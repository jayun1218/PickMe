'use client';

import React from 'react';
import { BarChart3, ThumbsUp, AlertCircle, RotateCcw, PieChart, Star, Target, Zap } from 'lucide-react';

interface FeedbackData {
    scores: {
        logical_thinking: number;
        job_suitability: number;
        clarity: number;
        keyword_usage: number;
    };
    overall_feedback: string;
    strengths: string[];
    improvements: string[];
}

interface FeedbackReportProps {
    data: FeedbackData;
    onRestart: () => void;
}

export default function FeedbackReport({ data, onRestart }: FeedbackReportProps) {
    const scoreItems = [
        { label: '논리적 사고', value: data.scores.logical_thinking, color: 'from-blue-500 to-indigo-600', icon: <Target className="w-4 h-4" /> },
        { label: '직무 적합성', value: data.scores.job_suitability, color: 'from-indigo-500 to-violet-600', icon: <Zap className="w-4 h-4" /> },
        { label: '전달력', value: data.scores.clarity, color: 'from-violet-500 to-purple-600', icon: <Star className="w-4 h-4" /> },
        { label: '키워드 활용', value: data.scores.keyword_usage, color: 'from-purple-500 to-pink-600', icon: <BarChart3 className="w-4 h-4" /> },
    ];

    return (
        <div className="w-full max-w-5xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Main Analysis Dashboard */}
            <div className="bg-white p-12 rounded-[50px] border border-slate-50 shadow-2xl shadow-indigo-100/40 relative overflow-hidden">
                {/* Background Decorative Element */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-50/50 rounded-full blur-3xl -z-10"></div>

                <div className="flex flex-col md:flex-row gap-16">
                    {/* Left: Scores Side */}
                    <div className="flex-1 space-y-10">
                        <header className="space-y-2">
                            <div className="flex items-center gap-3 text-indigo-600">
                                <PieChart className="w-6 h-6" />
                                <span className="text-[11px] font-black uppercase tracking-[0.3em]">Performance Metrics</span>
                            </div>
                            <h2 className="text-4xl font-black text-slate-900 tracking-tight">AI 역량 분석 리포트</h2>
                        </header>

                        <div className="grid gap-8">
                            {scoreItems.map((item) => (
                                <div key={item.label} className="space-y-3 group">
                                    <div className="flex justify-between items-end px-1">
                                        <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                                            {item.icon}
                                            {item.label}
                                        </div>
                                        <span className="text-2xl font-black text-slate-900 tracking-tighter">
                                            {item.value}<span className="text-sm font-medium text-slate-400 ml-0.5">/100</span>
                                        </span>
                                    </div>
                                    <div className="h-4 bg-slate-50 rounded-full overflow-hidden p-0.5 border border-slate-100">
                                        <div
                                            className={`h-full bg-gradient-to-r ${item.color} rounded-full transition-all duration-1000 ease-out shadow-lg shadow-indigo-200/50`}
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Summary Side */}
                    <div className="w-full md:w-80 flex flex-col pt-4">
                        <div className="flex-1 h-full bg-slate-50 p-10 rounded-[40px] flex flex-col justify-center relative">
                            <div className="absolute top-8 left-8 text-slate-200 font-serif text-6xl leading-none">“</div>
                            <p className="text-xl text-slate-700 leading-relaxed font-bold italic z-10 text-center">
                                {data.overall_feedback}
                            </p>
                            <div className="absolute bottom-8 right-8 text-slate-200 font-serif text-6xl leading-none rotate-180">“</div>
                        </div>
                        <p className="mt-6 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">Synthetic Insight by PickMe</p>
                    </div>
                </div>
            </div>

            {/* Qualititative Cards */}
            <div className="grid md:grid-cols-2 gap-8">
                {/* Strengths Card */}
                <div className="bg-white p-10 rounded-[45px] border border-slate-50 shadow-xl hover:shadow-2xl hover:shadow-green-100/30 transition-all group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-green-50 text-green-500 rounded-2xl flex items-center justify-center group-hover:bg-green-500 group-hover:text-white transition-all shadow-sm">
                            <ThumbsUp className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Key Strengths</h3>
                            <p className="text-xs text-green-600/70 font-bold uppercase tracking-widest">강점 분석</p>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        {data.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-4 p-5 bg-green-50/50 rounded-3xl text-slate-700 text-base font-bold transition-all hover:translate-x-1 group/item">
                                <div className="mt-1.5 w-2 h-2 bg-green-500 rounded-full shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Improvements Card */}
                <div className="bg-white p-10 rounded-[45px] border border-slate-50 shadow-xl hover:shadow-2xl hover:shadow-amber-100/30 transition-all group">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-all shadow-sm">
                            <AlertCircle className="w-7 h-7" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Areas for Growth</h3>
                            <p className="text-xs text-amber-600/70 font-bold uppercase tracking-widest">보완 가이드</p>
                        </div>
                    </div>

                    <ul className="space-y-4">
                        {data.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-4 p-5 bg-amber-50/50 rounded-3xl text-slate-700 text-base font-bold transition-all hover:translate-x-1 group/item">
                                <div className="mt-1.5 w-2 h-2 bg-amber-500 rounded-full shrink-0 group-hover/item:scale-150 transition-transform"></div>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Action Area */}
            <div className="flex flex-col items-center gap-8 py-10">
                <button
                    onClick={onRestart}
                    className="group flex items-center gap-4 bg-slate-900 text-white px-12 py-6 rounded-[30px] font-black text-xl hover:scale-105 transition-all shadow-2xl shadow-indigo-100/50 hover:bg-gradient-premium ring-8 ring-transparent hover:ring-indigo-50"
                >
                    <RotateCcw className="w-6 h-6 group-hover:rotate-180 transition-transform duration-700" />
                    다른 질문으로 연습하기
                </button>
                <p className="text-slate-400 font-black text-[11px] uppercase tracking-[0.4em]">Ready for your next challenge?</p>
            </div>
        </div>
    );
}
