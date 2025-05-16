"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";
import { FormResponse } from "@/types";

export const getOrder = async (orderId: string) => {
  // Retrieve current user
  const currentUser = await auth();
  const user = currentUser?.user;

  // Check if user is authenticated
  if (!user) throw new Error("Unauthenticated.");

  const order = await db.order.findUnique({
    where: {
      id: orderId,
      userId: user.id,
    },
    include: {
      paymentDetails: true,
      items: true,
    },
  });

  return order;
};

export async function createOrder(): Promise<FormResponse<{ id: string }>> {
  try {
    // Get the current user
    const currentUser = await auth();
    const userId = currentUser?.user.id;

    if (!userId) {
      throw new Error("User not authenticated");
    }

    // Get the user's cart with items
    const userCart = await db.cart.findUnique({
      where: { userId },
      include: {
        cartItems: {
          include: {
            course: true,
          },
        },
      },
    });

    if (!userCart) return { success: false, message: "Cart doesn't exist." };

    if (!userCart) {
      throw new Error("Cart not found");
    }

    if (userCart.cartItems.length === 0) {
      throw new Error("Cart is empty");
    }

    // Calculate total
    const total = userCart.cartItems.reduce(
      (sum, item) => sum + (item.course.price || 0),
      0
    );

    // Create the order in a transaction
    const order = await db.$transaction(async (tx) => {
      // 1. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          total,
          paymentStatus: "Pending",
        },
      });

      // 2. Create order items from cart items
      await tx.orderItem.createMany({
        data: userCart.cartItems.map((item) => ({
          orderId: newOrder.id,
          courseId: item.course.id,
          courseSlug: item.course.slug,
          title: item.course.title,
          thumbnail: item.course.thumbnail || "",
          price: item.course.price || 0,
        })),
      });

      // 3. Clear the cart
      await tx.cartItem.deleteMany({
        where: { cartId: userCart.id },
      });

      await tx.cart.update({
        where: { id: userCart.id },
        data: { total: 0 },
      });

      return newOrder;
    });

    return { success: true, data: { id: order.id }, message: "" };
  } catch (error) {
    console.error("Error creating order:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
