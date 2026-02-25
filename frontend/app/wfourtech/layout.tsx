import type { Metadata } from "next";
import React from "react";

import { AdminPageProvider } from "@/features/admin/contexts/AdminPageContext";
import { SidebarProvider } from "@/features/admin/contexts/SidebarContext";
import { NotificationProvider } from "@/features/admin/contexts/NotificationContext";
import "@/shared/styles/globals.css";
import "suneditor/dist/css/suneditor.min.css";

import { AdminClientWrapper } from "@/shared/components/AdminClientWrapper";
import QueryProvider from "@/shared/components/QueryProvider";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const dynamic = "force-dynamic"; // Fix build error: Route used cookies

import { redirect } from "next/navigation";
import { verifyAdminAccess } from "@/features/admin/lib/admin-guard";

export const metadata: Metadata = {
  title: "W Four Tech Admin",
  description: "Admin Dashboard",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const locale = cookieStore.get("NEXT_LOCALE")?.value || "vi";

  let messages;
  try {
    // Dynamic import for admin messages based on locale
    // We navigate to frontend/language/admin
    messages = (await import(`@/language/admin/${locale}.json`)).default;
  } catch (error) {
    // Fallback to Vietnamese if locale file not found
    messages = (await import(`@/language/admin/vi.json`)).default;
  }

  // --- Auth Check ---
  // Toàn bộ logic kiểm tra quyền đã được bọc kín trong hàm verifyAdminAccess
  // để đảm bảo bảo mật và không lộ Role ra ngoài layout.
  const hasAccess = await verifyAdminAccess();

  if (!hasAccess) {
    // Nếu không có quyền, đá về trang chủ
    redirect("/");
  }

  // Import NextIntlClientProvider dynamically to avoid build issues if it's not used in other server components similarly
  const { NextIntlClientProvider } = await import("next-intl");

  return (
    <html lang={locale} suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextIntlClientProvider locale={locale} messages={messages}>
          <AdminClientWrapper>
            <QueryProvider>
              <SidebarProvider>
                <NotificationProvider>
                  <AdminPageProvider>
                    <div className="h-screen flex flex-col overflow-hidden">
                      {children}
                    </div>
                    <ToastContainer
                      position="top-right"
                      theme="light"
                      autoClose={1000}
                      limit={2}
                    />
                  </AdminPageProvider>
                </NotificationProvider>
              </SidebarProvider>
            </QueryProvider>
          </AdminClientWrapper>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
