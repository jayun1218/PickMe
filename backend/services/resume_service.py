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
        return await self.generate_combined_analysis(resume_text, None)

    async def generate_combined_analysis(self, resume_text: str, notice_text: str = None):
        """이력서와 채용 공고(옵션)를 기반으로 최적화된 면접 질문을 생성합니다."""
        if not resume_text:
            return []

        if not self.client:
            return [
                {"id": 1, "category": "안내", "question": "OPENAI_API_KEY가 설정되지 않았습니다. .env 파일을 확인해주세요."},
                {"id": 2, "category": "역량", "question": "Mock 질문: 본인의 핵심 강점은 무엇인가요?"}
            ]

        if notice_text:
            system_prompt = """
            당신은 기업의 채용 전문가이자 수석 면접관입니다. 
            제공된 [채용 공고]의 직무 요구사항과 [지원자 이력서]의 경험을 대조하여 가장 날카로운 면접 질문 20개를 생성해주세요.
            
            분석 지침:
            1. 공고에서 요구하는 '필수 역량'이 이력서에 있는지 검증하는 질문을 우선순위로 둡니다.
            2. 지원자의 경험 중 공고의 '우대 사항'과 일치하는 부분을 깊이 있게 파고드세요.
            3. 공고의 직무 성격(예: 공기업의 공공성, 스타트업의 도전정신 등)을 반영한 태도 질문을 포함하세요.
            4. 질문은 구체적이어야 하며, 실무 중심이어야 합니다.

            응답은 반드시 아래의 JSON 형식으로만 해주세요:
            {
                "questions": [
                    {"id": 1, "category": "직무적합성/역량/경험", "question": "질문 내용"},
                    ...
                ]
            }
            """
            user_content = f"[채용 공고 내용]:\n{notice_text}\n\n[지원자 이력서 내용]:\n{resume_text}"
        else:
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
            user_content = f"지원자 이력서 내용:\n{resume_text}"

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return result.get("questions", [])
        except Exception as e:
            raise Exception(f"AI 질문 생성 중 오류 발생: {str(e)}")

    async def generate_resume_coaching(self, resume_text: str, notice_text: str):
        """채용 공고를 바탕으로 이력서 첨삭 제안을 생성합니다."""
        if not self.client:
            return {"coaching": "API 키가 필요합니다."}

        system_prompt = """
        당신은 전문 커리어 코치입니다. [채용 공고]의 요구사항과 [지원자 이력서]를 비교하여, 
        합격률을 높이기 위한 구체적인 이력서 수정 제안을 해주세요.
        
        포함할 내용:
        1. 강조해야 할 핵심 키워드 (공고 기반)
        2. 부족한 경험을 보완할 수 있는 기술 방식
        3. 구체적인 문장 수정 예시 (Before/After)
        
        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "summary": "전체적인 전략 요약",
            "keywords": ["키워드1", "키워드2"],
            "suggestions": [
                {"category": "경험/기술/학력", "issue": "문제점", "improvement": "개선 제안"}
            ]
        }
        """
        
        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"[채용 공고]:\n{notice_text}\n\n[이력서]:\n{resume_text}"}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"첨삭 생성 중 오류 발생: {str(e)}")
    async def generate_star_coaching(self, resume_text: str, experience_text: str):
        """사용자의 파편화된 경험을 STAR 기법으로 구조화하고 자소서용 초안을 생성합니다."""
        if not self.client:
            return {
                "star_structure": {
                    "situation": "API 키가 설정되지 않았습니다.",
                    "task": "설정 확인이 필요합니다.",
                    "action": "행동 내용",
                    "result": "결과 내용"
                },
                "improved_draft": "API 키를 설정하면 전문적인 초안이 생성됩니다.",
                "key_insight": "핵심 역량 요약"
            }

        system_prompt = """
        당신은 지원자의 경험을 매력적으로 다듬어주는 전문 자소서 에디터이자 커리어 코치입니다.
        사용자가 입력한 [파편화된 경험]을 바탕으로, 지원자의 [이력서] 배경 정보를 참고하여 
        최적화된 STAR(Situation, Task, Action, Result) 구조로 정리하고, 
        실제 자기소개서에 바로 사용할 수 있는 전문적이고 설득력 있는 초안을 작성해주세요.

        작성 지침:
        1. Situation: 당시의 구체적인 상황과 배경을 설명하세요.
        2. Task: 해결해야 했던 문제나 목표를 명확히 정의하세요.
        3. Action: 지원자가 직접 수행한 구체적인 행동과 노력을 강조하세요.
        4. Result: 정성적/정량적 성과를 명확히 제시하세요.
        5. Improved Draft: 소제목을 포함하여 약 500자 내외의 완성도 높은 문장을 작성하세요.

        응답 형식은 반드시 아래의 JSON 구조를 따르세요:
        {
            "star_structure": {
                "situation": "내용",
                "task": "내용",
                "action": "내용",
                "result": "내용"
            },
            "improved_draft": "소제목을 포함한 전체 문장",
            "key_insight": "이 경험에서 강조되는 핵심 역량 1줄 요약"
        }
        """

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"[이력서 배경]:\n{resume_text}\n\n[파편화된 경험]:\n{experience_text}"}
                ],
                response_format={"type": "json_object"}
            )
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"STAR 코칭 생성 중 오류 발생: {str(e)}")
