"use client";

// Provider
import { useModal } from "@/providers/modal-provider";

// UI components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  defaultOpen?: boolean;
};

const Modal = ({ children, defaultOpen }: Props) => {
  const { isOpen, setClose } = useModal();
  return (
    <Dialog open={isOpen || defaultOpen} onOpenChange={setClose}>
      <DialogTitle></DialogTitle>
      <DialogContent className={cn("!bg-transparent p-0 rounded-2xl")}>
        <div>{children}</div>
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
