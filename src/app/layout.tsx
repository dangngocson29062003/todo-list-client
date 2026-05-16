import { Lexend } from "next/font/google";
import { NotificationProvider } from "../components/notification/notificationProvider";
import { ThemeProvider } from "../components/theme-provider";
import { AuthProvider } from "../context/authContext";
import "./globals.css";
import { Metadata } from "next";
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Weaver — Work Together, Better",
  description: "Weaver combines project management, team collaboration, and workspace organization into a simple and flexible platform designed for modern teams.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <html
        lang="en"
        suppressHydrationWarning
        className={`${lexend.className} scroll-smooth`}
      >
        <head />
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <AuthProvider>
              <NotificationProvider>{children}</NotificationProvider>
            </AuthProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
