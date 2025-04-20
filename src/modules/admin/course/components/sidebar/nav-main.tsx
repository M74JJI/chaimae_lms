"use client";

import { Check, ChevronRight, type LucideIcon } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { useParams, usePathname } from "next/navigation";
import Link from "next/link";
import { DashboardLinksType } from "@/types/common";
import { CourseTabsStatus } from "../../types";

export function NavMain({
  items,
  title,
  course_statuses,
}: {
  items: DashboardLinksType;
  title: string;
  course_statuses: CourseTabsStatus;
}) {
  const pathname = usePathname();
  const params = useParams();
  const { id } = params;
  const path = pathname.split(`${id}`)[1];
  const { open } = useSidebar();
  return (
    <SidebarGroup>
      {open && (
        <div className="absolute right-1 top-3">
          <SidebarTrigger />
        </div>
      )}
      <SidebarGroupLabel>{title}</SidebarGroupLabel>
      <SidebarMenu>
        {!open && (
          <div className="absolute right-2 ">
            <SidebarTrigger />
          </div>
        )}
        <div
          className={cn({
            "mt-8": !open,
          })}
        >
          {items.map((item) => (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={true}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    isActive={path === item.url}
                  >
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => {
                      if (
                        (subItem.url === "/manage/promotions" &&
                          course_statuses.status === "DRAFT") ||
                        (subItem.url === "/manage/students" &&
                          course_statuses.status === "DRAFT")
                      )
                        return null;
                      return (
                        <SidebarMenuSubItem
                          key={subItem.url}
                          className={cn({
                            "bg-sidebar-accent rounded-md":
                              subItem.url === pathname,
                          })}
                        >
                          <SidebarMenuSubButton
                            asChild
                            isActive={path === subItem.url}
                          >
                            <Link
                              href={`/dashboard/instructor/courses/${id}${subItem.url}`}
                              className="flex items-center gap-x-1"
                            >
                              <label
                                htmlFor={subItem.url}
                                className="p-0 text-gray-900 text-sm leading-6 inline-flex items-center cursor-pointer align-middle"
                              >
                                <span className="leading-8 inline-flex p-0.5 cursor-pointer ">
                                  <span className="leading-8 w-4 h-4 rounded-full bg-transparent border border-gray-300 flex items-center justify-center hover:border-orange-background">
                                    {(subItem.url ===
                                      "/manage/intended-learners" &&
                                      course_statuses.intendedLearners) ||
                                    (subItem.url === "/manage/objectives" &&
                                      course_statuses.objectives) ||
                                    (subItem.url === "/manage/prerequisites" &&
                                      course_statuses.prerequisites) ? (
                                      <span className="bg-orange-background w-4 h-4 rounded-full flex items-center justify-center">
                                        <Check className="w-3 text-black dark:text-white" />
                                      </span>
                                    ) : null}
                                  </span>
                                </span>
                                <input
                                  type="checkbox"
                                  id={subItem.url}
                                  hidden
                                />
                              </label>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </div>
      </SidebarMenu>
    </SidebarGroup>
  );
}
