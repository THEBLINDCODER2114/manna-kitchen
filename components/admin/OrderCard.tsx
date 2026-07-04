"use client";

import { useState } from "react";
import { updateOrderStatus } from "@/lib/updateOrderStatus";
import { getWhatsappMessage } from "@/lib/getWhatsappMessage";

type Props = {
  order: any;
  isNew: boolean;
  onStatusChange: (status: string) => void;
};

const statusFlow: Record<
  string,
  {
    next: string;
    button: string;
  }
> = {
  Pending: {
    next: "Accepted",
    button: "Accept Order",
  },
  Accepted: {
    next: "Preparing",
    button: "Start Preparing",
  },
  Preparing: {
    next: "Out For Delivery",
    button: "Out For Delivery",
  },
  "Out For Delivery": {
    next: "Delivered",
    button: "Mark Delivered",
  },
};

export default function OrderCard({ order, isNew, onStatusChange }: Props) {
  const [updating, setUpdating] = useState(false);
  const whatsappMessage = getWhatsappMessage(order, order.status);

  const phone = `91${(order.customers?.phone ?? "").replace(/\D/g, "")}`;

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(
    whatsappMessage,
  )}`;
  return (
    <div
      className={`
    relative
    bg-zinc-900
    rounded-3xl
    p-6
    transition-all
    duration-300

    ${
      isNew
        ? "border-2 border-orange-500 shadow-[0_0_25px_rgba(249,115,22,0.6)] animate-pulse"
        : "border border-zinc-800 hover:border-orange-500"
    }
  `}
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        {isNew && (
          <div className="absolute -top-3 -right-3 bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            🆕 NEW
          </div>
        )}
        <div>
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>

          <p className="text-gray-400 mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <span
          className={`
    px-4
    py-2
    rounded-full
    font-bold

    ${
      order.status === "Pending"
        ? "bg-yellow-500 text-black"
        : order.status === "Accepted"
          ? "bg-blue-500 text-white"
          : order.status === "Preparing"
            ? "bg-orange-500 text-white"
            : order.status === "Out For Delivery"
              ? "bg-purple-500 text-white"
              : "bg-green-600 text-white"
    }
  `}
        >
          {order.status}
        </span>
      </div>

      {/* Customer */}

      <div className="mt-6 bg-zinc-800 rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-xl font-bold">
              👤 {order.customers?.full_name}
            </h3>

            <p className="text-gray-400 mt-2">📞 {order.customers?.phone}</p>

            <p className="text-gray-400 mt-2">📍 {order.customers?.address}</p>

            {order.customers?.landmark && (
              <p className="text-gray-500 mt-1">
                🏠 {order.customers.landmark}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-5">
          {/* CALL */}

          <a
            href={`tel:${order.customers?.phone}`}
            className="
      bg-green-600
      hover:bg-green-500
      rounded-xl
      py-3
      text-center
      font-semibold
      transition
      "
          >
            📞 Call
          </a>

          {/* WHATSAPP */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="
    bg-emerald-600
    hover:bg-emerald-500
    rounded-xl
    py-3
    text-center
    font-semibold
    transition
  "
          >
            💬 Notify Customer
          </a>

          {/* GOOGLE MAPS */}

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
              `${order.customers?.address} ${order.customers?.landmark || ""}`,
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="
      bg-blue-600
      hover:bg-blue-500
      rounded-xl
      py-3
      text-center
      font-semibold
      transition
      "
          >
            🧭 Get Directions
          </a>
        </div>
      </div>

      {/* Items */}

      <div className="mt-6 space-y-2">
        {order.order_items?.map((item: any) => (
          <div
            key={item.id}
            className="flex justify-between items-start border-b border-zinc-800 pb-4"
          >
            <div className="flex-1">
              <p className="font-semibold text-lg">
                {item.quantity} × {item.menu_items?.name}
              </p>

              {item.bucket_type && (
                <p className="text-sm text-orange-400 mt-1">
                  🍗 {item.bucket_type}
                </p>
              )}

              {item.addons?.length > 0 && (
                <div className="mt-2 space-y-1">
                  {item.addons.map((addon: any) => (
                    <p key={addon.name} className="text-sm text-gray-400">
                      ➕ {addon.name}
                    </p>
                  ))}
                </div>
              )}
            </div>

            <div className="ml-6 text-right">
              <p className="text-xl font-bold text-orange-400">₹{item.price}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer */}

      <div className="flex justify-between items-center mt-8 border-t border-zinc-700 pt-6">
        <h2 className="text-2xl font-black">₹{order.total}</h2>

        <div className="flex gap-3">
          {order.status === "Pending" && (
            <>
              <button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);

                  const success = await updateOrderStatus(order.id, "Accepted");

                  if (success) {
                    onStatusChange("Accepted");
                  }

                  setUpdating(false);
                }}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
              >
                {updating ? "Updating..." : "✅ Accept Order"}
              </button>

              <button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);

                  const success = await updateOrderStatus(order.id, "Rejected");

                  if (success) {
                    onStatusChange("Rejected");
                  }

                  setUpdating(false);
                }}
                className="bg-red-600 hover:bg-red-500 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
              >
                ❌ Reject Order
              </button>
            </>
          )}

          {order.status !== "Pending" &&
            order.status !== "Delivered" &&
            order.status !== "Rejected" && (
              <button
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);

                  const nextStatus = statusFlow[order.status]?.next;

                  const success = await updateOrderStatus(order.id, nextStatus);

                  if (success) {
                    onStatusChange(nextStatus);
                  }

                  setUpdating(false);
                }}
                className="bg-green-600 hover:bg-green-500 disabled:opacity-50 px-5 py-3 rounded-xl font-bold"
              >
                {updating ? "Updating..." : statusFlow[order.status]?.button}
              </button>
            )}

          {order.status === "Delivered" && (
            <span className="bg-green-700 px-5 py-3 rounded-xl font-bold">
              ✅ Completed
            </span>
          )}

          {order.status === "Rejected" && (
            <span className="bg-red-700 px-5 py-3 rounded-xl font-bold">
              ❌ Rejected
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
