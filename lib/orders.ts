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

export async function getTodayOrders() {
  const now = new Date();

  const today =
    now.getFullYear() +
    "-" +
    String(now.getMonth() + 1).padStart(2, "0") +
    "-" +
    String(now.getDate()).padStart(2, "0");

  const { data, error } = await supabase
    .from("orders")
    .select(
      `
      *,
      customers (
        full_name,
        phone,
        address,
        landmark
      )
    `,
    )
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}
