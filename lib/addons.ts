import { supabase } from "./supabase";

export async function getAddons(menuItemId: number) {
  const { data, error } = await supabase
    .from("addons")
    .select("*")
    .eq("menu_item_id", menuItemId)
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
