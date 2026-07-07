"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AdminNavbar() {
  const router = useRouter();

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }
  return (
    <header
      className="
    fixed
    top-0
    left-0
    lg:left-72
    right-0
    h-20
    bg-black/95
    backdrop-blur-md
    border-b
    border-zinc-800
    z-40
    flex
    items-center
    justify-between
    px-4
    lg:px-8
  "
    >
      <button className="lg:hidden text-3xl">☰</button>
      <div className="flex items-center gap-6">
        <button className="text-2xl hover:scale-110 transition">🔔</button>

        <div className="flex items-center gap-3">
          <img
            src="/mannakitchensticker.png"
            alt="Admin"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <p className="font-bold">
              Berlin{" "}
              <button
                onClick={logout}
                className="
    bg-red-600
    hover:bg-red-500
    px-4
    py-2
    rounded-xl
    font-semibold
    transition
  "
              >
                Logout
              </button>
            </p>

            {/* <p className="text-gray-500 text-sm">Administrator</p> */}
          </div>
        </div>
      </div>
    </header>
  );
}
