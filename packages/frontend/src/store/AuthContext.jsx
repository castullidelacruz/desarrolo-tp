import React, { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import { jwtDecode } from "jwt-decode";
import { login as loginApi } from "../services/authService";

// 🔑 Claves de localStorage
const TOKEN_KEY = process.env.REACT_APP_TOKEN_KEY || "accessToken";
const USER_KEY = process.env.REACT_APP_USER_KEY || "user";

// 🔧 Helpers para manejo de localStorage
const getAccessToken = () => localStorage.getItem(TOKEN_KEY);

const getCurrentUser = () => {
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

const setStorageToken = (token) => localStorage.setItem(TOKEN_KEY, token);
const setStorageUser = (user) =>
  localStorage.setItem(USER_KEY, JSON.stringify(user));

const clearStorage = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

// 🧩 Contexto de autenticación
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🔁 Cargar usuario y token al montar, validando expiración
  useEffect(() => {
    const token = getAccessToken();
    const user = getCurrentUser();

    if (token && user) {
      try {
        const decoded = jwtDecode(token);

        // Verificar si el token expiró
        if (decoded.exp * 1000 < Date.now()) {
          console.warn("⚠️ Token expirado, limpiando sesión");
          clearStorage();
        } else {
          setToken(token);
          setUser(user);
        }
      } catch (err) {
        console.error("❌ Token inválido:", err);
        clearStorage();
      }
    }

    setLoading(false);
  }, []);

  // 🔐 Login
  const loginUser = async (credentials) => {
    const response = await loginApi(credentials);
    const { accessToken, user } = response;

    // Guardar en storage
    setStorageToken(accessToken);
    setStorageUser(user);

    // Actualizar estado
    setToken(accessToken);
    setUser(user);

    return response;
  };

  // 🚪 Logout
  const logout = () => {
    clearStorage();
    setToken(null);
    setUser(null);
  };

  // 🌐 Valor del contexto
  const value = {
    user,
    token,
    login: loginUser,
    logout,
    isAuthenticated: !!token,
    loading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// 🎯 Hook de acceso al contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};
