import { apiCall } from "./apiCall.js";

export const login = async (credentials) => {
  const response = await apiCall("/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: credentials,
  });

  return response;
};

export const register = async (userInfo) => {
  const response = await apiCall("/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: userInfo,
  });

  return response;
};
