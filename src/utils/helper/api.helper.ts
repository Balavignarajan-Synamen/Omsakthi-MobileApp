import { AxiosError } from "axios";

export function handleApiErrors(err: any): string | null {
  console.log("API Error:", err);

  // If error comes directly with status
  if (err?.status === 404) return null;
  if (err?.status === 400) return "Invalid request. Please check your input.";
  if (err?.status === 401) return "Unauthorized access. Please login again.";
  if (err?.status === 500) return "Server error. Please try again later.";

  // If using Axios
  const axiosError = err as AxiosError<any>;
  const status = axiosError?.response?.status;

  if (status === 404) return null;
  if (status === 400) return "Invalid request. Please check your input.";
  if (status === 401) return "Unauthorized access. Please login again.";
  if (status === 500) return "Server error. Please try again later.";

  const message = axiosError?.response?.data?.message;
  if (message) return message;

  return "Something went wrong. Please try again.";
}

// ✅ Clean API request data (remove null/empty values)
export function cleanApiReq(data: Record<string, any>) {
  return Object.entries(data)
    .filter(([_, value]) => value !== null && value !== "")
    .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
}

// ✅ Convert query params to string (handles arrays also)
export function toApiParams(queryParams: Record<string, any>): string {
  let queryString = "?";

  for (const key in queryParams) {
    const value = queryParams[key];
    if (value !== null && value !== undefined && value !== "") {
      if (Array.isArray(value)) {
        value.forEach((v) => {
          queryString += `${encodeURIComponent(key)}[]=${encodeURIComponent(v)}&`;
        });
      } else {
        queryString += `${encodeURIComponent(key)}=${encodeURIComponent(value)}&`;
      }
    }
  }

  // remove last "&"
  return queryString.endsWith("&") ? queryString.slice(0, -1) : queryString;
}

