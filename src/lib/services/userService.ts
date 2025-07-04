import { createClient } from "@/lib/supabase/client";

// Get user display name from metadata
export async function getUserDisplayName(): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.user_metadata?.displayName || null;
}

// Get user email
export async function getUserEmail(): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.email ?? null;
}

// Update display name in metadata
export async function updateDisplayName(newName: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({
    data: { displayName: newName },
  });
  if (error) throw new Error(error.message);
}

// Update password
export async function updatePassword(newPassword: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
}

// Update password with reauthentication
export async function updatePasswordWithReauth(
  email: string,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const supabase = createClient();

  const { error: authError } = await supabase.auth.signInWithPassword({
    email,
    password: currentPassword,
  });
  if (authError) throw new Error("Current password is incorrect.");

  await updatePassword(newPassword);
}

// Get auth provider (email, google, etc.)
export async function getAuthProvider(): Promise<string | null> {
  const supabase = createClient();
  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return data.user.app_metadata?.provider || null;
}
