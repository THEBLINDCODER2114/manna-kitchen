"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type KitchenSettings = {
  kitchen_open: boolean;
  closing_message: string;
};

export function useKitchenStatus() {
  const [settings, setSettings] = useState<KitchenSettings | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadSettings() {
    const { data, error } = await supabase
      .from("settings")
      .select("kitchen_open, closing_message")
      .eq("id", 1)
      .single();

    if (!error) {
      setSettings(data);
    }

    setLoading(false);
  }

  useEffect(() => {
    loadSettings();

    const channel = supabase
      .channel("kitchen-status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "settings",
        },
        (payload) => {
          console.log("Kitchen Status Changed:", payload);
          loadSettings();
        },
      )
      .subscribe((status) => {
        console.log("Kitchen Realtime:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return {
    settings,
    loading,
  };
}
