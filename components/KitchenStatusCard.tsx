"use client";

import { useEffect, useState } from "react";
import { getKitchenStatus } from "@/lib/getKitchenStatus";
import { updateKitchenStatus } from "@/lib/updateKitchenStatus";

export default function KitchenStatusCard() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [kitchenOpen, setKitchenOpen] = useState(true);
  const [closingMessage, setClosingMessage] = useState("");

  async function loadStatus() {
    setLoading(true);

    const data = await getKitchenStatus();

    if (data) {
      setKitchenOpen(data.kitchen_open);
      setClosingMessage(data.closing_message ?? "");
    }

    setLoading(false);
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function saveStatus(open: boolean) {
    setSaving(true);

    const success = await updateKitchenStatus(
      open,
      open ? "" : closingMessage
    );

    if (success) {
      setKitchenOpen(open);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
        Loading Kitchen Status...
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 rounded-3xl p-6 border border-zinc-800">
      <h2 className="text-2xl font-bold mb-6">
        🍳 Kitchen Status
      </h2>

      <div className="flex items-center justify-between">

        <div>
          <p
            className={`text-2xl font-bold ${
              kitchenOpen ? "text-green-500" : "text-red-500"
            }`}
          >
            {kitchenOpen ? "🟢 OPEN" : "🔴 CLOSED"}
          </p>

          <p className="text-gray-400 mt-2">
            {kitchenOpen
              ? "Customers can place orders."
              : "Customers cannot place orders."}
          </p>
        </div>

        <button
          disabled={saving}
          onClick={() => saveStatus(!kitchenOpen)}
          className={`px-6 py-3 rounded-xl font-bold transition ${
            kitchenOpen
              ? "bg-red-600 hover:bg-red-500"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {saving
            ? "Saving..."
            : kitchenOpen
            ? "Turn OFF"
            : "Turn ON"}
        </button>
      </div>

      {!kitchenOpen && (
        <div className="mt-6">
          <label className="block mb-2 font-semibold">
            Closing Message
          </label>

          <textarea
            value={closingMessage}
            onChange={(e) =>
              setClosingMessage(e.target.value)
            }
            placeholder="We'll be back soon ❤️"
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-3"
          />

          <button
            disabled={saving}
            onClick={() =>
              saveStatus(false)
            }
            className="mt-4 bg-orange-600 hover:bg-orange-500 px-5 py-3 rounded-xl font-bold"
          >
            Save Message
          </button>
        </div>
      )}
    </div>
  );
}