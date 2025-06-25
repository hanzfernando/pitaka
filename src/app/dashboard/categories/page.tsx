"use client";

import { useState, useEffect } from "react";
import CategoryTable from "@/components/category/CategoryTable";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import { Category } from "@/types/category";
import {
  fetchCategories,
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";

// Modal types
type ModalType = "add" | "edit" | "delete" | null;

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [modal, setModal] = useState<ModalType>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  useEffect(() => {
    const fetchUserCategories = async () => {
      const fetched = await fetchCategories();
      setCategories(fetched);
    };
    fetchUserCategories();
  }, []);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddCategory = async (input: Omit<Category, "id" | "created_at">) => {
    try {
      const created = await addCategory(input);
      if (created) setCategories((prev) => [created, ...prev]);
      closeModal();
    } catch (err) {
      console.error("Add failed:", err);
    }
  };

  const handleEditCategory = async (updated: Category) => {
    try {
      const saved = await updateCategory(updated);
      if (saved) updateCategoryList(saved);
      closeModal();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  const handleDeleteCategory = async () => {
    if (!activeCategory) return;
    try {
      const success = await deleteCategory(activeCategory.id);
      if (success) removeCategoryFromList(activeCategory.id);
      closeModal();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  // ─── Helpers ─────────────────────────────────────────
  const updateCategoryList = (updated: Category) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === updated.id ? updated : cat))
    );
  };

  const removeCategoryFromList = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const openModal = (type: ModalType, category: Category | null = null) => {
    setModal(type);
    setActiveCategory(category);
  };

  const closeModal = () => {
    setModal(null);
    setActiveCategory(null);
  };

  // ─── UI ─────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-6 w-full h-full px-4 py-10 bg-background text-foreground">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-primary">Your Categories 📂</h1>
        <button
          onClick={() => openModal("add")}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
        >
          + Add Category
        </button>
      </div>

      <div className="max-w-5xl w-full mx-auto">
        <CategoryTable
          categories={categories}
          onEdit={(cat) => openModal("edit", cat)}
          onDelete={(cat) => openModal("delete", cat)}
        />
      </div>

      {/* Modals */}
      {modal === "add" && (
        <AddCategoryModal onClose={closeModal} onAdd={handleAddCategory} />
      )}
      {modal === "edit" && activeCategory && (
        <EditCategoryModal
          category={activeCategory}
          onClose={closeModal}
          onUpdate={handleEditCategory}
        />
      )}
      {modal === "delete" && activeCategory && (
        <ConfirmDeleteModal
          title="Delete Category"
          itemName={activeCategory.name}
          onClose={closeModal}
          onConfirm={handleDeleteCategory}
        />
      )}
    </div>
  );
}
