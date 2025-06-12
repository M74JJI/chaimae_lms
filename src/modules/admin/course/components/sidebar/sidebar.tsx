"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "./nav-main";
import { NavProjects } from "./nav-projects";
import { NavUser } from "./nav-user";
import { TeamSwitcher } from "./team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { User } from "next-auth";
import { DashboardLinksType } from "@/types/common";
import { CourseTabsStatus } from "../../types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { submitCourseForReview } from "@/modules/course/actions";
import { useRouter } from "next/navigation";

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
  links: DashboardLinksType;
  title: string;
  course_statuses: CourseTabsStatus;
  allValid: boolean;
  isDraft: boolean;
  course_id: string;
};

export function DashboardSidebar({
  user,
  links,
  title,
  course_statuses,
  allValid,
  course_id,
  isDraft,
  ...props
}: DashboardSidebarProps) {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const handleSubmit = async () => {
    await submitCourseForReview(course_id);
    router.refresh();
  };
  return (
    <Sidebar collapsible="icon" {...props} className="top-12">
      <SidebarContent className="relative">
        <NavMain
          items={links}
          title={title}
          course_statuses={course_statuses}
        />
        {isDraft && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2">
            <Button
              disabled={!allValid}
              className={cn({
                "cursor-not-allowed": !allValid,
              })}
              onClick={() => handleSubmit()}
            >
              {loading ? "Loading..." : "Submit for review"}
            </Button>
          </div>
        )}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
