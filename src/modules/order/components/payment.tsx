"use client";

import PaypalProvider from "@/payment/providers/paypal-provider";
import PaypalPayment from "@/payment/components/paypal";
import { FC } from "react";
import StripeProvider from "@/modules/payment/providers/stripe-provider";
import StripePayment from "@/modules/payment/components/stripe";

interface Props {
  orderId: string;
  amount: number;
}

const OrderPayment: FC<Props> = ({ amount, orderId }) => {
  return (
    <div className="w-full h-full min-[768px]:min-w-[400px] space-y-5">
      {/* Paypal */}
      <div className="mt-6">
        <PaypalProvider>
          <PaypalPayment orderId={orderId} />
        </PaypalProvider>
      </div>
      {/* Stripe */}
      <StripeProvider amount={amount}>
        <StripePayment orderId={orderId} />
      </StripeProvider>
    </div>
  );
};

export default OrderPayment;
