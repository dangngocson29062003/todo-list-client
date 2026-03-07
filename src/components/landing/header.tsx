"use client";
import { useTheme } from "next-themes";
import { Button } from "../shadcn/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full flex justify-center z-50">
      <div
        className={`flex max-w-[90rem] w-full items-center h-16 px-4 md:px-10 transition-all duration-300
    ${scrolled
            ? "rounded-full bg-background/80 backdrop-blur border shadow-md mt-2"
            : "bg-transparent"
          }`}
      >
        <div className="w-full flex items-center justify-between">
          <div className="flex items-center gap-1">
            <img
              src="/images/logo.png"
              alt="Weaver Logo"
              className="w-[16px] h-[16px] md:w-[32px] md:h-[32px]"
            />
            <h2 className="font-bold text-lg md:text-2xl">Weaver</h2>
          </div>

          <div className="flex items-center gap-2 md:gap:10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
            >
              <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden" />
              <Moon className="hidden h-5 w-5 dark:block" />
            </Button>

            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>

            <Link href="/signup">
              <Button className="bg-[#2e5fe8] dark:bg-[#6ad2ff]">
                Sign up
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
