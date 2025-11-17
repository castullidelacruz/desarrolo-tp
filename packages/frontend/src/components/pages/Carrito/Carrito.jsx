import React from "react";
import { useNavigate } from "react-router-dom";
import "./Carrito.css";
import PropTypes from "prop-types";

const formatPrice = (price, currency = "ARS") => {
  const symbol =
    currency === "DOLAR_USA" ? "USD" : currency === "REAL" ? "BRL" : "ARS";
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: symbol,
  }).format(price);
};

const calcularTotal = (carrito) => {
  return carrito.reduce((total, item) => {
    const price = item.precio || item.precioUnitario || 0;
    return total + price * (item.cantidad || 1);
  }, 0);
};

const Carrito = ({ carrito = [], eliminarProducto, limpiarCarrito }) => {
  const navigate = useNavigate();
  const subTotal = calcularTotal(carrito);

  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="carrito-main-content">
      <h2 className="page-title">Tu Carrito de Compras</h2>

      <p className="breadcrumb">Home / Carrito de Compras</p>

      <div className="carrito-grid">
        <div className="carrito-productos-tabla">
          <div className="tabla-header">
            <span className="col-producto">PRODUCTO</span>
            <span className="col-precio">PRECIO</span>
            <span className="col-cantidad">CANTIDAD</span>
            <span className="col-total">TOTAL</span>
          </div>

          {carrito.map((item) => {
            const itemTotal = (item.cantidad || 1) * item.precio;
            const currency = item.moneda || "ARS";
            const imageUrl =
              item.fotos?.[0] ||
              item.image ||
              "https://placehold.co/80x80/f59e0b/ffffff?text=NoImagen";

            return (
              <div key={item._id} className="tabla-fila">
                <div className="col-producto">
                  <img
                    src={imageUrl}
                    alt={item.titulo}
                    className="producto-imagen-mini"
                  />
                  <div className="producto-info-detalle">
                    <p className="producto-nombre">{item.titulo}</p>
                    <p className="producto-atributos">
                      Vendedor: {item.vendedor?.nombre || "ID"}
                    </p>
                    <button
                      className="boton-remove"
                      onClick={() => eliminarProducto(item._id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </div>

                <span className="col-precio">
                  {formatPrice(item.precio, currency)}
                </span>

                <span className="col-cantidad">
                  <input
                    type="number"
                    min="1"
                    value={item.cantidad}
                    className="input-cantidad"
                    readOnly
                  />
                </span>

                <span className="col-total">
                  {formatPrice(itemTotal, currency)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="carrito-resumen-order">
          <h3>Resumen del pedido</h3>

          <div className="resumen-row">
            <span>
              Productos (
              {carrito.reduce((total, item) => total + item.cantidad, 0)})
            </span>
            <span>{formatPrice(subTotal)}</span>
          </div>

          <div className="resumen-row total-row">
            <span>Total</span>
            <span>{formatPrice(subTotal)}</span>
          </div>

          <button
            className="button button--primary checkout-btn"
            onClick={handleCheckout}
          >
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

Carrito.propTypes = {
  carrito: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      titulo: PropTypes.string.isRequired,
      precio: PropTypes.number.isRequired,
      cantidad: PropTypes.number.isRequired,
      fotos: PropTypes.arrayOf(PropTypes.string),
    }),
  ).isRequired,
  eliminarProducto: PropTypes.func.isRequired,
  limpiarCarrito: PropTypes.func.isRequired,
};

export default Carrito;
