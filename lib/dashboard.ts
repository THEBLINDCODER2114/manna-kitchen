import { supabase } from "./supabase";

export async function getDashboardStats() {
  const now = new Date();

const today =
  now.getFullYear() +
  "-" +
  String(now.getMonth() + 1).padStart(2, "0") +
  "-" +
  String(now.getDate()).padStart(2, "0");

  const [
    { count: menuCount },
    { count: customerCount },
    { count: orderCount },
  ] = await Promise.all([
    supabase.from("menu_items").select("*", { count: "exact", head: true }),

    supabase
      .from("customers")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),

    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .gte("created_at", `${today}T00:00:00`)
      .lte("created_at", `${today}T23:59:59`),
  ]);

  const { data: orders } = await supabase
    .from("orders")
    .select("total, status")
    .gte("created_at", `${today}T00:00:00`)
    .lte("created_at", `${today}T23:59:59`);

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
