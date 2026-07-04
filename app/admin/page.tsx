"use client";

import { useEffect, useState } from "react";
import DashboardCard from "@/components/admin/DashboardCard";
import { getDashboardStats } from "@/lib/dashboard";

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

useEffect(() => {
  async function loadStats() {
    const data = await getDashboardStats();
    setStats(data);
  }

  loadStats();
}, []);
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-black text-white">Dashboard</h1>

        <p className="text-gray-400 mt-2">
          Welcome back! Here's an overview of your restaurant.
        </p>
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
        <DashboardCard title="Today's Sales" value={`₹${stats.totalSales}`} icon="💰" />

        <DashboardCard title="Orders" value={stats.orderCount.toString()} icon="📦"/>

        <DashboardCard title="Customers" value={stats.customerCount.toString()} icon="👥" />

        <DashboardCard title="Menu Items" value={stats.menuCount.toString()} icon="🍔"/>
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
