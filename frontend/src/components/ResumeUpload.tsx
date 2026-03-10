'use client';

import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { analyzeResume } from '@/lib/api';

interface ResumeUploadProps {
    onAnalysisComplete: (data: any) => void;
}

export default function ResumeUpload({ onAnalysisComplete }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) return;
        setIsUploading(true);
        try {
            const data = await analyzeResume(file);
            onAnalysisComplete({ ...data, filename: file.name });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-3xl mx-auto flex flex-col gap-16">
            <div
                className={`relative group h-72 rounded-3xl border border-white/30 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${dragActive
                    ? "border-indigo-400 bg-indigo-50/40 scale-[1.02] shadow-indigo-500/20"
                    : "hover:border-white/50 hover:bg-gradient-to-br hover:from-white/40 hover:to-white/20 hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)]"
                    }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    accept=".pdf"
                    onChange={handleChange}
                />

                <div className="flex flex-col items-center gap-10 pointer-events-none">
                    <div className={`w-24 h-24 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-white/50 ${file ? "bg-green-500 text-white rotate-[360deg] scale-110 border-green-400" : "bg-white/60 text-indigo-600 group-hover:scale-110 group-hover:bg-white group-hover:shadow-md"
                        }`}>
                        {file ? <CheckCircle2 className="w-12 h-12" /> : <Upload className="w-12 h-12" />}
                    </div>

                    <div className="text-center space-y-2">
                        <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                            {file ? file.name : "이력서 PDF를 여기로 가져오세요"}
                        </h3>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-[11px]">
                            {file ? "준비가 완료되었습니다" : "지원 포맷: PDF Only (Max 10MB)"}
                        </p>
                    </div>
                </div>

                {file && (
                    <button
                        onClick={() => setFile(null)}
                        className="absolute top-6 right-6 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            <button
                onClick={handleUpload}
                disabled={isUploading}
                className="w-full group relative overflow-hidden h-20 rounded-[20px] bg-slate-900 border border-slate-800 text-white font-black text-xl hover:-translate-y-1 active:scale-95 transition-all duration-500 shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] flex items-center justify-center gap-3"
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                        <span className="animate-pulse">Analyzing Experience...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        면접 질문지 생성하기
                    </>
                )}

                {/* Subtle Glow Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
        </div>
    );
}
