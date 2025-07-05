"use client";

import { useUserContext } from "@/hooks/useUserContext";
import {
  updateDisplayName,
  updatePasswordWithReauth,
  getAuthProvider,
  getUserEmail,
} from "@/lib/services/userService";
import { withToast } from "@/lib/utils/withToast";
import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLogout } from "@/hooks/useLogout";

export default function ProfileSettingsPage() {
  const { state, dispatch } = useUserContext();
  const [displayName, setDisplayName] = useState(state.displayName);
  const [provider, setProvider] = useState<string | null>(null);
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const { logout } = useLogout();

  useEffect(() => {
    getAuthProvider().then(setProvider).catch(() => setProvider("email"));
    getUserEmail().then((email) => setEmail(email ?? ""));
  }, []);

  const handleUpdateName = () => {
    withToast(() => updateDisplayName(displayName), {
      success: "Display name updated successfully.",
      error: "Failed to update display name.",
    }).then((res) => {
      if (res !== null) {
        dispatch({ type: "SET_DISPLAY_NAME", payload: displayName });
      }
    });
  };

const handleUpdatePassword = () => {
  if (!currentPassword || !newPassword || !confirmPassword) {
    return withToast(() => Promise.reject(), {
      success: "",
      error: "All fields are required.",
    });
  }

  if (newPassword !== confirmPassword) {
    return withToast(() => Promise.reject(), {
      success: "",
      error: "New and confirm password do not match.",
    });
  }

  if (newPassword.length < 6) {
    return withToast(() => Promise.reject(), {
      success: "",
      error: "Password must be at least 6 characters.",
    });
  }

  withToast(() => updatePasswordWithReauth(email, currentPassword, newPassword), {
    success: "Password updated successfully. You'll be signed out shortly.",
    error: "Failed to update password.",
  }).then((res) => {
    if (res !== null) {
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // ⏳ Wait 2.5 seconds then log the user out
      setTimeout(() => {
        logout(); // this should clear session and redirect to login
      }, 2500);
    }
  });
};

  const renderPasswordField = (
    label: string,
    value: string,
    setValue: (val: string) => void,
    show: boolean,
    toggle: () => void
  ) => (
    <div className="relative">
      <label className="block font-medium mb-1">{label}</label>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-2 pr-10 border rounded"
      />
      <button
        type="button"
        className="absolute top-10 right-3 text-muted-foreground"
        onClick={toggle}
      >
        {show ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );

  return (
    <div className="max-w-md mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center max-w-5xl w-full mx-auto">
        <h1 className="text-3xl font-bold text-primary">Profile Settings</h1>       
      </div>

      <div>
        <label className="block font-medium mb-1">Display Name</label>
        <input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <button
          onClick={handleUpdateName}
          className="mt-2 px-4 py-2 bg-blue-600 text-white rounded"
        >
          Update Name
        </button>
      </div>

      {provider === "email" && (
        <div className="space-y-2 mt-4">
          {renderPasswordField(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            showCurrent,
            () => setShowCurrent((prev) => !prev)
          )}
          {renderPasswordField(
            "New Password",
            newPassword,
            setNewPassword,
            showNew,
            () => setShowNew((prev) => !prev)
          )}
          {renderPasswordField(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            showConfirm,
            () => setShowConfirm((prev) => !prev)
          )}

          <button
            onClick={handleUpdatePassword}
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
          >
            Update Password
          </button>
        </div>
      )}

      {provider && provider !== "email" && (
        <p className="text-sm text-muted-foreground mt-4">
          Password change is disabled for accounts signed in with {provider}.
        </p>
      )}
    </div>
  );
}
