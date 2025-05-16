import { auth } from "@/auth";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function OrderUserDetailsCard() {
  const currentuser = await auth();
  const user = currentuser?.user;
  if (!user) return redirect("/");
  const { name, email, image } = user;
  return (
    <div>
      <section className="p-2 shadow-sm w-full">
        <div className="w-fit mx-auto">
          {image && (
            <Image
              src={image}
              alt="profile pic"
              width={100}
              height={100}
              className="rounded-full w-28 h-28 object-cover"
            />
          )}
        </div>
        <div className="text-main-primary mt-2 space-y-2">
          <h2 className="text-center font-bold text-2xl tracking-wide capitalize">
            {name}
          </h2>
          <h6 className="text-center py-2 border-t border-neutral-400 border-dashed">
            {email}
          </h6>
        </div>
      </section>
    </div>
  );
}
