"use client";
import Header from "@/components/layout/header/header";
import { saveUserCart } from "@/modules/cart/actions";
import { useCart } from "@/modules/cart/context/cart-context";
import { formatCourseDuration } from "@/modules/course/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import { useState } from "react";
import { Icons } from "@/components/icons";
import {
  ArrowLeft,
  Heart,
  Shield,
  ShoppingBag,
  SplinePointer,
  Trash,
} from "lucide-react";

export default function CartPage() {
  const { cart, removeFromCart } = useCart();
  const [isLoading, setIsLoading] = useState(false);
  const total = cart.reduce((a, c) => a + c.price, 0);

  const handleSaveCart = async () => {
    setIsLoading(true);
    try {
      const res = await saveUserCart(cart);
      if (res.success) redirect("/checkout");
    } catch (error) {
      console.error("Checkout error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Header />
      {cart.length > 0 ? (
        <div className="w-full min-h-[calc(100vh)] bg-gray-50 dark:bg-gray-900 pt-24">
          <div className="container mx-auto px-4 py-8">
            {/* Cart Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                Your Shopping Cart
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                {cart.length} {cart.length === 1 ? "course" : "courses"} in your
                cart
              </p>
            </div>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Cart Items */}
              <div className="lg:w-2/3">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
                  {cart.map((course) => (
                    <div
                      key={course.id}
                      className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                    >
                      <div className="w-full md:w-1/3 aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={course.thumbnail}
                          alt={course.title}
                          width={300}
                          height={200}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h3 className="text-xl font-semibold text-gray-800 dark:text-white line-clamp-2">
                            {course.title}
                          </h3>
                          <button
                            onClick={() => removeFromCart(course.id)}
                            className="text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
                          >
                            <Trash className="h-5 w-5" />
                          </button>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {course.subtitle}
                        </p>
                        <div className="flex items-center mt-2">
                          <div className="flex items-center mr-4">
                            <Icons.star className="h-4 w-4 text-yellow-500 fill-yellow-500 mr-1" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {course.rating.toFixed(1)}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                              ({course.numReviews})
                            </span>
                          </div>
                          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-2">
                            <span>{course.numLectures} lectures</span>
                            <span>•</span>
                            <span>{formatCourseDuration(course.duration)}</span>
                            <span>•</span>
                            <span>{course.level}</span>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                          By: {course.instructor}
                        </p>
                        <div className="flex items-center justify-between mt-4">
                          <button className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300 flex items-center">
                            <Heart className="h-4 w-4 mr-1" />
                            Save for later
                          </button>
                          <p className="text-lg font-bold text-gray-900 dark:text-white">
                            ${course.price.toFixed(2)}
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
                        ${total.toFixed(2)}
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
                        ${total.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSaveCart}
                    disabled={isLoading}
                    className={`w-full mt-6 py-3 px-4 rounded-lg font-medium text-white transition-colors cursor-pointer ${
                      isLoading
                        ? "bg-indigo-400 cursor-not-allowed"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    }`}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <SplinePointer className="h-5 w-5 animate-spin" />
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <Icons.lock className="h-5 w-5" />
                        Proceed to Checkout
                      </div>
                    )}
                  </button>

                  <div className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-center gap-2">
                      <Shield className="h-4 w-4 text-green-500" />
                      30-Day Money-Back Guarantee
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[calc(100vh-90px)] flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-8">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 max-w-md text-center">
            <ShoppingBag className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Your cart is empty
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Keep shopping to find a course that fits your goals!
            </p>
            <a
              href="/courses"
              className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Browse Courses
            </a>
          </div>
        </div>
      )}
    </>
  );
}
