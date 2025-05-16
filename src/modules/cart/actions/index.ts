"use server";
import { auth } from "@/auth";
import { CourseCartType } from "../types";
import { db } from "@/lib/db";

export async function saveUserCart(cartItems: CourseCartType[]) {
  try {
    // Get the current user
    const currentUser = await auth();
    const userId = currentUser?.user.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Calculate the total price of the cart
    const total = cartItems.reduce((sum, item) => sum + item.price, 0);

    // Upsert the user's cart (create or update)
    const cart = await db.cart.upsert({
      where: { userId },
      update: {
        total,
        // Delete all existing cart items
        cartItems: {
          deleteMany: {},
        },
      },
      create: {
        userId,
        total,
      },
      include: {
        cartItems: true,
      },
    });

    // Add all the new cart items
    await db.cartItem.createMany({
      data: cartItems.map((item) => ({
        cartId: cart.id,
        courseId: item.id,
      })),
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving user cart:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
