"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: "📊",
  },
  {
    name: "Menu",
    href: "/admin/menu",
    icon: "🍔",
  },
  {
    name: "Categories",
    href: "/admin/categories",
    icon: "📂",
  },
  {
    name: "Orders",
    href: "/admin/orders",
    icon: "📦",
  },
  {
    name: "Customers",
    href: "/admin/customers",
    icon: "👥",
  },
  {
    name: "Analytics",
    href: "/admin/analytics",
    icon: "📈",
  },
  {
    name: "Settings",
    href: "/admin/settings",
    icon: "⚙️",
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="
    fixed
    left-0
    top-0
    h-screen
    w-72
    bg-zinc-950
    border-r
    border-zinc-800
    z-50
    overflow-y-auto
  "
    >
      <div className="p-8">
        <h1 className="text-3xl font-black text-orange-500">MANNA KITCHEN</h1>

        <p className="text-gray-500">Admin Dashboard</p>
      </div>

      <nav className="px-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`
              flex
              items-center
              gap-4
              px-5
              py-4
              rounded-2xl
              transition-all

              ${
                pathname === item.href
                  ? "bg-orange-500 text-white"
                  : "hover:bg-zinc-900"
              }
            `}
          >
            <span className="text-xl">{item.icon}</span>

            {item.name}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
