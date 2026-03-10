from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
import shutil
from dotenv import load_dotenv
from services.resume_service import ResumeService
from services.interview_service import InterviewService
from services.feedback_service import FeedbackService
from services.stt_service import STTService
from services.scraping_service import ScrapingService

load_dotenv()

app = FastAPI(title="PickMe API")
resume_service = ResumeService()
interview_service = InterviewService()
feedback_service = FeedbackService()
stt_service = STTService()
scraping_service = ScrapingService()

# API 데이터 모델
class ChatMessage(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[ChatMessage]
    context: Optional[dict] = None

class UrlAnalyzeRequest(BaseModel):
    resume_text: str
    notice_url: str

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to PickMe API"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/resume/analyze")
async def analyze_resume(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF 파일만 업로드 가능합니다.")

    # 임시 파일 저장
    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, file.filename)

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 텍스트 추출 및 질문 생성
        text = resume_service.extract_text_from_pdf(temp_path)
        questions = await resume_service.generate_interview_questions(text)

        return {
            "filename": file.filename,
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # 임시 파일 삭제
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/v1/resume/extract")
async def extract_resume_text(file: UploadFile = File(...)):
    if not file.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="PDF 파일만 가능합니다.")

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    temp_path = os.path.join(temp_dir, f"extract_{file.filename}")

    try:
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        text = resume_service.extract_text_from_pdf(temp_path)
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)

@app.post("/api/v1/analyze/combined")
async def analyze_combined(resume: UploadFile = File(...), notice: UploadFile = File(...)):
    if not resume.filename.endswith('.pdf') or not notice.filename.endswith('.pdf'):
        raise HTTPException(status_code=400, detail="모든 파일은 PDF 형식이어야 합니다.")

    temp_dir = "temp"
    os.makedirs(temp_dir, exist_ok=True)
    
    resume_path = os.path.join(temp_dir, f"resume_{resume.filename}")
    notice_path = os.path.join(temp_dir, f"notice_{notice.filename}")

    try:
        # 파일 저장
        with open(resume_path, "wb") as r_buf:
            shutil.copyfileobj(resume.file, r_buf)
        with open(notice_path, "wb") as n_buf:
            shutil.copyfileobj(notice.file, n_buf)

        # 텍스트 추출
        resume_text = resume_service.extract_text_from_pdf(resume_path)
        notice_text = resume_service.extract_text_from_pdf(notice_path)
        
        # 통합 분석 및 질문 생성
        questions = await resume_service.generate_combined_analysis(resume_text, notice_text)

        return {
            "resume_filename": resume.filename,
            "notice_filename": notice.filename,
            "questions": questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        for p in [resume_path, notice_path]:
            if os.path.exists(p):
                os.remove(p)

@app.post("/api/v1/analyze/combined-url")
async def analyze_combined_url(request: UrlAnalyzeRequest):
    try:
        # URL에서 텍스트 추출
        notice_text = await scraping_service.extract_text_from_url(request.notice_url)
        
        # 통합 분석
        questions = await resume_service.generate_combined_analysis(request.resume_text, notice_text)
        
        # 이력서 첨삭 가이드 생성
        coaching = await resume_service.generate_resume_coaching(request.resume_text, notice_text)

        return {
            "questions": questions,
            "resume_coaching": coaching,
            "notice_text_preview": notice_text[:200]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/resume/coach")
async def analyze_resume_coaching(resume_text: str, notice_text: str):
    try:
        coaching = await resume_service.generate_resume_coaching(resume_text, notice_text)
        return coaching
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/interview/chat")
async def chat_with_interviewer(request: ChatRequest):
    try:
        # Pydantic 모델을 dict 리스트로 변환
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        
        response = await interview_service.get_next_response(messages, request.context)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/v1/interview/analyze")
async def analyze_interview_result(request: ChatRequest):
    try:
        messages = [{"role": m.role, "content": m.content} for m in request.messages]
        feedback = await feedback_service.analyze_interview(messages)
        
        # 데이터베이스 저장
        from database import db_manager
        await db_manager.save_interview_result(messages, feedback)
        
        return feedback
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/interview/history")
async def get_interview_history(limit: int = 10):
    try:
        from database import db_manager
        history = await db_manager.get_interview_history(limit)
        return history
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/api/v1/interview/stt")
async def transcribe_voice(file: UploadFile = File(...)):
    try:
        # 임시 파일 저장
        temp_dir = "temp"
        if not os.path.exists(temp_dir):
            os.makedirs(temp_dir)
            
        temp_path = os.path.join(temp_dir, file.filename)
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # STT 수행
        text = await stt_service.transcribe_audio(temp_path)
        
        # 임시 파일 삭제
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
        return {"text": text}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
