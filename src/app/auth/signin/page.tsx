import { SignInFormHandler } from "@/modules/auth/components/forms";
import { Metadata } from "next";
import VectorImg from "@/public/assets/vectors/elearn_live.svg";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in page",
};

/**
 * SignInPage
 *
 * This page renders the sign-in form where users can input their credentials
 * to log into their accounts. It uses the `SignInFormHandler` to manage form state
 * and validation.
 */
export default function SignInPage() {
  return (
    <main>
      <section className="p-0 flex items-center relative overflow-hidden h-[calc(100vh-5rem)]">
        <div className="container mx-auo">
          <div className="flex flex-wrap -mx-2">
            <div className="w-full lg:w-1/2 md:flex items-center justify-center bg-blue-500/10 lg:h-screen">
              <div className="p-3 lg:p-5">
                <div className="text-center">
                  <h2 className="font-bold">
                    Welcome to our largest community
                  </h2>
                  <p className="mb-0 text-sm font-light">
                    Let's learn something new today!
                  </p>
                </div>
                <Image
                  src={VectorImg}
                  alt=""
                  width={500}
                  height={200}
                  className="mt-5"
                />
                <div className="sm:flex mt-5 items-center justify-center">
                  <ul className="avatar-group mb-2 sm:mb-0 flex space-x-2">
                    <li className="avatar avatar-sm">
                      <img
                        className="avatar-img rounded-full"
                        src="/eduport_r/assets/01-7N0KytgQ.jpg"
                        alt="avatar"
                      />
                    </li>
                    <li className="avatar avatar-sm">
                      <img
                        className="avatar-img rounded-full"
                        src="/eduport_r/assets/02-Dm08lEkH.jpg"
                        alt="avatar"
                      />
                    </li>
                    <li className="avatar avatar-sm">
                      <img
                        className="avatar-img rounded-full"
                        src="/eduport_r/assets/03-gME39Lw5.jpg"
                        alt="avatar"
                      />
                    </li>
                    <li className="avatar avatar-sm">
                      <img
                        className="avatar-img rounded-full"
                        src="/eduport_r/assets/04-Axz2kzOk.jpg"
                        alt="avatar"
                      />
                    </li>
                  </ul>
                  <p className="mb-0 text-sm font-light sm:ml-3">
                    4k+ Students joined us, now it's your turn.
                  </p>
                </div>
              </div>
            </div>
            <div className="w-full lg:w-1/2 mx-auto flex items-center justify-center">
              <SignInFormHandler />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
