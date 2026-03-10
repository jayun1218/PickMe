from openai import OpenAI
import os

class STTService:
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

    async def transcribe_audio(self, audio_file_path: str):
        """음성 파일을 텍스트로 변환합니다."""
        
        if not self.client:
            # Mock STT 결과
            return "현재 개발 환경(API KEY 미설정)입니다. 실제 음성 인식 결과 대신 반환되는 텍스트입니다."

        try:
            with open(audio_file_path, "rb") as audio_file:
                transcript = self.client.audio.transcriptions.create(
                    model="whisper-1", 
                    file=audio_file
                )
            return transcript.text
        except Exception as e:
            raise Exception(f"음성 인식(STT) 중 오류 발생: {str(e)}")
