import { auth } from "@/auth";
import Header from "@/components/layout/header/header";
import { db } from "@/lib/db";
import { formatCourseDuration } from "@/modules/course/utils";
import { createOrder } from "@/modules/order/actions/order";
import CreateOrderButton from "@/modules/order/components/create-order-btn";
import Image from "next/image";
import { redirect } from "next/navigation";
export default async function CheckoutPage() {
  const user = await auth();
  const userId = user?.user.id;
  if (!userId) redirect("/");
  const cart = await db.cart.findUnique({
    where: {
      userId,
    },
    include: {
      cartItems: {
        include: {
          course: {
            include: {
              instructorProfile: {
                include: {
                  user: {
                    select: {
                      name: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!cart) redirect("/");
  const { cartItems } = cart;

  return (
    <>
      <Header />
      <div className="w-full  z-10 h-full overflow-x-hiddentransition ease-in-out duration-700">
        <div className="flex md:flex-row flex-col justify-end">
          <div className="w-full md:pl-10 pl-4 pr-10 md:pr-4 md:py-12 py-8 bg-white overflow-y-auto overflow-x-hidden h-[calc(100vh-90px)]">
            <div className="flex items-center text-gray-500 hover:text-gray-600 cursor-pointer">
              <p className="text-5xl font-black leading-10 text-gray-800 pt-3">
                Checkout ({cartItems.length})
              </p>
            </div>
            <div className="mt-14">
              {cartItems.map((course) => (
                <div
                  className="md:flex items-center py-8 border-t border-b border-gray-200"
                  key={course.id}
                >
                  <div className="h-full w-1/2">
                    <Image
                      src={course.course.thumbnail!}
                      alt=""
                      width={300}
                      height={200}
                      className="w-full h-full object-center object-cover"
                    />
                  </div>
                  <div className="md:pl-3 md:w-3/4 w-full">
                    <div className="flex items-center justify-between w-full pt-1">
                      <p className="text-base font-black leading-none text-gray-800 line-clamp-1 capitalize">
                        {course.course.title}
                      </p>
                      <select className="px-1 border pt-1 border-gray-200 mr-6 focus:outline-none">
                        <option>01</option>
                      </select>
                    </div>
                    <p className="text-xs leading-3 text-gray-600 line-clamp-2">
                      {course.course.subtitle}
                    </p>
                    <div className="mt-2 flex items-center">
                      {/*
                      <StarRatings
                        rating={course.course.rating}
                        starRatedColor="#FFD700"
                        numberOfStars={5}
                        starSpacing="1"
                        starDimension="15px"
                      />
                     */}
                      <p className="text-xs mt-1 text-gray-500">
                        ({course.course.numReviews}&nbsp;
                        {course.course.numReviews > 1 ? "ratings" : "rating"} )
                      </p>
                    </div>

                    <div className="mt-2 flex items-center flex-wrap gap-1 text-gray-400 text-xs">
                      <p>
                        {formatCourseDuration(course.course.duration)} total
                      </p>
                      ●<p>{course.course.numLectures} lectures</p>●
                      <p>{course.course.difficultyLevel}</p>
                    </div>
                    <p className="w-96 text-xs leading-3 text-gray-600 pt-3">
                      By: {course.course.instructorProfile.user.name}
                    </p>
                    <div className="flex items-center justify-between pt-5 pr-6">
                      <p className="text-base font-black leading-none text-gray-800">
                        ${course.course.price?.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full bg-gray-100 ">
            <div className="flex flex-col md:h-[calc(100vh-90px)] px-14 py-20 justify-between overflow-y-auto">
              <div>
                <p className="text-4xl font-black leading-9 text-gray-800">
                  Summary
                </p>
                <div className="flex items-center justify-between pt-16">
                  <p className="text-base leading-none text-gray-800">
                    Subtotal
                  </p>
                  <p className="text-base leading-none text-gray-800">
                    {cart.total.toFixed(2)}
                  </p>
                </div>
                <div className="flex items-center justify-between pt-5">
                  <p className="text-base leading-none text-gray-800">Tax</p>
                  <p className="text-base leading-none text-gray-800">$0</p>
                </div>
              </div>
              <div>
                <div className="flex items-center pb-6 justify-between lg:pt-5 pt-20">
                  <p className="text-2xl leading-normal text-gray-800">Total</p>
                  <p className="text-2xl font-bold leading-normal text-right text-gray-800">
                    {cart.total.toFixed(2)}
                  </p>
                </div>
                <CreateOrderButton />
              </div>
            </div>
          </div>
        </div>
      </div>
      <style>
        {` /* width */
              #scroll::-webkit-scrollbar {
                  width: 1px;
              }

              /* Track */
              #scroll::-webkit-scrollbar-track {
                  background: #f1f1f1;
              }

              /* Handle */
              #scroll::-webkit-scrollbar-thumb {
                  background: rgb(133, 132, 132);
              }
`}
      </style>
    </>
  );
}
