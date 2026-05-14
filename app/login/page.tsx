import { redirect } from "next/navigation";
import LoginForm from "@/components/layout/login-form";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === "true") {
    redirect("/dashboard");
  }
  return <LoginForm />;
}
