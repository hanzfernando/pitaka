"use client";

import { useState } from "react";
import { Category } from "@/types/category";

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

    onAdd({ name, color } as Category);

    onClose();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full max-w-md rounded-2xl shadow-xl border border-gray-200 dark:border-zinc-700 p-6 space-y-5">
        <h2 className="text-xl font-bold text-primary">Add Category</h2>
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
                  placeholder="e.g., ffcc00"
                  maxLength={6}
                  className="w-20 bg-transparent focus:outline-none"
                />
              </div>
            </div>
          </div>
          {error && <p className="text-sm text-destructive text-red-500">{error}</p>}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-sm bg-muted text-muted-foreground rounded-lg hover:bg-muted/80 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
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
