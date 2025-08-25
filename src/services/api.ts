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


export const apiCmsMenus = (code: string) => {
    return axiosInstance.get(`/api/cms/menu/${code}`);
};

export const apiCmsPage = (slug: string) => {
    return axiosInstance.get(`/api/cms/page/${slug}`);
};

export const apiGetCountries = () => {      
    return axiosInstance.get(`/api/countries`);
};

export const apiGetStates = (country_id: any) => {
    return axiosInstance.get(`/api/countries/${country_id}/states`);
};

export const apiCmsHomeSlider = (code: string) => {
    return axiosInstance.get(`/api/cms/slider/${code}`);
};

export const apiCmsContact = (data: any) => {
    return axiosInstance.post(`/api/cms/contact_form`, data);
};
export const apiUserRegister = (data: any) => {
    return axiosInstance.post(`/api/user/register`, data);
};

export const apiUserLogin = (data: any) => {
    return axiosInstance.post(`/api/user/login`, data);
};

export const apiUserChangePassword = (data: any) => {
    return axiosInstance.post(`/api/user/change-password`, data);
};

export const apiUserForgetPassword = (data: any) => {
    return axiosInstance.post(`/api/user/forgot-password`, data);
};

export const apiUserResetPassword = (data: any) => {
    return axiosInstance.post(`/api/user/reset-password`, data);
};

export const apiUserProfile = () => {
    return axiosInstance.get(`/api/user/profile`);
};

export const apiUserLogout = () => {
    return axiosInstance.get(`/api/user/logout`);
};

export const apiGetTrusts = () => {
    return axiosInstance.get(`/api/trust`);
};

export const apiDonationTypes = (id: any) => {
    const queryParams = getQueryParamsFromObject(id);
    return axiosInstance.get(`/api/donation-types${queryParams}`);
};

export const apiDonationTypeBySlug = (slug: any, id: any) => {
    const queryParams = getQueryParamsFromObject(id);
    return axiosInstance.get(`/api/donation-types/${slug}${queryParams}`);
};

export const apiPanVerify = (data: any) => {
    return axiosInstance.post(`/api/pan/verify`, data);
};

export const apiAadhaarVerify = (data: any) => {
    return axiosInstance.post(`/api/aadhaar/verify`, data);
};

export const apiAadhaarGenerate = (data: any) => {
    return axiosInstance.post(`/api/aadhaar/generate`, data);
};

export const apiMobileGenerate = (data: any) => {
    return axiosInstance.post(`/api/mobile/generate`, data);
};

export const apiMobileVerify = (data: any) => {
    return axiosInstance.post(`/api/mobile/verify`, data);
};

export const apiCreateDonations = (data: any) => {
    return axiosInstance.post(`/api/donations`, data);
};
export const apiGetDonations = (params: any) => {
    const queryParams = getQueryParamsFromObject(params);
    return axiosInstance.get(`/api/donations${queryParams}`);
};
export const apiGetDonationsById = (donation_id: number) => {
    return axiosInstance.get(`/api/donations/${donation_id}`);
};

export const apiRazorpayCreate = (data: any) => {
    return axiosInstance.post(`/api/razorpay/create`, data);
};

export const apiRazorpayCallback = (data: any) => {
    return axiosInstance.post(`/api/razorpay/callback`, data);
};

// export const apiGetReceipt = (data: any) => {
//     return axiosInstance.post(`/api/donations/receipt`, data, {
//         responseType: "blob",
//         headers: {
//             "Content-Type": "application/json",
//         },
//     });
// };

export const apiGetReceipt = (data: any, config = {}) => {
  return axiosInstance.post("/api/donations/receipt", data, {
    responseType: "arraybuffer", // important
    ...config,
  })
}
