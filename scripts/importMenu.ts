import dotenv from "dotenv";

dotenv.config({
  path: ".env.local",
});

import { createClient } from "@supabase/supabase-js";

import {
  burgers,
  pizzas,
  pasta,
  maggie,
  rolls,
  sides,
} from "../data/menu";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
);

const categories = [
  { name: "Burgers", items: burgers },
  { name: "Pizza", items: pizzas },
  { name: "Pasta", items: pasta },
  { name: "Maggie", items: maggie },
  { name: "Rolls", items: rolls },
  { name: "Sides", items: sides },
];

async function importMenu() {
  for (const category of categories) {
    let { data: existingCategory } = await supabase
      .from("categories")
      .select("*")
      .eq("name", category.name)
      .maybeSingle();

    if (!existingCategory) {
      const { data } = await supabase
        .from("categories")
        .insert({
          name: category.name,
        })
        .select()
        .single();

      existingCategory = data;
    }

    for (const item of category.items) {
      const { data: existingItem } = await supabase
        .from("menu_items")
        .select("id")
        .eq("name", item.name)
        .maybeSingle();

      if (!existingItem) {
        const { data: menuItem } = await supabase
          .from("menu_items")
          .insert({
            category_id: existingCategory.id,
            category: category.name,
            name: item.name,
            description: item.description || "",
            badge: item.badge || "",
            image: item.image,
            type: item.type,
            price: item.price,
            available: true,
          })
          .select()
          .single();

        if (item.addons) {
          for (const addon of item.addons) {
            await supabase.from("addons").insert({
              menu_item_id: menuItem.id,
              name: addon.name,
              price: addon.price,
            });
          }
        }
      }
    }
  }

  console.log("✅ Menu Imported Successfully");
}

importMenu();