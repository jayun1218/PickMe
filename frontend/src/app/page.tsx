'use client';

import React, { useState, useEffect } from "react";
import { Mic, FileText, BarChart3, Sparkles, ArrowRight, ChevronRight } from "lucide-react";
import Link from "next/link";
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
    const [isPressureMode, setIsPressureMode] = useState(false);

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
        <div className="min-h-screen bg-[#FAFBFF] text-slate-900 selection:bg-indigo-200/50 relative">
            {/* Ambient Background Glows */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-400/20 blur-[140px] mix-blend-multiply animate-float-slow"></div>
                <div className="absolute top-[20%] -right-[15%] w-[45vw] h-[45vw] rounded-full bg-purple-400/20 blur-[130px] mix-blend-multiply animate-float-slow" style={{ animationDelay: '2s' }}></div>
                <div className="absolute -bottom-[20%] left-[10%] w-[60vw] h-[50vw] rounded-full bg-pink-400/15 blur-[150px] mix-blend-multiply animate-float-slow" style={{ animationDelay: '4s' }}></div>
            </div>

            {/* Premium Floating Navigation */}
            <nav className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-6 pt-6 flex justify-center ${scrolled ? "pt-4" : "pt-8"
                }`}>
                <div className="w-full max-w-[1400px] glass-effect rounded-[28px] pl-20 pr-12 h-20 flex items-center justify-between border border-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
                    <div className="absolute inset-0 bg-white/40 backdrop-blur-xl -z-10"></div>
                    <div
                        onClick={() => {
                            setAnalysisResult(null);
                            setInterviewQuestion(null);
                            setFeedbackData(null);
                            window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        style={{ marginLeft: '40px' }}
                        className="flex items-center gap-3 group cursor-pointer"
                    >
                        <div className="w-10 h-10 bg-gradient-premium rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200 group-hover:rotate-6 transition-transform">
                            <Sparkles className="text-white w-6 h-6" />
                        </div>
                        <span className="text-2xl font-[900] tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600">
                            PickMe
                        </span>
                    </div>

                    <div className="hidden md:flex items-center gap-14 text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">
                        <Link href="/" className="hover:text-indigo-600 transition-colors">Platform</Link>
                        <Link href="/dashboard" className="hover:text-indigo-600 transition-colors">Dashboard</Link>
                        <a href="#" className="hover:text-indigo-600 transition-colors">Success Stories</a>
                    </div>

                    {/* Spacer to keep menu centered after removing Get Started button */}
                    <div className="hidden md:block w-[130px]"></div>
                </div>
            </nav>

            {/* Main Content */}
            <main style={{ paddingTop: '180px' }} className="pb-0 px-6 flex flex-col items-center w-full">
                <div className="w-full max-w-6xl flex flex-col items-center relative z-10">
                    {isAnalyzing ? (
                        <div className="flex flex-col items-center justify-center py-48 animate-in fade-in zoom-in duration-700">
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
                                <div className="w-32 h-32 border-[4px] border-indigo-50 border-t-indigo-600 rounded-full animate-spin shadow-lg"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                                    <BarChart3 className="w-10 h-10 text-indigo-500 animate-pulse" />
                                </div>
                            </div>
                            <h2 className="text-3xl font-[900] text-slate-900 mb-4 tracking-tight">당신의 답변을 정교하게 분석 중입니다</h2>
                            <p className="text-slate-500 font-medium text-lg tracking-tight">인공지능이 면접관의 시선으로 데이터를 살펴보고 있습니다</p>
                        </div>
                    ) : feedbackData ? (
                        <FeedbackReport data={feedbackData} onRestart={() => setFeedbackData(null)} />
                    ) : interviewQuestion ? (
                        <div className="animate-in fade-in slide-in-from-bottom-12 duration-700 w-full flex flex-col items-center py-20">
                            <div className="w-full max-w-3xl mb-12 flex items-center justify-between">
                                <button
                                    onClick={() => setInterviewQuestion(null)}
                                    className="group py-2 pr-4 text-slate-500 font-bold flex items-center gap-2 hover:text-indigo-600 transition-all"
                                >
                                    <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center group-hover:bg-indigo-50 group-hover:border-indigo-200 transition-all">
                                        <ChevronRight className="w-5 h-5 rotate-180" />
                                    </div>
                                    Back to questions
                                </button>
                                <div className="px-5 py-2 bg-indigo-50/80 text-indigo-600 rounded-full text-[11px] font-black uppercase tracking-widest border border-indigo-100 shadow-sm backdrop-blur-sm flex items-center gap-2">
                                    <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span>
                                    Live Session
                                </div>
                            </div>
                            <InterviewChat
                                initialQuestion={interviewQuestion}
                                onFinish={finishInterview}
                                isPressureMode={isPressureMode}
                            />
                        </div>
                    ) : !analysisResult ? (
                        <section className="w-full text-center space-y-24 animate-in fade-in slide-in-from-bottom-8 duration-1000 flex flex-col items-center">
                            <div className="space-y-12 flex flex-col items-center w-full relative">
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 blur-[80px] -z-10 rounded-full"></div>

                                <div className="inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full bg-white/80 backdrop-blur-md border border-indigo-100 shadow-xl shadow-indigo-900/5 text-indigo-600 text-[11px] font-black tracking-[0.2em] uppercase mx-auto hover:scale-105 transition-transform cursor-default">
                                    <span className="relative flex h-2.5 w-2.5">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600 shadow-[0_0_10px_rgba(79,70,229,0.5)]"></span>
                                    </span>
                                    AI Powered Interview Intelligence
                                </div>

                                <h1 className="text-[3.5rem] md:text-7xl lg:text-[5.5rem] font-[900] tracking-tighter text-slate-900 leading-[1.1] text-center w-full max-w-5xl">
                                    합격의 문을 여는 <br />
                                    <span className="text-gradient relative inline-block">
                                        가장 완벽한 전략
                                        <Sparkles className="absolute -top-6 -right-10 w-8 h-8 text-indigo-400 animate-pulse" />
                                    </span>
                                </h1>

                                <p className="text-xl md:text-2xl text-slate-500 max-w-2xl mx-auto leading-relaxed font-medium text-center tracking-tight">
                                    당신의 이력서와 채용 공고를 정밀 매칭하여 <br />
                                    합격을 위한 초정밀 면접 질문을 설계해 드립니다.
                                </p>
                            </div>

                            <div className="flex flex-col items-center gap-6">
                                {/* Mode Switching Tabs */}
                                <div className="flex bg-slate-200/50 p-1.5 rounded-[28px] border border-slate-200 backdrop-blur-md shadow-inner">
                                    <button
                                        onClick={() => setMode("simple")}
                                        className={`relative min-w-[220px] px-12 py-4 rounded-[22px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${mode === "simple"
                                            ? "bg-white text-indigo-600 shadow-2xl shadow-indigo-200/50 scale-100"
                                            : "text-slate-400 hover:text-slate-600 scale-95"
                                            }`}
                                    >
                                        이력서 단독 분석
                                    </button>
                                    <button
                                        onClick={() => setMode("combined")}
                                        className={`relative min-w-[220px] px-12 py-4 rounded-[22px] text-[13px] font-black uppercase tracking-widest transition-all duration-300 ${mode === "combined"
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
                            <div className="h-[80px] w-full" />

                            {/* Feature Grid */}
                            <div className="grid md:grid-cols-3 gap-16 w-full max-w-6xl border-t border-slate-100/50 pt-20">
                                <FeatureItem
                                    icon={<FileText className="w-8 h-8" />}
                                    title="Deep Analysis"
                                    description="이력서의 텍스트를 정밀 분석하여 직무 맞춤형 질문지를 즉시 생성합니다."
                                />
                                <FeatureItem
                                    icon={<Mic className="w-8 h-8" />}
                                    title="Voice Interview"
                                    description="Whisper STT 기술로 실제 목소리를 통해 자연스러운 답변 연습이 가능합니다."
                                />
                                <FeatureItem
                                    icon={<BarChart3 className="w-8 h-8" />}
                                    title="AI Feedback"
                                    description="모든 답변의 논리성과 직무 적합성을 점수와 차트로 시각화하여 제공합니다."
                                />
                            </div>
                            <div className="h-32 w-full" />
                        </section>
                    ) : (
                        <div className="text-left animate-in fade-in slide-in-from-bottom-8 duration-700">
                            <div className="flex justify-between items-start mb-10">
                                <button
                                    onClick={() => setAnalysisResult(null)}
                                    className="text-indigo-600 font-bold flex items-center gap-2 hover:translate-x-[-4px] transition-transform"
                                >
                                    <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center">
                                        <ChevronRight className="w-4 h-4 rotate-180" />
                                    </div>
                                    Upload different resume
                                </button>

                                {/* Pressure Mode Toggle */}
                                <div className="flex items-center gap-4 bg-white/40 backdrop-blur-2xl p-2 pl-6 rounded-full border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.04)] group">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">Pressure Mode</span>
                                        <span className="text-[9px] font-bold text-slate-400">심층 꼬리 질문 활성화</span>
                                    </div>
                                    <button
                                        onClick={() => setIsPressureMode(!isPressureMode)}
                                        className={`w-14 h-8 rounded-full p-1 transition-all duration-500 ${isPressureMode ? "bg-slate-900" : "bg-slate-200"}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white shadow-md transform transition-transform duration-500 ${isPressureMode ? "translate-x-6" : "translate-x-0"}`} />
                                    </button>
                                </div>
                            </div>

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

                            {/* Resume Coaching Section (If available) */}
                            {analysisResult.resume_coaching && (
                                <div className="mb-20 p-10 rounded-[45px] bg-gradient-to-br from-indigo-50 to-white border border-indigo-100 shadow-xl shadow-indigo-100/30 overflow-hidden relative">
                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center">
                                                <Sparkles className="w-5 h-5" />
                                            </div>
                                            <h3 className="text-xl font-black text-slate-900 tracking-tight">AI 이력서 첨삭 리포트</h3>
                                        </div>
                                        <p className="text-slate-600 font-bold mb-8 leading-relaxed">{analysisResult.resume_coaching.summary}</p>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {analysisResult.resume_coaching.suggestions.map((s: any, i: number) => (
                                                <div key={i} className="p-6 bg-white rounded-3xl border border-indigo-50 shadow-sm">
                                                    <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-black rounded-lg mb-3 uppercase tracking-widest">{s.category}</span>
                                                    <p className="text-slate-400 text-[11px] font-bold mb-2">문제점: {s.issue}</p>
                                                    <p className="text-indigo-900 text-[13px] font-black leading-snug">개선 제안: {s.improvement}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <Sparkles className="absolute -bottom-10 -right-10 w-40 h-40 text-indigo-200/20 rotate-12" />
                                </div>
                            )}

                            <div className="space-y-6">
                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">Select a question to practice</p>
                                <div className="grid gap-8">
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

            <footer className="mt-20 border-t border-slate-100 py-20 px-6 bg-white flex flex-col items-center">
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
        <div className="py-12 px-12 min-h-[200px] h-full rounded-[28px] bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl border border-white/20 shadow-[0_8px_30px_rgb(0,0,0,0.06)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.12)] hover:-translate-y-2 hover:from-white/30 hover:to-white/10 transition-all duration-500 group text-center relative overflow-hidden flex flex-col items-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10 flex flex-col items-center text-center h-full justify-center">
                <div className="w-16 h-16 bg-white/40 backdrop-blur-xl rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-500 mb-10 shadow-inner border border-white/50 group-hover:border-indigo-600 mx-auto">
                    {icon}
                </div>
                <h3 className="text-2xl font-black mb-6 text-slate-900 tracking-tight group-hover:text-indigo-900 transition-colors w-full">
                    {title}
                </h3>
                <p className="text-base text-slate-500 leading-relaxed font-semibold break-keep w-full px-4">
                    {description}
                </p>
            </div>
        </div>
    );
}

function PracticeCard({ item, onStart }: { item: any, onStart: () => void }) {
    return (
        <button
            onClick={onStart}
            className="p-8 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-3xl border border-white/20 rounded-[24px] hover:border-indigo-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 hover:from-white/30 hover:to-white/10 transition-all duration-300 group text-left flex items-center justify-between gap-6 relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-50/0 via-indigo-50/30 to-indigo-50/0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <div className="flex items-start gap-6 relative z-10">
                <div className="mt-1 w-14 h-14 bg-slate-50 text-slate-500 rounded-[22px] flex items-center justify-center text-xl font-black group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300 shadow-sm border border-slate-100 group-hover:border-indigo-600 shrink-0">
                    {item.id}
                </div>
                <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-black text-indigo-500 uppercase tracking-widest bg-indigo-50/50 px-2.5 py-1 rounded-md w-fit">
                        {item.category}
                    </div>
                    <p className="text-xl font-bold text-slate-800 leading-snug group-hover:text-slate-900 transition-colors">
                        {item.question}
                    </p>
                </div>
            </div>
            <div className="h-14 px-8 bg-slate-900 text-white rounded-2xl flex items-center justify-center font-black text-sm group-hover:bg-indigo-600 transition-colors duration-300 shrink-0 gap-2 shadow-md relative z-10">
                Practice
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </div>
        </button>
    );
}
