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
  CircularProgress,
} from "@mui/material";
import { getPedidos } from "../../../services/pedidoService.js";
import { useAuth } from "../../../store/AuthContext";

const TabMisVentas = ({ abrirDetallePedido }) => {
  const { token, isAuthenticated, loading: authLoading } = useAuth();
  const [localPedidos, setLocalPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authLoading || !isAuthenticated) return;
    let mounted = true;

    const fetchPedidos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getPedidos(token, "VENDEDOR");
        if (!mounted) return;

        const pedidos = Array.isArray(data)
          ? data
          : Array.isArray(data?.data)
            ? data.data
            : [];
        setLocalPedidos(pedidos);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "No se pudieron cargar tus ventas.");
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
    return `${simbolos[moneda] || ""} ${precio.toFixed(2)}`;
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Mis ventas
      </Typography>

      {!authLoading && !isAuthenticated ? (
        <Alert severity="warning">
          Necesitas iniciar sesión para ver tus ventas.
        </Alert>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : localPedidos.length === 0 ? (
        <Alert severity="info">No tienes ventas registradas aún.</Alert>
      ) : (
        <Grid container spacing={2}>
          {localPedidos.map((pedido) => (
            <Grid item xs={12} key={pedido._id}>
              <Card
                variant="outlined"
                sx={{ cursor: "pointer" }}
                onClick={() => abrirDetallePedido(pedido)}
              >
                <CardContent>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="start"
                  >
                    <Box>
                      <Typography variant="h6">Pedido #{pedido._id}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        Cliente: {pedido.comprador?.nombre || "Sin nombre"}
                      </Typography>
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
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

TabMisVentas.propTypes = {
  abrirDetallePedido: PropTypes.func.isRequired,
};

export default TabMisVentas;
