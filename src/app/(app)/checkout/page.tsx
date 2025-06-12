import { auth } from "@/auth";
import Header from "@/components/layout/header/header";
import { db } from "@/lib/db";
import { formatCourseDuration } from "@/modules/course/utils";
import { createOrder } from "@/modules/order/actions/order";
import { Icons } from "@/components/icons";
import Image from "next/image";
import { redirect } from "next/navigation";
import { CreditCard, Shield } from "lucide-react";
import { IoPlaySkipBackOutline } from "react-icons/io5";

export default async function CheckoutPage() {
  const user = await auth();
  const userId = user?.user.id;
  if (!userId) redirect("/");

  const cart = await db.cart.findUnique({
    where: { userId },
    include: {
      cartItems: {
        include: {
          course: {
            include: {
              instructorProfile: {
                include: {
                  user: { select: { name: true } },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) redirect("/");
  const { cartItems } = cart;

  return (
    <>
      <Header />
      <div className="w-full min-h-[calc(100vh-90px)] bg-gray-50 dark:bg-gray-900 pt-24">
        <div className="container mx-auto px-4 py-8">
          {/* Checkout Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Complete Your Purchase
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Review your {cartItems.length}{" "}
              {cartItems.length === 1 ? "course" : "courses"} before checkout
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Course List */}
            <div className="lg:w-2/3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                  >
                    <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                      <Image
                        src={item.course.thumbnail!}
                        alt={item.course.title}
                        width={300}
                        height={200}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
                        {item.course.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                        {item.course.subtitle}
                      </p>
                      <div className="flex items-center mt-2">
                        <div className="flex items-center mr-4">
                          <Icons.star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                          <span className="text-sm text-gray-700 dark:text-gray-300">
                            {item.course.rating?.toFixed(1) || "New"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                            ({item.course.numReviews})
                          </span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                          <span>{item.course.numLectures} lectures</span>
                          <span>•</span>
                          <span>
                            {formatCourseDuration(item.course.duration)}
                          </span>
                          <span>•</span>
                          <span>{item.course.difficultyLevel}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                        By: {item.course.instructorProfile.user.name}
                      </p>
                      <div className="flex items-center justify-end mt-4">
                        <p className="text-lg font-bold text-gray-900 dark:text-white">
                          ${item.course.price?.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 sticky top-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Subtotal
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      ${cart.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">
                      Tax
                    </span>
                    <span className="text-gray-800 dark:text-gray-200">
                      $0.00
                    </span>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>
                  <div className="flex justify-between">
                    <span className="text-lg font-semibold text-gray-800 dark:text-white">
                      Total
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      ${cart.total.toFixed(2)}
                    </span>
                  </div>
                </div>
                {/* 
onClick={() => createOrder()}
*/}
                <div className="mt-6">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 rounded-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <Icons.lock className="h-5 w-5" />
                    Complete Purchase
                  </button>
                </div>

                <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                  <div className="flex items-center justify-center gap-2">
                    <Shield className="h-4 w-4 text-green-500" />
                    30-Day Money-Back Guarantee
                  </div>
                </div>

                <div className="mt-6 border-t border-gray-200 dark:border-gray-700 pt-6">
                  <h3 className="font-medium text-gray-800 dark:text-white mb-3">
                    What's included:
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                    <li className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-green-500" />
                      Lifetime access to all course materials
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-green-500" />
                      Certificate of completion
                    </li>
                    <li className="flex items-center gap-2">
                      <Icons.check className="h-4 w-4 text-green-500" />
                      24/7 customer support
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
