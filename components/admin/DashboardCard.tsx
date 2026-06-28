type Props = {
  title: string;
  value: string;
  icon: string;
};

export default function DashboardCard({
  title,
  value,
  icon,
}: Props) {
  return (
    <div
      className="
      relative
      overflow-hidden
      rounded-3xl
      border
      border-zinc-800
      bg-zinc-900
      p-6
      transition-all
      duration-300
      hover:-translate-y-1
      hover:border-orange-500
      hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]
      "
    >
      {/* Glow */}
      <div
        className="
        absolute
        -top-8
        -right-8
        h-24
        w-24
        rounded-full
        bg-orange-500/10
        blur-3xl
        "
      />

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">
              {value}
            </h2>
          </div>

          <div
            className="
            flex
            h-16
            w-16
            items-center
            justify-center
            rounded-2xl
            bg-orange-500/15
            text-4xl
            "
          >
            {icon}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-400">
            ● Live
          </span>

          <span className="text-sm text-gray-500">
            Updated now
          </span>
        </div>
      </div>
    </div>
  );
}