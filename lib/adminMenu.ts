import { supabase } from "./supabase";

export async function getAllMenuItems() {
  const { data, error } = await supabase
    .from("menu_items")
    .select("*")
    .order("category")
    .order("id");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
