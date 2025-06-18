"use client";

import { useState } from "react";
import { Category } from "@/types/category";
import { addCategory } from "@/lib/services/categoryService";

type Props = {
  onClose: () => void;
  onAdd: (cat: Category) => void;
};

  const AddCategoryModal: React.FC<Props> = ({ onClose, onAdd }) => {
    const [name, setName] = useState("");
    const [color, setColor] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setLoading(true);
      setError("");

      const isValidHex = /^([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$/.test(color);
      if (!isValidHex) {
        setError("Color must be a valid hex code (3 or 6 characters).");
        setLoading(false);
        return;
      }
      if (!name.trim()) {
        setError("Name cannot be empty.");
        setLoading(false);
        return;
      }
      if (name.length > 50) {
        setError("Name cannot exceed 50 characters.");
        setLoading(false);
        return;
      }

      const newCategory = await addCategory({ name, color, user_id: "" }); // user_id will be injected inside service

      if (!newCategory) {
        setError("Failed to add category. Please try again.");
        setLoading(false);
        return;
      }

      onAdd(newCategory);
      onClose();
      setLoading(false);
    };



  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-card bg-white text-foreground w-full max-w-md rounded-xl shadow-lg border border-border p-6 space-y-4">
        <h2 className="text-lg font-semibold">Add New Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color (hex)</label>
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
              placeholder="e.g., ffcc00"
              className="w-full border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/70 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

};

export default AddCategoryModal;
