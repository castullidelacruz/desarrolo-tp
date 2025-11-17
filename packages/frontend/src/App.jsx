import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import Home from "./components/pages/Home/Home";
import Catalogo from "./components/pages/Productos/Productos";
import Perfil from "./components/pages/Perfil/Perfil";
import Login from "./components/pages/Auth/Login";
import Register from "./components/pages/Auth/Register";
import FormNuevoProducto from "./components/pages/Perfil/FormNuevoProducto";
import "./App.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ProductDetailPage from "./components/pages/ProductDetail/ProductDetailPage";
import Layout from "./components/Layout/Layout.jsx";
import { useState } from "react";
import Checkout from "./components/pages/Carrito/checkout/Checkout";
import CarritoWrapper from "./components/pages/Carrito/CarritoWrapper";
import { AuthProvider } from "./store/AuthContext";
import { CarritoProvider } from "./components/pages/Carrito/CarritoContext";

const theme = createTheme({
  palette: {
    primary: {
      main: "#92400e",
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <CarritoProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="/productos" element={<Catalogo />} />
                <Route path="/carrito" element={<CarritoWrapper />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registro" element={<Register />} />
                <Route path="/product/:id" element={<ProductDetailPage />} />
                <Route path="/checkout" element={<Checkout />} />
              </Route>
              <Route path="/nuevo-producto" element={<FormNuevoProducto />} />
            </Routes>
          </BrowserRouter>
        </CarritoProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
