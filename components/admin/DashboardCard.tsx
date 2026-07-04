type Props = {
  title: string;
  value: string;
  icon: string;
  color?: "green" | "blue" | "purple" | "orange" | "yellow" | "red";
};

export default function DashboardCard({
  title,
  value,
  icon,
  color = "orange",
}: Props) {
  const colors = {
    green: {
      border: "hover:border-green-500",
      glow: "bg-green-500/10",
      icon: "bg-green-500/15",
    },

    blue: {
      border: "hover:border-blue-500",
      glow: "bg-blue-500/10",
      icon: "bg-blue-500/15",
    },

    purple: {
      border: "hover:border-purple-500",
      glow: "bg-purple-500/10",
      icon: "bg-purple-500/15",
    },

    orange: {
      border: "hover:border-orange-500",
      glow: "bg-orange-500/10",
      icon: "bg-orange-500/15",
    },

    yellow: {
      border: "hover:border-yellow-500",
      glow: "bg-yellow-500/10",
      icon: "bg-yellow-500/15",
    },

    red: {
      border: "hover:border-red-500",
      glow: "bg-red-500/10",
      icon: "bg-red-500/15",
    },
  };

  const theme = colors[color];
  return (
    <div
  className={`
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
    ${theme.border}
    hover:shadow-[0_0_25px_rgba(249,115,22,0.25)]
  `}
>
      {/* Glow */}
      <div
  className={`
    absolute
    -top-8
    -right-8
    h-24
    w-24
    rounded-full
    ${theme.glow}
    blur-3xl
  `}
/>

      <div className="relative z-10">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm uppercase tracking-wider text-gray-400">
              {title}
            </p>

            <h2 className="mt-3 text-4xl font-black text-white">{value}</h2>
          </div>

          <div
  className={`
    flex
    h-16
    w-16
    items-center
    justify-center
    rounded-2xl
    ${theme.icon}
    text-4xl
  `}
>
            {icon}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between">
          <span className="rounded-full bg-green-500/15 px-3 py-1 text-sm font-semibold text-green-400">
            ● Live
          </span>

          <span className="text-sm text-gray-500">Updated now</span>
        </div>
      </div>
    </div>
  );
}
