'use client';

import React, { useState, useEffect } from "react";
import { Mic, FileText, BarChart3, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import ResumeUpload from "@/components/ResumeUpload";
import CombinedUpload from "@/components/CombinedUpload";
import QuestionList from "@/components/QuestionList";
import InterviewChat from "@/components/InterviewChat";
import FeedbackReport from "@/components/FeedbackReport";
import { analyzeInterview } from "@/lib/api";

export default function HomePage() {
    const [analysisResult, setAnalysisResult] = useState<any>(null);
    const [interviewQuestion, setInterviewQuestion] = useState<string | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [feedbackData, setFeedbackData] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const [mode, setMode] = useState<"simple" | "combined">("simple");

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

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
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-indigo-100">
            {/* Premium Floating Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 pt-6 flex justify-center ${scrolled ? "pt-4" : "pt-6"
                }`}>
                <div className="w-full max-w-5xl glass-effect rounded-[28px] px-8 h-20 flex items-center justify-between border border-white/40 shadow-2xl shadow-indigo-100/30">
                    <div
                        onClick={() => {
                            setAnalysisResult(null);
                            setInterviewQuestion(null);
                            setFeedbackData(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-[900] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            PickMe
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-10 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Platform</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Solutions</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Success Stories</a>
                    </div>

                    <button className="bg-slate-900 text-white px-7 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl shadow-slate-200">
                        Get Started
                    </button>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ paddingTop: '180px' }} className="pb-40 px-6 flex flex-col items-center w-full">
                <div className="w-full max-w-6xl flex flex-col items-center">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-48 animate-in fade-in zoom-in duration-700">
                            <div className="relative mb-12">
                                <div className="w-32 h-32 border-[6px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <BarChart3 className="w-10 h-10 text-indigo-200 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-black text-slate-900 mb-4 tracking-tight">당신의 답변을 정교하게 분석 중입니다</h2>
                            <p className="text-slate-400 font-medium text-lg">인공지능이 면접관의 시선으로 데이터를 살펴보고 있습니다.</p>
                        </div>
                    ) : feedbackData ? (
                        <FeedbackReport data={feedbackData} onRestart={() => setFeedbackData(null)} />
                    ) : interviewQuestion ? (
                        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 w-full flex flex-col items-center py-20">
                            <div className="w-full max-w-3xl mb-12 flex items-center justify-between">
                                <button
                                    onClick={() => setInterviewQuestion(null)}
                                    className="group py-2 pr-4 text-slate-400 font-bold flex items-center gap-2 hover:text-indigo-600 transition-all"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-100 transition-all">
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                    </div>
                                    Back to questions
                                </button>
                                <div className="px-4 py-1.5 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100">
                                    Live Session
                                </div>
                            </div>
                            <InterviewChat
                                initialQuestion={interviewQuestion}
                                onFinish={finishInterview}
                            />
                        </div>
                    ) : !analysisResult ? (
                        <section className="w-full text-center space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
                            <div className="space-y-10 flex flex-col items-center w-full">
                                <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white border border-indigo-50 shadow-sm text-indigo-600 text-[11px] font-black tracking-[0.2em] uppercase mx-auto">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
                                    </span>
                                    AI Powered Interview Intelligence
                                </div>

                                <h1 className="text-5xl md:text-8xl font-[900] tracking-tight text-slate-900 leading-tight lg:px-20 text-center">
                                    합격의 문을 여는 <br />
                                    <span className="text-gradient">가장 완벽한 전략</span>
                                </h1>

                                <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium text-center">
                                    당신의 이력서와 채용 공고를 정밀 매칭하여 <br />
                                    합격을 위한 초정밀 면접 질문을 설계해 드립니다.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                {/* Mode Switching Tabs */}
                                <div className="flex bg-slate-200/50 p-1.5 rounded-[28px] border border-slate-200 backdrop-blur-md shadow-inner">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={`relative px-10 py-4 rounded-[22px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${mode === "simple"
                                            ? "bg-white text-indigo-600 shadow-2xl shadow-indigo-200/50 scale-100"
                                            : "text-slate-400 hover:text-slate-600 scale-95"
                                            }`}
                                    >
                                        이력서 단독 분석
                                    </button>
                                    <button
                                        onClick={() => setMode("combined")}
                                        className={`relative px-10 py-4 rounded-[22px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${mode === "combined"
                                            ? "bg-white text-indigo-600 shadow-2xl shadow-indigo-200/50 scale-100"
                                            : "text-slate-400 hover:text-slate-600 scale-95"
                                            }`}
                                    >
                                        기업 맞춤형 매칭
                                    </button>
                                </div>
                                <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">분석 모드를 선택하여 시작하세요</p>
                            </div>

                            <div className="py-16 w-full flex justify-center">
                                {mode === "simple" ? (
                                    <ResumeUpload onAnalysisComplete={handleAnalysisComplete} />
                                ) : (
                                    <CombinedUpload onAnalysisComplete={handleAnalysisComplete} />
                                )}
                            </div>

                            {/* Feature Grid */}
                            <div className="grid md:grid-cols-3 gap-12 pt-40 w-full max-w-6xl">
                                <FeatureItem
                                    icon={<FileText className="w-6 h-6" />}
                                    title="Deep Analysis"
                                    description="이력서의 텍스트를 정밀 분석하여 직무 맞춤형 질문지를 즉시 생성합니다."
                                />
                                <FeatureItem
                                    icon={<Mic className="w-6 h-6" />}
                                    title="Voice Interview"
                                    description="Whisper STT 기술로 실제 목소리를 통해 자연스러운 답변 연습이 가능합니다."
                                />
                                <FeatureItem
                                    icon={<BarChart3 className="w-6 h-6" />}
                                    title="AI Feedback"
                                    description="모든 답변의 논리성과 직무 적합성을 점수와 차트로 시각화하여 제공합니다."
                                />
                            </div>
                        </section>
                    ) : (
                        <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <button
                                onClick={() => setAnalysisResult(null)}
                                className="mb-10 text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                            >
                                <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                                    <ChevronRight className="w-4 h-4 rotate-180" />
                                </div>
                                Upload different resume
                            </button>

                            <header className="mb-16">
                                <h2 className="text-4xl font-[900] text-slate-900 mb-4 tracking-tight">AI가 설계한 <br />맞춤 면접 질문 리스트</h2>
                                <div className="flex flex-wrap items-center gap-3">
                                    <div className="px-3 py-1 bg-slate-900 text-white rounded-lg text-[11px] font-bold">PDF Found</div>
                                    <p className="text-slate-500 font-medium">이력서: "{analysisResult.filename}"</p>
                                    {analysisResult.notice_filename && (
                                        <>
                                            <div className="w-1.5 h-1.5 rounded-full bg-slate-200"></div>
                                            <p className="text-slate-500 font-medium">채용공고: "{analysisResult.notice_filename}"</p>
                                        </>
                                    )}
                                </div>
                            </header>

                            <div className="space-y-6">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Select a question to practice</p>
                                <div className="grid gap-6">
                                    {analysisResult.questions.map((q: any) => (
                                        <PracticeCard
                                            key={q.id}
                                            item={q}
                                            onStart={() => startInterview(q.question)}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>

            <footer className="border-t border-slate-100 py-48 px-6 bg-white flex flex-col items-center">
                <div className="w-full max-w-6xl flex flex-col items-center space-y-12">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-slate-100">
                            <Sparkles className="w-6 h-6" />
                        </div>
                        <p className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-500">PickMe Intelligence</p>
                    </div>
                    <div className="flex flex-wrap justify-center gap-12 text-[11px] font-black text-slate-400 uppercase tracking-[0.3em]">
                        <a href="#" className="hover:text-indigo-600 transition-colors">Twitter</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</a>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Privacy</a>
                    </div>
                    <p className="text-slate-300 text-[10px] font-black uppercase tracking-widest">© 2026 PickMe Inc. Designed for your ultimate success.</p>
                </div>
            </footer>
        </div>
    );
}

function FeatureItem({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
    return (
        <div className="p-14 rounded-[50px] bg-white border border-slate-50 hover:border-indigo-100 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group text-left">
            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:bg-gradient-premium group-hover:text-white transition-all mb-10 shadow-sm">
                {icon}
            </div>
            <h3 className="text-2xl font-[900] mb-5 text-slate-900 tracking-tight">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium text-base">
                {description}
            </p>
        </div>
    );
}

function PracticeCard({ item, onStart }: { item: any, onStart: () => void }) {
    return (
        <button
            onClick={onStart}
            className="p-8 bg-white border border-slate-100 rounded-[35px] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all group text-left flex items-center justify-between gap-6"
        >
            <div className="flex items-start gap-6">
                <div className="mt-1 w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center text-lg font-black group-hover:bg-gradient-premium group-hover:text-white transition-all">
                    {item.id}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        {item.category}
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-tight">
                        {item.question}
                    </p>
                </div>
            </div>
            <div className="h-14 px-8 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-black group-hover:text-white transition-all shrink-0 gap-2">
                Practice Now
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    );
}
