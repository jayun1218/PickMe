'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft, Calendar, BarChart3, ArrowRight, Clock } from 'lucide-react';
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
        if (values.length === 0) return "0.0";
        const sum = values.reduce((acc, curr) => acc + (Number(curr) || 0), 0);
        return (sum / values.length).toFixed(1);
    };

    return (
        <div className="min-h-screen bg-[#FAFBFF] py-20 px-6">
            <div className="w-full max-w-5xl mx-auto space-y-12">
                <header className="flex items-center justify-between">
                    <div className="space-y-2">
                        <Link href="/" className="text-indigo-600 font-bold flex items-center gap-2 mb-6 hover:translate-x-[-4px] transition-all">
                            <ChevronLeft className="w-4 h-4" />
                            홈으로 돌아가기
                        </Link>
                        <h1 className="text-4xl font-[900] text-slate-900 tracking-tight">면접 분석 히스토리</h1>
                        <p className="text-slate-400 font-medium">지금까지의 성장을 한눈에 확인하세요</p>
                    </div>
                </header>

                {isLoading ? (
                    <div className="py-40 flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-slate-400 font-bold animate-pulse">데이터를 불러오는 중...</p>
                    </div>
                ) : history.length === 0 ? (
                    <div className="py-40 bg-white rounded-[45px] border border-slate-100 shadow-xl shadow-indigo-100/20 flex flex-col items-center justify-center text-center space-y-6">
                        <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-300">
                            <BarChart3 className="w-10 h-10" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-slate-800">기록이 아직 없네요</h3>
                            <p className="text-slate-400 font-medium">첫 번째 AI 면접을 시작하고 성장을 기록해 보세요.</p>
                        </div>
                        <Link href="/" className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black text-sm hover:scale-105 transition-all">
                            면접 시작하기
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {history.map((item: any) => (
                            <div key={item.id} className="group p-8 bg-white border border-slate-100 rounded-[35px] hover:border-indigo-600 hover:shadow-2xl hover:shadow-indigo-100/50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex flex-col items-center justify-center group-hover:bg-gradient-premium group-hover:text-white transition-all shrink-0">
                                        <Calendar className="w-6 h-6 mb-1" />
                                        <span className="text-[10px] font-black uppercase">
                                            {item.interviews?.created_at ? new Date(item.interviews.created_at).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }) : "-"}
                                        </span>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black rounded-lg uppercase tracking-widest">
                                                {item.interviews?.resume_summary || "Personalized Interview"}
                                            </span>
                                            <div className="flex items-center gap-1 text-slate-300">
                                                <Clock className="w-3 h-3" />
                                                <span className="text-[10px] font-bold">
                                                    {item.interviews?.created_at ? new Date(item.interviews.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) : "-"}
                                                </span>
                                            </div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 tracking-tight line-clamp-1">
                                            종합 점수: {calculateAvgScore(item.scores)}점
                                        </h3>
                                        <p className="text-slate-400 text-sm font-medium line-clamp-1 leading-relaxed">
                                            {item.overall_feedback}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="grid grid-cols-4 gap-2">
                                        {Object.entries(item.scores || {}).map(([key, value]: [string, any]) => (
                                            <div key={key} className="flex flex-col items-center px-3 py-2 bg-slate-50 rounded-xl group-hover:bg-white border border-transparent group-hover:border-slate-100 transition-all">
                                                <span className="text-[8px] font-black text-slate-400 uppercase tracking-tighter mb-1">{key}</span>
                                                <span className="text-xs font-black text-indigo-600">{value as number}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-all shadow-xl shadow-slate-200 group-hover:bg-indigo-600">
                                        <ArrowRight className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
