import { useState } from "react";
import AddOnModal from "./AddOnModal";

type Props = {
  item: any;
  onClose: () => void;
  onAdd: (item: any) => void;
};

export default function ProductModal({ item, onClose, onAdd }: Props) {
  const [showAddOnModal, setShowAddOnModal] = useState(false);

  if (!item) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/80
      backdrop-blur-sm
      z-[99999]
      flex
      items-center
      justify-center
      p-4
      animate-fadeIn
    "
    >
      <div
        className="
        bg-zinc-900
        rounded-3xl
        overflow-hidden
        max-w-2xl
        w-full
        border
        border-orange-500
        shadow-2xl
        animate-scaleIn
        relative
      "
      >
        <img
          src={item.image}
          alt={item.name}
          className="
          w-full
          h-[280px]
          md:h-[400px]
          object-cover
          "
        />

        <button
          onClick={onClose}
          className="
          absolute
          top-4
          right-4
          w-10
          h-10
          rounded-full
          bg-black/70
          text-white
          text-xl
          "
        >
          ✕
        </button>

        <div className="p-6"> 
          <div className="flex items-center gap-3 mb-3">
            {item.type === "veg" ? (
              <span className="bg-green-900 px-3 py-1 rounded-full text-sm font-bold">
                🟢 Veg
              </span>
            ) : (
              <span className="bg-red-900 px-3 py-1 rounded-full text-sm font-bold">
                🔴 Non Veg
              </span>
            )}
            {item.badge && (
              <span className="ml-2 bg-orange-900 text-black px-3 py-1 rounded-full text-sm font-bold">
                {item.badge}
              </span>
            )}
          </div>

          <h2 className="text-3xl font-bold">{item.name}</h2>

          {item.name === "Chicken Bucket" && (
            <p className="text-gray-400 mt-2">
              {item.bucketSize === "6" ? "6 PCS Bucket" : "4 PCS Bucket"}
            </p>
          )}

          <p className="text-orange-400 text-2xl font-bold mt-2">
            ₹{item.selectedPrice || item.price}
          </p>

          <p className="text-gray-400 mt-4 leading-relaxed">
            {item.description ||
              "Delicious handcrafted item from Manna Kitchen."}
          </p>

          <button
            onClick={() => setShowAddOnModal(true)}
            className="
            w-full
            mt-6
            bg-orange-500
            hover:bg-orange-400
            py-4
            rounded-xl
            font-bold
            text-lg
            transition-all
            "
          >
            Add To Cart
          </button>
        </div>
      </div>
      <AddOnModal
        item={item}
        isOpen={showAddOnModal}
        onClose={() => setShowAddOnModal(false)}
        onConfirm={(updatedItem) => {
          setShowAddOnModal(false);
          onAdd(updatedItem);
          onClose();
        }}
      />
    </div>
  );
}
