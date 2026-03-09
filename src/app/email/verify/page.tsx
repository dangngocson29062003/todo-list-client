"use client";

import { useEffect } from "react";
import { AlertCircle, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useSearchParams, useRouter } from "next/navigation";

export default function EmailVerifyPage() {
    const params = useSearchParams();
    const router = useRouter();
    const status = params.get("status")?.trim().toUpperCase();

    const config = {
        SUCCESS: {
            title: "Email Verified",
            message: "Your account has been verified successfully.\nYou can now log in.",
            color: "text-green-600",
            icon: <CheckCircle2 className="w-16 h-16" />,
            redirect: true,
        },
        EXPIRED: {
            title: "Verification Expired",
            message: "Your verification link expired.\nA new confirmation email has been sent.",
            color: "text-yellow-500",
            icon: <AlertCircle className="w-16 h-16" />,
            redirect: false,
        },
        USED: {
            title: "Already Verified",
            message: "Your account has already been verified.\nPlease log in.",
            color: "text-blue-600",
            icon: <Info className="w-16 h-16" />,
            redirect: true,
        },
        NOT_FOUND: {
            title: "Invalid Link",
            message: "This verification link is invalid or does not exist.",
            color: "text-red-600",
            icon: <AlertTriangle className="w-16 h-16" />,
            redirect: false,
        },
    } as const;

    const data = config[status as keyof typeof config] ?? {
        title: "Verification Error",
        message: "Something went wrong.",
        color: "text-red-600",
        icon: <AlertTriangle className="w-16 h-16" />,
        redirect: false,
    };

    useEffect(() => {
        if (data.redirect) {
            const timer = setTimeout(() => {
                router.push("/login");
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [data.redirect, router]);

    return (
        <div className="min-h-screen flex items-center justify-center
            bg-gradient-to-br from-gray-50 to-gray-100
            dark:from-zinc-900 dark:to-zinc-950 transition-colors">

            <div className="w-[420px] text-center
                border border-gray-200 dark:border-zinc-700
                bg-white dark:bg-zinc-800
                shadow-2xl py-8 px-8 rounded-2xl">

                <div className={`flex justify-center text-5xl mb-6 ${data.color}`}>
                    {data.icon}
                </div>

                <h1 className={`text-xl font-semibold mb-4 ${data.color}`}>
                    {data.title}
                </h1>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-8 whitespace-pre-line leading-relaxed">
                    {data.message}
                </p>

                {data.redirect && (
                    <div className="flex items-center justify-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                        <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        Redirecting to login...
                    </div>
                )}
            </div>
        </div>
    );
}