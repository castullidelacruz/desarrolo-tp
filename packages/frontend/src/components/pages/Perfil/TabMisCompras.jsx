import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import { getPedidos, cancelarPedido } from "../../../services/pedidoService.js";
import { useAuth } from "../../../store/AuthContext";

const TabMisCompras = ({ abrirDetallePedido }) => {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const [localPedidos, setLocalPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [canceling, setCanceling] = useState(null);
  const [showCancelToast, setShowCancelToast] = useState(false);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let mounted = true;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPedidos(token, "COMPRADOR");
        if (!mounted) return;

        const pedidos = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        setLocalPedidos(pedidos);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "No se pudieron cargar tus compras.");
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchPedidos();
    return () => (mounted = false);
  }, [authLoading, isAuthenticated, token]);

  const getEstadoColor = (estado) => {
    const colores = {
      PENDIENTE: "warning",
      CONFIRMADO: "info",
      EN_PREPARACION: "secondary",
      ENVIADO: "primary",
      ENTREGADO: "success",
      CANCELADO: "error",
    };
    return colores[estado] || "default";
  };

  const formatearFecha = (fecha) =>
    new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatearPrecio = (precio, moneda) => {
    const simbolos = { PESO_ARG: "$", DOLAR_USA: "USD", REAL: "R$" };
    return `${simbolos[moneda] || ""} ${precio?.toFixed(2)}`;
  };

  const handleCancelarPedido = async (pedidoId) => {
    if (!window.confirm("¿Seguro que deseas cancelar este pedido?")) return;
    try {
      setCanceling(pedidoId);
      await cancelarPedido(pedidoId);

      // Recargar los pedidos para obtener el estado actualizado
      const data = await getPedidos(token, "COMPRADOR");
      const pedidos = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : [];
      setLocalPedidos(pedidos);

      // Mostrar toast de éxito
      setShowCancelToast(true);
      setTimeout(() => {
        setShowCancelToast(false);
      }, 2000);
    } catch (e) {
      alert(e.message || "No se pudo cancelar el pedido.");
    } finally {
      setCanceling(null);
    }
  };

  return (
    <Box p={3}>
      {/* Toast de cancelación exitosa */}
      {showCancelToast && (
        <Box
          sx={{
            position: "fixed",
            top: 20,
            right: 20,
            backgroundColor: "#4caf50",
            color: "white",
            padding: "16px 24px",
            borderRadius: "8px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "1rem",
            fontWeight: 500,
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              color: "#4caf50",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: 18,
            }}
          >
            ✓
          </Box>
          Tu pedido fue cancelado exitosamente.
        </Box>
      )}

      <Typography variant="h5" gutterBottom>
        Mis compras
      </Typography>

      {!authLoading && !isAuthenticated ? (
        <Alert severity="warning">Iniciá sesión para ver tus compras.</Alert>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : localPedidos?.length === 0 ? (
        <Alert severity="info">No realizaste compras aún.</Alert>
      ) : (
        <Grid container spacing={2}>
          {localPedidos.map((pedido) => (
            <Grid item xs={12} key={pedido._id}>
              <Card
                variant="outlined"
                sx={{
                  borderLeft:
                    pedido.estado === "CANCELADO"
                      ? "4px solid #f44336"
                      : "4px solid transparent",
                }}
              >
                <CardContent
                  onClick={() => abrirDetallePedido(pedido)}
                  sx={{ cursor: "pointer", pb: 1 }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Box>
                      <Typography variant="h6">Pedido #{pedido._id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {formatearFecha(pedido.fechaCreacion)}
                      </Typography>
                      <Box mt={1}>
                        {pedido.items?.map((item, idx) => (
                          <Typography key={idx} variant="body2">
                            • {item.producto?.titulo || "Producto"} ×{" "}
                            {item.cantidad}
                          </Typography>
                        ))}
                      </Box>
                    </Box>
                    <Box textAlign="right">
                      <Chip
                        label={pedido.estado}
                        color={getEstadoColor(pedido.estado)}
                        size="small"
                      />
                      <Typography variant="h6" mt={1}>
                        {formatearPrecio(pedido.total || 0, pedido.moneda)}
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>

                {pedido.estado === "PENDIENTE" && (
                  <Box px={2} pb={2}>
                    <Button
                      variant="outlined"
                      color="error"
                      size="small"
                      disabled={canceling === pedido._id}
                      onClick={() => handleCancelarPedido(pedido._id)}
                    >
                      {canceling === pedido._id
                        ? "Cancelando..."
                        : "Cancelar pedido"}
                    </Button>
                  </Box>
                )}
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

TabMisCompras.propTypes = {
  abrirDetallePedido: PropTypes.func.isRequired,
};

export default TabMisCompras;
