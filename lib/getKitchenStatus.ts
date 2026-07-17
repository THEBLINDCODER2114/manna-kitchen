import { supabase } from "./supabase";

export async function getKitchenStatus() {
  const { data, error } = await supabase
    .from("settings")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
