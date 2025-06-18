import { Category } from "@/types/category";
import { createClient } from "@/lib/supabase/client";

export async function fetchCategories(): Promise<Category[]> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return [];
  }

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching categories:", error.message);
    return [];
  }

  return data as Category[];
}

export async function addCategory(Category: Omit<Category, "id" | "created_at">): Promise<Category | null> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return null;
  }

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...Category, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding category:", error.message);
    return null;
  }

  return data as Category;
}