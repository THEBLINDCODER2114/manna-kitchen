import { supabase } from "./supabase";

export async function getAllCategories() {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name");

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}

export async function addCategory(name: string) {
  const { error } = await supabase.from("categories").insert({
    name,
  });

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function updateCategory(id: number, name: string) {
  const { error } = await supabase
    .from("categories")
    .update({
      name,
    })
    .eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function deleteCategory(id: number) {
  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}

export async function deleteCategoryWithItems(categoryId: number) {
  const { error: itemsError } = await supabase
    .from("menu_items")
    .delete()
    .eq("category_id", categoryId);

  if (itemsError) {
    console.error(itemsError);
    return false;
  }

  const { error: categoryError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (categoryError) {
    console.error(categoryError);
    return false;
  }

  return true;
}

export async function moveItemsAndDeleteCategory(categoryId: number) {
  const { data: uncategorized } = await supabase
    .from("categories")
    .select("id")
    .eq("name", "Uncategorized")
    .single();

  if (!uncategorized) {
    console.error("Uncategorized category not found");
    return false;
  }

  const { error: moveError } = await supabase
    .from("menu_items")
    .update({
      category_id: uncategorized.id,
      category: "Uncategorized",
    })
    .eq("category_id", categoryId);

  if (moveError) {
    console.error(moveError);
    return false;
  }

  const { error: deleteError } = await supabase
    .from("categories")
    .delete()
    .eq("id", categoryId);

  if (deleteError) {
    console.error(deleteError);
    return false;
  }

  return true;
}

export async function categoryHasItems(categoryId: number) {
  const { count, error } = await supabase
    .from("menu_items")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("category_id", categoryId);

  if (error) {
    console.error(error);
    return 0;
  }

  return count ?? 0;
}
