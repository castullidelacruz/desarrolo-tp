import React, { useState } from "react";
import PropTypes from "prop-types";
import "./ProductGallery.css";
import ImageProduct from "../ImageProduct/ImageProduct.jsx";

const ProductGallery = ({ images = [], alt = "Producto", fallback = "" }) => {
  const fromPhotos = Array.isArray(images) ? images.filter(Boolean) : [];
  const validImages = fromPhotos.length
    ? fromPhotos
    : fallback
      ? [fallback]
      : [];
  const [index, setIndex] = useState(0);

  const prev = () => setIndex((i) => (i > 0 ? i - 1 : validImages.length - 1));
  const next = () => setIndex((i) => (i < validImages.length - 1 ? i + 1 : 0));

  const hasThumbs = validImages.length > 1 && fromPhotos.length > 1;

  return (
    <div className="pg-container">
      {hasThumbs && (
        <div className="pg-thumbs">
          {validImages.map((src, i) => (
            <button
              key={src + i}
              type="button"
              className={`pg-thumb ${i === index ? "active" : ""}`}
              onClick={() => setIndex(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={src} alt={`${alt} ${i + 1}`} />
            </button>
          ))}
        </div>
      )}

      <div className="pg-viewer">
        {hasThumbs && (
          <button
            className="pg-nav pg-prev"
            type="button"
            onClick={prev}
            aria-label="Anterior"
          >
            ‹
          </button>
        )}
        <div className="pg-image-wrap">
          <ImageProduct url={validImages[index]} alt={alt} />
        </div>
        {hasThumbs && (
          <button
            className="pg-nav pg-next"
            type="button"
            onClick={next}
            aria-label="Siguiente"
          >
            ›
          </button>
        )}
      </div>
    </div>
  );
};

ProductGallery.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
  alt: PropTypes.string,
  fallback: PropTypes.string,
};

export default ProductGallery;
