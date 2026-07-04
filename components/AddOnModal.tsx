"use client";

import { useState, useEffect } from "react";
import { getAddons } from "@/lib/addons";

type Addon = {
  name: string;
  price: number;
};

type Props = {
  item: any;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (item: any) => void;
};

export default function AddOnModal({
  item,
  isOpen,
  onClose,
  onConfirm,
}: Props) {
  const [addons, setAddons] = useState<Addon[]>([]);
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    async function loadAddons() {
      if (!item) return;

      const data = await getAddons(item.id);

      console.log("Loaded Addons:", data);

      setAddons(data);
      setSelectedAddons([]);
    }

    loadAddons();
  }, [item]);

  if (!isOpen || !item) return null;

  const toggleAddon = (addon: Addon) => {
    const exists = selectedAddons.find((a) => a.name === addon.name);

    if (exists) {
      setSelectedAddons(selectedAddons.filter((a) => a.name !== addon.name));
    } else {
      setSelectedAddons([...selectedAddons, addon]);
    }
  };

  const addonTotal = selectedAddons.reduce(
    (sum, addon) => sum + addon.price,
    0,
  );

  const basePrice =
    item.selectedPrice ||
    item.price ||
    (item.bucketSize === "6" ? item.price6 : item.price4) ||
    0;

  const finalPrice = basePrice + addonTotal;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-zinc-900 border border-orange-500 rounded-2xl p-6 w-[90%] max-w-md">
        <div className="mb-4">
          <h2 className="text-2xl font-bold">{item.name}</h2>

          {item.name === "Chicken Bucket" && (
            <p className="text-gray-400">
              {item.bucketSize === "6" ? "6 PCS Bucket" : "4 PCS Bucket"}
            </p>
          )}
        </div>

        <p className="text-orange-400 mb-4">Base Price ₹{basePrice}</p>

        <div className="space-y-3">
          {addons.map((addon: Addon, index: number) => (
            <label key={index} className="flex justify-between items-center">
              <div>
                <input
                  type="checkbox"
                  className="mr-2"
                  onChange={() => toggleAddon(addon)}
                />
                {addon.name}
              </div>

              <span>+₹{addon.price}</span>
            </label>
          ))}
        </div>

        <div className="mt-5 text-xl font-bold text-orange-400">
          Total ₹{finalPrice}
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={() => {
              setSelectedAddons([]);
              onClose();
            }}
            className="flex-1 bg-zinc-700 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              setAdded(true);

              const upgraded = selectedAddons.some(
                (addon) => addon.name === "Upgrade to 6 PCS",
              );

              onConfirm({
                ...item,

                ...(item.name === "Chicken Bucket" && {
                  bucketType: upgraded ? "6 PCS" : "4 PCS",
                }),

                addonsSelected: selectedAddons,
                price: finalPrice,
              });

              setTimeout(() => {
                setSelectedAddons([]);
                setAdded(false);
                onClose();
              }, 1000);
            }}
            className={`
    flex-1
    py-3
    rounded-xl
    font-bold
    transition-all
    duration-300

    ${added ? "bg-green-500 scale-105" : "bg-orange-500"}
  `}
          >
            {added ? "✓ Added To Cart" : "Add To Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}
