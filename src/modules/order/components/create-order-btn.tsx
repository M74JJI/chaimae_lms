"use client";

import { redirect } from "next/navigation";
import { createOrder } from "../actions/order";

export default function CreateOrderButton() {
  const handleCreateOrder = async () => {
    const res = await createOrder();
    if (res.success && res.data?.id) {
      redirect(`/order/${res.data?.id}`);
    }
  };
  return (
    <button
      className="text-base leading-none w-full py-5 bg-gray-800 border-gray-800 border focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-800 text-white cursor-pointer hover:bg-gray-900"
      onClick={() => handleCreateOrder()}
    >
      Complete Purchase
    </button>
  );
}
