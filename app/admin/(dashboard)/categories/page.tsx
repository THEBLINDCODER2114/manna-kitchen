"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/admin/PageHeader";
import {
  getAllCategories,
  addCategory,
  updateCategory,
  categoryHasItems,
  deleteCategoryWithItems,
  moveItemsAndDeleteCategory,
} from "@/lib/categoryAdmin";
import CategoryModal from "@/components/admin/CategoryModal";
import DeleteConfirmModal from "@/components/admin/DeleteConfirmModal";
import { toast } from "sonner";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [deleteCategoryData, setDeleteCategoryData] = useState<any>(null);
  const [categoryItemCount, setCategoryItemCount] = useState(0);

  async function loadCategories() {
    const data = await getAllCategories();
    setCategories(data);
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div className="p-8">
      <PageHeader
        title="📂 Categories"
        subtitle="Manage restaurant menu categories."
        action={
          <button
            onClick={() => setShowModal(true)}
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
              <h2 className="text-2xl font-bold">{category.name}</h2>

              <p className="text-gray-400">Category ID: {category.id}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setEditingCategory(category);
                  setShowModal(true);
                }}
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
                onClick={async () => {
                  const count = await categoryHasItems(category.id);

                  setCategoryItemCount(count);
                  setDeleteCategoryData(category);
                }}
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
      <CategoryModal
        isOpen={showModal}
        title={editingCategory ? "Edit Category" : "Add Category"}
        initialValue={editingCategory?.name ?? ""}
        onClose={() => {
          setShowModal(false);
          setEditingCategory(null);
        }}
        onSave={async (name) => {
          if (!name.trim()) {
            toast.error("Category name is required.");
            return;
          }

          let success = false;

          if (editingCategory) {
            success = await updateCategory(editingCategory.id, name.trim());
          } else {
            success = await addCategory(name.trim());
          }

          if (!success) {
            toast.error(
              editingCategory
                ? "Failed to update category."
                : "Failed to add category.",
            );
            return;
          }

          toast.success(
            editingCategory
              ? "Category updated successfully!"
              : "Category added successfully!",
          );

          setShowModal(false);
          setEditingCategory(null);

          await loadCategories();
        }}
      />

      <DeleteConfirmModal
        isOpen={!!deleteCategoryData}
        title="Delete Category"
        hasItems={categoryItemCount > 0}
        message={
          deleteCategoryData
            ? `Category: ${deleteCategoryData.name}

This category contains ${categoryItemCount} menu item(s).

Choose what you want to do.`
            : ""
        }
        onCancel={() => {
          setDeleteCategoryData(null);
          setCategoryItemCount(0);
        }}
        onMove={async () => {
          if (!deleteCategoryData) return;

          const success = await moveItemsAndDeleteCategory(
            deleteCategoryData.id,
          );

          if (!success) {
            toast.error("Failed to move menu items.");
            return;
          }

          toast.success("Category deleted and menu items moved successfully.");

          setDeleteCategoryData(null);
          setCategoryItemCount(0);

          await loadCategories();
        }}
        onDelete={async () => {
          if (!deleteCategoryData) return;

          const success = await deleteCategoryWithItems(deleteCategoryData.id);

          if (!success) {
            toast.error("Failed to delete category.");
            return;
          }

          toast.success("Category and all menu items deleted successfully.");

          setDeleteCategoryData(null);
          setCategoryItemCount(0);

          await loadCategories();
        }}
      />
    </div>
  );
}
