"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import { getDashboardStats } from "@/lib/dashboard";
import { getTodayOrders } from "@/lib/orders";
import { generateDailyReport } from "@/lib/generateDailyReport";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalSales: 0,

    orderCount: 0,
    customerCount: 0,
    menuCount: 0,

    pendingCount: 0,
    acceptedCount: 0,
    preparingCount: 0,
    outForDeliveryCount: 0,
    deliveredCount: 0,
    rejectedCount: 0,
  });

  async function loadStats() {
    const data = await getDashboardStats();
    setStats(data);
  }

  async function handleEndDaySales() {
    const confirmEnd = window.confirm("Generate today's sales report?");

    if (!confirmEnd) return;

    const orders = await getTodayOrders();

    generateDailyReport(stats, orders);

    toast.success("Daily Sales Report downloaded successfully!");
  }
  useEffect(() => {
    loadStats();

    const channel = supabase
      .channel("dashboard-live")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        () => {
          loadStats();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  return (
    <div className="p-8">
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black text-white">Dashboard</h1>

          <p className="text-gray-400 mt-2">
            Welcome back! Here's an overview of our restaurant.
          </p>
        </div>

        <button
          onClick={handleEndDaySales}
          className="
      bg-orange-500
      hover:bg-orange-400
      px-6
      py-4
      rounded-2xl
      font-bold
      transition
    "
        >
          📄 End Day Sales
        </button>
      </div>

      <div
        className="
        grid
        grid-cols-1
        sm:grid-cols-2
        xl:grid-cols-4
        gap-6
        "
      >
        <DashboardCard
          title="Today's Sales"
          value={`₹${stats.totalSales}`}
          icon="💰"
        />

        <DashboardCard
          title="Orders"
          value={stats.orderCount.toString()}
          icon="📦"
        />

        <DashboardCard
          title="Customers"
          value={stats.customerCount.toString()}
          icon="👥"
        />

        <DashboardCard
          title="Menu Items"
          value={stats.menuCount.toString()}
          icon="🍔"
        />
      </div>
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-white mb-6">
          📦 Today's Order Status
        </h2>

        <div
          className="
      grid
      grid-cols-2
      md:grid-cols-3
      xl:grid-cols-6
      gap-6
    "
        >
          <DashboardCard
            title="Pending"
            value={stats.pendingCount.toString()}
            icon="⏳"
          />

          <DashboardCard
            title="Accepted"
            value={stats.acceptedCount.toString()}
            icon="✅"
          />

          <DashboardCard
            title="Preparing"
            value={stats.preparingCount.toString()}
            icon="👨‍🍳"
          />

          <DashboardCard
            title="Out For Delivery"
            value={stats.outForDeliveryCount.toString()}
            icon="🛵"
          />

          <DashboardCard
            title="Delivered"
            value={stats.deliveredCount.toString()}
            icon="🎉"
          />

          <DashboardCard
            title="Rejected"
            value={stats.rejectedCount.toString()}
            icon="❌"
          />
        </div>
      </div>
    </div>
  );
}
