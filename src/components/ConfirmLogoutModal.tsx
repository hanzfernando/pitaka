// components/ConfirmLogoutModal.tsx
"use client";

type ConfirmLogoutModalProps = {
  onClose: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({ onClose, onConfirm }: ConfirmLogoutModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-background p-6 rounded-lg shadow-lg max-w-sm w-full">
        <h2 className="text-lg font-semibold mb-4">Confirm Logout</h2>
        <p className="text-sm text-muted-foreground mb-6">Are you sure you want to log out?</p>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded bg-red-600 text-white hover:bg-red-500"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
