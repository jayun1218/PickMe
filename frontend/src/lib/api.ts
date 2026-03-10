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

export const chatWithInterviewer = async (messages: { role: string; content: string }[]) => {
    const response = await api.post('/api/v1/interview/chat', { messages });
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
