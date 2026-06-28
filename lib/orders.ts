import { supabase } from "./supabase";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(`
      *,
      customers (
        full_name,
        phone,
        address
      ),
      order_items (
        quantity,
        price,
        menu_items (
          name,
          image
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}