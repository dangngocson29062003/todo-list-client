"use client";
import Image from "next/image";

export default function EmailNoticePage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div
        className="flex flex-col items-center text-center 
        w-full max-w-md p-8 space-y-6
        animate-in fade-in zoom-in duration-500"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-28 h-28 bg-blue-400/50 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute w-24 h-24 border-2 border-blue-500/50 rounded-full animate-ping opacity-30"></div>
          <Image
            src="/images/logo.png"
            alt="logo"
            width={32}
            height={32}
            className="animate-pulse"
          />
        </div>
        <div className="space-y-2">
          <h1 className="text-xl font-semibold text-blue-600">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
            We've sent a verification link to your email.
            <br />
            Please check your inbox and click the link to continue.
          </p>
        </div>
        <p className="text-xs text-gray-400">
          Didn’t receive the email? Check your spam folder.
        </p>
      </div>
    </div>
  );
}
