import { supabase } from "./supabase";

export async function updateKitchenStatus(
  kitchenOpen: boolean,
  closingMessage: string,
) {
  const { error } = await supabase
    .from("settings")
    .update({
      kitchen_open: kitchenOpen,
      closing_message: closingMessage,
    })
    .eq("id", 1);

  if (error) {
    console.error(error);
    return false;
  }

  return true;
}
