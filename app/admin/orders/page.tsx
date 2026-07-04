"use client";

import { useEffect, useState } from "react";
import { getAllOrders } from "@/lib/orders";
import OrderCard from "@/components/admin/OrderCard";

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [newOrders, setNewOrders] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      const data = await getAllOrders();

      setOrders(data);
      setLoading(false);
    }

    loadOrders();

    const handleNewOrder = async (event: Event) => {
  const orderId = (event as CustomEvent).detail;

  console.log("Received new-order event:", orderId);

  const data = await getAllOrders();

  console.log("Latest order:", data[0]?.id);

  setOrders(data);

  setNewOrders((prev) => {
    const updated = prev.includes(orderId)
      ? prev
      : [...prev, orderId];

    console.log("newOrders will become:", updated);

    return updated;
  });
};

    window.addEventListener("new-order", handleNewOrder);

    return () => {
      window.removeEventListener("new-order", handleNewOrder);
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Loading Orders...</div>;
  }

  return (
    <div className="p-8">
      <div className="mb-10">
        <h1 className="text-4xl font-black">📦 Orders</h1>

        <p className="text-gray-400 mt-2">Manage all customer orders.</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-20 text-center">
          <div className="text-7xl">📦</div>

          <h2 className="text-3xl font-bold mt-6">No Orders Yet</h2>

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
              isNew={newOrders.includes(order.id)}
              onStatusChange={(newStatus) => {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === order.id ? { ...o, status: newStatus } : o,
                  ),
                );

                // Remove NEW highlight only when the order leaves Pending
                if (newStatus === "Accepted" || newStatus === "Rejected") {
                  setNewOrders((prev) => prev.filter((id) => id !== order.id));
                }
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
