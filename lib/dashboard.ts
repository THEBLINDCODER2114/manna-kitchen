import { supabase } from "./supabase";

export async function getDashboardStats() {
  const startOfToday = new Date();
startOfToday.setHours(0, 0, 0, 0);

const endOfToday = new Date();
endOfToday.setHours(23, 59, 59, 999);

  const [
    { count: menuCount },
    { count: customerCount },
    { count: orderCount },
  ] = await Promise.all([
    supabase.from("menu_items").select("*", { count: "exact", head: true }),

    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString())
.lte("created_at", endOfToday.toISOString()),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", startOfToday.toISOString())
.lte("created_at", endOfToday.toISOString()),
  ]);

  const { data: orders } = await supabase
  .from("orders")
  .select("total, status")
  .gte("created_at", startOfToday.toISOString())
.lte("created_at", endOfToday.toISOString());

  const totalSales =
    orders?.reduce(
      (sum: number, order: any) => sum + Number(order.total ?? 0),
      0,
    ) ?? 0;

    const pendingCount =
    orders?.filter((o) => o.status === "Pending").length ?? 0;

  const acceptedCount =
    orders?.filter((o) => o.status === "Accepted").length ?? 0;

  const preparingCount =
    orders?.filter((o) => o.status === "Preparing").length ?? 0;

  const outForDeliveryCount =
    orders?.filter((o) => o.status === "Out For Delivery").length ?? 0;

  const deliveredCount =
    orders?.filter((o) => o.status === "Delivered").length ?? 0;

  const rejectedCount =
    orders?.filter((o) => o.status === "Rejected").length ?? 0;

  return {
    totalSales,

    orderCount: orderCount ?? 0,
    customerCount: customerCount ?? 0,
    menuCount: menuCount ?? 0,

    pendingCount,
    acceptedCount,
    preparingCount,
    outForDeliveryCount,
    deliveredCount,
    rejectedCount,
  };
}
