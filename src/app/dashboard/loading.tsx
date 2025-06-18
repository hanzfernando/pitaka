// src/app/dashboard/loading.tsx
import { Loader2 } from "lucide-react"; // if using lucide-react

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-full p-6">
      <Loader2 className="w-6 h-6 animate-spin text-gray-500" />
      <span className="ml-2 text-sm text-gray-500">Loading...</span>
    </div>
  );
}
