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
//import { useToast } from "@/components/ui/use-toast";
import { useModal } from "@/providers/modal-provider";

// Lucide icons
import { MoreHorizontal, Trash } from "lucide-react";

// Queries

// Tanstack React Table
import { ColumnDef } from "@tanstack/react-table";

import { deletecourseAction } from "@/modules/admin/course/actions/course.actions";
import { AdminCourseType } from "@/modules/admin/course/types";
import { formatCourseDuration } from "@/modules/course/utils";
import Image from "next/image";

export const columns: ColumnDef<AdminCourseType>[] = [
  {
    accessorKey: "thumbnail",
    header: "Thumbnail",
    cell: ({ row }) => {
      return (
        <div>
          {row.original.thumbnail && row.original.thumbnail?.length > 0 ? (
            <Image
              src={row.original.thumbnail}
              alt=""
              width={200}
              height={100}
              className="rounded-md"
            />
          ) : (
            <div className="w-[200p] h-[100px]" />
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.title}
        </span>
      );
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.category.name}
        </span>
      );
    },
  },
  {
    accessorKey: "subcategory",
    header: "Subcategory",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.subcategory?.name || <div>&nbsp;-</div>}
        </span>
      );
    },
  },
  {
    accessorKey: "sections",
    header: "Sections",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize pl-6">
          {row.original._count.sections}
        </span>
      );
    },
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      return (
        <span className="font-extrabold text-lg capitalize">
          {row.original.duration
            ? formatCourseDuration(row.original.duration)
            : "-"}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;

      const statusMap: Record<string, { label: string; className: string }> = {
        DRAFT: {
          label: "Draft",
          className: "bg-yellow-50 text-yellow-800 border border-yellow-200",
        },
        PUBLISHED: {
          label: "Published",
          className: "bg-green-50 text-green-800 border border-green-200",
        },
        ARCHIVED: {
          label: "Archived",
          className: "bg-gray-50 text-gray-800 border border-gray-200",
        },
      };

      const { label, className } = statusMap[status] || {
        label: "Unknown",
        className: "bg-muted text-muted-foreground border border-gray-200",
      };

      return (
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}
        >
          {label}
        </span>
      );
    },
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const rowData = row.original;

      return <CellActions rowData={rowData} />;
    },
  },
];

// Define props interface for CellActions component
interface CellActionsProps {
  rowData: AdminCourseType;
}

// CellActions component definition
const CellActions: React.FC<CellActionsProps> = ({ rowData }) => {
  // Hooks
  const { setOpen, setClose } = useModal();
  const [loading, setLoading] = useState(false);
  // const { toast } = useToast();
  const router = useRouter();

  // Return null if rowData or rowData.id don't exist
  if (!rowData || !rowData.id) return null;

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem className="flex gap-2" onClick={() => {}}>
              <Trash size={15} /> Delete course
            </DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent className="max-w-lg">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-left">
            Are you absolutely sure?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-left">
            This action cannot be undone. This will permanently delete the
            course and related data.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex items-center">
          <AlertDialogCancel className="mb-2">Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={loading}
            className="bg-destructive hover:bg-destructive mb-2 text-white"
            onClick={async () => {
              setLoading(true);
              await deletecourseAction(rowData.id);
              setLoading(false);
              setClose();
              router.refresh();
            }}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
