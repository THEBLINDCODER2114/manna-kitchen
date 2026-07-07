"use client";

import React, { useEffect, useState } from "react";
import { getAllMenuItems } from "@/lib/adminMenu";
import MenuItemCard from "@/components/admin/MenuItemCard";
import PageHeader from "@/components/admin/PageHeader";
import SearchBar from "@/components/admin/SearchBar";
import AddItemModal from "@/components/admin/AddItemModal";
import DeleteItemModal from "@/components/admin/DeleteItemModal";
import { deleteMenuItem } from "@/lib/deleteMenuItem";

export default function MenuPage() {
  const [menu, setMenu] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);

  async function loadMenu() {
    const data = await getAllMenuItems();
    setMenu(data);
    setLoading(false);
  }

  useEffect(() => {
    loadMenu();
  }, []);

  const handleEdit = (item: any) => {
    setEditingItem(item);
    setShowAddModal(true);
  };

  const handleDeleteClick = (item: any) => {
    setDeleteItem(item);
  };

  const handleDelete = async () => {
    if (!deleteItem) return;

    try {
      await deleteMenuItem(deleteItem);

      setMenu((prev) => prev.filter((item) => item.id !== deleteItem.id));

      setDeleteItem(null);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return <div className="p-10 text-white">Loading...</div>;
  }

  const groupedMenu = menu.reduce((acc: any, item: any) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);

    return acc;
  }, {});

  const filteredItems = menu.filter((item: any) =>
    item.name.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <PageHeader
        title="Menu Management"
        subtitle="Manage all food items from one place."
        action={
          <button
            onClick={() => setShowAddModal(true)}
            className="
  bg-orange-500
  hover:bg-orange-400
  px-6
  py-4
  rounded-2xl
  font-bold
  "
          >
            ➕ Add New Item
          </button>
        }
      />
      <div className="mb-10">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {search.trim() ? (
        <section>
          <h2 className="text-3xl font-black text-orange-400 mb-8">
            🔍 Search Results ({filteredItems.length})
          </h2>

          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <h3 className="text-2xl font-bold">No items found</h3>

              <p className="mt-3">Try searching with a different keyword.</p>
            </div>
          ) : (
            <div
              className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
        "
            >
              {filteredItems.map((item: any) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          )}
        </section>
      ) : (
        Object.entries(groupedMenu).map(([category, items]: any) => (
          <section key={category} className="mb-16">
            <h2 className="text-4xl font-black text-orange-400 mb-8">
              {category}
            </h2>

            <div
              className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
        gap-8
        "
            >
              {items.map((item: any) => (
                <MenuItemCard
                  key={item.id}
                  item={item}
                  onEdit={handleEdit}
                  onDelete={handleDeleteClick}
                />
              ))}
            </div>
          </section>
        ))
      )}

      <AddItemModal
        isOpen={showAddModal}
        editingItem={editingItem}
        onClose={() => {
          setShowAddModal(false);
          setEditingItem(null);
        }}
        onSaved={async () => {
          await loadMenu();
        }}
      />

      <DeleteItemModal
        isOpen={!!deleteItem}
        item={deleteItem}
        onClose={() => setDeleteItem(null)}
        onDelete={handleDelete}
      />
    </div>
  );
}
