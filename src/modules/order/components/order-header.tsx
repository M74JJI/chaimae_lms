"use client";
import PaymentStatusTag from "@/payment/components/payment-status-tag";
import { Button } from "@/components/ui/button";
import { PaymentStatusType } from "@/payment/types";
import { ChevronLeft, ChevronRight, Download, Printer } from "lucide-react";
import React from "react";
import { OrderFulltType } from "../types";

export default function OrderHeader({ order }: { order: OrderFulltType }) {
  if (!order) return;

  return (
    <div>
      <div className="w-full border-b flex gap-4 p-2">
        {/* Order id */}
        <div className="w-full flex items-center gap-x-3 justify-between">
          <div className="flex items-center gap-x-3">
            <div className="border-r pr-4">
              <button className="w-10 h-10 border rounded-full grid place-items-center">
                <ChevronLeft className="stroke-main-secondary" />
              </button>
            </div>
            <h1 className="text-main-secondary">Order Details</h1>
            <ChevronRight className="stroke-main-secondary w-4" />
            <h2>Order #{order.id}</h2>
          </div>
          <div className="">
            <PaymentStatusTag
              status={order.paymentStatus as PaymentStatusType}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
