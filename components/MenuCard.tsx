"use client";

import { useState } from "react";
import ProductModal from "./ProductModal";

type MenuItem = {
  name: string;
  image: string;
  type: string;
  price?: number;
  price4?: number;
  price6?: number;
  badge?: string;
  available: boolean;
};

type Props = {
  item: MenuItem;
  onAdd: (item: any) => void;
};

export default function MenuCard({ item, onAdd }: Props) {
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const [added, setAdded] = useState(false);

  return (
    <>
      <div className="relative">
        {!item.available && (
          <div className="absolute inset-0 z-20 rounded-3xl bg-zinc-900/70 backdrop-blur-[1px] flex items-center justify-center">
            <div className="bg-red-600 px-6 py-3 rounded-2xl text-xl font-black shadow-xl">
              🔴 SOLD OUT
            </div>
          </div>
        )}

        <div
          onClick={() => {
            if (item.available) {
              setSelectedItem(item);
            }
          }}
          className={`
      rounded-3xl
      overflow-hidden
      border
      transition-all
      duration-300

      ${
        item.available
          ? `
            cursor-pointer
            bg-zinc-900
            border-orange-500
            shadow-xl shadow-orange-500/10
            hover:scale-105
          `
          : `
            cursor-not-allowed
            bg-zinc-800
            border-zinc-700
            grayscale
            opacity-50
          `
      }

      ${added ? "shadow-[0_0_30px_rgba(34,197,94,0.8)] scale-[1.02]" : ""}
    `}
        >
          <img
            src={item.image}
            alt={item.name}
            className="
            w-full
            h-56 md:h-72
            object-cover
            cursor-pointer
            transition-all
            duration-500
          "
          />

          <div className="p-5">
            <div className="mb-3">
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

            <h3 className="text-lg md:text-xl font-bold">{item.name}</h3>

            <p
              className={`text-xl md:text-2xl font-bold mt-4 ${
                item.available ? "text-orange-400" : "text-gray-400"
              }`}
            >
              ₹{item.price}
            </p>
          </div>
        </div>
      </div>

      <ProductModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={(updatedItem) => {
          setSelectedItem(null);
          onAdd(updatedItem);
        }}
      />
    </>
  );
}
