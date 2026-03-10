'use client';

import React from 'react';
import { HelpCircle, Tag } from 'lucide-react';

interface Question {
    id: number;
    category: string;
    question: string;
}

interface QuestionListProps {
    questions: Question[];
}

export default function QuestionList({ questions }: QuestionListProps) {
    return (
        <div className="w-full max-w-4xl mx-auto mt-12 space-y-8 pb-20">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                    <HelpCircle className="text-indigo-600 w-7 h-7" />
                    생성된 면접 질문
                </h2>
                <span className="bg-indigo-100 text-indigo-700 px-4 py-1 rounded-full text-sm font-bold">
                    총 {questions.length}개
                </span>
            </div>

            <div className="grid gap-4">
                {questions.map((q) => (
                    <div
                        key={q.id}
                        className="p-6 bg-white border border-slate-100 rounded-3xl hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group"
                    >
                        <div className="flex items-start gap-4">
                            <div className="mt-1 w-8 h-8 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center text-sm font-bold group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                {q.id}
                            </div>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2 text-xs font-bold text-indigo-500 uppercase tracking-wider">
                                    <Tag className="w-3 h-3" />
                                    {q.category}
                                </div>
                                <p className="text-lg font-medium text-slate-800 leading-relaxed">
                                    {q.question}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
