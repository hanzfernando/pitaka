"use client";

import { Category } from "@/types/category";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
};

const CategoryTable: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-white dark:bg-zinc-800 shadow-md p-6 space-y-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search categories 🔍"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-input bg-muted text-foreground rounded-full px-4 py-2 text-sm w-full sm:w-72 focus:outline-none focus:ring-2 focus:ring-primary transition"
        />
      </div>

      <div className="overflow-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr className="text-left font-medium">
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-6 text-muted-foreground italic">
                  Nothing here yet. Add your first category above!
                </td>
              </tr>
            ) : (
              filtered.map((cat) => (
                <tr key={cat.id} className="border-t border-border hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                  <td className="px-4 py-3 flex items-center gap-2">
                    <span
                      className="w-4 h-4 rounded-full border border-border"
                      style={{ backgroundColor: `#${cat.color}` }}
                    />
                    <span>#{cat.color}</span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(cat.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 flex justify-center gap-3">
                    <button
                      onClick={() => onEdit(cat)}
                      className="text-blue-500 hover:text-blue-700"
                      title="Edit"
                    >
                      <Pencil size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(cat)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoryTable;
