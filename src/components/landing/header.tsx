"use client";
import { useTheme } from "next-themes";
import { Button } from "../shadcn/button";
import { Moon, Sun } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import Link from "next/link";
import { useAuthContext } from "@/src/context/authContext";
import { Avatar, AvatarFallback, AvatarImage } from "../shadcn/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../shadcn/dropdown-menu";
import { useRouter } from "next/navigation";

export default function Header() {
  const { setTheme, theme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const { authUser } = useAuthContext();
  const router = useRouter();
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

          <div className="flex items-center gap-4 md:gap:10">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "light" ? "dark" : "light")}
              className="cursor-pointer"
            >
              <Sun className="h-[1.5rem] w-[1.3rem] dark:hidden " />
              <Moon className="hidden h-5 w-5 dark:block " />
            </Button>
            {!authUser ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" className="px-4 cursor-pointer">
                    Login
                  </Button>
                </Link>

                <Link href="/signup">
                  <Button className="rounded-full bg-[#2e5fe8] dark:bg-[#6ad2ff] px-4 cursor-pointer">
                    Sign up
                  </Button>
                </Link>
              </>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <div className="flex items-center gap-2 cursor-pointer">
                    <Avatar className="h-8 w-8 hover:scale-105 transition">
                      <AvatarImage src={authUser.avatarUrl} />
                      <AvatarFallback>
                        {authUser.email.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <p className="hidden md:block text-sm">
                      Hi, {authUser.email.split("@")[0]}
                    </p>
                  </div>
                </DropdownMenuTrigger>

                <DropdownMenuContent>
                  <DropdownMenuLabel>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {authUser.email}
                      </span>
                      <span className="text-xs text-gray-500">Signed in</span>
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => router.push("/home")}>
                    Dashboard
                  </DropdownMenuItem>

                  <DropdownMenuItem onClick={() => router.push("/settings")}>
                    Settings
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={() => router.push("/logout")}
                    className="text-red-500"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
