import fitz  # PyMuPDF
from openai import OpenAI
import os
import json

class ResumeService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self._client = None

    @property
    def client(self):
        if not self._client:
            if not self.api_key:
                # 개발 편의를 위해 키가 없으면 에러를 내지 않고 나중에 호출 시 체크
                return None
            self._client = OpenAI(api_key=self.api_key)
        return self._client

    def extract_text_from_pdf(self, file_path: str) -> str:
        """PDF 파일에서 텍스트를 추출합니다."""
        text = ""
        try:
            with fitz.open(file_path) as doc:
                for page in doc:
                    text += page.get_text()
            return text.strip()
        except Exception as e:
            raise Exception(f"PDF 텍스트 추출 중 오류 발생: {str(e)}")

    async def generate_interview_questions(self, resume_text: str):
        """이력서 텍스트를 기반으로 면접 질문을 생성합니다."""
        if not resume_text:
            return []

        if not self.client:
            # API 키가 없는 경우 개발용 Mock 응답 반환 (Optional)
            return [
                {"id": 1, "category": "안내", "question": "OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요."},
                {"id": 2, "category": "역량", "question": "Mock 질문: 본인의 핵심 강점은 무엇인가요?"}
            ]

        system_prompt = """
        당신은 전문적인 기술 면접관입니다. 제공된 이력서 내용을 분석하여 지원자의 역량을 파악하고,
        실무 역량(Hard Skills)과 협업 능력(Soft Skills)을 검증할 수 있는 예상 면접 질문 20개를 생성해주세요.
        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "questions": [
                {"id": 1, "category": "역량/경험", "question": "질문 내용"},
                ...
            ]
        }
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"이력서 내용:\n{resume_text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result.get("questions", [])
        except Exception as e:
            raise Exception(f"AI 질문 생성 중 오류 발생: {str(e)}")
