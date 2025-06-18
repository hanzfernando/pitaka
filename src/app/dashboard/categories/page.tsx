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
    <div className="flex flex-col gap-4 w-full h-full px-4 backdrop-blur-sm py-8">
      <div className="flex justify-between items-center max-w-6xl w-full mx-auto">
        <h1 className="text-2xl font-semibold">Categories</h1>
        <button
          onClick={() => setShowModal(true)}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          Add Category
        </button>
      </div>

      <div className="max-w-6xl w-full mx-auto">
        <CategoryTable categories={categories} />
      </div>

      {showModal && (
        <AddCategoryModal onClose={() => setShowModal(false)} onAdd={handleAddCategory} />
      )}
    </div>
  );
}
