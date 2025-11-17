import React from "react";
import Carrito from "./Carrito";
import CarritoVacio from "./CarritoVacio";
import { useCarrito } from "./CarritoContext.jsx";

const CarritoWrapper = () => {
  const { carrito, eliminarProducto, limpiarCarrito } = useCarrito();

  if (!carrito || carrito.length === 0) return <CarritoVacio />;
  return (
    <Carrito
      carrito={carrito}
      eliminarProducto={eliminarProducto}
      limpiarCarrito={limpiarCarrito}
    />
  );
};

export default CarritoWrapper;
