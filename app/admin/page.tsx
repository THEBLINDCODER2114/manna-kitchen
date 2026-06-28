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

        <DashboardCard title="Orders" value={stats.orderCount.toString()} icon="📦" />

        <DashboardCard title="Customers" value={stats.customerCount.toString()} icon="👥" />

        <DashboardCard title="Menu Items" value={stats.menuCount.toString()} icon="🍔" />
      </div>
    </div>
  );
}
