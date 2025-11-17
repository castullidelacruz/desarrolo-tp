import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Checkout.css";
import { TextField, Button, Card } from "@mui/material";
import PropTypes from "prop-types";
import { useCarrito } from "../../Carrito/CarritoContext.jsx";
import { useAuth } from "../../../../store/AuthContext.jsx";
import { crearPedido } from "../../../../services/pedidoService.js";
import { getProductoById } from "../../../../services/productService.js";

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

const Checkout = () => {
  const navigate = useNavigate();
  const { carrito, limpiarCarrito } = useCarrito();
  const { user, token } = useAuth();
  const subTotal = calcularTotal(carrito);

  const [email, setEmail] = useState(user?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const [calle, setCalle] = useState("");
  const [altura, setAltura] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [provincia, setProvincia] = useState("");

  // Estados de validación
  const [errors, setErrors] = useState({
    email: "",
    calle: "",
    altura: "",
    codigoPostal: "",
    provincia: "",
  });

  const validateForm = () => {
    const newErrors = {};

    // Validar email
    if (!email || !email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Ingresa un email válido";
    }

    // Validar calle
    if (!calle || !calle.trim()) {
      newErrors.calle = "La calle es obligatoria";
    }

    // Validar altura
    if (!altura || !altura.trim()) {
      newErrors.altura = "La altura es obligatoria";
    } else if (Number(altura) <= 0) {
      newErrors.altura = "La altura debe ser mayor a 0";
    }

    // Validar código postal
    if (!codigoPostal || !codigoPostal.trim()) {
      newErrors.codigoPostal = "El código postal es obligatorio";
    } else if (Number(codigoPostal) <= 0) {
      newErrors.codigoPostal = "El código postal debe ser válido";
    }

    // Validar provincia
    if (!provincia || !provincia.trim()) {
      newErrors.provincia = "La provincia es obligatoria";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmarCompra = async () => {
    setError("");
    setSuccess("");

    // Validar formulario antes de proceder
    if (!validateForm()) {
      setError("Por favor, completa todos los campos obligatorios correctamente.");
      return;
    }

    setLoading(true);

    try {
      if (!user || !token) {
        setError("Debes iniciar sesión para realizar un pedido.");
        navigate("/login");
        setLoading(false);
        return;
      }

      if (carrito.length === 0) {
        setError("Tu carrito está vacío.");
        setLoading(false);
        return;
      }

      const primerItem = carrito[0];

      let vendedorId =
        primerItem?.vendedor?._id ||
        primerItem?.vendedor ||
        primerItem?.producto?.vendedor?._id ||
        primerItem?.producto?.vendedor;

      if (!vendedorId && primerItem?._id) {
        try {
          const productoData = await getProductoById(primerItem._id);
          vendedorId = productoData?.vendedor?._id || productoData?.vendedor;
        } catch (e) {
          console.error("⚠️ No se pudo recuperar vendedor:", e);
        }
      }

      if (!vendedorId) {
        setError("No se pudo determinar el vendedor del pedido.");
        setLoading(false);
        return;
      }

      // Items en formato backend
      const items = carrito.map((item) => ({
        producto: item._id || item.id,
        cantidad: item.cantidad,
        precioUnitario: item.precio || item.precioUnitario || 0,
      }));

      const direccionEntrega = {
        calle,
        altura: Number(altura),
        codigoPostal,
        ciudad: "CABA",
        provincia,
        pais: "Argentina",
        lat: -34.578,
        long: -58.425,
      };

      const pedidoData = {
        comprador: user._id,
        vendedor: vendedorId,
        items,
        moneda: carrito[0]?.moneda || "PESO_ARG",
        direccionEntrega,
      };

      const response = await crearPedido(pedidoData, token);

      console.log("✅ Pedido creado:", response);

      setSuccess("Pedido creado exitosamente.");
      setShowSuccessToast(true);

      // Ocultar el toast después de 2 segundos y navegar
      setTimeout(() => {
        setShowSuccessToast(false);
        limpiarCarrito();
        navigate("/perfil");
      }, 2000);
    } catch (err) {
      console.error("❌ Error al crear pedido:", err);
      const mensaje =
        err?.response?.data?.error ||
        err?.response?.data?.message ||
        err.message ||
        "Ups. Algo sucedió en el servidor.";
      setError(mensaje);
    } finally {
      setLoading(false);
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="checkout-main-container">
        <Card
          className="form-container"
          style={{ margin: "3rem auto", textAlign: "center", padding: "2rem" }}
        >
          <h3>Carrito Vacío</h3>
          <p>No hay productos para proceder al pago.</p>
          <Button
            onClick={() => navigate("/productos")}
            variant="contained"
            style={{ marginTop: "1rem" }}
          >
            Volver a Productos
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="checkout-main-container">
      {/* Toast de éxito */}
      {showSuccessToast && (
        <div className="success-toast">
          <span className="success-icon">✓</span>
          ¡Tu pedido fue generado con éxito! Recibirás una notificación cuando
          el vendedor confirme el envío.
        </div>
      )}

      <p className="breadcrumb-checkout">Contacto / Envío / Pago</p>

      <div className="checkout-grid">
        <div className="checkout-contact-form">
          <div className="contact-info-section">
            <h3>Información de Contacto</h3>

            <TextField
              label="Email"
              required
              fullWidth
              margin="normal"
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (errors.email) {
                  setErrors({ ...errors, email: "" });
                }
              }}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
            />

            {/* CAMPOS DE ENTREGA */}
            <TextField
              label="Calle"
              name="calle"
              required
              fullWidth
              margin="normal"
              value={calle}
              onChange={(e) => {
                setCalle(e.target.value);
                if (errors.calle) {
                  setErrors({ ...errors, calle: "" });
                }
              }}
              error={!!errors.calle}
              helperText={errors.calle}
            />
            <TextField
              label="Altura"
              name="altura"
              type="number"
              required
              fullWidth
              margin="normal"
              value={altura}
              onChange={(e) => {
                setAltura(e.target.value);
                if (errors.altura) {
                  setErrors({ ...errors, altura: "" });
                }
              }}
              error={!!errors.altura}
              helperText={errors.altura}
            />
            <TextField
              label="Código Postal"
              name="codigoPostal"
              type="number"
              required
              fullWidth
              margin="normal"
              value={codigoPostal}
              onChange={(e) => {
                setCodigoPostal(e.target.value);
                if (errors.codigoPostal) {
                  setErrors({ ...errors, codigoPostal: "" });
                }
              }}
              error={!!errors.codigoPostal}
              helperText={errors.codigoPostal}
            />
            <TextField
              label="Provincia"
              name="provincia"
              fullWidth
              required
              margin="normal"
              value={provincia}
              onChange={(e) => {
                setProvincia(e.target.value);
                if (errors.provincia) {
                  setErrors({ ...errors, provincia: "" });
                }
              }}
              error={!!errors.provincia}
              helperText={errors.provincia}
            />

            {error && (
              <p style={{ color: "red", marginTop: "10px" }}>{error}</p>
            )}
            {success && (
              <p style={{ color: "green", marginTop: "10px" }}>{success}</p>
            )}
          </div>
        </div>

        <div className="checkout-summary-box">
          <h4 className="summary-title">Resumen de la Orden</h4>

          {carrito.map((item) => (
            <div key={item._id} className="summary-item">
              <img
                src={
                  item.fotos?.[0] ||
                  "https://placehold.co/60x60/f59e0b/ffffff?text=NoImagen"
                }
                alt={item.titulo}
                className="summary-item-image"
              />
              <div className="summary-item-details">
                <p className="summary-item-name">{item.titulo}</p>
                <p className="summary-item-quantity">
                  Cantidad: {item.cantidad}
                </p>
              </div>
              <span className="summary-item-price">
                {formatPrice(item.cantidad * item.precio)}
              </span>
            </div>
          ))}

          <div className="summary-separator"></div>

          <div className="summary-details-section">
            <div className="summary-details-row">
              <span>
                Productos (
                {carrito.reduce((total, item) => total + item.cantidad, 0)}{" "}
                ítems)
              </span>
              <span>{formatPrice(subTotal)}</span>
            </div>
          </div>

          <div className="summary-total-row">
            <strong>Total</strong>
            <strong>{formatPrice(subTotal)}</strong>
          </div>

          <div className="checkout-actions">
            <Button
              variant="contained"
              onClick={handleConfirmarCompra}
              disabled={loading}
              className="button-continue"
            >
              {loading ? "Procesando..." : "Confirmar compra"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

Checkout.propTypes = {
  carrito: PropTypes.array,
  limpiarCarrito: PropTypes.func,
};

export default Checkout;
