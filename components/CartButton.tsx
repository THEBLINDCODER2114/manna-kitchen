"use client";

type Props = {
  count: number;
  onClick: () => void;
};

export default function CartButton({
  count,
  onClick,
}: Props) {
  return (
    <button
      onClick={onClick}
      className="
      fixed
      bottom-6
      right-6
      bg-green-500
      hover:bg-green-600
      px-6
      py-4
      rounded-full
      font-bold
      shadow-xl
      z-50
      "
    >
      🛒 Cart ({count})
    </button>
  );
}