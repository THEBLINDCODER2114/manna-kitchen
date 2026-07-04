import { supabase } from "./supabase";

export async function updateOrderStatus(orderId: number, status: string) {
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}
