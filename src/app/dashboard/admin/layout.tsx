import { auth } from "@/auth";
import { DashboardSidebar } from "@/components/layout/dashboard/sidebar/sidebar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { admin_dashboard_links } from "@/data/navigation-links";

import { redirect } from "next/navigation";
import { ReactNode } from "react";
export default async function AdminDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await auth();
  const user = session?.user;
  if (!user) redirect("/");

  return (
    <SidebarProvider>
      <DashboardSidebar
        user={user}
        links={admin_dashboard_links}
        title="Admin Dashboard"
      />
      <SidebarInset>
        <div className="flex flex-1">
          <div className="h-[100vh] bg-muted/50 flex-1">{children}</div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
