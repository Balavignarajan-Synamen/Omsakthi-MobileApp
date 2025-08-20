// utils/common.helper.ts

// ✅ Generate a UUID (v4 style)
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ✅ Convert object to query params (handles arrays too)
export function getQueryParamsFromObject(queryParams: Record<string, any>): string {
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

  // remove trailing "&" if exists
  return queryString.endsWith("&") ? queryString.slice(0, -1) : queryString;
}
