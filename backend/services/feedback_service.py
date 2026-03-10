from openai import OpenAI
import os
import json

class FeedbackService:
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

    async def analyze_interview(self, transcript: list):
        """면접 전체 대화 내역을 분석하여 피드백 리포트를 생성합니다."""
        
        if not self.client:
            # Mock 피드백 결과
            return {
                "scores": {
                    "logical_thinking": 85,
                    "job_suitability": 78,
                    "clarity": 92,
                    "keyword_usage": 70
                },
                "overall_feedback": "전반적으로 논리적인 답변을 구성하셨습니다. 다만 직무 관련 구체적인 사례를 더 보강하면 좋겠습니다.",
                "strengths": ["명확한 결론 도출", "조리 있는 설명"],
                "improvements": ["핵심 키워드 강조가 부족함", "직무 기술적 깊이 보완 필요"]
            }

        analysis_prompt = """
        당신은 시니어 면접관이자 커리어 코치입니다. 제공된 면접 대화 내역(transcript)을 철저히 분석하여 상세한 피드백 리포트를 생성해주세요.
        
        평가 항목 (1~100점):
        1. 논리성 (logical_thinking): 답변의 구조와 논리적 일관성
        2. 직무 적합성 (job_suitability): 직무에 필요한 역량과 경험의 매칭 정도
        3. 전달력 (clarity): 답변의 명확성과 이해 용이성
        4. 키워드 활용 (keyword_usage): 핵심 역량 키워드의 적절한 사용
        
        응답은 반드시 아래의 JSON 형식으로만 해주세요:
        {
            "scores": {
                "logical_thinking": 점수,
                "job_suitability": 점수,
                "clarity": 점수,
                "keyword_usage": 점수
            },
            "overall_feedback": "전체적인 총평",
            "strengths": ["강점 1", "강점 2"],
            "improvements": ["보완점 1", "보완점 2"]
        }
        """

        try:
            transcript_text = "\n".join([f"{m['role']}: {m['content']}" for m in transcript])
            
            response = self.client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": analysis_prompt},
                    {"role": "user", "content": f"면접 대화 내용:\n{transcript_text}"}
                ],
                response_format={"type": "json_object"}
            )
            
            return json.loads(response.choices[0].message.content)
        except Exception as e:
            raise Exception(f"피드백 생성 중 오류 발생: {str(e)}")
