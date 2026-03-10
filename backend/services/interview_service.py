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
        
        is_pressure_mode = context.get("is_pressure_mode", False) if context else False
        
        if not self.client:
            # Mock 응답
            return {
                "role": "assistant",
                "content": "현재 개발 환경(API KEY 미설정)입니다. 실전 모드였다면 귀하의 답변에 대해 날카로운 꼬리 질문을 던졌을 것입니다. 다음 질문을 진행하시겠습니까?",
                "is_finished": False
            }

        base_persona = """
        당신은 실력 있는 시니어 면접관 '피키(Picky)'입니다. 
        사용자가 제출한 이력서와 이전 질문들에 대한 답변을 바탕으로 심층 면접을 진행하세요.
        
        원칙:
        1. [STAR 기법 적용]: 사용자의 답변에서 Situation, Task, Action, Result 중 누락된 부분이 있다면 그 부분을 파고드는 꼬리 질문을 하세요.
        2. [구체성 요구]: "열심히 했습니다", "성과를 냈습니다"와 같은 모호한 표현이 나오면 구체적인 수치나 본인의 '데이터 기반 기여도'를 묻는 질문을 던지세요.
        3. [문맥 유지]: 이전 질문과 연결되지 않는 뜬금없는 질문을 피하고, 사용자의 마지막 답변에서 가장 설득력이 떨어지는 지점을 공략하세요.
        4. [완결성 판단]: 답변이 충분히 구체적이고 논리적이라 판단되면 "답변 감사합니다. 관련해서는 충분히 이해했습니다."라고 언급한 뒤 다음 역량 검증 질문으로 넘어가세요.
        5. [면접 종료]: 준비된 역량 검증이 모두 끝났고 질문할 내용이 더 이상 없다면 따뜻한 격려와 함께 면접을 종료하세요.
        """

        pressure_instruction = """
        [압박 면접 모드 활성화됨]
        - 지원자의 답변에 대해 "그게 최선이었나요?", "다른 대안은 고려하지 않았나요?"와 같은 비판적인 시각을 유지하세요.
        - 논리적 허점을 발견하면 즉시 집요하게 파고드세요.
        - 지원자의 감정보다는 사실과 논리에 집중하며 냉철한 태도를 보이세요.
        """

        system_prompt = base_persona + (pressure_instruction if is_pressure_mode else "") + """
        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "content": "면접관의 응답 내용",
            "is_finished": "true/false",
            "focus_competency": "현재 검증 중인 역량 (예: communication, technical_skill 등)"
        }
        """

        try:
            full_messages = [{"role": "system", "content": system_prompt}] + messages
            
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
