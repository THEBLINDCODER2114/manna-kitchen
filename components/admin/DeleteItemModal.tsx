"use client";

type Props = {
  isOpen: boolean;
  item: any;
  onClose: () => void;
  onDelete: () => void;
};

export default function DeleteItemModal({
  isOpen,
  item,
  onClose,
  onDelete,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[9999]">
      <div className="bg-zinc-900 rounded-3xl p-8 w-[450px] border border-red-500">

        <h2 className="text-3xl font-black text-red-500 mb-5">
          🗑 Delete Menu Item
        </h2>

        <p className="text-gray-300">
          Are you sure you want to delete
        </p>

        <p className="text-xl font-bold mt-4">
          "{item?.name}"
        </p>

        <p className="text-red-400 mt-6">
          This action cannot be undone.
        </p>

        <div className="flex justify-end gap-4 mt-10">

          <button
            onClick={onClose}
            className="bg-zinc-700 px-5 py-3 rounded-xl"
          >
            Cancel
          </button>

          <button
            onClick={onDelete}
            className="bg-red-600 hover:bg-red-500 px-5 py-3 rounded-xl font-bold"
          >
            Delete
          </button>

        </div>

      </div>
    </div>
  );
}