import toast from "react-hot-toast";

export interface AppError {
  message: string;
  status?:  number;
  details?: unknown;
}

export function handleError(error: unknown): AppError {
  // Already an AppError
  if (typeof error === "object" && error !== null && "message" in error) {
    const err = error as AppError;
    return { message: err.message, status: err.status, details: err.details };
  }

  // Native Error
  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "An unexpected error occurred." };
}

export function showError(error: unknown): void {
  const err = handleError(error);
  let message = err.message;

  // Validation error হলে specific field error দেখান
  if (err.status === 400 && Array.isArray(err.details)) {
    const firstError = err.details[0];
    if (firstError?.message) {
      message = `${firstError.message}`;
    }
  }

  toast.error(message);
}

export function showSuccess(message: string): void {
  toast.success(message);
}

export function isAuthError(error: unknown): boolean {
  const { status } = handleError(error);
  return status === 401;
}

export function isValidationError(error: unknown): boolean {
  const { status } = handleError(error);
  return status === 400;
}
