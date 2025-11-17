import React from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Divider,
  Chip,
  Grid,
} from "@mui/material";
import {
  AccessTime,
  Person,
  Phone,
  Email,
  LocationOn,
} from "@mui/icons-material";

const DetallesPedidoModal = ({ open, onClose, pedido }) => {
  if (!pedido) return null;

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatearPrecio = (precio, moneda) => {
    const simbolos = { ARS: "$", USD: "USD", EUR: "€" };
    return `${simbolos[moneda] || ""} ${precio?.toFixed(2) || "0.00"}`;
  };

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

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5">Pedido #{pedido._id}</Typography>
          <Chip label={pedido.estado} color={getEstadoColor(pedido.estado)} />
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        <Box mb={3}>
          <Typography variant="h6" gutterBottom>
            <Person sx={{ verticalAlign: "middle", mr: 1 }} />
            Información del Comprador
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Person fontSize="small" color="action" />
                <Typography variant="body2">
                  {pedido.comprador?.nombre}
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box display="flex" alignItems="center" gap={1}>
                <Email fontSize="small" color="action" />
                <Typography variant="body2">
                  {pedido.comprador?.email}
                </Typography>
              </Box>
            </Grid>
            {pedido.comprador?.telefono && (
              <Grid item xs={12} sm={6}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body2">
                    {pedido.comprador.telefono}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        </Box>

        <Divider />

        {pedido.direccionEntrega && (
          <>
            <Box my={3}>
              <Typography variant="h6" gutterBottom>
                <LocationOn sx={{ verticalAlign: "middle", mr: 1 }} />
                Dirección de Entrega
              </Typography>
              <Typography variant="body2">
                {pedido.direccionEntrega.calle} {pedido.direccionEntrega.altura}
                {pedido.direccionEntrega.piso &&
                  `, Piso ${pedido.direccionEntrega.piso}`}
                {pedido.direccionEntrega.departamento &&
                  `, Depto ${pedido.direccionEntrega.departamento}`}
              </Typography>
              <Typography variant="body2">
                {pedido.direccionEntrega.ciudad},{" "}
                {pedido.direccionEntrega.provincia}
              </Typography>
              <Typography variant="body2">
                CP: {pedido.direccionEntrega.codigoPostal},{" "}
                {pedido.direccionEntrega.pais}
              </Typography>
            </Box>
            <Divider />
          </>
        )}

        <Box my={3}>
          <Typography variant="h6" gutterBottom>
            Productos
          </Typography>
          {pedido.items?.map((item, idx) => (
            <Box
              key={idx}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              py={1}
              borderBottom={
                idx < pedido.items.length - 1 ? "1px solid #eee" : "none"
              }
            >
              <Box>
                <Typography variant="body1">
                  {item.producto?.titulo || item.producto?.nombre || "Producto"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Cantidad: {item.cantidad} ×{" "}
                  {formatearPrecio(item.precioUnitario, pedido.moneda)}
                </Typography>
              </Box>
              <Typography variant="body1" fontWeight="bold">
                {formatearPrecio(
                  item.cantidad * item.precioUnitario,
                  pedido.moneda,
                )}
              </Typography>
            </Box>
          ))}
        </Box>

        <Divider />

        <Box
          my={3}
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Total</Typography>
          <Typography variant="h5" color="primary">
            {formatearPrecio(pedido.total, pedido.moneda)}
          </Typography>
        </Box>

        <Divider />

        {pedido.historialEstados && pedido.historialEstados.length > 0 && (
          <Box mt={3}>
            <Typography variant="h6" gutterBottom>
              <AccessTime sx={{ verticalAlign: "middle", mr: 1 }} />
              Historial de Estados
            </Typography>
            {pedido.historialEstados.map((cambio, idx) => (
              <Box key={idx} display="flex" alignItems="start" gap={2} py={1}>
                <Chip
                  label={cambio.estado}
                  size="small"
                  color={getEstadoColor(cambio.estado)}
                />
                <Box>
                  <Typography variant="body2">
                    {formatearFecha(cambio.fecha)}
                  </Typography>
                  {cambio.motivo && (
                    <Typography variant="caption" color="text.secondary">
                      {cambio.motivo}
                    </Typography>
                  )}
                </Box>
              </Box>
            ))}
          </Box>
        )}

        <Box mt={2}>
          <Typography variant="caption" color="text.secondary">
            Creado el {formatearFecha(pedido.fechaCreacion)}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
};

DetallesPedidoModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  pedido: PropTypes.shape({
    _id: PropTypes.string,
    estado: PropTypes.string,
    comprador: PropTypes.shape({
      nombre: PropTypes.string,
      email: PropTypes.string,
      telefono: PropTypes.string,
    }),
    direccionEntrega: PropTypes.shape({
      calle: PropTypes.string,
      altura: PropTypes.string,
      piso: PropTypes.string,
      departamento: PropTypes.string,
      codigoPostal: PropTypes.string,
      ciudad: PropTypes.string,
      provincia: PropTypes.string,
      pais: PropTypes.string,
    }),
    items: PropTypes.arrayOf(
      PropTypes.shape({
        producto: PropTypes.shape({
          titulo: PropTypes.string,
          nombre: PropTypes.string,
        }),
        cantidad: PropTypes.number,
        precioUnitario: PropTypes.number,
      }),
    ),
    total: PropTypes.number,
    moneda: PropTypes.string,
    historialEstados: PropTypes.arrayOf(
      PropTypes.shape({
        estado: PropTypes.string,
        fecha: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.instanceOf(Date),
        ]),
        motivo: PropTypes.string,
      }),
    ),
    fechaCreacion: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date),
    ]),
  }),
};

export default DetallesPedidoModal;
