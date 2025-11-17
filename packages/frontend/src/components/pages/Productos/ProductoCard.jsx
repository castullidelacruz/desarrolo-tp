import React from "react";
import "./Productos.css";
import PropTypes from "prop-types";
import { transformCurrencySymbol } from "../../../utils/utils.js";
import ImageProduct from "../../shared/ImageProduct/ImageProduct.jsx";
import { notify } from "../../common/NotificationCenter.jsx";

const ProductCard = ({ prod, actualizarCarrito, navigate }) => {
  const handleVerDetalles = () => {
    navigate(`/product/${prod._id || prod.id}`);
  };

  const handleAddToCart = () => {
    actualizarCarrito(prod, 1);
  };

  const productPrice = prod.precio || "N/A";
  const productName = prod.titulo || prod.nombre;

  return (
    <div className="product-card">
      <ImageProduct url={prod.fotos?.[0]} alt={productName} />

      <div className="product-info">
        <h4>{productName}</h4>
        <p>{prod.descripcion}</p>
        <p>Vendedor: {prod.vendedor.nombre}</p>
        <p className="product-price">
          {transformCurrencySymbol(prod.moneda)} {productPrice}
        </p>
        <p className="product-category">{prod.categorias.join(", ")}</p>
      </div>

      <div className="product-actions">
        <button className="btn btn-details" onClick={handleVerDetalles}>
          Ver detalle
        </button>
        <button className="btn btn-cart" onClick={handleAddToCart}>
          🛒 Carrito
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  prod: PropTypes.object.isRequired,
  actualizarCarrito: PropTypes.func.isRequired,
  navigate: PropTypes.func.isRequired,
};

export default ProductCard;
