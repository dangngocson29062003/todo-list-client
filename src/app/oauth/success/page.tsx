"use client";

import { useEffect } from "react";
import { refresh,getMe } from "../../../service/auth-service";
import { useRouter } from "next/navigation";
import { useNotify } from "@/src/components/notification/notificationProvider";
import { useAuthContext } from "@/src/context/authContext";

export default function OAuthSuccessPage() {
    const router = useRouter();
    const notify = useNotify();
    const {authLogin}=useAuthContext();

    useEffect(() => {
        (async () => {
            try {
                const token = await refresh();
                const user=await getMe();

                // console.log(user)

                authLogin(token,user)
                
                router.push("/home");
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