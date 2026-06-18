import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type ErrorWithResponse = {
  response?: {
    data?: unknown;
  };
};

function hasResponseData(err: unknown): err is ErrorWithResponse {
  return (
    typeof err === "object" &&
    err !== null &&
    "response" in err &&
    typeof (err as ErrorWithResponse).response?.data !== "undefined"
  );
}

export function getRequestErrorMessage(err: unknown, fallback: string) {
  if (hasResponseData(err)) {
    return String(err.response?.data);
  }

  return fallback;
}
