'use client';

import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2 } from 'lucide-react';
import { transcribeAudio } from '@/lib/api';

interface VoiceRecorderProps {
    onTranscriptionComplete: (text: string) => void;
    isDisabled: boolean;
}

export default function VoiceRecorder({ onTranscriptionComplete, isDisabled }: VoiceRecorderProps) {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    chunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = async () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setIsProcessing(true);
                try {
                    const data = await transcribeAudio(audioBlob);
                    if (data.text) {
                        onTranscriptionComplete(data.text);
                    }
                } catch (error) {
                    console.error('STT 변환 오류:', error);
                    alert('음성 인식 중 오류가 발생했습니다.');
                } finally {
                    setIsProcessing(false);
                }

                // 스트림 트랙 종료
                stream.getTracks().forEach(track => track.stop());
            };

            mediaRecorder.start();
            setIsRecording(true);
        } catch (error) {
            console.error('마이크 접근 오류:', error);
            alert('마이크 접근 권한이 필요합니다.');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
    };

    return (
        <div className="flex items-center gap-2">
            {isRecording ? (
                <button
                    onClick={stopRecording}
                    className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all flex items-center gap-2 animate-pulse"
                >
                    <Square className="w-5 h-5 fill-current" />
                    <span className="text-xs font-bold">중지</span>
                    <div className="flex gap-1">
                        <span className="w-1 h-3 bg-white/50 rounded-full animate-[bounce_1s_infinite_0ms]"></span>
                        <span className="w-1 h-4 bg-white/80 rounded-full animate-[bounce_1s_infinite_200ms]"></span>
                        <span className="w-1 h-3 bg-white/50 rounded-full animate-[bounce_1s_infinite_400ms]"></span>
                    </div>
                </button>
            ) : (
                <button
                    onClick={startRecording}
                    disabled={isDisabled || isProcessing}
                    className="p-3 bg-indigo-50 text-indigo-600 rounded-xl hover:bg-indigo-100 transition-all disabled:opacity-30 flex items-center justify-center"
                    title="음성으로 답변하기"
                >
                    {isProcessing ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Mic className="w-5 h-5" />
                    )}
                </button>
            )}
        </div>
    );
}
