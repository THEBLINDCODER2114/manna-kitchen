"use client";

import { useState, useEffect } from "react";

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
  const [selectedAddons, setSelectedAddons] = useState<Addon[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setSelectedAddons([]);
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

  const basePrice = item.price || item.price4 || 0;

  const finalPrice = basePrice + addonTotal;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[100]">
      <div className="bg-zinc-900 border border-orange-500 rounded-2xl p-6 w-[90%] max-w-md">
        <h2 className="text-2xl font-bold mb-4">{item.name}</h2>

        <p className="text-orange-400 mb-4">Base Price ₹{basePrice}</p>

        <div className="space-y-3">
          {item.addons?.map((addon: Addon, index: number) => (
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

              onConfirm({
                ...item,
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
