import React, { useState } from 'react';
import { Upload, FileText, CheckCircle2, Loader2, Sparkles, X, Briefcase, Link as LinkIcon } from 'lucide-react';
import { analyzeCombined, analyzeCombinedUrl, extractResumeText } from '@/lib/api';

interface CombinedUploadProps {
    onAnalysisComplete: (data: any) => void;
}

export default function CombinedUpload({ onAnalysisComplete }: CombinedUploadProps) {
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [noticeFile, setNoticeFile] = useState<File | null>(null);
    const [noticeUrl, setNoticeUrl] = useState("");
    const [noticeMode, setNoticeMode] = useState<"file" | "url">("file");
    const [isUploading, setIsUploading] = useState(false);

    const handleUpload = async () => {
        if (!resumeFile || (noticeMode === "file" && !noticeFile) || (noticeMode === "url" && !noticeUrl)) return;

        setIsUploading(true);
        try {
            let data;
            if (noticeMode === "file" && noticeFile) {
                data = await analyzeCombined(resumeFile, noticeFile);
            } else {
                // 이력서 PDF에서 텍스트 추출 (백엔드 URL 분석용)
                const { text: resumeText } = await extractResumeText(resumeFile);
                data = await analyzeCombinedUrl(resumeText, noticeUrl);
            }

            onAnalysisComplete({
                ...data,
                filename: resumeFile.name,
                notice_filename: noticeMode === "file" ? noticeFile?.name : "Link Analysis"
            });
        } catch (error) {
            console.error('Upload failed:', error);
            alert('분석 중 오류가 발생했습니다. 다시 시도해 주세요.');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="w-full max-w-4xl mx-auto flex flex-col gap-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="grid md:grid-cols-2 gap-10 items-end">
                {/* Resume Upload Box */}
                <FileBox
                    title="나의 이력서"
                    file={resumeFile}
                    setFile={setResumeFile}
                    icon={<FileText className="w-8 h-8" />}
                    color="indigo"
                />

                {/* Notice Input Box */}
                <div className="flex flex-col gap-6">
                    <div className="w-full flex justify-center">
                        <div className="flex bg-white/20 backdrop-blur-xl p-1.5 rounded-[16px] w-fit border border-white/30 shadow-[0_4px_20px_rgb(0,0,0,0.05)]">
                            <button
                                onClick={() => setNoticeMode("file")}
                                className={`relative min-w-[160px] px-12 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${noticeMode === "file" ? "bg-white/80 text-indigo-700 shadow-sm backdrop-blur-md" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                PDF 파일
                            </button>
                            <button
                                onClick={() => setNoticeMode("url")}
                                className={`relative min-w-[160px] px-12 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${noticeMode === "url" ? "bg-white/80 text-indigo-700 shadow-sm backdrop-blur-md" : "text-slate-500 hover:text-slate-800"}`}
                            >
                                URL 링크
                            </button>
                        </div>
                    </div>

                    {noticeMode === "file" ? (
                        <FileBox
                            title="채용 공고 PDF"
                            file={noticeFile}
                            setFile={setNoticeFile}
                            icon={<Briefcase className="w-8 h-8" />}
                            color="slate"
                        />
                    ) : (
                        <div className="relative group h-64 rounded-[24px] border border-white/30 bg-gradient-to-br from-white/30 to-white/10 backdrop-blur-3xl p-8 flex flex-col items-center justify-center transition-all duration-500 shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:shadow-[0_20px_40px_rgba(79,70,229,0.15)] hover:-translate-y-1 hover:from-white/40 hover:to-white/20 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 w-full flex flex-col items-center">
                                <div className="w-16 h-16 rounded-[18px] bg-white/70 backdrop-blur-md text-indigo-600 flex items-center justify-center mb-6 overflow-hidden transition-all duration-500 shadow-sm border border-white/50 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-600 group-hover:scale-110 group-hover:rotate-6">
                                    <LinkIcon className="w-8 h-8" />
                                </div>
                                <div className="w-full space-y-4">
                                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-center group-hover:text-indigo-400 transition-colors">채용 공고 URL을 입력하세요</p>
                                    <div className="relative w-full">
                                        <input
                                            type="url"
                                            placeholder="https://wanted.co.kr/jobs/..."
                                            value={noticeUrl}
                                            onChange={(e) => setNoticeUrl(e.target.value)}
                                            className="w-full px-8 py-5 rounded-[16px] border border-white/40 bg-white/50 backdrop-blur-lg focus:bg-white/80 focus:border-indigo-400 focus:outline-none transition-all font-black text-sm text-slate-700 shadow-sm placeholder:text-slate-500"
                                        />
                                        <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none">
                                            {noticeUrl && <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {(() => {
                const isDisabled = isUploading || !resumeFile || (noticeMode === "file" && !noticeFile) || (noticeMode === "url" && !noticeUrl);
                return (
                    <button
                        onClick={handleUpload}
                        disabled={isDisabled}
                        className={`w-full group relative overflow-hidden h-24 rounded-[20px] font-[900] text-xl transition-all duration-500 flex items-center justify-center gap-4 ${isDisabled
                            ? "bg-white/10 backdrop-blur-2xl text-slate-400 border border-white/20 cursor-not-allowed shadow-[0_8px_30px_rgb(0,0,0,0.05)]"
                            : "bg-slate-900 text-white hover:-translate-y-1 shadow-[0_20px_40px_rgba(15,23,42,0.2)] hover:shadow-[0_20px_50px_rgba(79,70,229,0.3)] border border-slate-800"
                            }`}
                    >
                        {!isDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 animate-gradient-x transition-opacity duration-500"></div>
                        )}
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {isUploading ? (
                                <>
                                    <Loader2 className="w-7 h-7 animate-spin text-white/80" />
                                    <span className="animate-pulse tracking-tight text-white/90">면접관 AI 접속 중...</span>
                                </>
                            ) : (
                                <>
                                    <Sparkles className={`w-7 h-7 transition-all duration-500 ${isDisabled ? 'text-slate-300' : 'text-indigo-400 group-hover:text-white group-hover:scale-110 group-hover:rotate-12'}`} />
                                    <span className="tracking-tight">초정밀 맞춤형 질문 생성</span>
                                </>
                            )}
                        </div>
                        {!isDisabled && (
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer transition-transform duration-1000"></div>
                        )}
                    </button>
                );
            })()}
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
