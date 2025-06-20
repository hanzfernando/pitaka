"use client";

import { useState, useEffect } from "react";
import CategoryTable from "@/components/category/CategoryTable";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import ConfirmDeleteModal from "@/components/category/ConfirmDeleteModal";

import { Category } from "@/types/category";
import { fetchCategories } from "@/lib/services/categoryService";
import { updateCategory } from "@/lib/services/categoryService";
import { addCategory } from "@/lib/services/categoryService";
import { deleteCategory } from "@/lib/services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchUserCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };

    fetchUserCategories();
  }, []);

  // ─── Handlers ───────────────────────────────────────────────────
  const handleAddCategory = async (input: Omit<Category, "id" | "created_at">) => {
    try {
      const newCategory = await addCategory(input);
      if (newCategory) {
        setCategories((prev) => [newCategory, ...prev]);
        setShowAddModal(false);
      }
    } catch (err) {
      console.error("Failed to add category:", err);
    }
  };

  const handleEditCategory = async (updated: Category) => {
    try {
      const saved = await updateCategory(updated); // service call here
      
      if (!saved) {
        throw new Error("Failed to update category");
      }
      
      updateCategoryList(saved); // update local state
      closeEditModal(); // close modal
    } catch (err) {
      console.error("Failed to update category:", err);
      // optional: show error toast or state
    }
};

  const handleDeleteCategory = (deleted: Category) => {
    try {
      const success = deleteCategory(deleted.id);
      if (!success) {
        throw new Error("Failed to delete category");
      }
      removeCategoryFromList(deleted.id); // update local state
      closeDeleteModal(); // close modal
    } catch (err) {
      console.error("Failed to delete category:", err);
    }
    
  };

  // ─── Helpers ────────────────────────────────────────────────────
  const updateCategoryList = (updated: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updated.id ? updated : cat))
    );
  };

  const removeCategoryFromList = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const closeEditModal = () => setEditingCategory(null);
  const closeDeleteModal = () => setDeletingCategory(null);

  // ─── UI ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 py-10 bg-background text-foreground">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-primary">Your Categories 📂</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
        >
          + Add Category
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        <CategoryTable
          categories={categories}
          onEdit={setEditingCategory}
          onDelete={setDeletingCategory}
        />
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddCategoryModal onClose={() => setShowAddModal(false)} onAdd={handleAddCategory} />
      )}

      {editingCategory && (
        <EditCategoryModal
          category={editingCategory}
          onClose={closeEditModal}
          onUpdate={handleEditCategory}
        />
      )}

      {deletingCategory && (
        <ConfirmDeleteModal
          categoryName={deletingCategory.name}
          onClose={closeDeleteModal}
          onConfirm={() => handleDeleteCategory(deletingCategory)}
        />
      )}
    </div>
  );
}
