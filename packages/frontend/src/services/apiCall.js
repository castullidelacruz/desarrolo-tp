import axios from "axios";

const host = process.env.REACT_APP_API_URL || "http://localhost:8000";
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || "accessToken";
const USER_KEY = process.env.REACT_APP_USER_KEY || "user";

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const handleInvalidToken = () => {
  clearStorage();

  if (
    !window.location.pathname.includes("/login") &&
    !window.location.pathname.includes("/registro")
  ) {
    window.location.href = "/login";
  }
};

export const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await axios(`${host}${endpoint}`, options);
    if (response.status === 204) return null;
    return response.data;
  } catch (error) {
    if (error.response) {
      const message =
        error.response.data?.error ||
        error.response.data?.message ||
        error.message ||
        "Algo salió mal";

      const normalizedError = new Error(message);
      normalizedError.status = error.response.status;
      normalizedError.data = error.response.data;
      normalizedError.cause = error;

      if (
        error.response.status === 401 ||
        error.response.status === 403 ||
        /jwt expired|invalid token/i.test(message)
      ) {
        console.warn("⚠️ Token inválido o expirado. Cerrando sesión...");
        handleInvalidToken();
      }

      throw normalizedError;
    }

    const networkError = new Error(error.message || "Error de red");
    networkError.cause = error;
    throw networkError;
  }
};
