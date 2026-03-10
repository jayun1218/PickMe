'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, X, Briefcase, Building2, Bell } from 'lucide-react';
import { getJobs, addJob, deleteJob } from '@/lib/api';

interface Job {
    id: string;
    company: string;
    position: string;
    deadline: string;
    notes?: string;
}

export default function JobCalendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // New job form state
    const [newJob, setNewJob] = useState({
        company: '',
        position: '',
        deadline: '',
        notes: ''
    });

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
            await addJob(newJob);
            setIsModalOpen(false);
            setNewJob({ company: '', position: '', deadline: '', notes: '' });
            fetchJobs();
        } catch (error) {
            console.error("Failed to add job:", error);
            alert("저장에 실패했습니다.");
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
                    <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-200">
                        <CalendarIcon className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-[900] text-slate-900 tracking-tight">취업 캘린더</h2>
                        <p className="text-slate-500 font-bold text-sm tracking-tight">중요한 마감 기한을 놓치지 마세요</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 bg-white/50 backdrop-blur-md p-2 rounded-2xl border border-white/60 shadow-sm">
                    <button onClick={prevMonth} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronLeft className="w-5 h-5 text-slate-600" /></button>
                    <span className="text-lg font-black text-slate-800 min-w-[140px] text-center">
                        {currentDate.getFullYear()}년 {currentDate.getMonth() + 1}월
                    </span>
                    <button onClick={nextMonth} className="p-2 hover:bg-white rounded-xl transition-colors"><ChevronRight className="w-5 h-5 text-slate-600" /></button>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl font-bold text-sm hover:bg-slate-800 hover:scale-105 transition-all shadow-xl"
                >
                    <Plus className="w-4 h-4" /> 일정 추가하기
                </button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-white/40 backdrop-blur-3xl rounded-[40px] border border-white/60 p-8 shadow-2xl shadow-indigo-900/5">
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
                                        <div className="space-y-1.5">
                                            {dayJobs.map(job => (
                                                <div
                                                    key={job.id}
                                                    className="group/item relative px-2.5 py-1.5 bg-indigo-600 text-white text-[10px] rounded-lg font-bold shadow-md shadow-indigo-200 cursor-default hover:scale-105 transition-transform"
                                                >
                                                    <div className="truncate w-full">{job.company}</div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handleDeleteJob(job.id); }}
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

            {/* Modal for adding job */}
            {isModalOpen && (
                <div className="fixed inset-0 z-[200] flex items-center justify-center px-6 py-10">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                    <div className="w-full max-w-lg bg-white rounded-[40px] shadow-2xl relative z-10 p-8 border border-white max-h-[90vh] overflow-y-auto animate-in zoom-in duration-300 scrollbar-hide">
                        <div className="absolute top-0 right-0 p-6">
                            <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2"><X className="w-6 h-6" /></button>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-center gap-4 border-b border-slate-50 pb-6 -mx-8 px-8">
                                <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center">
                                    <Bell className="text-indigo-600 w-6 h-6" />
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 tracking-tight">새 일정 추가</h3>
                            </div>

                            <form onSubmit={handleAddJob} className="space-y-5">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">회사명</label>
                                    <div className="relative group">
                                        <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:scale-110 transition-all" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="예: 구글 코리아"
                                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={newJob.company}
                                            onChange={(e) => setNewJob({ ...newJob, company: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">모집 직무</label>
                                    <div className="relative group">
                                        <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:scale-110 transition-all" />
                                        <input
                                            required
                                            type="text"
                                            placeholder="예: 신입 프런트엔드 개발자"
                                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={newJob.position}
                                            onChange={(e) => setNewJob({ ...newJob, position: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">마감 날짜</label>
                                    <div className="relative group">
                                        <CalendarIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500 group-focus-within:scale-110 transition-all" />
                                        <input
                                            required
                                            type="date"
                                            className="w-full pl-16 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
                                            value={newJob.deadline}
                                            onChange={(e) => setNewJob({ ...newJob, deadline: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="pt-6 pb-4">
                                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-[26px] font-[1000] text-sm uppercase tracking-[0.3em] hover:bg-indigo-600 hover:shadow-2xl hover:shadow-indigo-200 transition-all active:scale-[0.98] shadow-xl shadow-slate-100">
                                        일정 저장하기
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
