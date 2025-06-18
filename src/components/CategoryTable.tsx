"use client";

import { useState } from "react";
import { Category } from "@/types/category";

type Props = {
  categories: Category[];
};

const CategoryTable: React.FC<Props> = ({ categories }) => {
  const [search, setSearch] = useState("");

  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="w-full rounded-2xl border border-border bg-card shadow-md p-6">
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-input bg-background text-foreground rounded-lg px-3 py-2 text-sm w-full sm:w-64 shadow-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition"
        />
      </div>

      <div className="overflow-auto rounded-xl border border-border">
        <table className="min-w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr className="text-left font-medium">
              {/* <th className="px-4 py-3">ID</th> */}
              {/* <th className="px-4 py-3">User ID</th> */}
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Color</th>
              <th className="px-4 py-3">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-6 text-muted-foreground"
                >
                  No categories found.
                </td>
              </tr>
            ) : (
              filtered.map((cat) => (
                <tr
                  key={cat.id}
                  className="border-t border-border hover:bg-muted/30 transition-colors"
                >
                  {/* <td className="px-4 py-3">{cat.id}</td> */}
                  {/* <td className="px-4 py-3">{cat.user_id}</td> */}
                  <td className="px-4 py-3 font-medium text-foreground">
                    {cat.name}
                  </td>
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
