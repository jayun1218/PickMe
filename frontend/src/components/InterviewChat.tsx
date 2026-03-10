'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, StopCircle } from 'lucide-react';
import { chatWithInterviewer } from '@/lib/api';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface InterviewChatProps {
    initialQuestion: string;
    onFinish: (transcript: Message[]) => void;
}

export default function InterviewChat({ initialQuestion, onFinish }: InterviewChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: initialQuestion }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // 자동 스크롤
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const data = await chatWithInterviewer(newMessages);
            const aiMessage: Message = {
                role: 'assistant',
                content: data.content
            };

            setMessages(prev => [...prev, aiMessage]);

            if (data.is_finished) {
                setTimeout(() => onFinish([...newMessages, aiMessage]), 1500);
            }
        } catch (error) {
            console.error('채팅 오류:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '죄송합니다. 오류가 발생했습니다. 다시 시도해 주세요.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] w-full max-w-3xl mx-auto bg-white rounded-3xl border border-slate-100 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
                        <Bot className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-800">면접관 피키 (Picky)</p>
                        <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                            <p className="text-xs text-slate-400 font-medium font-sans">Interviewing Native</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onFinish(messages)}
                    className="text-xs font-bold text-slate-400 hover:text-red-500 transition-colors flex items-center gap-1.5"
                >
                    <StopCircle className="w-4 h-4" />
                    면접 종료
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth"
            >
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-3 ${m.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${m.role === 'assistant' ? 'bg-indigo-100 text-indigo-600' : 'bg-slate-100 text-slate-600'
                            }`}>
                            {m.role === 'assistant' ? <Bot className="w-5 h-5" /> : <User className="w-5 h-5" />}
                        </div>
                        <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${m.role === 'assistant'
                                ? 'bg-slate-50 text-slate-800 rounded-tl-none'
                                : 'bg-indigo-600 text-white rounded-tr-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center">
                            <Bot className="w-5 h-5" />
                        </div>
                        <div className="bg-slate-50 p-4 rounded-2xl rounded-tl-none">
                            <Loader2 className="w-5 h-5 animate-spin text-indigo-400" />
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-slate-50 bg-white">
                <div className="relative flex items-center">
                    <input
                        type="text"
                        className="w-full pl-4 pr-12 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500/20 transition-all outline-none"
                        placeholder="답변을 입력하세요..."
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isLoading}
                        className="absolute right-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-30"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
