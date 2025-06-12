"use client";

// React, Next.js imports
import { useState } from "react";
import { useRouter } from "next/navigation";

// UI components
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hooks and utilities
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import { MoreHorizontal, Trash } from "lucide-react";

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

import { StudentType } from "@/modules/admin/students/types";
import { deleteStudentAction } from "@/modules/admin/students/actions/students.actions";
import Image from "next/image";
import { EnrollmentType } from "@/modules/admin/enrollments/types";

export const columns: ColumnDef<EnrollmentType>[] = [
  {
    accessorKey: "user",
    header: "User",
    filterFn: (row, id, value) => {
      return row.original.user.name.toLowerCase().includes(value.toLowerCase());
    },
    cell: ({ row }) => {
      return (
        <div>
          {row.original.user.image && row.original.user.image?.length > 0 ? (
            <Image
              src={row.original.user.image}
              alt=""
              width={50}
              height={50}
              className="rounded-full"
            />
          ) : (
            <div className="w-[50px] h-[50px]" />
          )}
          <div className="space-y-1 mt-2">
            <div>{row.original.user.name}</div>
            <div>{row.original.user.email}</div>
            <div>{row.original.user.phoneNumber}</div>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "thumbnail",
    header: "Course",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.course.thumbnail &&
          row.original.course.thumbnail?.length > 0 ? (
            <Image
              src={row.original.course.thumbnail}
              alt=""
              width={200}
              height={100}
              className="rounded-md"
            />
          ) : (
            <div className="w-[200px] h-[100px]" />
          )}
          <div>
            <h1 className="line-clamp-2 w-[190px] mt-2">
              {row.original.course.title}
            </h1>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "purchasedAt",
    header: "Purshased At",
    cell: ({ row }) => {
      return <div>{row.original.purchasedAt.toDateString()}</div>;
    },
  },
];
