'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, X, BrainCircuit, PenTool, Lightbulb } from 'lucide-react';
import { extractResumeText, analyzeStarCoach } from '@/lib/api';

interface ResumeCoachProps {
    onAnalysisComplete: (data: any) => void;
}

export default function ResumeCoach({ onAnalysisComplete }: ResumeCoachProps) {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [experienceText, setExperienceText] = useState("");
    const [isAnalyzing, setIsAnalyzing] = useState(false);

    const handleCoach = async () => {
        if (!resumeFile || !experienceText) return;

        setIsAnalyzing(true);
        try {
            // 1. 이력서 텍스트 추출
            const { text: resumeText } = await extractResumeText(resumeFile);

            // 2. STAR 코칭 분석 요청
            const data = await analyzeStarCoach(resumeText, experienceText);

            onAnalysisComplete({
                type: 'coaching',
                ...data, // star_structure, improved_draft, key_insight 포함
                filename: resumeFile.name,
                experienceText
            });
        } catch (error) {
            console.error('Coaching failed:', error);
            alert('자소서 코칭 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsAnalyzing(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid md:grid-cols-2 gap-10 items-start">
                {/* Step 1: Resume Upload */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-100">
                            <span className="text-xs font-black">01</span>
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">이력서 업로드</h3>
                    </div>
                    <FileBox
                        title="분석할 이력서"
                        file={resumeFile}
                        setFile={setResumeFile}
                        icon={<FileText className="w-8 h-8" />}
                        color="indigo"
                    />
                </div>

                {/* Step 2: Experience Input */}
                <div className="flex flex-col gap-6">
                    <div className="flex items-center gap-3 ml-2">
                        <div className="w-8 h-8 rounded-lg bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-100">
                            <span className="text-xs font-black">02</span>
                        </div>
                        <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">나의 경험 들려주기</h3>
                    </div>
                    <div className="relative group h-64 rounded-[24px] border border-white/30 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-3xl p-8 flex flex-col transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(124,58,237,0.15)] overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        <div className="relative z-10 h-full flex flex-col">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 group-hover:text-purple-500 transition-colors flex items-center gap-2">
                                <Lightbulb className="w-3 h-3" /> 프로젝트, 아르바이트 등 자유롭게 적어주세요
                            </p>
                            <textarea
                                value={experienceText}
                                onChange={(e) => setExperienceText(e.target.value)}
                                placeholder="예: 지난 여름 카페 아르바이트에서 재고 관리 효율을 20% 높였습니다..."
                                className="flex-1 w-full bg-white/40 backdrop-blur-md rounded-2xl p-5 text-sm font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:bg-white/70 border border-white/40 transition-all resize-none scrollbar-hide"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Submit Button */}
            {(() => {
                const isDisabled = isAnalyzing || !resumeFile || !experienceText;
                return (
                    <button
                        onClick={handleCoach}
                        disabled={isDisabled}
                        className={`w-full group relative overflow-hidden h-24 rounded-[20px] font-[900] text-xl transition-all duration-500 flex items-center justify-center gap-4 ${isDisabled
                            ? "bg-white/10 backdrop-blur-2xl text-slate-400 border border-white/20 cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
                            : "bg-slate-900 text-white hover:-translate-y-1 shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_50px_rgba(124,58,237,0.3)] border border-slate-800"
                            }`}
                    >
                        {!isDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity duration-500"></div>
                        )}
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {isAnalyzing ? (
                                <>
                                    <Loader2 className="w-7 h-7 animate-spin text-white/80" />
                                    <span className="animate-pulse tracking-tight text-white/90">전문 에디터 AI 접속 중...</span>
                                </>
                            ) : (
                                <>
                                    <PenTool className={`w-7 h-7 transition-all duration-500 ${isDisabled ? 'text-slate-300' : 'text-purple-400 group-hover:text-white group-hover:scale-110 group-hover:rotate-12'}`} />
                                    <span className="tracking-tight">AI 입체적 자소서 코칭 시작</span>
                                </>
                            )}
                        </div>
                    </button>
                );
            })()}
        </div>
    );
}

// 기존 FileBox 재사용 (코드 중복 최소화를 위해 추후 별도 파일로 분리 가능)
function FileBox({ title, file, setFile, icon, color }: {
    title: string,
    file: File | null,
    setFile: (f: File | null) => void,
    icon: React.ReactNode,
    color: string
}) {
    const [dragActive, setDragActive] = useState(false);

    const handleDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(e.type === "dragenter" || e.type === "dragover");
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) setFile(e.dataTransfer.files[0]);
    };

    return (
        <div
            className={`relative group h-64 rounded-3xl border border-white/30 transition-all duration-500 overflow-hidden flex flex-col items-center justify-center bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${dragActive
                ? `border-${color}-400 bg-${color}-50/40 scale-[1.02] shadow-${color}-500/20`
                : `hover:border-white/50 hover:from-white/40 hover:to-white/20 hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)]`
                }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
        >
            <input
                type="file" accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />

            <div className="flex flex-col items-center gap-6 pointer-events-none">
                <div className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm border border-white/50 ${file ? "bg-green-500 text-white border-green-400" : "bg-white/60 text-slate-500 group-hover:bg-white group-hover:scale-110 group-hover:shadow-md group-hover:text-indigo-600"
                    }`}>
                    {file ? <CheckCircle2 className="w-8 h-8" /> : icon}
                </div>
                <div className="text-center">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
                    <h4 className="text-base font-bold text-slate-800 line-clamp-1 px-4">
                        {file ? file.name : "클릭하여 PDF 업로드"}
                    </h4>
                </div>
            </div>

            {file && (
                <button
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                    className="absolute top-4 right-4 p-2 bg-slate-50 text-slate-400 rounded-full hover:bg-red-50 hover:text-red-500 transition-all z-20"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
}
