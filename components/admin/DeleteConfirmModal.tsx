"use client";

import { useState } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  hasItems?: boolean;

  onCancel: () => void;
  onMove: () => void;
  onDelete: () => void;
};

export default function DeleteConfirmModal({
  isOpen,
  title,
  message,
  hasItems = false,
  onCancel,
  onMove,
  onDelete,
}: Props) {
  if (!isOpen) {
    return null;
  }
  const [confirmDelete, setConfirmDelete] = useState(false);

  return (
    <div className="fixed inset-0 z-[9999] bg-black/70 flex items-center justify-center">
      <div className="w-full max-w-lg rounded-3xl border border-zinc-800 bg-zinc-900 p-8">
        <div className="text-6xl text-center">🗑️</div>

        <h2 className="mt-5 text-center text-3xl font-bold">{title}</h2>

        <p className="mt-4 text-center text-gray-400 whitespace-pre-line">
          {message}
        </p>

        <div className="mt-8 space-y-3">
          <button
            onClick={() => {
              setConfirmDelete(false);
              onCancel();
            }}
            className="w-full rounded-xl bg-zinc-700 py-3 font-bold hover:bg-zinc-600"
          >
            Cancel
          </button>

          {hasItems && (
            <button
              onClick={onMove}
              className="w-full rounded-xl bg-yellow-600 py-3 font-bold hover:bg-yellow-500"
            >
              📦 Move Items to Uncategorized & Delete Category
            </button>
          )}

          <>
            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="w-full rounded-xl bg-red-600 py-3 font-bold hover:bg-red-500"
              >
                🗑 Delete Category + All Menu Items
              </button>
            ) : (
              <div className="rounded-xl border border-red-500 bg-red-500/10 p-4">
                <p className="text-center text-red-400 font-semibold">
                  ⚠ This will permanently delete the category and ALL menu
                  items.
                </p>

                <div className="mt-4 flex gap-3">
                  <button
                    onClick={() => setConfirmDelete(false)}
                    className="flex-1 rounded-xl bg-zinc-700 py-3 font-bold"
                  >
                    Cancel
                  </button>

                  <button
                    onClick={onDelete}
                    className="flex-1 rounded-xl bg-red-600 py-3 font-bold hover:bg-red-500"
                  >
                    YES, DELETE EVERYTHING
                  </button>
                </div>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}
