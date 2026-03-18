# PickMe 🚀

> **AI 모의면접 코치 & 이력서 분석 SaaS**  
> 취준생의 합격을 돕는 AI 1:1 면접 파트너

PickMe는 취업 준비생이 언제 어디서나 AI와 1:1 모의 면접을 진행하고, 답변 품질에 대한 즉각적인 피드백을 받을 수 있는 서비스입니다. 이력서를 업로드하면 맞춤형 예상 질문이 생성되고, 실제 목소리로 대화하듯 면접을 진행한 뒤 상세 리포트를 받아볼 수 있습니다.

---

## 주요 기능 ✨

- **이력서 단독 분석**: 자신의 이력서에서 추출한 역량을 바탕으로 핵심 질문을 생성합니다.
- **기업 맞춤형 매칭**: 채용 공고(PDF/URL)와 내 이력서를 대조하여 공고에 최적화된 고난도 질문을 생성합니다.
- **AI 이력서 코칭 (New)**: STAR 기법을 활용해 이력서를 정밀 분석하고, 임팩트 있는 자기소개서 개선 방향을 제안합니다.
- **스마트 대시보드 (New)**: 지금까지의 면접 여정을 분석하여 더 완벽한 합격 전략과 성장 기록을 제공합니다.
- **취업 캘린더 (New)**: 기업별 공고 마감 기간을 한눈에 확인하고 체계적인 지원 일정을 관리할 수 있습니다.
- **AI 보이스 면접**: OpenAI Whisper STT 기술을 활용하여 텍스트가 아닌 실제 목소리로 자연스러운 답변 연습이 가능합니다.
- **압박 면접 모드 (Pressure Mode)**: 심층 꼬리 질문을 활성화하여 실제 면접과 유사한 긴장감 속에서 대처 능력을 훈련할 수 있습니다.
- **Deep Intelligence 피드백**: 답변의 논리성, 직무 적합성, 언어 습관 등을 점수와 시각화 차트로 제공합니다.
- **프리미엄 UI/UX**: 글래스모피즘(Glassmorphism) 기반의 트렌디하고 세련된 인터페이스.

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
OPENAI_API_KEY=your_key
SUPABASE_URL=your_url
SUPABASE_KEY=your_key
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
