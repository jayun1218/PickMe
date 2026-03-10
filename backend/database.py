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

    async def get_interview_history(self, limit: int = 10):
        """과거 면접 분석 결과 리스트를 가져옵니다."""
        if not self.client:
            return []
        
        try:
            # results와 interviews 테이블을 조인하여 가져옴
            res = self.client.table("interview_results")\
                .select("*, interviews(resume_summary, created_at)")\
                .order("created_at", descending=True)\
                .limit(limit)\
                .execute()
            return res.data
        except Exception as e:
            print(f"이력 조회 중 오류 발생: {e}")
            return []

    async def save_job_application(self, data: dict):
        """새로운 지원 공고 정보를 DB에 저장합니다."""
        if not self.client:
            return None
        try:
            res = self.client.table("job_applications").insert(data).execute()
            return res.data[0]
        except Exception as e:
            print(f"공고 저장 중 오류 발생: {e}")
            return None

    async def get_job_applications(self):
        """등록된すべての 지원 공고 정보를 가져옵니다."""
        if not self.client:
            return []
        try:
            res = self.client.table("job_applications").select("*").order("deadline", descending=False).execute()
            return res.data
        except Exception as e:
            print(f"공고 조회 중 오류 발생: {e}")
            return []

    async def delete_job_application(self, app_id: str):
        """특정 지원 공고 정보를 삭제합니다."""
        if not self.client:
            return False
        try:
            self.client.table("job_applications").delete().eq("id", app_id).execute()
            return True
        except Exception as e:
            print(f"공고 삭제 중 오류 발생: {e}")
            return False

db_manager = DatabaseManager()
