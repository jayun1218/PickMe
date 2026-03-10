import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

class DatabaseManager:
    def __init__(self):
        self.url = os.getenv("SUPABASE_URL")
        self.key = os.getenv("SUPABASE_KEY")
        self._client = None

    @property
    def client(self) -> Client:
        if not self._client:
            if not self.url or not self.key:
                return None
            try:
                self._client = create_client(self.url, self.key)
            except Exception as e:
                print(f"Supabase 연결 실패: {e}")
                return None
        return self._client

    async def save_interview_result(self, transcript: list, feedback: dict):
        """면접 대화와 분석 결과를 DB에 저장합니다."""
        if not self.client:
            print("DB 연결 정보가 없어 저장을 스킵합니다.")
            return None

        try:
            # 1. 면접 세션 저장
            interview_data = {
                "resume_summary": "Auto-analyzed Resume", # 추후 확장
                "transcript": transcript
            }
            res = self.client.table("interviews").insert(interview_data).execute()
            interview_id = res.data[0]["id"]

            # 2. 분석 결과 저장
            result_data = {
                "interview_id": interview_id,
                "scores": feedback.get("scores"),
                "overall_feedback": feedback.get("overall_feedback"),
                "strengths": feedback.get("strengths"),
                "improvements": feedback.get("improvements")
            }
            self.client.table("interview_results").insert(result_data).execute()
            
            return interview_id
        except Exception as e:
            print(f"DB 저장 중 오류 발생: {e}")
            return None

db_manager = DatabaseManager()
