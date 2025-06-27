import { Category } from "@/types/category";
import { CreateCategoryInput } from "@/types/category";
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

export async function addCategory(category: CreateCategoryInput): Promise<Category | null> {
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
    .insert({ ...category, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error("Error adding category:", error.message);
    return null;
  }

  return data as Category;
}

export async function updateCategory(category: Category): Promise<Category | null> {
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
    .update(category)
    .eq("id", category.id)
    .select()
    .single();

  if (error) {
    console.error("Error updating category:", error.message);
    return null;
  }

  return data as Category;
}

export async function deleteCategory(id: string): Promise<boolean> {
  const supabase = createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error("User not authenticated");
    return false;
  }

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("Error deleting category:", error.message);
    return false;
  }

  return true;
}