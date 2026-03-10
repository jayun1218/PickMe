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
// 취업 캘린더 관련 API
export const getJobs = async () => {
    const response = await api.get('/api/v1/jobs');
    return response.data;
};

export const addJob = async (jobData: { company: string; position: string; deadline: string; notes?: string }) => {
    const response = await api.post('/api/v1/jobs', jobData);
    return response.data;
};

export const deleteJob = async (appId: string) => {
    const response = await api.delete(`/api/v1/jobs/${appId}`);
    return response.data;
};
