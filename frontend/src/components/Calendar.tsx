'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Briefcase, Building2, Bell, Loader2, Sparkles } from 'lucide-react';
import { getJobs, addJob, deleteJob, updateJob, syncAlioJobs } from '@/lib/api';

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

    // Calendar logic
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = getFirstDayOfMonth(currentDate.getFullYear(), currentDate.getMonth());

    const days = [];
    // Padding for previous month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Days of current month
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

    return (
        <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-12 duration-1000">
            {/* Header & Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200 dark:shadow-none">
                        <CalendarIcon className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-[900] text-slate-900 dark:text-white tracking-tight">취업 캘린더</h2>
                        <p className="text-slate-500 dark:text-slate-400 font-bold text-sm tracking-tight">중요한 마감 기한을 놓치지 마세요</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/50 dark:bg-slate-800/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 dark:border-slate-700 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-white dark:hover:bg-slate-700 rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" /></button>
                    <span className="text-lg font-black text-slate-800 dark:text-slate-200 min-w-[140px] text-center">
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                </div>

                <div className="flex gap-3 items-center">
                    <select
                        value={alioCategory}
                        onChange={(e) => setAlioCategory(e.target.value)}
                        className="bg-white/70 border border-transparent text-slate-800 text-[13px] rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold shadow-sm"
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

            {/* Calendar Grid */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-3xl border border-white/60 p-8 shadow-2xl shadow-indigo-900/5">
                <div className="grid grid-cols-7 mb-6 border-b border-slate-100/50 pb-4">
                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map((d, index) => (
                        <div key={d} className={`text-center text-[10px] font-black tracking-widest ${index === 0 ? 'text-red-400' : index === 6 ? 'text-indigo-400' : 'text-slate-400'}`}>
                            {d}
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2 md:gap-4">
                    {days.map((day, index) => {
                        const dayJobs = day ? getJobsForDay(day) : [];
                        return (
                            <div
                                key={index}
                                className={`min-h-[100px] md:min-h-[140px] p-3 rounded-2xl border transition-all ${day
                                    ? isToday(day)
                                        ? 'bg-indigo-50/30 border-indigo-200'
                                        : 'bg-white/40 border-slate-50 hover:bg-white/80'
                                    : 'opacity-0 pointer-events-none'
                                    }`}
                            >
                                {day && (
                                    <>
                                        <span className={`text-sm font-black mb-2 block ${index % 7 === 0 ? 'text-red-400' : index % 7 === 6 ? 'text-indigo-400' : 'text-slate-600'}`}>
                                            {day}
                                        </span>
                                        <div className="space-y-1.5 pb-6">
                                            {(() => {
                                                const dateString = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                                const eventsOnThisDate: {job: Job, type: string, color: string}[] = [];
                                                jobs.forEach(job => {
                                                    if (job.deadline === dateString) eventsOnThisDate.push({job, type: '서류', color: 'bg-indigo-500'});
                                                    if (job.written_exam_date === dateString) eventsOnThisDate.push({job, type: '필기', color: 'bg-rose-500'});
                                                    if (job.first_interview_date === dateString) eventsOnThisDate.push({job, type: '1차면접', color: 'bg-emerald-500'});
                                                    if (job.second_interview_date === dateString) eventsOnThisDate.push({job, type: '2차면접', color: 'bg-teal-600'});
                                                });
                                                return eventsOnThisDate.map((event, idx) => (
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
                                                ));
                                            })()}
                                        </div>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Modal for adding job */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={closeModal}></div>
                    <div className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl relative z-10 p-16 pb-32 border border-white max-h-[95vh] overflow-y-auto animate-in zoom-in duration-500 scrollbar-hide">
                        <div className="absolute top-0 right-0 p-6">
                            <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-12">
                            <div className="flex items-center gap-8 border-b border-slate-50 pb-12 -mx-16 px-16">
                                <div className="w-20 h-20 bg-indigo-100 rounded-3xl flex items-center justify-center shadow-inner">
                                    <Bell className="text-indigo-600 w-10 h-10" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-4xl font-[1000] text-slate-900 tracking-tighter">{editingJobId ? '일정 수정' : '새 일정 추가'}</h3>
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
                                            className="w-full pl-24 pr-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-2xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-xl font-bold text-slate-700 placeholder:text-slate-200 transition-all"
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
                                            className="w-full pl-24 pr-10 py-8 bg-slate-50 border-2 border-slate-100 rounded-3xl focus:ring-8 focus:ring-indigo-500/5 focus:border-indigo-500 outline-none text-xl font-bold text-slate-700 placeholder:text-slate-200 transition-all"
                                            value={newJob.position}
                                            onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4 bg-slate-50/50 p-6 rounded-3xl border-2 border-slate-100 pb-8">
                                    <h4 className="text-lg font-black text-slate-800 mb-6 pl-2">일정 날짜 정보</h4>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">서류 마감일 <span className="text-red-500">*</span></label>
                                            <input type="date" required value={newJob.deadline} onChange={e => setNewJob({...newJob, deadline: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">필기 시험일</label>
                                            <input type="date" value={newJob.written_exam_date} onChange={e => setNewJob({...newJob, written_exam_date: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">1차 면접일</label>
                                            <input type="date" value={newJob.first_interview_date} onChange={e => setNewJob({...newJob, first_interview_date: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
                                        </div>
                                        <div>
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] pl-2 block mb-2">2차 면접일</label>
                                            <input type="date" value={newJob.second_interview_date} onChange={e => setNewJob({...newJob, second_interview_date: e.target.value})} className="w-full px-6 py-4 bg-white border border-slate-200 rounded-3xl text-sm font-bold text-slate-700 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all" />
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
        </div>
    );
}
