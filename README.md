# PickMe 🚀

> **AI 모의면접 코치 & 이력서 분석 SaaS**  
> 취준생의 합격을 돕는 AI 1:1 면접 파트너

PickMe는 취업 준비생이 언제 어디서나 AI와 1:1 모의 면접을 진행하고, 답변 품질에 대한 즉각적인 피드백을 받을 수 있는 서비스입니다. 이력서를 업로드하면 맞춤형 예상 질문이 생성되고, 실제 목소리로 대화하듯 면접을 진행한 뒤 상세 리포트를 받아볼 수 있습니다.

---

## 주요 기능 ✨

### 🏢 공기업 취업 특화 지원 솔루션 (New!)
- **잡알리오(ALIO) 맞춤 동기화**: 공공데이터포털 API를 연동하여 에너지, SOC, 보건/복지, 금융 등 관심 지원 분야별 공고를 원클릭으로 캘린더에 가져옵니다.
- **필기/면접 다중 일정 관리**: 단순 서류 마감일뿐만 아니라 NCS/전공 필기시험, 1차/2차 면접 등 디테일한 다중 일정을 달력에 시각적으로 구분하여 띄워줍니다.
- **D-1 긴급 마감 알람 배너**: 시험이나 서류 제출이 코앞(D-1 또는 당일)인 일정이 있다면 대시보드 최상단에 긴급 경고 배너로 강력하게 알려줍니다.
- **타겟 공기업 AI 면접 프롬프트**: 면접 챗봇 시작 전 지원 기업명(Target)을 입력하면, AI 피키가 해당 공기업의 산업 이슈(예: 탄소중립, 국토인프라 등)를 반영한 실전 압박 꼬리 질문을 생성합니다.

### 🎯 핵심 면접 & 이력서 코칭
- **이력서 단독 분석 & 기업 맞춤 매칭**: 내 이력서 기반 핵심 질문은 물론 채용 공고(PDF/URL)와 대조한 고난도 면접 질문까지 완벽 설계합니다.
- **AI 자기소개서 코칭**: STAR 기법을 활용하여 이력서를 정밀 분석하고, 무기력한 자소서를 매력적으로 탈바꿈시킬 개선안을 제시합니다.
- **스마트 대시보드**: 누적된 면접 점수와 역량 방사형 차트, AI Daily Support 메시지로 우상향 성장을 돕습니다.
- **AI 보이스 면접 (OpenAI Whisper)**: 텍스트 렌더링에 그치지 않고 실제 목소리로 대화하며 훈련하는 생생한 모의 면접 환경.
- **Deep Intelligence 피드백**: 면접이 끝나면 답변의 논리성, 직무/조직 적합성, 보완점을 종합 평가한 리포트를 발급합니다.

## 기술 스택 🛠

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Vanilla CSS + Tailwind CSS v4 (Custom Design System)
- **Language**: TypeScript
- **State Management**: React Hooks
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **AI Core**: OpenAI API (GPT-4o, Whisper STT, TTS)
- **Database/Auth**: Supabase (PostgreSQL)
- **File Processing**: PyMuPDF (PDF 분석)

---

## 시작하기 🏁

### 1. 환경 변수 설정
프로젝트 루트의 `.env.example`을 `.env`로 복사하고 필요한 API Key들을 입력하세요.

```bash
# Frontend (.env.local)
NEXT_PUBLIC_API_URL=http://localhost:8000

# Backend (.env)
OPENAI_API_KEY=your_openai_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key
ALIO_API_KEY=your_alio_public_data_key # 필수: 잡알리오 동기화 기능 지원
```

### 2. 백엔드 실행 (FastAPI)
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

### 3. 프론트엔드 실행 (Next.js)
```bash
cd frontend
npm install
npm run dev
```

---

## 프로젝트 구조 📁

```text
PickMe/
├── frontend/
│   ├── src/
│   │   ├── app/           # Next.js App Router (메인 페이지 등)
│   │   ├── components/    # Upload, Chat, Feedback 등 핵심 컴포넌트
│   │   └── lib/           # API 통신 및 유틸리티
│   └── public/            # 정적 파일
├── backend/
│   ├── main.py            # FastAPI 엔트리 포인트
│   ├── app/               # 비즈니스 로직 및 AI 엔진
│   └── requirements.txt   # 의존성 목록
└── README.md
```

---

## 라이선스 📄
© 2026 PickMe Inc. Designed for your ultimate success.
