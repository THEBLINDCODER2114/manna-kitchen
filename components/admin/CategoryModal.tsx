"use client";

import { useEffect, useState } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  initialValue?: string;
  onClose: () => void;
  onSave: (name: string) => void;
};

export default function CategoryModal({
  isOpen,
  title,
  initialValue = "",
  onClose,
  onSave,
}: Props) {
  const [name, setName] = useState("");

  useEffect(() => {
    setName(initialValue);
  }, [initialValue, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-md rounded-3xl bg-zinc-900 border border-zinc-800 p-8">
        <h2 className="text-3xl font-bold mb-6">{title}</h2>

        <label className="block mb-2 text-gray-400">Category Name</label>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Burgers"
          className="w-full rounded-xl bg-zinc-800 border border-zinc-700 p-4 outline-none focus:border-orange-500"
        />

        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl bg-zinc-700 hover:bg-zinc-600"
          >
            Cancel
          </button>

          <button
            onClick={() => onSave(name)}
            className="px-5 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 font-bold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
