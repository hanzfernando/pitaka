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

// Modal types
type ModalType = "add" | "edit" | "delete" | null;

export default function Categories() {
  const { state, dispatch } = useCategoryContext();
  const { categories, loading, error } = state;

  const [modal, setModal] = useState<ModalType>(null);
  const [activeCategory, setActiveCategory] = useState<Category | null>(null);

  // useEffect(() => {
  //   if (categories.length === 0 && !loading && !error) {
  //     const retryFetch = async () => {
  //       dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });
  //       try {
  //         const fetched = await fetchCategories();
  //         dispatch({ type: categoryActionTypes.SET_CATEGORIES, payload: fetched });
  //       } catch (err) {
  //         dispatch({
  //           type: categoryActionTypes.SET_ERROR,
  //           payload: err instanceof Error ? err.message : "Failed to fetch categories",
  //         });
  //       }
  //     };

  //     retryFetch();
  //   }
  // }, [categories.length, loading, error, dispatch]);

  // ─── Handlers ─────────────────────────────────────────
  const handleAddCategory = async (input: CreateCategoryInput) => {
    try {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });
      const created = await addCategory(input);
      if (created) {
        dispatch({ type: categoryActionTypes.ADD_CATEGORY, payload: created });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: categoryActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to add category",
      });
    } finally {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleEditCategory = async (updated: Category) => {
    try {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });
      const saved = await updateCategory(updated);
      if (saved) {
        dispatch({ type: categoryActionTypes.UPDATE_CATEGORY, payload: saved });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: categoryActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to update category",
      });
    } finally {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
    }
  };

  const handleDeleteCategory = async () => {
    if (!activeCategory) return;
    try {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: true });
      const success = await deleteCategory(activeCategory.id);
      if (success) {
        dispatch({
          type: categoryActionTypes.DELETE_CATEGORY,
          payload: activeCategory.id,
        });
      }
      closeModal();
    } catch (err) {
      dispatch({
        type: categoryActionTypes.SET_ERROR,
        payload: err instanceof Error ? err.message : "Failed to delete category",
      });
    } finally {
      dispatch({ type: categoryActionTypes.SET_LOADING, payload: false });
    }
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
          <CategoryTable
            categories={categories}
            onEdit={(cat) => openModal("edit", cat)}
            onDelete={(cat) => openModal("delete", cat)}
          />
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
