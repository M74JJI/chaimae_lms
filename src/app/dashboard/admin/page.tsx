import { auth } from "@/auth";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Admin Dashboard",
};
export default async function AdminDashboard() {
  const data = await auth();
  return <div>admin</div>;
}
