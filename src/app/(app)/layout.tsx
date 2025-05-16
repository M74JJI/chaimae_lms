import Header from "@/components/layout/header/header";
import { CartProvider } from "@/modules/cart/context/cart-context";
import { ReactNode } from "react";

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <CartProvider>{children}</CartProvider>
    </div>
  );
}
