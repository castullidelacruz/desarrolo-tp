import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  Typography,
  Box,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import {
  Email,
  Phone,
  ShoppingBag,
  Store,
  ShoppingCart,
  Logout,
} from "@mui/icons-material";
import DetallesPedidoModal from "./DetallesPedidoModal";
import TabMisCompras from "./TabMisCompras";
import TabMisVentas from "./TabMisVentas";
import TabMisProductos from "./TabMisProductos";
import "./Perfil.css";
import { useAuth } from "../../../store/AuthContext.jsx";
import { getPedidos, getPedidoById } from "../../../services/pedidoService.js";

const Perfil = () => {
  const [tabActual, setTabActual] = useState(0);
  const [usuario, setUsuario] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [pedidosCompra, setPedidosCompra] = useState([]);
  const [pedidosVenta, setPedidosVenta] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();
  const { user, token, logout } = useAuth();

  useEffect(() => {
    const cargarDatos = async () => {
      if (!user) {
        navigate("/login", { replace: true });
        return;
      }

      try {
        setLoading(true);
        setError(null);
        setUsuario(user);

        const compras = await getPedidos(token, "COMPRADOR");
        const ventas = await getPedidos(token, "VENDEDOR");

        setPedidosCompra(compras || []);
        setPedidosVenta(ventas || []);
      } catch (err) {
        console.error("❌ Error cargando perfil:", err);
        setError(err.message || "No se pudieron cargar los datos del perfil.");
      } finally {
        setLoading(false);
      }
    };

    cargarDatos();
  }, [user, token, navigate]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pedidoParam = params.get("pedido");
    if (!pedidoParam || !token) return;

    const fetchPedido = async () => {
      try {
        const pedidoId = pedidoParam.replace(/^#/, "");
        const response = await getPedidos(token, "COMPRADOR");
        const compras = Array.isArray(response)
          ? response
          : response?.data || [];

        const pedidoC = compras.find((p) => p._id === pedidoId);
        if (pedidoC) {
          const pedidoCompleto = await getPedidoById(pedidoId, token);
          const pedidoData = pedidoCompleto?.data || pedidoCompleto;
          setPedidoSeleccionado(pedidoData);
          setModalAbierto(true);
          setTabActual(0);
          return;
        }

        const responseVentas = await getPedidos(token, "VENDEDOR");
        const ventas = Array.isArray(responseVentas)
          ? responseVentas
          : responseVentas?.data || [];
        const pedidoV = ventas.find((p) => p._id === pedidoId);
        if (pedidoV) {
          const pedidoCompleto = await getPedidoById(pedidoId, token);
          const pedidoData = pedidoCompleto?.data || pedidoCompleto;
          setPedidoSeleccionado(pedidoData);
          setModalAbierto(true);
          setTabActual(1);
          return;
        }
      } catch (err) {
        console.error("Error al cargar pedido desde URL:", err);
      }
    };

    fetchPedido();
  }, [location.search, token]);

  const handleTabChange = (event, newValue) => {
    setTabActual(newValue);
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString("es-AR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const abrirDetallePedido = (pedido) => {
    setPedidoSeleccionado(pedido);
    setModalAbierto(true);
  };

  const cerrarDetallePedido = () => {
    setModalAbierto(false);
    setPedidoSeleccionado(null);
  };

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <div className="perfil-container">
      {/* === Datos del usuario === */}
      <Card className="perfil-card-usuario">
        <CardContent>
          <Box display="flex" alignItems="center" gap={3}>
            <Box flex={1}>
              <Typography variant="h4" gutterBottom>
                {usuario?.nombre}
              </Typography>
              <Box display="flex" flexDirection="column" gap={1}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Email fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {usuario?.email}
                  </Typography>
                </Box>
                <Box display="flex" alignItems="center" gap={1}>
                  <Phone fontSize="small" color="action" />
                  <Typography variant="body1" color="text.secondary">
                    {usuario?.telefono}
                  </Typography>
                </Box>
              </Box>
            </Box>
            <Box textAlign="right">
              <Typography variant="caption" color="text.secondary">
                Miembro desde
              </Typography>
              <Typography variant="body2">
                {formatearFecha(usuario?.fechaAlta)}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                startIcon={<Logout />}
                onClick={handleLogout}
                sx={{ mt: 2 }}
              >
                Cerrar Sesión
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* === Tabs === */}
      <Card className="perfil-card-tabs">
        <Tabs
          value={tabActual}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{ borderBottom: 1, borderColor: "divider" }}
        >
          <Tab
            icon={<ShoppingCart />}
            label="Mis Compras"
            iconPosition="start"
          />
          <Tab icon={<ShoppingBag />} label="Mis Ventas" iconPosition="start" />
          <Tab icon={<Store />} label="Mis Productos" iconPosition="start" />
        </Tabs>

        {tabActual === 0 && (
          <TabMisCompras
            pedidos={pedidosCompra}
            abrirDetallePedido={abrirDetallePedido}
          />
        )}
        {tabActual === 1 && (
          <TabMisVentas
            pedidos={pedidosVenta}
            abrirDetallePedido={abrirDetallePedido}
          />
        )}
        {tabActual === 2 && <TabMisProductos />}
      </Card>

      {/* === Modal de detalles === */}
      <DetallesPedidoModal
        open={modalAbierto}
        onClose={cerrarDetallePedido}
        pedido={pedidoSeleccionado}
      />
    </div>
  );
};

export default Perfil;
