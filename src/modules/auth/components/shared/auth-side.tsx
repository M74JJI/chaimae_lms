import VectorImg from "@/public/assets/vectors/elearn_live.svg";
import Image from "next/image";
import { user_images } from "@/lib/data";

export default function AuthSide() {
  return (
    <div className="w-full lg:w-1/2 md:flex items-center justify-center bg-blue-500/10 lg:h-screen">
      <div className="p-3 lg:p-5">
        <div className="text-center max-w-sm mx-auto">
          <h2 className="font-bold text-3xl">
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
          <ul className="mb-2 sm:mb-0 flex space-x-2">
            {user_images.map((img, i) => (
              <li
                className="w-9 h-9 rounded-full overflow-hidden border-4 border-white"
                key={img.id}
                style={{ transform: `translateX(-${15 * i}px)` }}
              >
                <Image
                  src={img.image}
                  alt="user img"
                  className="rounded-full"
                />
              </li>
            ))}
          </ul>
          <p className="mb-0 text-sm font-light -ml-8">
            4k+ Students joined us, now it's your turn.
          </p>
        </div>
      </div>
    </div>
  );
}
