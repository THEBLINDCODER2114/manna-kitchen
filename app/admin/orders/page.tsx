"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/orders";
import OrderCard from "@/components/admin/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const data = await getAllOrders();

      setOrders(data);
      setLoading(false);
    }

    loadOrders();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-white">
        Loading Orders...
      </div>
    );
  }

  return (
    <div className="p-8">

      <div className="mb-10">

        <h1 className="text-4xl font-black">
          📦 Orders
        </h1>

        <p className="text-gray-400 mt-2">
          Manage all customer orders.
        </p>

      </div>

      {orders.length === 0 ? (

        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-20 text-center">

          <div className="text-7xl">
            📦
          </div>

          <h2 className="text-3xl font-bold mt-6">
            No Orders Yet
          </h2>

          <p className="text-gray-500 mt-3">
            New customer orders will appear here.
          </p>

        </div>

      ) : (

        <div className="space-y-8">

          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}

        </div>

      )}

    </div>
  );
}