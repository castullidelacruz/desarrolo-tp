import React from "react";
import { useNavigate } from "react-router-dom";

const CarritoVacio = () => {
  const navigate = useNavigate();
  return (
    <div className="carrito-main-content">
      <h2 className="page-title">Tu Carrito de Compras</h2>
      <div className="carrito-empty-state">
        <p className="carrito-message">
          Aún no tienes productos en tu carrito.
        </p>
        <button
          className="button button--primary"
          onClick={() => navigate("/productos")}
        >
          Explorar Productos
        </button>
      </div>
    </div>
  );
};

export default CarritoVacio;
