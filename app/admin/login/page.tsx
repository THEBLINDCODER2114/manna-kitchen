"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function AdminLogin() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function login() {
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      toast.error(error.message);
      return;
    }

    toast.success("Welcome back!");

    router.push("/admin");
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8">

        <h1 className="text-4xl font-black text-orange-500 mb-8 text-center">
          MANNA KITCHEN
        </h1>

        <h2 className="text-2xl font-bold text-center mb-8">
          Admin Login
        </h2>

        <div className="space-y-5">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-4 outline-none border border-zinc-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 p-4 outline-none border border-zinc-700"
          />

          <button
            onClick={login}
            disabled={loading}
            className="w-full rounded-xl bg-orange-500 py-4 font-bold hover:bg-orange-400 disabled:opacity-60"
          >
            {loading ? "Signing In..." : "Login"}
          </button>

        </div>

      </div>
    </div>
  );
}