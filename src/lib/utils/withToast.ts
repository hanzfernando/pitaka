// lib/utils/withToast.ts
import { toast } from "sonner";

type ToastMessages = {
  success: string;
  error: string;
};

export async function withToast<T>(
  action: () => Promise<T>,
  messages: ToastMessages
): Promise<T | null> {
  try {
    const result = await action();
    toast.success(messages.success);
    return result;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    toast.error(messages.error);
    return null;
  }
}
