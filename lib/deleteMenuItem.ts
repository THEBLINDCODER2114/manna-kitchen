import { supabase } from "./supabase";

export async function deleteMenuItem(item: any) {
  // Delete add-ons
  await supabase
    .from("addons")
    .delete()
    .eq("menu_item_id", item.id);

  // Delete image from Storage
  if (
    item.image &&
    item.image.includes("/storage/v1/object/public/menu-images/")
  ) {
    const fileName = item.image.split("/menu-images/")[1];

    if (fileName) {
      await supabase.storage
        .from("menu-images")
        .remove([fileName]);
    }
  }

  // Delete menu item
  const { error } = await supabase
    .from("menu_items")
    .delete()
    .eq("id", item.id);

  if (error) {
    throw error;
  }
}