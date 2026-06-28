"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import { getAllCategories } from "@/lib/categoryAdmin";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    async function loadCategories() {
      const data = await getAllCategories();
      setCategories(data);
    }

    loadCategories();
  }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="📂 Categories"
        subtitle="Manage restaurant menu categories."
        action={
          <button
            className="
            bg-orange-500
            hover:bg-orange-400
            px-6
            py-3
            rounded-xl
            font-bold
            "
          >
            ➕ Add Category
          </button>
        }
      />

      <div className="space-y-5">
        {categories.map((category) => (
          <div
            key={category.id}
            className="
            bg-zinc-900
            border
            border-zinc-800
            rounded-2xl
            p-6
            flex
            justify-between
            items-center
            "
          >
            <div>
              <h2 className="text-2xl font-bold">
                {category.name}
              </h2>

              <p className="text-gray-400">
                Category ID: {category.id}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                className="
                bg-blue-600
                hover:bg-blue-500
                px-4
                py-2
                rounded-xl
                "
              >
                ✏ Edit
              </button>

              <button
                className="
                bg-red-600
                hover:bg-red-500
                px-4
                py-2
                rounded-xl
                "
              >
                🗑 Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}