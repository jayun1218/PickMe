'use client';

import React from 'react';
import { BarChart3, ThumbsUp, AlertCircle, RotateCcw, PieChart } from 'lucide-react';

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
        { label: '논리성', value: data.scores.logical_thinking, color: 'bg-blue-500' },
        { label: '직무 적합성', value: data.scores.job_suitability, color: 'bg-indigo-500' },
        { label: '전달력', value: data.scores.clarity, color: 'bg-violet-500' },
        { label: '키워드 활용', value: data.scores.keyword_usage, color: 'bg-purple-500' },
    ];

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {/* Header Card */}
            <div className="bg-white p-10 rounded-[40px] border border-slate-100 shadow-2xl shadow-slate-200/50">
                <h2 className="text-3xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
                    <BarChart3 className="text-indigo-600 w-8 h-8" />
                    면접 분석 리포트
                </h2>

                <div className="grid md:grid-cols-2 gap-12">
                    {/* Circular/Bar Scores */}
                    <div className="space-y-6">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                            <PieChart className="w-4 h-4" /> 역량별 점수
                        </p>
                        <div className="space-y-5">
                            {scoreItems.map((item) => (
                                <div key={item.label} className="space-y-2">
                                    <div className="flex justify-between text-sm font-bold">
                                        <span className="text-slate-600">{item.label}</span>
                                        <span className="text-slate-900">{item.value}점</span>
                                    </div>
                                    <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all duration-1000 ease-out`}
                                            style={{ width: `${item.value}%` }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Overall Comments */}
                    <div className="bg-slate-50 p-8 rounded-3xl space-y-4">
                        <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">종합 평가</p>
                        <p className="text-lg text-slate-700 leading-relaxed font-medium italic">
                            "{data.overall_feedback}"
                        </p>
                    </div>
                </div>
            </div>

            {/* Strengths & Improvements */}
            <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-green-600">
                        <ThumbsUp className="w-6 h-6" />
                        나의 강점
                    </h3>
                    <ul className="space-y-4">
                        {data.strengths.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 bg-green-50 rounded-2xl text-green-800 text-sm font-medium">
                                <span className="mt-1 w-1.5 h-1.5 bg-green-500 rounded-full shrink-0"></span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 text-amber-600">
                        <AlertCircle className="w-6 h-6" />
                        보완할 점
                    </h3>
                    <ul className="space-y-4">
                        {data.improvements.map((s, i) => (
                            <li key={i} className="flex items-start gap-3 p-4 bg-amber-50 rounded-2xl text-amber-800 text-sm font-medium">
                                <span className="mt-1 w-1.5 h-1.5 bg-amber-500 rounded-full shrink-0"></span>
                                {s}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-center pt-8">
                <button
                    onClick={onRestart}
                    className="flex items-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-2xl font-bold hover:scale-105 transition-all shadow-xl shadow-slate-200"
                >
                    <RotateCcw className="w-5 h-5" />
                    다른 질문으로 연습하기
                </button>
            </div>
        </div>
    );
}
