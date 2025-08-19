import axiosInstance from "../utils/config/axiosInstance";

export function getQueryParamsFromObject(queryParams: Record<string, any>): string {
  let queryString = "?";

  for (const key in queryParams) {
    if (
      queryParams[key] !== null &&
      queryParams[key] !== undefined &&
      queryParams[key] !== ""
    ) {
      if (Array.isArray(queryParams[key])) {
        queryParams[key].forEach((value: any) => {
          queryString += `${encodeURIComponent(key)}[]=${encodeURIComponent(value)}&`;
        });
      } else {
        queryString += `${encodeURIComponent(key)}=${encodeURIComponent(queryParams[key])}&`;
      }
    }
  }
  queryString = queryString.slice(0, -1);
  return queryString;
}

export const apiCmsHomeSlider = (code: string) => {
  return axiosInstance.get(`/api/cms/slider/${code}`);
};

export const apiGetTrusts = () => {
  return axiosInstance.get(`/api/trust`);
};
