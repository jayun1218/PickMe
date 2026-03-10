'use client';

import React, { useState } from 'react';
import { Upload, FileText, X, CheckCircle2, Loader2 } from 'lucide-react';
import { analyzeResume } from '@/lib/api';

interface ResumeUploadProps {
    onAnalysisComplete: (data: any) => void;
}

export default function ResumeUpload({ onAnalysisComplete }: ResumeUploadProps) {
    const [file, setFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            if (selectedFile.type !== 'application/pdf') {
                setError('PDF 파일만 업로드 가능합니다.');
                return;
            }
            setFile(selectedFile);
            setError(null);
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsUploading(true);
        setError(null);

        try {
            const data = await analyzeResume(file);
            onAnalysisComplete(data);
        } catch (err: any) {
            setError(err.response?.data?.detail || '업로드 중 오류가 발생했습니다.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-xl mx-auto p-8 bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-indigo-400 transition-colors">
            {!file ? (
                <label className="flex flex-col items-center justify-center cursor-pointer py-12">
                    <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 mb-4 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors">
                        <Upload className="w-8 h-8" />
                    </div>
                    <p className="text-lg font-bold text-slate-700">이력서 업로드</p>
                    <p className="text-slate-400 text-sm mt-2">PDF 파일을 드래그하거나 클릭하여 선택하세요</p>
                    <input type="file" className="hidden" accept=".pdf" onChange={handleFileChange} />
                </label>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center">
                                <FileText className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-slate-900 truncate max-w-[200px]">{file.name}</p>
                                <p className="text-xs text-slate-400">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                            </div>
                        </div>
                        {!isUploading && (
                            <button
                                onClick={() => setFile(null)}
                                className="p-2 hover:bg-slate-200 rounded-full text-slate-400 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {error && (
                        <p className="text-sm text-red-500 bg-red-50 p-3 rounded-xl">{error}</p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={isUploading}
                        className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isUploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                분석 중...
                            </>
                        ) : (
                            <>분석 시작하기</>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
