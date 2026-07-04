import { supabase } from "./supabase";

export async function getAllOrders() {
  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers (
  full_name,
  phone,
  address,
  landmark,
  latitude,
  longitude
),
      order_items (
  id,
  quantity,
  price,
  bucket_type,
  addons,
  menu_items (
    name,
    image
  )
)
    `,
    )
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
