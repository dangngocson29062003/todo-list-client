import { NotificationProvider } from "../components/notification/notificationProvider";
import { ThemeProvider } from "../components/theme-provider";
import "./globals.css";
import { Lexend } from "next/font/google";
const lexend = Lexend({
  subsets: ["latin"],
  display: "swap",
});
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
            <NotificationProvider>{children}</NotificationProvider>
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
