import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import OrderHeader from "@/order/components/order-header";
import { getOrder } from "@/order/actions/order";
import { redirect } from "next/navigation";
import OrderUserDetailsCard from "@/order/components/cards/user";
import OrderInfoCard from "@/modules/order/components/cards/info";
import OrderTotalDetailsCard from "@/modules/order/components/cards/total";
import OrderPayment from "@/modules/order/components/payment";
import OrderCourses from "@/modules/order/components/order-courses";

export default async function OrderPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order) return redirect("/");

  return (
    <div>
      <div className="p-2">
        <OrderHeader order={order} />
        <div
          className={cn("order-area-3", {
            "order-area-3":
              order.paymentStatus !== "Pending" &&
              order.paymentStatus !== "Failed",
          })}
        >
          {/* Col 1 -> User, Oder details */}
          <div className="order-area-cards min-[1024px]:h-[calc(100vh-137px)] min-[1024px]:border-r overflow-y-auto flex flex-col gap-y-5 scrollbar ">
            <OrderUserDetailsCard />
            <OrderInfoCard paymentDetails={order.paymentDetails} />
            {order.paymentStatus !== "Pending" &&
              order.paymentStatus !== "Failed" && (
                <OrderTotalDetailsCard total={order.total} />
              )}
          </div>
          {/* Col 2 -> Order Groups */}
          <OrderCourses courses={order.items} />
          {/* Col 3 -> Payment Gateways*/}
          {(order.paymentStatus === "Pending" ||
            order.paymentStatus === "Failed") && (
            <div className="order-area-payment min-[1024px]:h-[calc(100vh-137px)] min-[1024px]:border-l overflow-y-auto scrollbar px-2 py-4 space-y-5 flex flex-col justify-center">
              <OrderTotalDetailsCard total={order.total} />
              <Separator />
              <OrderPayment orderId={order.id} amount={order.total} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
