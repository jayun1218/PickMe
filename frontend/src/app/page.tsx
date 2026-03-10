'use client';

import React, { useState } from "react";
import { Mic, FileText, BarChart3, Loader2 } from "lucide-react";
import ResumeUpload from "@/components/ResumeUpload";
import QuestionList from "@/components/QuestionList";
import InterviewChat from "@/components/InterviewChat";
import FeedbackReport from "@/components/FeedbackReport";
import { analyzeInterview } from "@/lib/api";

export default function HomePage() {
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [interviewQuestion, setInterviewQuestion] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedbackData, setFeedbackData] = useState<any>(null);

    const handleAnalysisComplete = (data: any) => {
        setAnalysisResult(data);
        setFeedbackData(null);
    };

    const startInterview = (question: string) => {
        setInterviewQuestion(question);
        setFeedbackData(null);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const finishInterview = async (transcript: any[]) => {
        setInterviewQuestion(null);
        setIsAnalyzing(true);

        try {
            const result = await analyzeInterview(transcript);
            setFeedbackData(result);
        } catch (error) {
            console.error("분석 실패:", error);
            alert("분석 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.");
        } finally {
            setIsAnalyzing(false);
        }
    };

    const restartFromList = () => {
        setFeedbackData(null);
        setInterviewQuestion(null);
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900 selection:bg-indigo-100">
            {/* Navigation */}
            <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold">P</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight">PickMe</span>
                    </div>
                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
                        <a href="#" className="hover:text-indigo-600 transition-colors">기능</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">면접 연습</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">커뮤니티</a>
                    </div>
                    <button className="bg-slate-900 text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
                        로그인
                    </button>
                </div>
            </nav>

            {/* Hero & Content Section */}
            <main className="pt-32 pb-20 px-4">
                <div className="max-w-5xl mx-auto text-center space-y-8 mb-20">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in zoom-in duration-500">
                            <div className="relative mb-6">
                                <div className="w-24 h-24 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <BarChart3 className="w-8 h-8 text-indigo-200 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-2xl font-extrabold text-slate-900 mb-2">면접 답변 분석 중...</h2>
                            <p className="text-slate-400">AI가 당신의 역량을 정밀하게 측정하고 있습니다.</p>
                        </div>
                    ) : feedbackData ? (
                        <FeedbackReport data={feedbackData} onRestart={restartFromList} />
                    ) : interviewQuestion ? (
                        <div className="animate-in fade-in zoom-in duration-500">
                            <div className="text-left mb-8">
                                <button
                                    onClick={() => setInterviewQuestion(null)}
                                    className="text-slate-400 font-bold flex items-center gap-2 hover:text-indigo-600 transition-colors"
                                >
                                    ← 질문 리스트로
                                </button>
                            </div>
                            <InterviewChat
                                initialQuestion={interviewQuestion}
                                onFinish={finishInterview}
                            />
                        </div>
                    ) : !analysisResult ? (
                        <>
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold tracking-wide uppercase">
                                <span className="relative flex h-2 w-2">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
                                </span>
                                AI 이력서 분석기
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.1]">
                                당신의 합격을 결정짓는 <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                                    완벽한 면접 질문지
                                </span>
                            </h1>
                            <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
                                지금 이력서를 업로드하세요. <br />
                                AI가 당신의 경험 속에서 가장 가치 있는 질문을 찾아드립니다.
                            </p>

                            <div className="mt-12">
                                <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
                            </div>
                        </>
                    ) : (
                        <div className="text-left animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="mb-8 text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                            >
                                ← 이력서 다시 올리기
                            </button>
                            <h1 className="text-4xl font-extrabold text-slate-900 mb-2">분석 완료! ✨</h1>
                            <p className="text-slate-500 mb-12">"{analysisResult.filename}" 파일을 기반으로 생성된 커스텀 질문지입니다.</p>

                            <div className="space-y-4">
                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">연습할 질문을 선택하세요</p>
                                <div className="grid gap-4">
                                    {analysisResult.questions.map((q: any) => (
                                        <button
                                            key={q.id}
                                            onClick={() => startInterview(q.question)}
                                            className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-600 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group text-left flex items-start justify-between gap-4"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="mt-1 w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                    {q.id}
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <div className="flex items-center gap-2 text-[10px] font-bold text-indigo-500 uppercase tracking-wider">
                                                        {q.category}
                                                    </div>
                                                    <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                                        {q.question}
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="h-10 px-4 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                                                면접 시작
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Features Info (Show only if no result) */}
                {!analysisResult && !interviewQuestion && !feedbackData && !isAnalyzing && (
                    <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<FileText className="w-6 h-6" />}
                            title="이력서 분석"
                            description="PDF 이력서를 업로드하면 AI가 직무와 경험을 분석하여 맞춤형 질문을 생성합니다."
                        />
                        <FeatureCard
                            icon={<Mic className="w-6 h-6" />}
                            title="실전 음성 면접"
                            description="Whisper STT 기술을 통해 실제 면접관과 대화하듯 음성으로 연습할 수 있습니다."
                        />
                        <FeatureCard
                            icon={<BarChart3 className="w-6 h-6" />}
                            title="정밀 분석 리포트"
                            description="답변의 논리성, 직무 적합성 등을 분석하여 강점과 약점을 점수로 보여줍니다."
                        />
                    </div>
                )}
            </main>

            <footer className="border-t border-slate-100 py-12 px-4 bg-white">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-slate-400 text-sm">
                    <div className="flex items-center gap-2 grayscale opacity-50">
                        <span className="font-bold text-lg text-slate-900">PickMe</span>
                    </div>
                    <p>© 2026 PickMe. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-8 rounded-3xl bg-white border border-slate-100 hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group">
            <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-600 group-hover:bg-indigo-600 group-hover:text-white transition-all mb-6 shadow-sm">
                {icon}
            </div>
            <h3 className="text-xl font-bold mb-3 text-slate-900">{title}</h3>
            <p className="text-slate-500 leading-relaxed text-sm">
                {description}
            </p>
        </div>
    );
}
