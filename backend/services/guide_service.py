import os
import json
from openai import OpenAI

class GuideService:
    def __init__(self):
        self.api_key = os.getenv("OPENAI_API_KEY")
        self._client = None

    @property
    def client(self):
        if not self._client:
            if not self.api_key:
                return None
            self._client = OpenAI(api_key=self.api_key)
        return self._client

    async def generate_company_guide(self, company: str, position: str = None, notes: str = None):
        """특정 기업 및 직무에 대한 AI 맞춤형 준비 가이드를 생성합니다."""
        if not self.client:
            return {
                "resume_focus": "API 키가 설정되지 않았습니다.",
                "interview_focus": "설정이 필요합니다.",
                "company_trait": f"{company}의 핵심 가치를 확인할 수 없습니다."
            }

        system_prompt = """
        당신은 대한민국 주요 공기업 및 대기업 채용 전문가입니다. 
        제공된 [기업명]과 [직무 정보]를 바탕으로 해당 기업의 최신 채용 트렌드와 인재상을 분석하여 
        지원자가 자기소개서와 면접에서 반드시 공략해야 할 핵심 포인트를 요약해주세요.

        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "company_trait": "해당 기업의 핵심 가치 및 인재상 요약 (1~2문장)",
            "resume_focus": "자소서 작성 시 반드시 강조해야 할 핵심 키워드 및 경험 포인트",
            "interview_focus": "면접 시 자주 나오는 질문 유형 및 태도/답변 전략"
        }
        """
        
        user_content = f"기업명: {company}\n직무: {position or '미지정'}\n기타정보: {notes or '없음'}"

        try:
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_content}
                ],
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"가이드 생성 중 오류 발생: {str(e)}")
