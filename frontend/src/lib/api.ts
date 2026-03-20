import axios from 'axios';

const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
});

export const analyzeResume = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/resume/analyze', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const extractResumeText = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/api/v1/resume/extract', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeCombined = async (resume: File, notice: File) => {
    const formData = new FormData();
    formData.append('resume', resume);
    formData.append('notice', notice);

    const response = await api.post('/api/v1/analyze/combined', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export const analyzeCombinedUrl = async (resumeText: string, noticeUrl: string) => {
    const response = await api.post('/api/v1/analyze/combined-url', {
        resume_text: resumeText,
        notice_url: noticeUrl,
    });
    return response.data;
};

export const getInterviewHistory = async (limit: number = 10) => {
    const response = await api.get(`/api/v1/interview/history?limit=${limit}`);
    return response.data;
};

export const analyzeStarCoach = async (resumeText: string, experienceText: string) => {
    const response = await api.post('/api/v1/resume/star-coach', {
        resume_text: resumeText,
        experience_text: experienceText,
    });
    return response.data;
};

export const chatWithInterviewer = async (messages: { role: string; content: string }[], context?: any) => {
    const response = await api.post('/api/v1/interview/chat', { messages, context });
    return response.data;
};

export const analyzeInterview = async (messages: { role: string; content: string }[]) => {
    const response = await api.post('/api/v1/interview/analyze', { messages });
    return response.data;
};

export const transcribeAudio = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('file', new File([audioBlob], 'recording.webm', { type: 'audio/webm' }));

    const response = await api.post('/api/v1/interview/stt', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

export default api;
// 취업 캘린더 관련 API
export const getJobs = async () => {
    const response = await api.get('/api/v1/jobs');
    return response.data;
};

export const addJob = async (jobData: { company: string; position: string; deadline: string; written_exam_date?: string; first_interview_date?: string; second_interview_date?: string; notes?: string }) => {
    const response = await api.post('/api/v1/jobs', jobData);
    return response.data;
};

export const deleteJob = async (appId: string) => {
    const response = await api.delete(`/api/v1/jobs/${appId}`);
    return response.data;
};

export const updateJob = async (appId: string, jobData: { company: string; position: string; deadline: string; written_exam_date?: string; first_interview_date?: string; second_interview_date?: string; notes?: string }) => {
    const response = await api.put(`/api/v1/jobs/${appId}`, jobData);
    return response.data;
};

export const syncAlioJobs = async (category: string = "전체") => {
    const url = category && category !== "전체" ? `/api/v1/jobs/sync-alio?category=${encodeURIComponent(category)}` : '/api/v1/jobs/sync-alio';
    const response = await api.post(url);
    return response.data;
};

// --- 다중 이력서 프로필 ---
export const saveUserResume = async (user_id: string, filename: string, content: string) => {
    const response = await api.post('/api/v1/resumes', { user_id, filename, content });
    return response.data;
};

export const getUserResumes = async (user_id: string) => {
    const response = await api.get(`/api/v1/resumes/${user_id}`);
    return response.data;
};

export const analyzeResumeText = async (resume_text: string) => {
    const response = await api.post('/api/v1/resume/analyze-text', { resume_text });
    return response.data;
};

// --- 질문 스크랩 (오답노트) ---
export const saveScrappedQuestion = async (user_id: string, question: string, company_name?: string) => {
    const response = await api.post('/api/v1/scrap', { user_id, question, company_name });
    return response.data;
};

export const getScrappedQuestions = async (user_id: string) => {
    const response = await api.get(`/api/v1/scrap/${user_id}`);
    return response.data;
};

export const deleteScrappedQuestion = async (question_id: string) => {
    const response = await api.delete(`/api/v1/scrap/${question_id}`);
    return response.data;
};

export const getJobGuide = async (company: string, position?: string, notes?: string) => {
    const response = await api.post('/api/v1/jobs/guide', { company, position, notes });
    return response.data;
};


