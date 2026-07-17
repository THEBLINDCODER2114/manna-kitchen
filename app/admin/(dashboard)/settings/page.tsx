import KitchenStatusCard from "@/components/KitchenStatusCard";

export default function SettingsPage() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-4xl font-black text-white">
          ⚙️ Settings
        </h1>

        <p className="text-gray-400 mt-2">
          Configure your restaurant preferences and operational settings.
        </p>
      </div>

      {/* Kitchen Settings */}
      <section>
        <h2 className="text-2xl font-bold text-white mb-4">
          🍳 Kitchen
        </h2>

        <KitchenStatusCard />
      </section>

      {/* Future Settings */}
      <section className="rounded-3xl border border-dashed border-zinc-700 p-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          🚀 Coming Soon
        </h2>

        <ul className="text-gray-400 space-y-2">
          <li>🏪 Restaurant Details</li>
          <li>🕒 Business Hours</li>
          <li>🚚 Delivery Charges</li>
          <li>💰 Minimum Order Amount</li>
          <li>💳 Payment Settings</li>
          <li>🔔 Notification Settings</li>
        </ul>
      </section>
    </div>
  );
}