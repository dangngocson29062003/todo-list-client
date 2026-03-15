"use client";

import { useEffect } from "react";
import { refresh } from "../../../service/api";
import { useRouter } from "next/navigation";
import { useNotify } from "@/src/components/notification/notificationProvider";

export default function OAuthSuccessPage() {
    const router = useRouter();
    const notify = useNotify();

    useEffect(() => {
        (async () => {
            try {
                const token = await refresh();
                localStorage.setItem("token",token);
                
                router.push("/");
            } catch (err) {
                notify(
                    "error",
                    "OAuth Login Failed",
                    "Unable to refresh session. Please try logging in again."
                );
                router.push("/login");
            }
        })();
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center
            bg-gray-50 dark:bg-zinc-900 transition-colors">

            <div className="w-[450px] text-center
                border border-gray-200 dark:border-zinc-700
                bg-white dark:bg-zinc-800
                shadow-xl py-10 px-8 rounded-xl">

                {/* Spinner */}
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>

                {/* Title */}
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                    Signing you in
                </h2>

                {/* Subtitle */}
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please wait while we finish your authentication.
                </p>

            </div>
        </div>
    );
}