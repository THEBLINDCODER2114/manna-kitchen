"use client";

export default function AdminNavbar() {
  return (
    <header
      className="
      fixed
      top-0
      left-72
      right-0
      h-20
      bg-black/95
      backdrop-blur-md
      border-b
      border-zinc-800
      z-40
      flex
      items-center
      justify-end
      px-8
      "
    >
      <div className="flex items-center gap-6">
        <button className="text-2xl hover:scale-110 transition">🔔</button>

        <div className="flex items-center gap-3">
          <img
            src="/mannakitchensticker.png"
            alt="Admin"
            className="w-12 h-12 rounded-full"
          />

          <div>
            <p className="font-bold">Berlin</p>

            <p className="text-gray-500 text-sm">Administrator</p>
          </div>
        </div>
      </div>
    </header>
  );
}
