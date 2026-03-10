'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, StopCircle, Sparkles } from 'lucide-react';
import { chatWithInterviewer } from '@/lib/api';
import VoiceRecorder from './VoiceRecorder';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface InterviewChatProps {
    initialQuestion: string;
    onFinish: (transcript: Message[]) => void;
    isPressureMode?: boolean;
}

export default function InterviewChat({ initialQuestion, onFinish, isPressureMode = false }: InterviewChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: initialQuestion }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async (overrideContent?: string) => {
        const contentToSend = overrideContent || input;
        if (!contentToSend.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: contentToSend };
        const newMessages = [...messages, userMessage];
        setMessages(newMessages);
        setInput('');
        setIsLoading(true);

        try {
            const data = await chatWithInterviewer(newMessages, { is_pressure_mode: isPressureMode });
            const aiMessage: Message = {
                role: 'assistant',
                content: data.content
            };

            setMessages(prev => [...prev, aiMessage]);

            if (data.is_finished) {
                setTimeout(() => onFinish([...newMessages, aiMessage]), 2000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '연결 상태가 불안정합니다. 다시 한번 시도해 주시겠어요?' }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranscription = (text: string) => {
        handleSend(text);
    };

    return (
        <div className="flex flex-col h-[700px] w-full max-w-4xl mx-auto bg-white rounded-[45px] border border-slate-100 shadow-2xl shadow-indigo-100/30 overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Premium Header */}
            <div className="px-10 py-6 border-b border-slate-50 bg-[#FDFEFF] flex items-center justify-between">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-premium rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 ring-4 ring-indigo-50">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white rounded-full"></div>
                    </div>
                    <div>
                        <h3 className="font-black text-xl text-slate-900 tracking-tight">면접관 피키</h3>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                            <p className="text-[11px] text-indigo-500 font-black uppercase tracking-[0.2em]">Picky AI v2.0</p>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => onFinish(messages)}
                    className="group px-6 py-3 bg-red-50 text-red-500 rounded-2xl flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all drop-shadow-sm"
                >
                    <StopCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                    Terminate Interview
                </button>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-10 py-10 space-y-10 scroll-smooth bg-gradient-to-b from-[#FDFEFF] to-white"
            >
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'assistant'
                            ? 'bg-white border border-slate-100 text-indigo-600'
                            : 'bg-slate-900 text-white'
                            }`}>
                            {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>

                        <div className={`max-w-[75%] p-6 rounded-3xl text-base leading-relaxed font-medium shadow-sm border ${m.role === 'assistant'
                            ? 'bg-white border-slate-50 text-slate-700 rounded-tl-none'
                            : 'bg-slate-900 border-slate-900 text-white rounded-tr-none'
                            }`}>
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-white border border-slate-100 text-indigo-400 rounded-2xl flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-white border border-slate-50 p-6 rounded-3xl rounded-tl-none flex gap-1.5">
                            <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-indigo-200 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="px-10 py-10 bg-white border-t border-slate-50">
                <div className="flex items-center gap-5">
                    <div className="scale-110">
                        <VoiceRecorder
                            onTranscriptionComplete={handleTranscription}
                            isDisabled={isLoading}
                        />
                    </div>

                    <div className="relative flex-1 group">
                        <input
                            type="text"
                            className="w-full pl-6 pr-20 h-16 bg-slate-50 border-none rounded-[25px] text-lg font-medium focus:ring-4 focus:ring-indigo-500/10 focus:bg-white transition-all outline-none"
                            placeholder="답변을 입력하거나 마이크를 눌러보세요"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2.5 top-2.5 w-11 h-11 bg-slate-900 text-white rounded-[18px] flex items-center justify-center hover:bg-gradient-premium hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-slate-200/50"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
