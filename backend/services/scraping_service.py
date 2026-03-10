import httpx
from bs4 import BeautifulSoup
import re

class ScrapingService:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        }

    async def extract_text_from_url(self, url: str) -> str:
        """URL에서 채용 공고 본문 텍스트를 추출합니다."""
        try:
            async with httpx.AsyncClient(headers=self.headers, follow_redirects=True, timeout=10.0) as client:
                response = await client.get(url)
                response.raise_for_status()
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # 불필요한 태그 제거
                for tag in soup(['script', 'style', 'nav', 'footer', 'header', 'aside']):
                    tag.decompose()
                
                # 텍스트 추출 (공백 정리)
                text = soup.get_text(separator=' ')
                lines = [line.strip() for line in text.splitlines() if line.strip()]
                clean_text = ' '.join(lines)
                
                # 너무 긴 경우 적절히 자름 (OpenAI 토큰 제한 고려)
                return clean_text[:5000]
        except Exception as e:
            raise Exception(f"URL 추출 중 오류 발생: {str(e)}")
