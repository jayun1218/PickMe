'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Briefcase, Building2, Bell, Loader2, Sparkles, ExternalLink, Info, Target, Clock } from 'lucide-react';
import { getJobs, addJob, deleteJob, updateJob, syncAlioJobs, getJobGuide } from '@/lib/api';

interface Job {
    id: string;
    company: string;
    position: string;
    deadline: string;
    written_exam_date?: string | null;
    first_interview_date?: string | null;
    second_interview_date?: string | null;
    category?: string | null;
    notes?: string;
}

export default function JobCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSyncing, setIsSyncing] = useState(false);
    const [alioCategory, setAlioCategory] = useState("전체");
    const [editingJobId, setEditingJobId] = useState<string | null>(null);
    const [selectedGuide, setSelectedGuide] = useState<any>(null);
    const [isGuideLoading, setIsGuideLoading] = useState(false);

    // New job form state
    const [newJob, setNewJob] = useState({
        company: '',
        position: '',
        deadline: '',
        written_exam_date: '',
        first_interview_date: '',
        second_interview_date: '',
        notes: ''
    });

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingJobId(null);
        setNewJob({ company: '', position: '', deadline: '', written_exam_date: '', first_interview_date: '', second_interview_date: '', notes: '' });
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const fetchJobs = async () => {
        try {
            const data = await getJobs();
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddJob = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingJobId) {
                await updateJob(editingJobId, newJob);
            } else {
                await addJob(newJob);
            }
            closeModal();
            fetchJobs();
        } catch (error) {
            console.error("Failed to save job:", error);
            alert("저장에 실패했습니다.");
        }
    };

    const handleSyncAlio = async () => {
        setIsSyncing(true);
        try {
            const result = await syncAlioJobs(alioCategory);
            alert(`동기화 완료! ${result.added}개의 새로운 공고가 추가되었습니다.`);
            fetchJobs();
        } catch (error) {
            console.error("Failed to sync ALIO jobs:", error);
            alert("공공데이터 동기화에 실패했습니다. (API 키 승인 대기 중일 수 있습니다.)");
        } finally {
            setIsSyncing(false);
        }
    };

    const handleDeleteJob = async (id: string) => {
        if (!confirm("이 일정을 삭제하시겠습니까?")) return;
        try {
            await deleteJob(id);
            fetchJobs();
        } catch (error) {
            console.error("Failed to delete job:", error);
        }
    };

    const handleViewGuide = async (job: any) => {
        setIsGuideLoading(true);
        try {
            const guide = await getJobGuide(job.company, job.position, job.notes);
            setSelectedGuide({ ...guide, company: job.company });
        } catch (error) {
            console.error(error);
            alert("가이드를 생성하지 못했습니다.");
        } finally {
            setIsGuideLoading(false);
        }
    };

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
    const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

    const isToday = (day: number) => {
        const today = new Date();
        return today.getDate() === day &&
            today.getMonth() === currentDate.getMonth() &&
            today.getFullYear() === currentDate.getFullYear();
    };

    const getJobsForDay = (day: number) => {
        if (!day) return [];
        const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        return jobs.filter(job => job.deadline === dateString);
    };

    if (isLoading) {
        return (
            <div className="py-40 flex flex-col items-center gap-8 animate-in fade-in duration-500">
                <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-xl font-black text-slate-800/40 dark:text-white/40 tracking-widest uppercase">일정을 불러오는 중...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-12 animate-in fade-in slide-in-from-bottom-8 duration-1000 w-full max-w-6xl py-6 overflow-x-hidden">
            {/* Public Enterprise Recruitment Section at Top */}
            <div className="space-y-10 group/section">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-6">
                        <div className="w-14 h-14 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-200">
                            <Briefcase className="w-8 h-8" />
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-[1000] text-slate-800 dark:text-white tracking-tight">공기업 채용 리스트</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-base">실시간 동기화된 마감 임박 공고</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {jobs.slice(0, 6).map((job, idx) => (
                        <div key={idx} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-3xl border border-white/80 dark:border-slate-700 rounded-xl p-8 hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-2 transition-all duration-500 group/card relative overflow-hidden flex flex-col justify-between h-full">
                            <div className="space-y-6">
                                <div className="flex items-center justify-between gap-3">
                                    <span className="px-4 py-1.5 bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 text-[10px] font-black rounded-lg uppercase tracking-tighter border border-indigo-100/50 dark:border-indigo-800">
                                        {job.category || "공기업"}
                                    </span>
                                    <div className="flex items-center gap-2 text-white font-black text-[12px] bg-red-600 px-3 py-1.5 rounded-lg shadow-lg shadow-red-200/50 flex-shrink-0 whitespace-nowrap">
                                        <Clock className="w-3.5 h-3.5" />
                                        {(() => {
                                            const diff = Math.ceil((new Date(job.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                                            return diff === 0 ? "D-Day" : `D-${Math.abs(diff)}`;
                                        })()}
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white group-hover/card:text-indigo-600 transition-colors line-clamp-1">{job.company}</h3>
                                    <p className="text-sm font-bold text-slate-500 dark:text-slate-400 line-clamp-2 h-10 leading-relaxed">{job.position}</p>
                                </div>
                            </div>

                            <div className="mt-8 flex items-center gap-3">
                                <a
                                    href={job.notes?.includes("http") ? job.notes.match(/https?:\/\/[^\s]+/)?.[0] : "https://www.alio.go.kr"}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-1 py-4 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-800 transition-all shadow-lg"
                                >
                                    지원하기 <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                                <button
                                    onClick={() => handleViewGuide(job)}
                                    className="flex-1 py-4 bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-200 rounded-xl text-xs font-black flex items-center justify-center gap-2 hover:bg-slate-50 dark:hover:bg-slate-600 transition-all shadow-sm"
                                >
                                    가이드 <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-slate-200 dark:bg-slate-700/50 w-full"></div>

            {/* Calendar Section */}
            <div className="space-y-8">
                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                            <CalendarIcon className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-[1000] text-slate-900 dark:text-white tracking-tight">취업 캘린더</h2>
                            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight">내 일정을 관리하세요</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 dark:border-slate-700 shadow-sm">
                        <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
                        <span className="text-lg font-black text-slate-800 dark:text-slate-200 min-w-[140px] text-center">
                            {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                        </span>
                        <button onClick={nextMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
                    </div>

                    <div className="flex gap-3 items-center">
                        <select
                            value={alioCategory}
                            onChange={(e) => setAlioCategory(e.target.value)}
                            className="bg-white/70 dark:bg-slate-800/70 border border-transparent text-slate-800 dark:text-slate-200 text-[13px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold shadow-sm"
                        >
                            <option value="전체">전체 분야</option>
                            <option value="에너지">에너지 (발전/전력)</option>
                            <option value="SOC/건설/교통">SOC (건설/교통)</option>
                            <option value="보건/복지">보건/복지/의료</option>
                            <option value="금융">금융/경제</option>
                            <option value="R&D/연구">R&D/연구</option>
                            <option value="기타">기타</option>
                        </select>
                        <button
                            onClick={handleSyncAlio}
                            disabled={isSyncing}
                            className="flex items-center gap-2 px-6 py-3 bg-indigo-500 text-white rounded-2xl font-bold text-[13px] hover:bg-indigo-600 hover:scale-105 transition-all shadow-xl disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {isSyncing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                            잡알리오 동기화
                        </button>
                        <button
                            onClick={() => {
                                setEditingJobId(null);
                                setNewJob({ company: '', position: '', deadline: '', written_exam_date: '', first_interview_date: '', second_interview_date: '', notes: '' });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-[13px] hover:bg-slate-800 hover:scale-105 transition-all shadow-xl"
                        >
                            <Plus className="w-4 h-4" /> 일정 추가
                        </button>
                    </div>
                </div>

                <div className="bg-white/40 dark:bg-slate-900/40 backdrop-blur-3xl rounded-3xl border border-white/60 dark:border-slate-800 p-8 shadow-2xl shadow-indigo-900/5">
                    <div className="grid grid-cols-7 mb-6 border-b border-slate-100/50 dark:border-slate-800 pb-4">
                        {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, index) => (
                            <div key={d} className={`text-center text-[10px] font-black tracking-widest ${index === 0 ? 'text-red-400' : index === 6 ? 'text-indigo-400' : 'text-slate-400'}`}>
                                {d}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2 md:gap-4">
                        {days.map((day, index) => {
                            const dateString = day ? `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}` : null;
                            const eventsOnThisDate: {job: Job, type: string, color: string}[] = [];
                            
                            if (day) {
                                jobs.forEach(job => {
                                    if (job.deadline === dateString) eventsOnThisDate.push({job, type: '서류', color: 'bg-indigo-500'});
                                    if (job.written_exam_date === dateString) eventsOnThisDate.push({job, type: '필기', color: 'bg-rose-500'});
                                    if (job.first_interview_date === dateString) eventsOnThisDate.push({job, type: '1차면접', color: 'bg-emerald-500'});
                                    if (job.second_interview_date === dateString) eventsOnThisDate.push({job, type: '2차면접', color: 'bg-teal-600'});
                                });
                            }

                            return (
                                <div
                                    key={index}
                                    className={`min-h-[100px] md:min-h-[140px] p-3 rounded-2xl border transition-all ${day
                                    ? isToday(day)
                                        ? 'bg-indigo-600/10 dark:bg-indigo-500/20 border-indigo-200 dark:border-indigo-500/50'
                                        : 'bg-white/30 dark:bg-white/5 border-white dark:border-slate-800 hover:bg-white/60 dark:hover:bg-white/10 shadow-sm'
                                    : 'opacity-0 pointer-events-none'
                                    }`}
                                >
                                    {day && (
                                        <>
                                            <span className={`text-sm font-black mb-2 block ${index % 7 === 0 ? 'text-red-400' : index % 7 === 6 ? 'text-indigo-400' : 'text-slate-600'}`}>
                                                {day}
                                            </span>
                                            <div className="space-y-1.5 overflow-y-auto max-h-[80px] scrollbar-hide">
                                                {eventsOnThisDate.map((event, idx) => (
                                                    <div
                                                        key={`${event.job.id}-${event.type}-${idx}`}
                                                        onClick={() => {
                                                            setEditingJobId(event.job.id);
                                                            setNewJob({
                                                                company: event.job.company,
                                                                position: event.job.position,
                                                                deadline: event.job.deadline,
                                                                written_exam_date: event.job.written_exam_date || '',
                                                                first_interview_date: event.job.first_interview_date || '',
                                                                second_interview_date: event.job.second_interview_date || '',
                                                                notes: event.job.notes || ''
                                                            });
                                                            setIsModalOpen(true);
                                                        }}
                                                        className={`group/item relative px-2.5 py-1.5 ${event.color} text-white text-[10px] rounded-lg font-bold shadow-md cursor-pointer hover:scale-[1.02] transition-transform`}
                                                    >
                                                        <div className="truncate w-full tracking-tight">[{event.type}] {event.job.company}</div>
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); handleDeleteJob(event.job.id); }}
                                                            className="absolute -top-1 -right-1 w-4 h-4 bg-slate-900 rounded-full flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity"
                                                        >
                                                            <X className="w-2.5 h-2.5 text-white" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Modal for adding job */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="w-full max-w-3xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl relative z-10 p-16 pb-32 border border-white dark:border-slate-800 max-h-[95vh] overflow-y-auto animate-in zoom-in duration-500 scrollbar-hide">
                        <div className="absolute top-0 right-0 p-6">
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-12">
                            <div className="flex items-center gap-8 border-b border-slate-50 dark:border-slate-800 pb-12 -mx-16 px-16">
                                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/30 rounded-3xl flex items-center justify-center shadow-inner">
                                    <Bell className="text-indigo-600 dark:text-indigo-400 w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-[1000] text-slate-900 dark:text-white tracking-tighter">{editingJobId ? '일정 수정' : '새 일정 추가'}</h3>
                                    <p className="text-lg font-bold text-slate-400">{editingJobId ? '등록된 마감 일정을 수정하세요' : '새로운 서류 마감 일정을 캘린더에 기록하세요'}</p>
                                </div>
                            </div>

                            <form onSubmit={handleAddJob} className="space-y-12">
                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] pl-2">회사명</label>
                                    <div className="relative group">
                                        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-all z-10 pointer-events-none">
                                            <Building2 className="w-8 h-8 group-focus-within:scale-125 transition-transform" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="예: 구글 코리아"
                                            className="w-full pl-24 pr-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-xl font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-200 dark:placeholder:text-slate-700 transition-all"
                                            value={newJob.company}
                                            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-sm font-black text-slate-400 uppercase tracking-[0.4em] pl-2">모집 직무</label>
                                    <div className="relative group">
                                        <div className="absolute left-10 top-1/2 -translate-y-1/2 text-indigo-400 group-focus-within:text-indigo-600 transition-all z-10 pointer-events-none">
                                            <Briefcase className="w-8 h-8 group-focus-within:scale-125 transition-transform" />
                                        </div>
                                        <input
                                            required
                                            type="text"
                                            placeholder="예: 신입 프런트엔드 개발자"
                                            className="w-full pl-24 pr-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-xl font-bold text-slate-700 dark:text-slate-200 placeholder:text-slate-200 dark:placeholder:text-slate-700 transition-all"
                                            value={newJob.position}
                                            onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 bg-slate-50/50 dark:bg-slate-800/20 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 pb-8">
                                    <h4 className="text-lg font-black text-slate-800 dark:text-slate-200 mb-6 pl-2">일정 날짜 정보</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">서류 마감일 <span className="text-red-500">*</span></label>
                                            <input type="date" required value={newJob.deadline} onChange={e => setNewJob({...newJob, deadline: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">필기 시험일</label>
                                            <input type="date" value={newJob.written_exam_date} onChange={e => setNewJob({...newJob, written_exam_date: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">1차 면접일</label>
                                            <input type="date" value={newJob.first_interview_date} onChange={e => setNewJob({...newJob, first_interview_date: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">2차 면접일</label>
                                            <input type="date" value={newJob.second_interview_date} onChange={e => setNewJob({...newJob, second_interview_date: e.target.value})} className="w-full px-6 py-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-bold text-slate-700 dark:text-slate-200 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-12">
                                    <button type="submit" className="w-full py-8 bg-slate-900 text-white rounded-3xl font-[1000] text-2xl uppercase tracking-[0.5em] hover:bg-indigo-600 hover:shadow-[0_30px_60px_rgba(79,70,229,0.3)] transition-all active:scale-[0.97] shadow-2xl shadow-slate-200 group">
                                        {editingJobId ? '일정 수정하기' : '일정 저장하기'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* AI Guide Modal */}
            {selectedGuide && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-white/50 dark:border-slate-800">
                        <div className="px-10 py-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-white/20 rounded-2xl backdrop-blur-md">
                                    <Sparkles className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-black tracking-tight">{selectedGuide.company}</h3>
                                    <p className="text-[10px] uppercase font-black opacity-70 tracking-widest text-indigo-100">AI Preparation Guide</p>
                                </div>
                            </div>
                            <button onClick={() => setSelectedGuide(null)} className="p-2 hover:bg-white/20 rounded-full transition-all">
                                <X className="w-6 h-6" />
                            </button>
                        </div>
                        <div className="p-10 space-y-10 max-h-[70vh] overflow-y-auto scrollbar-hide">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-6 bg-indigo-500 rounded-full"></div>
                                    <h4 className="text-sm font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">기업 인재상 핵심 요약</h4>
                                </div>
                                <div className="p-6 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-slate-700 dark:text-slate-200 font-bold leading-relaxed">
                                    {selectedGuide.company_trait}
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Info className="w-5 h-5 text-purple-500" />
                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">자소서 중점 사항</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 min-h-[150px]">
                                        {selectedGuide.resume_focus}
                                    </p>
                                </div>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3">
                                        <Target className="w-5 h-5 text-indigo-500" />
                                        <h4 className="text-xs font-black text-slate-800 dark:text-slate-200 uppercase tracking-wider">면접 준비 포인트</h4>
                                    </div>
                                    <p className="text-sm text-slate-500 dark:text-slate-400 font-bold leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-100 dark:border-slate-700 min-h-[150px]">
                                        {selectedGuide.interview_focus}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="px-10 py-8 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                            <button
                                onClick={() => setSelectedGuide(null)}
                                className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-black shadow-xl shadow-slate-200"
                            >
                                가이드 닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Guide Loading Overlay */}
            {isGuideLoading && (
                <div className="fixed inset-0 z-[300] bg-white/60 dark:bg-slate-900/60 backdrop-blur-md flex flex-col items-center justify-center gap-6 animate-in fade-in duration-300">
                    <div className="w-16 h-16 border-4 border-indigo-100 dark:border-indigo-900 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="text-center space-y-2">
                        <p className="text-xl font-black text-slate-800 dark:text-white">AI 분석 리포트 생성 중...</p>
                        <p className="text-sm font-bold text-slate-400 dark:text-slate-500">기업의 최신 인재상과 요구 역량을 분석하고 있습니다.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
