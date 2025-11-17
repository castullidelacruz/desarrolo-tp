import React from "react";
import "./CarouselItem.css";
import PropTypes from "prop-types";
import { transformCurrencySymbol } from "../../../../../utils/utils";
import { useNavigate } from "react-router-dom";
import ImageProduct from "../../../../shared/ImageProduct/ImageProduct";

const CarouselItem = ({ product }) => {
  const navigate = useNavigate();

  const handleVerDetalles = () => {
    navigate(`/product/${product._id}`);
  };

  return (
    <div key={product._id} className="carousel-card">
      <div className="product-card">
        <ImageProduct url={product.fotos?.[0]} alt={product.titulo} />
        <div className="product-info">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h3 className="product-name">{product.titulo}</h3>
            <span className="product-price">
              {transformCurrencySymbol(product.moneda)}
              {product.precio}
            </span>
          </div>
          <div className="ver-detalles-container">
            <button className="btn btn-details" onClick={handleVerDetalles}>
              Ver Detalles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarouselItem;

CarouselItem.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    titulo: PropTypes.string,
    moneda: PropTypes.string,
    precio: PropTypes.number,
    fotos: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};
