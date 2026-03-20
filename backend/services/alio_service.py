import os
import aiohttp
import urllib.parse
from datetime import datetime
import json

class AlioService:
    def __init__(self):
        self.api_key = os.getenv("ALIO_API_KEY")
        self.base_url = "https://apis.data.go.kr/1051000/recruitment/list"

    async def fetch_active_jobs(self, count: int = 20):
        if not self.api_key:
            raise ValueError("ALIO_API_KEY is not set in environment.")

        # Decode the API key if it is url encoded, or just use as is
        # Usually data.go.kr expects either encoded or decoded. We'll pass it as is.
        # But aiohttp will encode parameters by default. 
        # Using URL string formatting to prevent double encoding issues.
        url = f"{self.base_url}?serviceKey={self.api_key}&numOfRows={count}&pageNo=1&resultType=json"

        timeout = aiohttp.ClientTimeout(total=5)
        async with aiohttp.ClientSession(timeout=timeout) as session:
            print(f"ALIO fetch URL: {url}")
            try:
                # SSL 끄고 요청 (공공데이터포털 인증서 이슈 대비)
                async with session.get(url, ssl=False) as response:
                    print(f"ALIO response status: {response.status}")
                    if response.status != 200:
                        print(f"ALIO API Error: Status {response.status}")
                        return []
                    
                    try:
                        data = await response.json(content_type=None)
                        
                        # Data.go.kr typical JSON structure checking
                        items = []
                        if "result" in data:
                            items = data["result"]
                        elif "response" in data and "body" in data["response"] and "items" in data["response"]["body"]:
                            item_node = data["response"]["body"]["items"]
                            if isinstance(item_node, dict) and "item" in item_node:
                                items = item_node["item"]
                            elif isinstance(item_node, list):
                                items = item_node
                        
                        parsed_jobs = []
                        for item in items:
                            # Typical fields: instNm(회사명), recrutPbancTtl(공고명/직무), pbancEndYmd(마감일 YYYYMMDD)
                            company = item.get("instNm", "공기업")
                            position = item.get("recrutPbancTtl", "신입/경력 채용")
                            end_date_str = item.get("pbancEndYmd") # e.g., "20260331" or "2026-03-31" 
                            
                            # Parse deadline to YYYY-MM-DD
                            deadline = ""
                            if end_date_str:
                                end_date_str = end_date_str.replace("-", "").replace(".", "")[:8]
                                if len(end_date_str) == 8:
                                    try:
                                        deadline = f"{end_date_str[:4]}-{end_date_str[4:6]}-{end_date_str[6:]}"
                                    except:
                                        pass

                            if not deadline:
                                continue # Skip if no deadline

                            # Determine category
                            category = "기타"
                            if any(k in company for k in ["전력", "발전", "수력", "원자력", "에너지", "가스", "난방"]):
                                category = "에너지"
                            elif any(k in company for k in ["도로", "철도", "교통", "공항", "항만", "수자원", "국토", "주택", "토지", "도시"]):
                                category = "SOC/건설/교통"
                            elif any(k in company for k in ["건강", "보건", "병원", "의료원", "적십자", "연금", "복지", "의료", "장애인"]):
                                category = "보건/복지"
                            elif any(k in company for k in ["금융", "은행", "보증", "구역", "자산", "투자", "예탁", "신용", "기금"]):
                                category = "금융"
                            elif any(k in company for k in ["연구", "과학", "기술", "진흥", "평가", "원"]):
                                category = "R&D/연구"

                            notes = f"ALIO 공공데이터 연동 공고\n고용형태: {item.get('recrutSeNm', '알수없음')}"
                            
                            parsed_jobs.append({
                                "company": company,
                                "position": position[:100], # safe clip
                                "deadline": deadline,
                                "category": category,
                                "url": item.get("recrutPbancUrl") or item.get("srcPath") or "https://www.alio.go.kr",
                                "notes": notes
                            })

                        # Filter active only
                        now_str = datetime.now().strftime("%Y-%m-%d")
                        active_jobs = [j for j in parsed_jobs if j["deadline"] >= now_str]

                        return active_jobs

                    except json.JSONDecodeError as je:
                        text = await response.text()
                        print(f"ALIO JSON Decode Error: {text[:200]}")
                        return []
            except Exception as e:
                print(f"ALIO Request Error: {e}")
                return []
