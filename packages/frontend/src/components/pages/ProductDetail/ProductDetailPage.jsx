import { useParams } from "react-router-dom";
import "./ProductDetailPage.css";
import { getProductoById } from "../../../services/productService.js";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import React from "react";
import PropTypes from "prop-types";
import { transformCurrencySymbol } from "../../../utils/utils.js";
import { useCarrito } from "../../../components/pages/Carrito/CarritoContext.jsx";
import ProductGallery from "../../shared/ProductGallery/ProductGallery.jsx";

const ProductDetailPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cantidad, setCantidad] = useState(1);
  const navigate = useNavigate();
  const { agregarAlCarrito } = useCarrito();

  useEffect(() => {
    setCantidad(1);
  }, [id]);

  const incrementarCantidad = () => {
    const nuevaCantidad = cantidad + 1;
    if (product.stock && nuevaCantidad > product.stock) return;
    setCantidad(nuevaCantidad);
  };

  const decrementarCantidad = () => {
    if (cantidad > 1) {
      const nuevaCantidad = cantidad - 1;
      setCantidad(nuevaCantidad);
    }
  };

  const comprar = () => {
    const ok = agregarAlCarrito(product, cantidad);

    if (ok === false) {
      return;
    }
    
    navigate("/carrito");
  };

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const productData = await getProductoById(id);
        setProduct(productData.data);
      } catch (err) {
        console.error(err);
        setError(
          "No se pudo cargar el producto. Verifica la conexión con el Backend.",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="product-detail-container loading-state">
        Cargando producto...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-detail-container error-state">
        <div className="product-header">
          <h1>Error de Carga</h1>
          <p>{error || `Producto con ID "${id}" no encontrado.`}</p>
        </div>
      </div>
    );
  }

  const tituloProducto = product.titulo || "Sin Título";
  const precioProducto = product.precio || 0;
  const descripcionProducto =
    product.descripcion || "Sin descripción disponible.";
  const nombreVendedor = product.vendedor
    ? product.vendedor.nombre || product.vendedor._id
    : "Vendedor Desconocido";

  const imagenes = Array.isArray(product.fotos) ? product.fotos : [];

  return (
    <div className="product-detail-container">
      <div className="product-header">
        <h1 className="product-nombre">{tituloProducto}</h1>
        <div className="product-seller-header">
          Vendedor: <strong>{nombreVendedor}</strong>
        </div>
      </div>

      <div className="product-content">
        <div className="product-image-section">
          <ProductGallery
            images={imagenes}
            alt={tituloProducto}
            fallback={product.image || ""}
          />
        </div>

        <div className="product-info-section">
          <div className="info-main-details">
            <div className="details-col-description">
              <div className="product-description">
                <p>{descripcionProducto}</p>
              </div>
            </div>
          </div>

          <div className="product-price-section">
            <div className="product-precio">
              {transformCurrencySymbol(product.moneda)} {precioProducto}
            </div>
            <div className="price-details">Impuestos incluidos</div>
          </div>
        </div>
      </div>

      <div className="buy-actions">
        <p>
          {product.stock > 0
            ? `Stock disponible: ${product.stock}`
            : "Sin stock disponible"}
        </p>
        <ButtonGroup variant="outlined" aria-label="outlined button group">
          <Button onClick={decrementarCantidad} disabled={cantidad === 1}>
            -
          </Button>
          <Button disabled>{cantidad}</Button>
          <Button
            onClick={incrementarCantidad}
            disabled={product.stock && cantidad >= product.stock}
          >
            +
          </Button>
        </ButtonGroup>

        <button className="btn-compra-final" onClick={comprar}>
          Agregar
        </button>
      </div>
    </div>
  );
};

ProductDetailPage.propTypes = {
  carrito: PropTypes.array.isRequired,
  actualizarCarrito: PropTypes.func.isRequired,
};

export default ProductDetailPage;
