type Props = {
  item: any;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
};

export default function MenuItemCard({ item, onEdit, onDelete }: Props) {
  return (
    <div
      className="
      bg-zinc-900
      rounded-3xl
      overflow-hidden
      border
      border-zinc-800
      hover:border-orange-500
      transition-all
      duration-300
      hover:scale-[1.02]
      "
    >
      <img
        src={item.image}
        className="
        w-full
        h-56
        object-cover
        "
      />

      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl">{item.name}</h2>

            <p className="text-gray-400 mt-1">{item.category}</p>
          </div>

          <span
            className="
            bg-orange-500
            px-3
            py-1
            rounded-full
            text-sm
            "
          >
            ₹{item.price}
          </span>
        </div>

        {item.badge && (
          <div className="mt-4">
            <span
              className="
              bg-yellow-600
              px-3
              py-1
              rounded-full
              text-sm
              "
            >
              {item.badge}
            </span>
          </div>
        )}

        <div className="mt-5">
          {item.available ? (
            <span className="text-green-500">🟢 Available</span>
          ) : (
            <span className="text-red-500">🔴 Sold Out</span>
          )}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => onEdit(item)}
            className="
  flex-1
  bg-blue-500
  hover:bg-blue-600
  py-3
  rounded-xl
  font-bold
  "
          >
            ✏ Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete(item)}
            className="
  bg-red-500
  hover:bg-red-600
  px-4
  rounded-xl
  "
          >
            🗑
          </button>
        </div>
      </div>
    </div>
  );
}
