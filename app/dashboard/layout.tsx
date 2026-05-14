import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "@/components/layout/dashboard-client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (process.env.NEXT_PUBLIC_DEMO_MODE !== "true") {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");
    return <DashboardClient user={user}>{children}</DashboardClient>;
  }

  // Demo mode: fake user, no Supabase auth
  const demoUser = { id: "demo", email: "demo@local", user_metadata: { full_name: "Demo" } } as never;
  return <DashboardClient user={demoUser}>{children}</DashboardClient>;
}
