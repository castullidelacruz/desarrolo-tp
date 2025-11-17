import React from "react";
import "./ImageProduct.css"; // Estilos específicos para la imagen del producto
import PropTypes from "prop-types";

const ImageProduct = ({ url, alt }) => {
  const handleError = (e) => {
    e.target.onerror = null;
    e.target.classList.add("no-image");
    e.target.parentNode.innerHTML = "Imagen no disponible";
  };

  return (
    <div className="product-image-container">
      {url ? (
        <img
          src={url}
          alt={alt}
          className="product-image"
          onError={handleError}
        />
      ) : (
        <div className="product-image no-image">Imagen no disponible</div>
      )}
    </div>
  );
};

ImageProduct.propTypes = {
  url: PropTypes.string,
  alt: PropTypes.string,
};

export default ImageProduct;
