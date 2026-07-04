"use client";

import { useEffect, useRef, useState } from "react";
import { getCategories } from "@/lib/categories";
import { uploadMenuImage } from "@/lib/storage";
import { supabase } from "@/lib/supabase";
import { getAddons } from "@/lib/addons";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  editingItem: any;
  onSaved: () => void;
};

export default function AddItemModal({
  isOpen,
  onClose,
  editingItem,
  onSaved,
}: Props) {
  const [categories, setCategories] = useState<any[]>([]);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    type: "veg",
    badge: "",
    available: true,
  });

  const [image, setImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [addons, setAddons] = useState([
    {
      name: "",
      price: "",
    },
  ]);

  const handleSave = async () => {
    try {
      let imageUrl = "";

      if (image) {
        imageUrl = await uploadMenuImage(image);
      }

      const selectedCategory = categories.find(
        (cat) => cat.id === Number(form.categoryId),
      );

      let menuItem;
      let error;

      if (editingItem) {
        const response = await supabase
          .from("menu_items")
          .update({
            category_id: Number(form.categoryId),
            category: selectedCategory?.name || "",
            name: form.name,
            description: form.description,
            image: imageUrl || editingItem.image,
            type: form.type,
            price: Number(form.price),
            badge: form.badge,
            available: form.available,
          })
          .eq("id", editingItem.id)
          .select()
          .single();

        menuItem = response.data;
        error = response.error;
      } else {
        const response = await supabase
          .from("menu_items")
          .insert({
            category_id: Number(form.categoryId),
            category: selectedCategory?.name || "",
            name: form.name,
            description: form.description,
            image: imageUrl,
            type: form.type,
            price: Number(form.price),
            badge: form.badge,
            available: form.available,
          })
          .select()
          .single();

        menuItem = response.data;
        error = response.error;
      }

      if (error) {
        console.error(error);
        return;
      }

      console.log(editingItem ? "Item Updated" : "Item Added", menuItem);
      if (editingItem) {
        await supabase
          .from("addons")
          .delete()
          .eq("menu_item_id", editingItem.id);
      }

      for (const addon of addons) {
        if (!addon.name.trim()) continue;

        await supabase.from("addons").insert({
          menu_item_id: menuItem.id,
          name: addon.name,
          price: Number(addon.price),
        });
      }

      setAddons([
        {
          name: "",
          price: "",
        },
      ]);

      resetForm();
      onClose();
      onSaved();
    } catch (err) {
      console.error(err);
    }
  };

  const [preview, setPreview] = useState("");

  const updateForm = (field: string, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setImage(file);

    setPreview(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setImage(null);
    setPreview("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const addAddon = () => {
    setAddons([
      ...addons,
      {
        name: "",
        price: "",
      },
    ]);
  };

  const updateAddon = (
    index: number,
    field: "name" | "price",
    value: string,
  ) => {
    const copy = [...addons];

    copy[index][field] = value;

    setAddons(copy);
  };

  const removeAddon = (index: number) => {
    setAddons(addons.filter((_, i) => i !== index));
  };
  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      categoryId: "",
      type: "veg",
      badge: "",
      available: true,
    });

    setImage(null);
    setPreview("");

    setAddons([
      {
        name: "",
        price: "",
      },
    ]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  useEffect(() => {
    async function loadCategories() {
      const data = await getCategories();
      setCategories(data);
    }

    loadCategories();
  }, []);

  useEffect(() => {
    async function loadItem() {
      if (!editingItem) return;

      setForm({
        name: editingItem.name || "",
        description: editingItem.description || "",
        price: editingItem.price?.toString() || "",
        categoryId: editingItem.category_id?.toString() || "",
        type: editingItem.type || "veg",
        badge: editingItem.badge || "",
        available: editingItem.available ?? true,
      });

      setPreview(editingItem.image || "");

      const addons = await getAddons(editingItem.id);

      if (addons.length > 0) {
        setAddons(
          addons.map((addon: any) => ({
            name: addon.name,
            price: addon.price.toString(),
          })),
        );
      } else {
        setAddons([
          {
            name: "",
            price: "",
          },
        ]);
      }
    }

    loadItem();
  }, [editingItem]);

  if (!isOpen) return null;

  return (
    <div
      className="
      fixed
      inset-0
      bg-black/70
      backdrop-blur-sm
      z-[9999]
      flex
      items-center
      justify-center
      p-6
      "
    >
      <div
        className="
        bg-zinc-900
        border
        border-orange-500
        rounded-3xl
        w-full
        max-w-2xl
        max-h-[90vh]
        overflow-y-auto
        p-8
        "
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-black">
            {editingItem ? "✏ Edit Menu Item" : "➕ Add Menu Item"}
          </h2>

          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="
            w-10
            h-10
            rounded-full
            bg-zinc-800
            hover:bg-red-500
            "
          >
            ✕
          </button>
        </div>

        <form className="space-y-8">
          {/* BASIC */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              🍔 Basic Information
            </h3>

            <div className="space-y-4">
              <input
                placeholder="Food Name"
                value={form.name}
                onChange={(e) => updateForm("name", e.target.value)}
                className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              />

              <textarea
                rows={4}
                placeholder="Description"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                className="w-full bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              />
            </div>
          </div>

          {/* PRICING */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              💰 Pricing
            </h3>

            <div className="grid md:grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Price"
                value={form.price}
                onChange={(e) => updateForm("price", e.target.value)}
                className="bg-zinc-800 rounded-xl p-4 border border-zinc-700"
              />

              <select
                value={form.categoryId}
                onChange={(e) => updateForm("categoryId", e.target.value)}
                className="
  bg-zinc-800
  rounded-xl
  p-4
  border
  border-zinc-700
  "
              >
                <option value="">Select Category</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>

              <select
                value={form.type}
                onChange={(e) => updateForm("type", e.target.value)}
                className="
  bg-zinc-800
  rounded-xl
  p-4
  border
  border-zinc-700
  "
              >
                <option value="veg">Veg</option>
                <option value="nonveg">Non Veg</option>
              </select>
            </div>
          </div>

          {/* BADGE */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">⭐ Badge</h3>

            <select
              value={form.badge}
              onChange={(e) => updateForm("badge", e.target.value)}
              className="
  w-full
  bg-zinc-800
  rounded-xl
  p-4
  border
  border-zinc-700
  "
            >
              <option value="">No Badge</option>
              <option value="⭐ BESTSELLER">⭐ Bestseller</option>
              <option value="🆕 NEW">🆕 New</option>
              <option value="🌶️ SPICY">🌶️ Spicy</option>
            </select>
          </div>

          {/* AVAILABILITY */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              🟢 Availability
            </h3>

            <div className="flex items-center justify-between bg-zinc-800 border border-zinc-700 rounded-xl p-4">
              <div>
                <p className="font-semibold">
                  {form.available ? "🟢 Available" : "🔴 Sold Out"}
                </p>

                <p className="text-sm text-gray-400 mt-1">
                  Customers can{" "}
                  {form.available ? "order this item." : "not order this item."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => updateForm("available", !form.available)}
                className={`
      relative
      w-16
      h-9
      rounded-full
      transition-all
      duration-300
      ${form.available ? "bg-green-500" : "bg-red-500"}
    `}
              >
                <span
                  className={`
        absolute
        top-1
        w-7
        h-7
        rounded-full
        bg-white
        transition-all
        duration-300
        ${form.available ? "left-8" : "left-1"}
      `}
                />
              </button>
            </div>
          </div>

          {/* IMAGE */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              🖼 Food Image
            </h3>

            <div>
              <div className="block">
                {preview ? (
                  <div
                    className="
  relative
  rounded-2xl
  overflow-hidden
  border
  border-zinc-700
  "
                  >
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        removeImage();
                      }}
                      className="
  absolute
  top-3
  right-3
  w-10
  h-10
  rounded-full
  bg-black/70
  hover:bg-red-500
  text-white
  text-xl
  flex
  items-center
  justify-center
  z-10
  transition
  "
                    >
                      ✕
                    </button>
                    <img
                      src={preview}
                      alt="Preview"
                      className="
          w-full
          h-64
          object-cover
          "
                    />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="
  w-full
  bg-zinc-800
  py-3
  text-center
  font-semibold
  hover:bg-orange-500
  transition
  "
                    >
                      Change Image
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="
  cursor-pointer
  border-2
  border-dashed
  border-zinc-700
  rounded-2xl
  h-64
  flex
  flex-col
  justify-center
  items-center
  hover:border-orange-500
  transition
  "
                  >
                    <div className="text-6xl">📷</div>

                    <p className="mt-5 font-semibold">Click to upload image</p>

                    <p className="text-gray-500 mt-2">PNG • JPG • WEBP</p>
                  </div>
                )}

                <input
                  ref={fileInputRef}
                  hidden
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                />
              </div>
            </div>
          </div>

          {/* ADDONS */}

          <div>
            <h3 className="text-xl font-bold text-orange-400 mb-4">
              ➕ Add-ons
            </h3>

            <div className="space-y-4">
              {addons.map((addon, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <input
                    placeholder="Add-on Name"
                    value={addon.name}
                    onChange={(e) => updateAddon(index, "name", e.target.value)}
                    className="flex-1 bg-zinc-800 rounded-xl p-3 border border-zinc-700"
                  />

                  <input
                    type="number"
                    placeholder="₹"
                    value={addon.price}
                    onChange={(e) =>
                      updateAddon(index, "price", e.target.value)
                    }
                    className="w-28 bg-zinc-800 rounded-xl p-3 border border-zinc-700"
                  />

                  <button
                    type="button"
                    onClick={() => removeAddon(index)}
                    className="text-red-500 text-xl"
                  >
                    ✕
                  </button>
                </div>
              ))}

              <button
                type="button"
                onClick={addAddon}
                className="bg-orange-500 px-5 py-3 rounded-xl font-semibold"
              >
                + Add Add-on
              </button>
            </div>
          </div>

          {/* BUTTONS */}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => {
                resetForm();
                onClose();
              }}
              className="
      px-6
      py-3
      rounded-xl
      bg-zinc-700
      "
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="bg-orange-500 hover:bg-orange-600 px-6 py-3 rounded-xl font-bold"
            >
              {editingItem ? "Update Item" : "Save Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
