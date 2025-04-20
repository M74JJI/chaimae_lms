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

type DashboardSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: User;
  links: DashboardLinksType;
  title: string;
  course_statuses: CourseTabsStatus;
};

export function DashboardSidebar({
  user,
  links,
  title,
  course_statuses,
  ...props
}: DashboardSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props} className="top-12">
      <SidebarContent>
        <NavMain
          items={links}
          title={title}
          course_statuses={course_statuses}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
