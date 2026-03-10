import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "InterviewAI - AI 모의면접 코치",
    description: "취준생의 합격을 돕는 AI 1:1 면접 파트너",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="ko">
            <body>{children}</body>
        </html>
    );
}
