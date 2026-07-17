import { supabase } from "./supabase";

export async function updatePaymentStatus(
  orderId: number,
  paymentStatus: "Pending" | "Paid"
) {
  const { error } = await supabase
    .from("orders")
    .update({
      payment_status: paymentStatus,
    })
    .eq("id", orderId);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}