"use client";

import { Category } from "@/types/category";
import { Pencil, Trash2 } from "lucide-react";

type Props = {
  categories: Category[];
  onEdit: (cat: Category) => void;
  onDelete: (cat: Category) => void;
};

const CategoryCardList: React.FC<Props> = ({ categories, onEdit, onDelete }) => {
  if (categories.length === 0) {
    return (
      <p className="text-muted-foreground text-center italic">
        Nothing here yet. Add your first category above!
      </p>
    );
  }

  return (
    <div className="md:hidden space-y-4">
      {categories.map((cat) => (
        <div
          key={cat.id}
          className="rounded-lg border border-border p-4 shadow-sm bg-muted/50"
        >
          <div className="flex justify-between items-center mb-2">
            <h2 className="font-semibold text-foreground">{cat.name}</h2>
            <div className="flex gap-2">
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
            </div>
          </div>

          <div className="text-sm text-muted-foreground space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-foreground">Color:</span>
              <span
                className="w-4 h-4 rounded-full border border-border"
                style={{ backgroundColor: `#${cat.color}` }}
              />
              <span className="text-foreground">#{cat.color}</span>
            </div>
            <div>
              <span className="font-medium text-foreground">Created:</span>{" "}
              {new Date(cat.created_at).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryCardList;
