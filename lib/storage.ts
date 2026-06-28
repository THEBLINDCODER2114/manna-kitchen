import { supabase } from "./supabase";

export async function uploadMenuImage(file: File) {
  const fileName = `${Date.now()}-${file.name}`;

  const { error } = await supabase.storage
    .from("menu-images")
    .upload(fileName, file);

  if (error) {
    throw error;
  }

  const {
    data: { publicUrl },
  } = supabase.storage
    .from("menu-images")
    .getPublicUrl(fileName);

  return publicUrl;
}