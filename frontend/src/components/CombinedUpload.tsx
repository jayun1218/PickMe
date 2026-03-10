'use client';

import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, X, Briefcase } from 'lucide-react';
import { analyzeCombined } from '@/lib/api';

interface CombinedUploadProps {
    onAnalysisComplete: (data: any) => void;
}

export default function CombinedUpload({ onAnalysisComplete }: CombinedUploadProps) {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [noticeFile, setNoticeFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!resumeFile || !noticeFile) return;
        setIsUploading(true);
        try {
            const data = await analyzeCombined(resumeFile, noticeFile);
            onAnalysisComplete({
                ...data,
                filename: resumeFile.name,
                notice_filename: noticeFile.name
            });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid md:grid-cols-2 gap-6">
                {/* Resume Upload Box */}
                <FileBox
                    title="나의 이력서"
                    file={resumeFile}
                    setFile={setResumeFile}
                    icon={<FileText className="w-8 h-8" />}
                    color="indigo"
                />

                {/* Notice Upload Box */}
                <FileBox
                    title="채용 공고 PDF"
                    file={noticeFile}
                    setFile={setNoticeFile}
                    icon={<Briefcase className="w-8 h-8" />}
                    color="slate"
                />
            </div>

            <button
                onClick={handleUpload}
                disabled={isUploading || !resumeFile || !noticeFile}
                className={`w-full group relative overflow-hidden h-20 rounded-[30px] font-black text-xl transition-all shadow-2xl flex items-center justify-center gap-3 ${!resumeFile || !noticeFile
                        ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                        : "bg-slate-900 text-white hover:scale-[1.02] active:scale-95 shadow-indigo-100"
                    }`}
            >
                {isUploading ? (
                    <>
                        <Loader2 className="w-7 h-7 animate-spin text-indigo-400" />
                        <span className="animate-pulse">Matching Experience with Job Requirements...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="w-6 h-6 text-indigo-400 group-hover:rotate-12 transition-transform" />
                        초정밀 기업 맞춤형 질문 생성하기
                    </>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
        </div>
    );
}

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
            className={`relative group h-64 rounded-[40px] border-4 border-dashed transition-all duration-500 flex flex-col items-center justify-center bg-white ${dragActive ? "border-indigo-500 bg-indigo-50/30 scale-[1.02]" : "border-slate-100"
                }`}
            onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop}
        >
            <input
                type="file" accept=".pdf"
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                onChange={(e) => e.target.files?.[0] && setFile(e.target.files[0])}
            />

            <div className="flex flex-col items-center gap-5 pointer-events-none">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 ${file ? "bg-green-500 text-white" : "bg-slate-50 text-slate-400 group-hover:scale-110"
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
