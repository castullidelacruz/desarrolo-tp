import React, { useEffect, useState, useCallback, useRef } from "react";
import "./ProductCarousel.css";
import CarouselItem from "./itemCarousel/CarouselItem.jsx";
import PropTypes from "prop-types";

const MIN_CARD_WIDTH = 300; // px including padding
const MAX_VISIBLE = 3; // upper bound to avoid too many tiny cards

const computeVisible = (containerWidth) => {
  if (!containerWidth || containerWidth < MIN_CARD_WIDTH) return 1;
  const count = Math.floor(containerWidth / MIN_CARD_WIDTH);
  return Math.max(1, Math.min(MAX_VISIBLE, count));
};

export default function ProductCarousel({ products }) {
  const [index, setIndex] = useState(0);
  const [visible, setVisible] = useState(3);
  const viewportRef = useRef(null);

  // Measure container and update visible count
  const recalcVisible = useCallback(() => {
    if (!viewportRef.current) return;
    const width = viewportRef.current.offsetWidth;
    if (width === 0) return; // Skip if not mounted yet
    const newVisible = computeVisible(width);
    setVisible((prev) => (prev !== newVisible ? newVisible : prev));
  }, []);

  useEffect(() => {
    // Defer calculation to ensure DOM is ready
    const timer = setTimeout(recalcVisible, 0);
    window.addEventListener("resize", recalcVisible);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", recalcVisible);
    };
  }, [recalcVisible]);

  useEffect(() => {
    setIndex(0);
  }, [products]);

  // Clamp index if visible count changes so we never overflow
  useEffect(() => {
    const maxStart = Math.max(0, products.length - visible);
    if (index > maxStart) setIndex(maxStart);
  }, [visible, products.length, index]);

  const siguiente = () => {
    setIndex((prev) => (prev < products.length - visible ? prev + 1 : prev));
  };

  const anterior = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : prev));
  };

  if (!Array.isArray(products) || products.length === 0) {
    return <p className="carousel-empty">No hay productos disponibles</p>;
  }

  return (
    <div className="carousel-container">
      <h2 className="carousel-title">Nuestras ofertas más radiantes</h2>

      <div className="carousel-wrapper">
        <div className="carousel-viewport" ref={viewportRef}>
          <div
            className="carousel-track"
            style={{
              "--visible": visible,
              transform: `translateX(-${index * (100 / visible)}%)`,
            }}
          >
            {products.map((product) => (
              <CarouselItem product={product} key={product._id || product.id} />
            ))}
          </div>
        </div>

        <button
          onClick={anterior}
          disabled={index === 0}
          aria-label="Anterior"
          className={`carousel-btn left-btn ${index === 0 ? "disabled" : ""}`}
        >
          ◀
        </button>

        <button
          onClick={siguiente}
          disabled={index >= products.length - visible}
          aria-label="Siguiente"
          className={`carousel-btn right-btn ${
            index >= products.length - visible ? "disabled" : ""
          }`}
        >
          ▶
        </button>
      </div>
    </div>
  );
}

ProductCarousel.propTypes = {
  products: PropTypes.arrayOf(PropTypes.object).isRequired,
};
