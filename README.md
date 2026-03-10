# PickMe 🚀

> **AI 모의면접 코치 & 이력서 분석 SaaS**  
> 취준생의 합격을 돕는 AI 1:1 면접 파트너

PickMe는 취업 준비생이 언제 어디서나 AI와 1:1 모의 면접을 진행하고, 답변 품질에 대한 즉각적인 피드백을 받을 수 있는 서비스입니다. 이력서를 업로드하면 맞춤형 예상 질문이 생성되고, 음성으로 대화하듯 면접을 진행한 뒤 상세 리포트를 받아볼 수 있습니다.

---

## 주요 기능 ✨

- **이력서 분석 & 질문 생성**: PDF/Word 이력서 기반 맞춤형 예상 질문 생성
- **AI 모의 면접 (텍스트/음성)**: GPT-4o와 Whisper STT를 활용한 실무 밀착형 면접 연습
- **정밀 피드백 리포트**: 논리성, 직무 적합성 등 다각도 답변 분석 및 점수 제공

## 기술 스택 🛠

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Icons**: Lucide React

### Backend
- **Framework**: FastAPI (Python 3.12+)
- **AI**: OpenAI API (GPT-4o, Whisper, TTS)
- **Database/Auth**: Supabase

---

## 시작하기 🏁

### 1. 환경 변수 설정
프로젝트 루트에 있는 `.env.example` 파일을 `.env`로 복사하고 필요한 API 키를 입력하세요.

```bash
cp .env.example .env
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
├── frontend/          # Next.js 애플리케이션
├── backend/           # FastAPI 서버
├── .env.example       # 환경 변수 템플릿
└── .gitignore         # Git 제외 패턴
```

---

## 라이선스 📄
© 2026 PickMe. All rights reserved.
