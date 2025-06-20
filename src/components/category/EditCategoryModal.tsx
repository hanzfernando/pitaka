"use client";

import { useState } from "react";
import { Category } from "@/types/category";

interface EditCategoryModalProps {
  category: Category;
  onClose: () => void;
  onUpdate: (updated: Category) => void;
}

const EditCategoryModal: React.FC<EditCategoryModalProps> = ({ category, onClose, onUpdate }) => {
  const [name, setName] = useState(category.name);
  const [color, setColor] = useState(category.color);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

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

    const updatedCategory = { ...category, name, color };

    onUpdate(updatedCategory); 

    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full max-w-md rounded-xl shadow-lg p-6 space-y-4">
        <h2 className="text-lg font-semibold">Edit Category</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Color</label>
            <div className="flex items-center gap-3">
              <label className="relative w-9 h-9 overflow-hidden cursor-pointer hover:scale-105 transition-transform">
                <input
                  type="color"
                  value={`#${color}`}
                  onChange={(e) => setColor(e.target.value.replace("#", ""))}
                  className="w-full h-full appearance-none cursor-pointer"
                />
              </label>

              <div className="flex items-center gap-1 border border-input rounded-lg px-2 py-1 bg-background text-foreground text-sm">
                <span className="text-muted-foreground">#</span>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  maxLength={6}
                  className="w-20 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>


          {error && <p className="text-sm text-destructive">{error}</p>}
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-muted text-muted-foreground hover:bg-muted/80 transition">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition">
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;