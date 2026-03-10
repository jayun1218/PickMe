'use client';

import React from 'react';
import { CheckCircle2, Copy, Sparkles, BookOpen, Target, Zap, ChevronRight, PenTool, BrainCircuit } from 'lucide-react';

interface ResumeCoachResultProps {
    data: {
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
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] font-black uppercase tracking-wider">AI Coaching Result</span>
                    </div>
                    <h2 className="text-4xl font-[900] text-slate-900 tracking-tight">AI 입체적 자소서 코칭 완료</h2>
                </div>
                <button
                    onClick={onReset}
                    className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                >
                    <ChevronRight className="w-4 h-4 rotate-180" />
                    다른 경험 분석하기
                </button>
            </header>

            <div className="grid lg:grid-cols-5 gap-10">
                {/* Left: STAR Structure Analysis */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white/40 backdrop-blur-2xl rounded-[32px] p-8 border border-white/60 shadow-xl shadow-indigo-900/5 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6 opacity-10">
                            <Sparkles className="w-20 h-20 text-indigo-600" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-3">
                            <BrainCircuit className="w-6 h-6 text-indigo-600" />
                            STAR 구조화 분석
                        </h3>

                        <div className="space-y-8 relative">
                            {starItems.map((item, idx) => (
                                <div key={item.label} className="relative pl-10 border-l-2 border-slate-100 last:border-0 pb-8 last:pb-0">
                                    <div className={`absolute -left-[13px] top-0 w-6 h-6 rounded-full bg-white border-2 flex items-center justify-center shadow-sm z-10 ${item.color === 'blue' ? 'border-blue-500 text-blue-500' :
                                            item.color === 'indigo' ? 'border-indigo-500 text-indigo-500' :
                                                item.color === 'purple' ? 'border-purple-500 text-purple-500' :
                                                    'border-emerald-500 text-emerald-500'
                                        }`}>
                                        <span className="text-[10px] font-black">{item.label[0]}</span>
                                    </div>
                                    <div className="space-y-1">
                                        <h4 className={`text-xs font-black uppercase tracking-widest ${item.color === 'blue' ? 'text-blue-600' :
                                                item.color === 'indigo' ? 'text-indigo-600' :
                                                    item.color === 'purple' ? 'text-purple-600' :
                                                        'text-emerald-600'
                                            }`}>{item.label}</h4>
                                        <p className="text-sm font-bold text-slate-700 leading-relaxed">{item.content}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-slate-900 rounded-[24px] p-6 text-white shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl -mr-10 -mt-10 group-hover:bg-indigo-500/30 transition-colors"></div>
                        <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-2">Key Insight</h4>
                        <p className="text-sm font-bold leading-relaxed italic">"{data.key_insight}"</p>
                    </div>
                </div>

                {/* Right: Improved Draft */}
                <div className="lg:col-span-3">
                    <div className="h-full bg-white/60 backdrop-blur-3xl rounded-[32px] p-10 border border-white/80 shadow-2xl shadow-indigo-900/10 flex flex-col">
                        <div className="flex justify-between items-center mb-10">
                            <h3 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                                <PenTool className="w-7 h-7 text-purple-600" />
                                AI 맞춤형 자소서 초안
                            </h3>
                            <button
                                onClick={() => copyToClipboard(data.improved_draft)}
                                className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-100"
                            >
                                <Copy className="w-4 h-4" />
                                전체 복사하기
                            </button>
                        </div>

                        <div className="flex-1 bg-white/40 rounded-3xl p-8 border border-white/50 relative group">
                            <div className="absolute top-4 right-4 animate-pulse">
                                <Sparkles className="w-5 h-5 text-purple-400" />
                            </div>
                            <div className="prose prose-slate max-w-none">
                                <div className="text-lg font-bold text-slate-800 leading-[1.8] whitespace-pre-wrap">
                                    {data.improved_draft}
                                </div>
                            </div>
                        </div>

                        <p className="mt-8 text-xs text-slate-400 font-medium text-center italic">
                            * AI가 생성한 초안입니다. 본인의 스타일에 맞게 조금 더 다듬으면 더 완벽한 자소서가 됩니다.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
