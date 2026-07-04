"use client";

import { useEffect, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AdminRealtime() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Create audio once
  useEffect(() => {
    audioRef.current = new Audio("/new-order.mp3");
    audioRef.current.preload = "auto";
    audioRef.current.volume = 1;
  }, []);

  // Unlock audio after first click anywhere on the admin page
  useEffect(() => {
    const unlockAudio = () => {
      if (!audioRef.current) return;

      audioRef.current
        .play()
        .then(() => {
          audioRef.current?.pause();

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
          }
        })
        .catch(() => {});
    };

    window.addEventListener("pointerdown", unlockAudio, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlockAudio);
    };
  }, []);

  // Listen for new orders
  useEffect(() => {
    const channel = supabase
      .channel("admin-orders")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          console.log("Realtime event received");
          toast.success("🔔 New Order Received!");

          window.dispatchEvent(
            new CustomEvent("new-order", {
              detail: payload.new.id,
            }),
          );

          if (audioRef.current) {
            audioRef.current.currentTime = 0;
            audioRef.current.play().catch(() => {});
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return null;
}
