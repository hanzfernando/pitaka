"use client";

import { useState } from "react";
import CategoryTable from "@/components/category/CategoryTable";
import AddCategoryModal from "@/components/category/AddCategoryModal";
import EditCategoryModal from "@/components/category/EditCategoryModal";
import ConfirmDeleteModal from "@/components/ConfirmDeleteModal";

import { Category } from "@/types/category";
import { CreateCategoryInput } from "@/types/category";

import {
  addCategory,
  updateCategory,
  deleteCategory,
} from "@/lib/services/categoryService";

import { useCategoryContext } from "@/hooks/useCategoryContext";
import { categoryActionTypes } from "@/context/CategoryContext";
import { withToast } from "@/lib/utils/withToast";
import CategoryCardList from "@/components/category/CategoryCardList";

// Modal types
type ModalType = "add" | "edit" | "delete" | null;

export default function Categories() {
  const { state, dispatch } = useCategoryContext();
  const { categories, loading, error } = state;

  const [modal, setModal] = useState<ModalType>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddCategory = async (input: CreateCategoryInput) => {
    dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });

    const created = await withToast(
      () => addCategory(input),
      {
        success: "Category added successfully!",
        error: "Failed to add category",
      }
    );

    if (created) {
      dispatch({ type: categoryActionTypes.ADD_CATEGORY, payload: created });
      closeModal();
    }

    dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
  };


  const handleEditCategory = async (updated: Category) => {
    dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });

    const saved = await withToast(
      () => updateCategory(updated),
      {
        success: "Category updated!",
        error: "Failed to update category",
      }
    );

    if (saved) {
      dispatch({ type: categoryActionTypes.UPDATE_CATEGORY, payload: saved });
      closeModal();
    }

    dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
  };


  const handleDeleteCategory = async () => {
    if (!activeCategory) return;

    dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });

    const success = await withToast(
      () => deleteCategory(activeCategory.id),
      {
        success: "Category deleted.",
        error: "Failed to delete category",
      }
    );

    if (success) {
      dispatch({
        type: categoryActionTypes.DELETE_CATEGORY,
        payload: activeCategory.id,
      });
      closeModal();
    }

    dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
  };


  // ─── Modal Helpers ────────────────────────────────────────
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
        {loading ? (
          <p className="text-muted-foreground">Loading...</p>
        ) : error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block">
              <CategoryTable
                categories={categories}
                onEdit={(cat) => openModal("edit", cat)}
                onDelete={(cat) => openModal("delete", cat)}
              />
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden">
              <CategoryCardList
                categories={categories}
                onEdit={(cat) => openModal("edit", cat)}
                onDelete={(cat) => openModal("delete", cat)}
              />
            </div>
          </>
        )}
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
