'use client';

import React from 'react';
import { CheckCircle2, Copy, Sparkles, BookOpen, Target, Zap, ChevronRight, PenTool, BrainCircuit } from 'lucide-react';

interface ResumeCoachResultProps {
    data: {
        benchmark_score?: number;
        summary?: string;
        missing_keywords?: string[];
        differentiation?: string;
        suggestions?: Array<{ category: string, issue: string, improvement: string }>;
        star_structure: {
            situation: string;
            task: string;
            action: string;
            result: string;
        };
        improved_draft: string;
        key_insight: string;
        filename: string;
    };
    onReset: () => void;
}

export default function ResumeCoachResult({ data, onReset }: ResumeCoachResultProps) {
    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        alert('클립보드에 복사되었습니다!');
    };

    const starItems = [
        { label: 'Situation', content: data.star_structure.situation, icon: <BookOpen className="w-5 h-5" />, color: 'blue' },
        { label: 'Task', content: data.star_structure.task, icon: <Target className="w-5 h-5" />, color: 'indigo' },
        { label: 'Action', content: data.star_structure.action, icon: <Zap className="w-5 h-5" />, color: 'purple' },
        { label: 'Result', content: data.star_structure.result, icon: <CheckCircle2 className="w-5 h-5" />, color: 'emerald' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 pb-20">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="space-y-2">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-indigo-600 text-white rounded-lg text-[10px] font-black uppercase tracking-[0.2em] shadow-lg shadow-indigo-100">Success Benchmark</span>
                        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">{data.filename}</span>
                    </div>
                    <h2 className="text-4xl font-[1000] text-slate-900 tracking-tight leading-tight">AI 입체적 자소서 코칭 완료</h2>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-[20px] text-sm font-black hover:bg-indigo-600 transition-all shadow-xl shadow-slate-200"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    새로운 경험 분석하기
                </button>
            </header>

            {/* Benchmarking Summary Bar */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] p-10 border border-white/70 shadow-2xl shadow-indigo-900/5 relative overflow-hidden group">
                <div className="flex flex-col lg:flex-row items-center gap-12">
                    <div className="relative flex-shrink-0">
                        <svg className="w-40 h-40">
                            <circle className="text-slate-100" strokeWidth="12" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                            <circle className="text-indigo-600 transition-all duration-1000" strokeWidth="12" strokeDasharray={440} strokeDashoffset={440 - (440 * (data.benchmark_score || 85)) / 100} strokeLinecap="round" stroke="currentColor" fill="transparent" r="70" cx="80" cy="80" />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-4xl font-black text-slate-900">{data.benchmark_score || 85}</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Bench. Score</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-6 text-center lg:text-left">
                        <div className="space-y-2">
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">"{data.summary || "동일 직무 합격자 대비 상위 15% 수준의 경쟁력을 보유하고 있습니다."}"</h3>
                            <p className="text-slate-500 font-bold text-lg leading-relaxed">{data.differentiation || "이분만의 실질적인 문제 해결 역량과 협업 태도가 돋보이는 훌륭한 자소서입니다."}</p>
                        </div>
                        <div className="flex flex-wrap justify-center lg:justify-start gap-3">
                            {data.missing_keywords?.map(tag => (
                                <span key={tag} className="px-5 py-2.5 bg-white rounded-2xl text-xs font-black text-indigo-600 border border-indigo-50 shadow-sm">
                                    # {tag} 보완 필요
                                </span>
                            )) || (
                                    <>
                                        <span className="px-5 py-2.5 bg-white rounded-2xl text-xs font-black text-indigo-600 border border-indigo-50 shadow-sm"># 데이터_검증</span>
                                        <span className="px-5 py-2.5 bg-white rounded-2xl text-xs font-black text-indigo-600 border border-indigo-50 shadow-sm"># 성과_지표</span>
                                        <span className="px-5 py-2.5 bg-white rounded-2xl text-xs font-black text-indigo-600 border border-indigo-50 shadow-sm"># 비즈니스_임팩트</span>
                                    </>
                                )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-5 gap-10">
                {/* Left: STAR Structure Analysis */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white/40 backdrop-blur-2xl rounded-[40px] p-10 border border-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
                        <h3 className="text-xl font-black text-slate-900 mb-10 flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-indigo-600" />
                            STAR 구조화 분석
                        </h3>

                        <div className="space-y-10 relative">
                            {starItems.map((item, idx) => (
                                <div key={item.label} className="relative pl-12 border-l-2 border-slate-100 last:border-0 pb-10 last:pb-0">
                                    <div className={`absolute -left-[14px] top-0 w-7 h-7 rounded-full bg-white border-2 flex items-center justify-center shadow-md z-10 ${item.color === 'blue' ? 'border-blue-500 text-blue-500' :
                                        item.color === 'indigo' ? 'border-indigo-500 text-indigo-500' :
                                            item.color === 'purple' ? 'border-purple-500 text-purple-500' :
                                                'border-emerald-500 text-emerald-500'
                                        }`}>
                                        <span className="text-[11px] font-black">{item.label[0]}</span>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className={`text-[11px] font-black uppercase tracking-[0.2em] ${item.color === 'blue' ? 'text-blue-600' :
                                            item.color === 'indigo' ? 'text-indigo-600' :
                                                item.color === 'purple' ? 'text-purple-600' :
                                                    'text-emerald-600'
                                            }`}>{item.label}</h4>
                                        <p className="text-base font-bold text-slate-700 leading-relaxed">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[35px] p-8 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/20 blur-3xl -mr-12 -mt-12 group-hover:bg-indigo-500/30 transition-colors"></div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-3">Key Insight</h4>
                        <p className="text-lg font-bold leading-relaxed italic">"{data.key_insight}"</p>
                    </div>
                </div>

                {/* Right: Improved Draft */}
                <div className="lg:col-span-3">
                    <div className="h-full bg-white/60 backdrop-blur-3xl rounded-[40px] p-12 border border-white/80 shadow-2xl shadow-indigo-900/10 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-[1000] text-slate-900 flex items-center gap-3 tracking-tight">
                                <PenTool className="w-8 h-8 text-purple-600" />
                                AI 맞춤형 합격 자소서
                            </h3>
                            <button
                                onClick={() => copyToClipboard(data.improved_draft)}
                                className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-[18px] text-[11px] font-black uppercase tracking-widest hover:bg-indigo-600 hover:scale-105 active:scale-95 transition-all shadow-xl shadow-slate-200"
                            >
                                <Copy className="w-4 h-4" />
                                Copy Text
                            </button>
                        </div>

                        <div className="flex-1 bg-white/50 rounded-[30px] p-10 border border-white relative group">
                            <div className="absolute top-6 right-6 animate-pulse">
                                <Sparkles className="w-6 h-6 text-purple-400" />
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <div className="text-xl font-bold text-slate-800 leading-[2.1] whitespace-pre-wrap tracking-tight">
                                    {data.improved_draft}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 p-6 bg-slate-50/50 rounded-2xl border border-slate-100 flex items-center gap-4">
                            <Zap className="w-6 h-6 text-amber-500 flex-shrink-0" />
                            <p className="text-xs text-slate-500 font-bold leading-relaxed">
                                AI가 합격자들의 패턴을 분석하여 다듬은 문장입니다. 상황에 맞게 수치를 조금만 더 보정하면 합격률은 더욱 올라갑니다.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
