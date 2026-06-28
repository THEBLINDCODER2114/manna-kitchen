type Props = {
  order: any;
};

export default function OrderCard({ order }: Props) {
  return (
    <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 hover:border-orange-500 transition">

      {/* Header */}
      <div className="flex justify-between items-start">

        <div>
          <h2 className="text-2xl font-bold">
            Order #{order.id}
          </h2>

          <p className="text-gray-400 mt-1">
            {new Date(order.created_at).toLocaleString()}
          </p>
        </div>

        <span className="bg-yellow-500 text-black px-4 py-2 rounded-full font-bold">
          {order.status}
        </span>

      </div>

      {/* Customer */}

      <div className="mt-6">

        <h3 className="font-bold text-lg">
          👤 {order.customers?.full_name}
        </h3>

        <p className="text-gray-400">
          📞 {order.customers?.phone}
        </p>

        <p className="text-gray-400 mt-1">
          📍 {order.customers?.address}
        </p>

      </div>

      {/* Items */}

      <div className="mt-6 space-y-2">

        {order.order_items?.map((item: any) => (

          <div
            key={item.id}
            className="flex justify-between"
          >
            <span>
              {item.quantity} × {item.menu_items?.name}
            </span>

            <span>
              ₹{item.price}
            </span>

          </div>

        ))}

      </div>

      {/* Footer */}

      <div className="flex justify-between items-center mt-8 border-t border-zinc-700 pt-6">

        <h2 className="text-2xl font-black">
          ₹{order.total}
        </h2>

        <div className="flex gap-3">

          <button className="bg-green-600 hover:bg-green-500 px-5 py-3 rounded-xl font-bold">
            Accept
          </button>

          <button className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-xl font-bold">
            Reject
          </button>

        </div>

      </div>

    </div>
  );
}