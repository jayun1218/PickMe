from openai import OpenAI
import os
import json

class InterviewService:
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

    async def get_next_response(self, messages: list, context: dict = None):
        """이전 대화 기록과 컨텍스트를 바탕으로 AI 면접관의 다음 응답을 생성합니다."""
        
        if not self.client:
            # Mock 응답
            return {
                "role": "assistant",
                "content": "현재 개발 환경(API KEY 미설정)입니다. 실전 모드였다면 귀하의 답변에 대해 날카로운 꼬리 질문을 던졌을 것입니다. 다음 질문을 진행하시겠습니까?",
                "is_finished": False
            }

        persona_prompt = """
        당신은 실력 있는 시니어 면접관 '피키(Picky)'입니다. 
        사용자가 제출한 이력서와 이전 질문들에 대한 답변을 바탕으로 면접을 진행하세요.
        
        원칙:
        1. 한 번에 너무 많은 질문을 하지 마세요. 하나의 핵심 질문에 집중하세요.
        2. 사용자의 답변이 모호하다면 구체적인 수치나 경험을 묻는 '꼬리 질문'을 던지세요.
        3. 답변이 충분하다면 "좋습니다. 다음 주제로 넘어가죠."와 함께 다음 면접 질문으로 부드럽게 전환하세요.
        4. 면접이 모두 종료되었다고 판단되면 면접을 마무리하는 인사를 하세요.
        
        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "content": "면접관의 응답 내용",
            "is_finished": "true/false (면접 종료 여부)"
        }
        """

        try:
            full_messages = [{"role": "system", "content": persona_prompt}] + messages
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=full_messages,
                response_format={"type": "json_object"}
            )
            
            result = json.loads(response.choices[0].message.content)
            return {
                "role": "assistant",
                "content": result.get("content", ""),
                "is_finished": result.get("is_finished") == "true" or result.get("is_finished") is True
            }
        except Exception as e:
            raise Exception(f"AI 응답 생성 중 오류 발생: {str(e)}")
