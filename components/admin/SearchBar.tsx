type Props = {
  value: string;
  onChange: (value: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <div className="relative w-full md:w-96">
      <input
        type="text"
        placeholder="Search food..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          rounded-2xl
          bg-zinc-900
          border
          border-zinc-700
          px-5
          py-3
          pl-12
          pr-12
          outline-none
          focus:border-orange-500
        "
      />

      {/* Search Icon */}
      <span
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      >
        🔍
      </span>

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            w-7
            h-7
            rounded-full
            bg-zinc-700
            hover:bg-red-500
            text-white
            text-sm
            flex
            items-center
            justify-center
            transition-all
          "
        >
          ✕
        </button>
      )}
    </div>
  );
}