import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  } else {
    return "An error occured.";
  }
};

export function formatDate(dateString : string) {
  return format(new Date(dateString), 'MMMM d, yyyy');
}
