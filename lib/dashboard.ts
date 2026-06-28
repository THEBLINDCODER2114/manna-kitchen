import { supabase } from "./supabase";

export async function getDashboardStats() {
  const [{ count: menuCount }, { count: customerCount }, { count: orderCount }] =
    await Promise.all([
      supabase
        .from("menu_items")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("customers")
        .select("*", { count: "exact", head: true }),

      supabase
        .from("orders")
        .select("*", { count: "exact", head: true }),
    ]);

  const { data: orders } = await supabase
    .from("orders")
    .select("total");

  const totalSales =
    orders?.reduce(
      (sum: number, order: any) => sum + Number(order.total || 0),
      0
    ) || 0;

  return {
    totalSales,
    orderCount: orderCount || 0,
    customerCount: customerCount || 0,
    menuCount: menuCount || 0,
  };
}