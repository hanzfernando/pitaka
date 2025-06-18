"use client";

import { useState, useEffect } from "react";
import CategoryTable from "@/components/CategoryTable";
import AddCategoryModal from "@/components/AddCategoryModal";
import { Category } from "@/types/category";
import { fetchCategories } from "@/lib/services/categoryService";

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [showModal, setShowModal] = useState(false);

  const handleAddCategory = (newCategory: Category) => {
    setCategories((prev) => [newCategory, ...prev]);
    setShowModal(false);
  };

  useEffect(() => {
    const fetchUserCategories = async () => {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);
    };

    fetchUserCategories();
  }, []);

  return (
    <>
      <div className="flex flex-col gap-6 w-full h-full px-4 py-10 bg-background text-foreground">
        <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
          <h1 className="text-3xl font-bold text-primary">Your Categories 📂</h1>
          <button
            onClick={() => setShowModal(true)}
            className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-5 py-2 rounded-lg text-sm font-semibold shadow hover:brightness-110 transition"
          >
            + Add Category
          </button>
        </div>

        <div className="max-w-5xl w-full mx-auto">
          <CategoryTable categories={categories} />
        </div>

        {showModal && (
          <AddCategoryModal onClose={() => setShowModal(false)} onAdd={handleAddCategory} />
        )}
      </div>
    </>
  );
}
