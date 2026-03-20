'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Send, User, Bot, Loader2, StopCircle, Sparkles, Volume2, VolumeX, Timer, Star } from 'lucide-react';
import { chatWithInterviewer, saveScrappedQuestion } from '@/lib/api';
import VoiceRecorder from './VoiceRecorder';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

interface InterviewChatProps {
    initialQuestion: string;
    onFinish: (transcript: Message[]) => void;
    isPressureMode?: boolean;
    targetCompany?: string;
}

export default function InterviewChat({ initialQuestion, onFinish, isPressureMode = false, targetCompany = "" }: InterviewChatProps) {
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: initialQuestion }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [currentCompetency, setCurrentCompetency] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    
    // Feature: TTS & Timer
    const [isMuted, setIsMuted] = useState(false);
    const [timeLeft, setTimeLeft] = useState<number | null>(60);

    const speakText = (text: string) => {
        if (isMuted || !('speechSynthesis' in window)) return;
        window.speechSynthesis.cancel(); // Cancel any ongoing speech
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'ko-KR';
        utterance.rate = 1.05;
        window.speechSynthesis.speak(utterance);
    };

    // Initial speak for the first question
    useEffect(() => {
        speakText(initialQuestion);
        return () => window.speechSynthesis.cancel();
    }, []);

    // Timer countdown logic
    useEffect(() => {
        if (timeLeft === null || timeLeft <= 0 || isLoading) return;
        const timerId = setInterval(() => setTimeLeft(prev => (prev ? prev - 1 : 0)), 1000);
        return () => clearInterval(timerId);
    }, [timeLeft, isLoading]);

    const competencyMap: Record<string, string> = {
        communication: '소통력 검증 중',
        problem_solving: '문제해결력 검증 중',
        technical_skill: '기술 역량 검증 중',
        passion: '열정 및 태도 검증 중',
        cooperation: '협업 능력 검증 중'
    };

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
        setTimeLeft(null); // Pause timer during loading
        window.speechSynthesis.cancel(); // Stop speaking if user interrupts

        try {
            const data = await chatWithInterviewer(newMessages, { 
                is_pressure_mode: isPressureMode,
                target_company: targetCompany 
            });
            const aiMessage: Message = {
                role: 'assistant',
                content: data.content
            };

            if (data.focus_competency) {
                setCurrentCompetency(data.focus_competency);
            }

            setMessages(prev => [...prev, aiMessage]);
            speakText(aiMessage.content);
            setTimeLeft(60); // Reset timer

            if (data.is_finished) {
                setTimeout(() => onFinish([...newMessages, aiMessage]), 2000);
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => [...prev, { role: 'assistant', content: '연결 상태가 불안정합니다. 다시 한번 시도해 주시겠어요?' }]);
            setTimeLeft(60);
        } finally {
            setIsLoading(false);
        }
    };

    const handleTranscription = (text: string) => {
        handleSend(text);
    };

    const handleScrap = async (question: string) => {
        try {
            await saveScrappedQuestion('test-user', question, targetCompany || '미지정');
            alert('질문이 오답노트에 스크랩되었습니다! ⭐');
        } catch (error) {
            console.error(error);
            alert('스크랩에 실패했습니다.');
        }
    };

    return (
        <div className="flex flex-col min-h-[600px] max-h-[85vh] w-full max-w-4xl mx-auto bg-white dark:bg-slate-900 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-2xl shadow-indigo-100/30 dark:shadow-none overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 transition-colors">
            {/* Premium Header */}
            <div className="px-10 py-6 border-b border-slate-50 dark:border-slate-800 bg-[#FDFEFF] dark:bg-slate-900 flex items-center justify-between transition-colors">
                <div className="flex items-center gap-5">
                    <div className="relative">
                        <div className="w-14 h-14 bg-gradient-premium rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 dark:shadow-none ring-4 ring-indigo-50 dark:ring-slate-800">
                            <Bot className="w-8 h-8" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-4 border-white dark:border-slate-900 rounded-full"></div>
                    </div>
                    <div>
                        <div className="flex items-center gap-3">
                            <h3 className="font-black text-xl text-slate-900 dark:text-white tracking-tight">면접관 피키</h3>
                            {currentCompetency && (
                                <div className="px-3 py-1 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 text-[10px] font-black uppercase tracking-tighter rounded-lg border border-indigo-100 dark:border-indigo-500/20 animate-in zoom-in duration-300">
                                    {competencyMap[currentCompetency] || currentCompetency}
                                </div>
                            )}
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-3 h-3 text-indigo-500 animate-pulse" />
                            <p className="text-[11px] text-indigo-500 font-black uppercase tracking-[0.2em]">Deep Interaction Mode</p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    {/* Timer Logic */}
                    {timeLeft !== null && (
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[11px] font-black tracking-widest transition-colors ${
                            timeLeft <= 10 ? 'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400 animate-pulse' : 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                        }`}>
                            <Timer className="w-4 h-4" />
                            00:{timeLeft < 10 ? `0${timeLeft}` : timeLeft}
                        </div>
                    )}

                    {/* TTS Mute Toggle */}
                    <button 
                        onClick={() => {
                            setIsMuted(!isMuted);
                            if (!isMuted) window.speechSynthesis.cancel();
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${isMuted ? 'bg-slate-100 text-slate-400 dark:bg-slate-800' : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400'}`}
                    >
                        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                    </button>

                    <button
                        onClick={() => {
                            window.speechSynthesis.cancel();
                            onFinish(messages);
                        }}
                        className="group px-6 py-3 bg-red-50 dark:bg-red-500/10 text-red-500 dark:text-red-400 rounded-2xl flex items-center gap-2 text-[11px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white dark:hover:bg-red-500 dark:hover:text-white transition-all drop-shadow-sm"
                    >
                        <StopCircle className="w-4 h-4 group-hover:rotate-90 transition-transform" />
                        Terminate
                    </button>
                </div>
            </div>

            {/* Messages Area */}
            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto px-10 py-10 space-y-10 scroll-smooth bg-gradient-to-b from-[#FDFEFF] to-white dark:from-slate-900 dark:to-[#0B0F19] transition-colors"
            >
                {messages.map((m, idx) => (
                    <div
                        key={idx}
                        className={`flex items-start gap-4 ${m.role === 'user' ? 'flex-row-reverse' : ''} animate-in fade-in slide-in-from-bottom-4 duration-500`}
                    >
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${m.role === 'assistant'
                            ? 'bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-600 dark:text-indigo-400'
                            : 'bg-slate-900 dark:bg-indigo-600 text-white'
                            }`}>
                            {m.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}
                        </div>

                        <div className={`max-w-[75%] p-6 pr-10 rounded-2xl text-base leading-relaxed font-medium shadow-sm border ${m.role === 'assistant'
                            ? 'bg-white dark:bg-slate-800 border-slate-50 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-tl-none relative overflow-hidden group'
                            : 'bg-slate-900 dark:bg-indigo-600 border-slate-900 dark:border-indigo-600 text-white rounded-tr-none'
                            }`}>
                            {m.role === 'assistant' && idx === messages.length - 1 && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500 animate-pulse"></div>
                            )}
                            {m.role === 'assistant' && (
                                <button 
                                    onClick={() => handleScrap(m.content)}
                                    className="absolute top-3 right-3 p-1.5 bg-slate-50 dark:bg-slate-700 text-slate-300 dark:text-slate-500 rounded-lg opacity-0 group-hover:opacity-100 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-500/10 hover:border-amber-200 border border-transparent transition-all shadow-sm"
                                    title="이 질문 오답노트에 스크랩하기"
                                >
                                    <Star className="w-4 h-4" />
                                </button>
                            )}
                            {m.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex items-start gap-4 animate-pulse">
                        <div className="w-10 h-10 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-indigo-400 rounded-2xl flex items-center justify-center">
                            <Bot className="w-6 h-6" />
                        </div>
                        <div className="bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 p-6 rounded-3xl rounded-tl-none flex gap-1.5">
                            <span className="w-2 h-2 bg-indigo-200 dark:bg-indigo-500/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-2 h-2 bg-indigo-200 dark:bg-indigo-500/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-2 h-2 bg-indigo-200 dark:bg-indigo-500/50 rounded-full animate-bounce"></span>
                        </div>
                    </div>
                )}
            </div>

            {/* Input Area */}
            <div className="px-10 py-10 bg-white dark:bg-slate-900 border-t border-slate-50 dark:border-slate-800 transition-colors">
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
                            className="w-full pl-6 pr-20 h-16 bg-slate-50 dark:bg-slate-800 border-none rounded-2xl text-lg font-medium focus:ring-4 focus:ring-indigo-500/10 dark:focus:ring-indigo-500/20 focus:bg-white dark:focus:bg-slate-700 transition-all outline-none text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                            placeholder="답변을 입력하거나 마이크를 눌러보세요"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                            disabled={isLoading}
                        />
                        <button
                            onClick={() => handleSend()}
                            disabled={!input.trim() || isLoading}
                            className="absolute right-2.5 top-2.5 w-11 h-11 bg-slate-900 dark:bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-gradient-premium hover:scale-105 active:scale-95 transition-all disabled:opacity-20 shadow-lg shadow-slate-200/50 dark:shadow-none"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
