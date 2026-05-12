"use client";

import { NavActions } from "@/src/components/dashboard/nav-actions";
import { AppSidebar } from "@/src/components/dashboard/sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/src/components/shadcn/breadcrumb";
import { Separator } from "@/src/components/shadcn/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/src/components/shadcn/sidebar";
import { Toaster } from "@/src/components/shadcn/sonner";
import { useAuthContext } from "@/src/context/authContext";
import { HomeProvider } from "@/src/context/homeContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { authToken, authUser, loading } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const [checkingWorkspace, setCheckingWorkspace] = useState(true);
  useEffect(() => {
    async function checkAuthAndWorkspace() {
      if (loading) return;

      if (!authToken || !authUser) {
        setCheckingWorkspace(false);
        router.replace("/login");
        return;
      }

      if (pathname === "/create-workspace") {
        setCheckingWorkspace(false);
        return;
      }

      try {
        const res = await fetch("/api/workspaces", {
          method: "GET",
          cache: "no-store",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        const json = await res.json();

        if (!res.ok) {
          throw new Error(json.message || "Failed to fetch workspaces");
        }

        const workspaces = json.data?.content ?? [];

        if (workspaces.length === 0) {
          router.replace("/create-workspace");
          return;
        }

        setCheckingWorkspace(false);
      } catch (error) {
        console.error(error);
        setCheckingWorkspace(false);
      }
    }

    checkAuthAndWorkspace();
  }, [authToken, authUser, loading, pathname, router]);

  if (loading || checkingWorkspace) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }
  if (pathname === "/create-workspace") {
    return (
      <HomeProvider>
        <div className="min-h-screen w-full">{children}</div>

        <Toaster position="bottom-center" />
      </HomeProvider>
    );
  }
  return (
    <SidebarProvider>
      <HomeProvider>
        <AppSidebar />
        <SidebarInset className="relative">
          <header className="flex h-14 shrink-0 items-center gap-2 border-bx">
            <div className="flex flex-1 items-center gap-2 px-3">
              <SidebarTrigger />
              <Separator
                orientation="vertical"
                className="mr-2 data-[orientation=vertical]:h-4"
              />

              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbPage>{title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>

            <div className="ml-auto px-3">
              <NavActions />
            </div>
          </header>
          <div className="w-full p-4 mx-auto relative">{children}</div>
          <Toaster
            position="bottom-center"
            style={{
              position: "fixed",
              left: "calc(50% + var(--sidebar-width) / 2)",
              transform: "translateX(-50%)",
              bottom: "40px",
              zIndex: 9999,
              display: "flex",
              alignItems: "center",
            }}
            toastOptions={{
              className: "flex items-center gap-3",
              style: {
                width: "fit-content",
                minWidth: "fit-content",
                display: "flex",
                alignItems: "center",
              },
            }}
            className="flex items-center"
          />
        </SidebarInset>
      </HomeProvider>
    </SidebarProvider>
  );
}
