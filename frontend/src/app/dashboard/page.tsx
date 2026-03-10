'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, BarChart3, ArrowRight, Clock, Sparkles, TrendingUp, Award, Zap } from 'lucide-react';
import Link from 'next/link';
import { getInterviewHistory } from '@/lib/api';

export default function DashboardPage() {
    const [history, setHistory] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const data = await getInterviewHistory();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchHistory();
    }, []);

    const calculateAvgScore = (scores: any) => {
        const values: any[] = Object.values(scores || {});
        if (values.length === 0) return 0;
        const sum = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        return Number((sum / values.length).toFixed(1));
    };

    const getGlobalAvgScore = () => {
        if (history.length === 0) return 0;
        const totalAvg = history.reduce((acc, item) => acc + calculateAvgScore(item.scores), 0);
        return (totalAvg / history.length).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#F8F9FF] via-[#F0F2FF] to-[#E8EBFF] py-20 px-6 relative overflow-hidden">
            {/* Background Decorative Elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[800px] h-[800px] bg-purple-200/30 rounded-full blur-[150px]"></div>
            <div className="absolute top-[20%] left-[5%] w-32 h-32 bg-white/40 rounded-full blur-3xl"></div>
            <div className="absolute bottom-[30%] right-[5%] w-48 h-48 bg-indigo-100/40 rounded-full blur-3xl"></div>

            <div className="w-full max-w-6xl mx-auto space-y-16 relative z-10">
                <header className="flex flex-col items-center text-center gap-8 animate-in fade-in slide-in-from-top-12 duration-1000">
                    <Link href="/" className="group w-fit flex items-center gap-2 px-6 py-3 rounded-2xl bg-white/40 backdrop-blur-md border border-white/50 text-indigo-600 font-[1000] text-xs uppercase tracking-[0.2em] hover:bg-white/70 hover:scale-105 transition-all shadow-sm">
                        <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                        홈으로 돌아가기
                    </Link>

                    <div className="space-y-4">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-16 h-16 bg-slate-900 rounded-[22px] flex items-center justify-center text-white shadow-2xl shadow-indigo-100 rotate-6 hover:rotate-0 transition-transform duration-500">
                                <Sparkles className="w-8 h-8" />
                            </div>
                            <h1 className="text-6xl font-[1000] text-slate-900 tracking-tighter italic">면접 분석 히스토리</h1>
                        </div>
                        <p className="text-slate-500 font-bold text-xl tracking-tight opacity-80">당신의 성장은 이미 시작되었습니다</p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="py-40 flex flex-col items-center gap-8 animate-in fade-in duration-500">
                        <div className="relative">
                            <div className="absolute inset-0 bg-indigo-500/30 rounded-full blur-2xl animate-pulse"></div>
                            <div className="w-20 h-20 border-[4px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-2xl"></div>
                        </div>
                        <p className="text-slate-400 font-black text-sm uppercase tracking-[0.3em] animate-pulse">성장 데이터 동기화 중...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="py-32 bg-white/30 backdrop-blur-3xl rounded-[60px] border border-white/60 shadow-[0_30px_70px_rgba(79,70,229,0.06)] flex flex-col items-center justify-center text-center space-y-12 animate-in fade-in zoom-in duration-1000">
                        <div className="relative scale-110">
                            <div className="absolute inset-0 bg-slate-200/50 rounded-full blur-3xl animate-pulse"></div>
                            <div className="w-28 h-28 bg-white/90 rounded-[40px] flex items-center justify-center text-slate-300 shadow-md border border-white/50 relative z-10 rotate-12">
                                <BarChart3 className="w-14 h-14" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-[1000] text-slate-800 tracking-tight">아직 기록된 면접이 없습니다</h3>
                            <p className="text-slate-500 font-bold text-lg max-w-md leading-relaxed">첫 번째 면접 분석을 완료하고<br />데이터 기반의 성장을 경험해보세요.</p>
                        </div>
                        <Link href="/" className="group relative px-12 py-6 bg-slate-900 text-white rounded-[24px] font-[1000] text-base uppercase tracking-widest overflow-hidden transition-all hover:scale-105 hover:shadow-2xl active:scale-95">
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                            <span className="relative z-10 flex items-center gap-3">
                                첫 분석 시작하기 <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <StatCard
                                icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                                label="Total Sessions"
                                value={`${history.length}`}
                                unit="회"
                            />
                            <StatCard
                                icon={<Award className="w-6 h-6 text-purple-600" />}
                                label="Average Score"
                                value={getGlobalAvgScore()}
                                unit="점"
                            />
                            <StatCard
                                icon={<Zap className="w-6 h-6 text-amber-600" />}
                                label="Practice Streak"
                                value="3"
                                unit="일"
                            />
                        </div>

                        {/* History List */}
                        <div className="grid gap-8">
                            {history.map((item: any, index: number) => (
                                <div
                                    key={item.id}
                                    style={{ animationDelay: `${index * 100}ms` }}
                                    className="group relative p-10 bg-white/40 backdrop-blur-3xl border border-white/70 rounded-[48px] hover:bg-white/90 hover:border-indigo-400/50 hover:shadow-[0_40px_80px_rgba(79,70,229,0.12)] hover:-translate-y-2 transition-all duration-700 flex flex-col lg:flex-row lg:items-center justify-between gap-12 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                                >
                                    {/* Abstract background shape on hover */}
                                    <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                    <div className="flex items-start gap-10 relative z-10 w-full lg:w-auto">
                                        <div className="w-24 h-24 bg-white shadow-sm rounded-[32px] flex flex-col items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shrink-0 border border-slate-50 group-hover:border-slate-800 scale-100 group-hover:scale-110 group-hover:rotate-6">
                                            <Calendar className="w-8 h-8 mb-2 opacity-80" />
                                            <span className="text-xs font-[1000] uppercase tracking-tighter">
                                                {item.interviews?.created_at ? new Date(item.interviews.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : "-"}
                                            </span>
                                        </div>
                                        <div className="space-y-5 flex-1 text-left">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <span className="px-5 py-2 bg-indigo-600 text-white text-[11px] font-[1000] rounded-xl uppercase tracking-[0.2em] shadow-xl shadow-indigo-100/50">
                                                    {item.interviews?.resume_summary || "AI Personalized"}
                                                </span>
                                                <div className="flex items-center gap-2 text-slate-400 px-4 py-1.5 bg-white/60 rounded-xl border border-white/50 shadow-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span className="text-[11px] font-black uppercase">
                                                        {item.interviews?.created_at ? new Date(item.interviews.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : "-"}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-3xl font-[1000] text-slate-800 tracking-tighter flex items-center gap-3 group-hover:text-indigo-600 transition-colors">
                                                    <span className="text-[14px] text-slate-400 font-black uppercase tracking-[0.3em] inline-block mb-1">Score.</span>
                                                    {calculateAvgScore(item.scores)} <span className="text-xl font-bold opacity-60">PTS</span>
                                                </h3>
                                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                    <div className="h-full bg-indigo-500 rounded-full group-hover:bg-indigo-600 transition-all duration-1000" style={{ width: `${calculateAvgScore(item.scores)}%` }}></div>
                                                </div>
                                            </div>
                                            <p className="text-slate-500 font-bold text-base line-clamp-2 leading-relaxed max-w-xl opacity-70 group-hover:opacity-100 transition-opacity">
                                                "{item.overall_feedback}"
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between lg:justify-end gap-10 relative z-10 border-t lg:border-t-0 border-white/40 pt-10 lg:pt-0">
                                        <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
                                            {Object.entries(item.scores || {}).map(([key, value]: [string, any]) => (
                                                <div key={key} className="flex flex-col items-center px-5 py-4 bg-white/80 border border-white rounded-3xl group-hover:border-indigo-100 transition-all min-w-[85px] shadow-sm group-hover:shadow-md">
                                                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2 opacity-80">{key}</span>
                                                    <span className="text-base font-black text-slate-900 group-hover:text-indigo-600">{value as number}</span>
                                                </div>
                                            ))}
                                        </div>
                                        <button className="w-20 h-20 rounded-[35px] bg-slate-900 text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-2xl shadow-slate-400 group-hover:bg-indigo-600 group-hover:shadow-indigo-200/60 shrink-0 border-4 border-white/50">
                                            <ArrowRight className="w-9 h-9" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit: string }) {
    return (
        <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/60 shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col items-center text-center gap-4 hover:bg-white/60 hover:-translate-y-1 transition-all">
            <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-slate-50">
                {icon}
            </div>
            <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{label}</p>
                <h4 className="text-4xl font-[1000] text-slate-900 tracking-tight">
                    {value}<span className="text-lg font-bold text-slate-400 ml-1">{unit}</span>
                </h4>
            </div>
        </div>
    );
}
