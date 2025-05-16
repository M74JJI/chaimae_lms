"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { CourseCartType } from "../types";

type CartContextType = {
  cart: CourseCartType[];
  addToCart: (course: CourseCartType) => void;
  removeFromCart: (id: string) => void;
  isInCart: (id: string) => boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cart, setCart] = useState<CourseCartType[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem("course_cart");
    if (storedCart) setCart(JSON.parse(storedCart));
  }, []);

  // Sync to localStorage
  useEffect(() => {
    console.log("Saving to localStorage:", cart);
    if (cart.length > 0) {
      localStorage.setItem("course_cart", JSON.stringify(cart));
    }
  }, [cart]);

  const addToCart = (course: CourseCartType) => {
    if (!cart.find((c) => c.id === course.id)) {
      setCart([...cart, course]);
    }
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((c) => c.id !== id));
    const new_cart = cart.filter((c) => c.id !== id);
    localStorage.setItem("course_cart", JSON.stringify(new_cart));
  };

  const isInCart = (id: string) => cart.some((c) => c.id === id);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, isInCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
