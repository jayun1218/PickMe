'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, BarChart3, ArrowRight, Clock, Sparkles, TrendingUp, Award, Zap, Loader2, Target, Heart, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';
import { getInterviewHistory, getJobs } from '@/lib/api';
import {
    Radar,
    RadarChart,
    PolarGrid,
    PolarAngleAxis,
    ResponsiveContainer,
} from 'recharts';

export default function Dashboard() {
    const [history, setHistory] = useState<any[]>([]);
    const [jobs, setJobs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dDayInfo, setDDayInfo] = useState<{ days: number, company: string } | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [historyData, jobsData] = await Promise.all([
                    getInterviewHistory(),
                    getJobs()
                ]);
                setHistory(historyData);
                setJobs(jobsData);

                // D-Day 계산
                if (jobsData && jobsData.length > 0) {
                    const now = new Date();
                    const futureJobs = jobsData
                        .map((job: any) => ({
                            ...job,
                            diff: new Date(job.deadline).getTime() - now.getTime()
                        }))
                        .filter((job: any) => job.diff > 0)
                        .sort((a: any, b: any) => a.diff - b.diff);

                    if (futureJobs.length > 0) {
                        const closest = futureJobs[0];
                        const days = Math.ceil(closest.diff / (1000 * 60 * 60 * 24));
                        setDDayInfo({ days, company: closest.company });
                    }
                }
            } catch (error) {
                console.error("Failed to fetch data:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
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

    const getCompetencyData = () => {
        const competencies = [
            { key: 'communication', label: '소통력' },
            { key: 'problem_solving', label: '문제해결' },
            { key: 'technical_skill', label: '기술역량' },
            { key: 'passion', label: '열정/발전' },
            { key: 'cooperation', label: '협업능력' }
        ];

        if (history.length === 0) {
            // Placeholder/Default data for empty state
            return competencies.map(comp => ({
                subject: comp.label,
                value: 40, // Base value for visualization
                fullMark: 100
            }));
        }

        return competencies.map(comp => {
            const scores = history
                .map(item => item.scores?.[comp.key] || 70)
                .filter(score => score !== undefined);

            const avg = scores.length > 0
                ? scores.reduce((a, b) => a + b, 0) / scores.length
                : 0;

            return {
                subject: comp.label,
                value: Math.round(avg),
                fullMark: 100
            };
        });
    };

    if (isLoading) {
        return (
            <div className="py-40 flex flex-col items-center gap-8 animate-in fade-in duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-2xl animate-pulse"></div>
                    <div className="w-14 h-14 border-[3px] border-indigo-100 border-t-indigo-600 rounded-full animate-spin shadow-xl"></div>
                </div>
                <p className="text-slate-400 font-black text-xs uppercase tracking-[0.3em] animate-pulse">데이터 동기화 중...</p>
            </div>
        );
    }

    const competencyData = getCompetencyData();
    const isEmpty = history.length === 0;

    return (
        <div className="space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000 w-full max-w-6xl">
            {/* Mental Care & D-Day Banner */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-[40px] p-10 text-white shadow-2xl shadow-indigo-200 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-20 -mt-20 blur-3xl group-hover:scale-110 transition-transform duration-1000"></div>
                    <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
                        <div className="space-y-4 text-center md:text-left">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/20 rounded-full text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                                <Heart className="w-3 h-3 fill-white" /> AI Daily Support
                            </div>
                            <h2 className="text-3xl md:text-4xl font-black leading-tight tracking-tight">
                                "지치지 마세요. 당신의 <br />
                                가능성은 데이터가 증명합니다."
                            </h2>
                            <p className="text-indigo-100 font-bold opacity-80 max-w-md">
                                오늘의 조언: 답변 시 '결과' 보다는 '과정에서의 문제 해결 방식'을 더 강조해 보세요. 훨씬 매력적으로 들릴 거예요!
                            </p>
                        </div>
                        <div className="flex flex-col items-center justify-center bg-white/10 backdrop-blur-xl rounded-[35px] p-8 border border-white/20 min-w-[200px]">
                            {dDayInfo ? (
                                <>
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">D-DAY</span>
                                    <span className="text-6xl font-black tracking-tighter mb-2">D-{dDayInfo.days}</span>
                                    <span className="text-xs font-bold bg-white text-indigo-600 px-3 py-1 rounded-lg shadow-sm">
                                        {dDayInfo.company}
                                    </span>
                                </>
                            ) : (
                                <>
                                    <AlertCircle className="w-8 h-8 mb-3 opacity-40" />
                                    <span className="text-center text-[11px] font-bold opacity-70">
                                        등록된 일정이 <br /> 없습니다
                                    </span>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                <div className="bg-white/40 backdrop-blur-3xl p-10 rounded-[40px] border border-white/70 shadow-xl flex flex-col justify-between">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-amber-600" />
                            </div>
                            <span className="text-sm font-black text-slate-800">오늘의 핵심 키워드</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {['협업 중심', '데이터 기반', '문제 해결', '성과 도출', '성장 지향'].map(tag => (
                                <span key={tag} className="px-4 py-2 bg-white rounded-2xl text-[11px] font-black text-slate-600 border border-slate-100 shadow-sm hover:border-amber-200 hover:text-amber-600 transition-colors cursor-default">
                                    #{tag}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="pt-6 border-t border-slate-100/50">
                        <p className="text-[11px] font-bold text-slate-400 leading-relaxed italic">
                            "이 키워드들을 답변에 녹여내면 더 좋은 점수를 받을 수 있습니다."
                        </p>
                    </div>
                </div>
            </div>

            {/* Middle Section: Stats & Competency Chart */}
            <div className="flex flex-col lg:flex-row gap-8">
                {/* Stats Overview */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 order-2 lg:order-1">
                    <StatCard
                        icon={<TrendingUp className="w-6 h-6 text-indigo-600" />}
                        label="Total Sessions"
                        value={isEmpty ? "0" : `${history.length}`}
                        unit="회"
                    />
                    <StatCard
                        icon={<Award className="w-6 h-6 text-purple-600" />}
                        label="Average Score"
                        value={isEmpty ? "0.0" : getGlobalAvgScore()}
                        unit="점"
                    />
                    <StatCard
                        icon={<Zap className="w-6 h-6 text-amber-600" />}
                        label="Practice Streak"
                        value={isEmpty ? "0" : "3"}
                        unit="일"
                    />
                    <div className="bg-white/60 backdrop-blur-3xl p-8 rounded-[40px] border border-white/70 shadow-lg flex flex-col justify-between group hover:border-indigo-200 transition-all cursor-default">
                        <CheckCircle2 className={`w-8 h-8 mb-4 ${isEmpty ? 'text-slate-300' : 'text-green-500'}`} />
                        <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Weekly Status</p>
                            <h4 className="text-xl font-black text-slate-800 leading-tight">
                                {isEmpty ? "첫 면접을 시작하여 \n 목표를 달성하세요!" : (<>이번 주 목표의 <span className="text-indigo-600">85%</span>를 달성했습니다.</>)}
                            </h4>
                        </div>
                    </div>
                </div>

                {/* Radar Chart */}
                <div className={`w-full lg:w-[450px] bg-white/40 backdrop-blur-3xl p-10 rounded-[50px] border border-white/70 shadow-xl flex flex-col items-center justify-center order-1 lg:order-2 relative ${isEmpty ? 'grayscale-[0.5] opacity-80' : ''}`}>
                    <div className="w-full flex justify-between items-center mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <Target className="w-4 h-4 text-indigo-600" />
                            </div>
                            <span className="text-sm font-black text-slate-800 tracking-tight">핵심 역량 프로필</span>
                        </div>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">AI Analysis</span>
                    </div>

                    <div className="w-full h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={competencyData}>
                                <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                                <PolarAngleAxis
                                    dataKey="subject"
                                    tick={{ fill: '#64748b', fontSize: 11, fontWeight: 900 }}
                                />
                                <Radar
                                    name="나의 역량"
                                    dataKey="value"
                                    stroke={isEmpty ? "#94a3b8" : "#4f46e5"}
                                    strokeWidth={3}
                                    fill={isEmpty ? "#cbd5e1" : "#4f46e5"}
                                    fillOpacity={0.15}
                                    animationDuration={1500}
                                />
                            </RadarChart>
                        </ResponsiveContainer>
                    </div>

                    {isEmpty && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/10 backdrop-blur-[2px] rounded-[50px] z-20">
                            <div className="bg-slate-900 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-2 scale-90 hover:scale-100 transition-transform cursor-default">
                                <HelpCircle className="w-4 h-4" />
                                <span className="text-xs font-black uppercase tracking-widest">No Data Available</span>
                            </div>
                        </div>
                    )}

                    <p className="mt-4 text-[11px] font-bold text-slate-400 text-center leading-relaxed">
                        최근 분석 데이터를 기반으로 도출된<br />직무 특화 핵심 역량 지표입니다.
                    </p>
                </div>
            </div>

            {/* History List Section */}
            <div className="space-y-8">
                <div className="flex items-center justify-between px-4 mt-8">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-indigo-600 rounded-full"></div>
                        <h3 className="text-2xl font-[900] text-slate-800 tracking-tight">최근 분석 리포트</h3>
                    </div>
                    {!isEmpty && (
                        <button className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors">
                            View All <ArrowRight className="w-4 h-4" />
                        </button>
                    )}
                </div>

                {isEmpty ? (
                    <div className="py-20 w-full bg-white/30 backdrop-blur-3xl rounded-[60px] border border-white/60 shadow-[0_30px_70px_rgba(79,70,229,0.06)] flex flex-col items-center justify-center text-center space-y-10">
                        <div className="relative">
                            <div className="absolute inset-0 bg-slate-200/50 rounded-full blur-2xl animate-pulse"></div>
                            <div className="w-20 h-20 bg-white/90 rounded-[30px] flex items-center justify-center text-slate-300 shadow-md border border-white/50 relative z-10 rotate-12">
                                <BarChart3 className="w-10 h-10" />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-3xl font-[1000] text-slate-800 tracking-tight">아직 기록된 면접이 없습니다</h3>
                            <p className="text-slate-500 font-bold text-lg max-w-md leading-relaxed">첫 번째 면접 분석을 완료하고<br />데이터 기반의 성장을 경험해보세요.</p>
                        </div>
                    </div>
                ) : (
                    <div className="grid gap-8">
                        {history.map((item: any, index: number) => (
                            <div
                                key={item.id}
                                style={{ animationDelay: `${index * 100}ms` }}
                                className="group relative p-10 bg-white/40 backdrop-blur-3xl border border-white/70 rounded-[48px] hover:bg-white/90 hover:border-indigo-400/50 hover:shadow-[0_40px_80px_rgba(79,70,229,0.12)] hover:-translate-y-2 transition-all duration-700 flex flex-col lg:flex-row lg:items-center justify-between gap-12 overflow-hidden animate-in fade-in slide-in-from-bottom-8 fill-mode-both"
                            >
                                <div className="absolute -top-20 -right-20 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>

                                <div className="flex items-start gap-10 relative z-10 w-full lg:w-auto">
                                    <div className="w-18 h-18 bg-white shadow-sm rounded-[24px] flex flex-col items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-500 shrink-0 border border-slate-50 group-hover:border-slate-800 scale-100 group-hover:scale-110 group-hover:rotate-6">
                                        <Calendar className="w-6 h-6 mb-1.5 opacity-80" />
                                        <span className="text-[10px] font-[1000] uppercase tracking-tighter">
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
                )}
            </div>
        </div>
    );
}

function StatCard({ icon, label, value, unit }: { icon: React.ReactNode, label: string, value: string | number, unit: string }) {
    return (
        <div className="bg-white/40 backdrop-blur-3xl p-8 rounded-[40px] border border-white/60 shadow-[0_15px_30px_rgba(0,0,0,0.03)] flex flex-col items-center text-center gap-4 hover:bg-white/60 hover:-translate-y-1 transition-all flex-1">
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
