"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import AdminSidebar from "@/components/admin/AdminSidebar";
import AdminNavbar from "@/components/admin/AdminNavbar";
import AdminRealtime from "@/components/admin/AdminRealtime";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/admin/login");
        return;
      }

      if (user.email !== "berlinbiju.model@gmail.com") {
        await supabase.auth.signOut();
        router.replace("/admin/login");
        return;
      }

      setLoading(false);
    }

    checkUser();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-2xl">
        Loading...
      </div>
    );
  }

  return (
    <div className="bg-black text-white">
      <AdminSidebar />

      <div className="ml-72">
        <AdminNavbar />
        <AdminRealtime />

        <main className="pt-20 min-h-screen overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
