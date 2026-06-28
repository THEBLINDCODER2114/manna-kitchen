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
};

type Props = {
  item: MenuItem;
  onAdd: (item: any) => void;
};

export default function MenuCard({ item, onAdd }: Props) {
  // const isBucket = item.name === "Chicken Bucket";

  const [selectedItem, setSelectedItem] = useState<any>(null);

  // const [bucketSize, setBucketSize] = useState<"4" | "6">("4");

  const [added, setAdded] = useState(false);

  return (
    <>
      <div
        onClick={() => setSelectedItem(item)}
        className={`
      cursor-pointer
      bg-zinc-900
      border
      border-orange-500
      rounded-3xl
      overflow-hidden
      transition-all
      duration-300

          ${
            added
              ? "shadow-[0_0_30px_rgba(34,197,94,0.8)] scale-[1.02]"
              : "shadow-xl shadow-orange-500/10 hover:scale-105"
          }
        `}
      >
        <img
          onClick={() => setSelectedItem(item)}
          src={item.image}
          alt={item.name}
          className="
            w-full
            h-56 md:h-72
            object-cover
            cursor-pointer
            hover:scale-105
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

          {/* {isBucket && (
            <div className="flex gap-3 mt-4"> */}
          {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBucketSize("4");
                }}
                className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${
                  bucketSize === "4"
                    ? "bg-green-500 border-green-400 text-white scale-105"
                    : "bg-zinc-800 border-zinc-600 text-gray-300"
                }`}
              >
                4 PCS
              </button> */}

          {/* <button
                onClick={(e) => {
                  e.stopPropagation();
                  setBucketSize("6");
                }}
                className={`px-4 py-2 rounded-lg font-bold border-2 transition-all ${
                  bucketSize === "6"
                    ? "bg-green-500 border-green-400 text-white scale-105"
                    : "bg-zinc-800 border-zinc-600 text-gray-300"
                }`}
              >
                6 PCS
              </button> */}
          {/* </div>
          )} */}

          <p className="text-orange-400 text-xl md:text-2xl font-bold mt-4">
            ₹{item.price}
          </p>

          {/* <button
            onClick={() => {
              onAdd(item);

              setAdded(true);

              setTimeout(() => {
                setAdded(false);
              }, 1000);
            }}
            className={`
              w-full
              mt-4
              py-3
              rounded-xl
              font-bold
              transition-all
              duration-300

              ${
                added
                  ? "bg-green-500 scale-105"
                  : "bg-orange-500 hover:bg-orange-400"
              }
            `}
          >
            {added ? "✓ Added" : "Add To Cart"}
          </button> */}
        </div>
      </div>

      <ProductModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onAdd={() => {
          setSelectedItem(null);
          onAdd(item);
        }}
      />
    </>
  );
}
