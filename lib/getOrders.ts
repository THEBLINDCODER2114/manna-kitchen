import { supabase } from "./supabase";

export async function getOrderById(orderId: number) {
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
    .eq("id", orderId)
    .single();

  if (error) {
    console.error(error);
    return null;
  }

  return data;
}
