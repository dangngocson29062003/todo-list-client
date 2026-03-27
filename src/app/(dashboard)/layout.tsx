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
import { useAuthContext } from "@/src/context/authContext";
import { HomeProvider } from "@/src/context/homeContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardLayout({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  const { authUser, authToken } = useAuthContext();
  const router = useRouter();
  useEffect(() => {
    if (!authUser && !authToken) {
      router.replace("/landing");
    }
  }, [authUser, authToken, router]);

  return (
    <SidebarProvider>
      <HomeProvider>
        <AppSidebar />
        <SidebarInset className="pb-10 justify-center">
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
          {children}
        </SidebarInset>
      </HomeProvider>
    </SidebarProvider>
  );
}
