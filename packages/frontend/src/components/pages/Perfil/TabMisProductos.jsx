import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Alert,
  Button,
  CircularProgress,
  CardActions,
} from "@mui/material";
import { ToggleButton, ToggleButtonGroup } from "@mui/material";
import { getMisProductos } from "../../../services/productService";
import { useAuth } from "../../../store/AuthContext";
import ImageProduct from "../../shared/ImageProduct/ImageProduct.jsx";
import { transformCurrencySymbol } from "../../../utils/utils.js";

const TabMisProductos = () => {
  const navigate = useNavigate();
  const { token, isAuthenticated, loading: authLoading } = useAuth();

  // Estado local cuando no vienen por props
  const [localProductos, setLocalProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filtro, setFiltro] = useState("activos"); // activos | inactivos | todos

  const handleNuevoProducto = () => {
    navigate("/nuevo-producto");
  };

  const handleFiltroChange = (_e, value) => {
    if (value) setFiltro(value);
  };

  useEffect(() => {
    // Si no recibimos datos por props, buscamos del servicio
    if (authLoading) return;
    if (!isAuthenticated) return;
    let mounted = true;
    const fetchProductos = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getMisProductos(token);
        if (!mounted) return;
        setLocalProductos(Array.isArray(data) ? data : data?.data || []);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "No se pudieron cargar tus productos.");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchProductos();
    return () => {
      mounted = false;
    };
  }, [authLoading, isAuthenticated, token]);

  return (
    <Box p={3}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
        gap={1}
        flexWrap="wrap"
      >
        <Typography variant="h5">Mis Productos</Typography>
        <ToggleButtonGroup
          value={filtro}
          exclusive
          onChange={handleFiltroChange}
          size="small"
          color="primary"
        >
          <ToggleButton value="activos">Activos</ToggleButton>
          <ToggleButton value="inactivos">Inactivos</ToggleButton>
          <ToggleButton value="todos">Todos</ToggleButton>
        </ToggleButtonGroup>
        <Button
          variant="contained"
          color="primary"
          onClick={handleNuevoProducto}
        >
          Nuevo Producto
        </Button>
      </Box>
      {!authLoading && !isAuthenticated ? (
        <Alert severity="warning">
          Necesitas iniciar sesión para ver tus productos.
        </Alert>
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : localProductos?.length === 0 ? (
        <Alert severity="info">No tienes productos publicados aún.</Alert>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(12, minmax(0, 1fr))",
              sm: "repeat(12, minmax(0, 1fr))",
              md: "repeat(12, minmax(0, 1fr))",
              lg: "repeat(12, minmax(0, 1fr))",
            },
            gap: 2, // theme spacing (equiv a spacing={2})
            width: "100%",
          }}
        >
          {localProductos
            .filter((p) =>
              filtro === "todos"
                ? true
                : filtro === "activos"
                  ? !!p.activo
                  : !p.activo,
            )
            .map((producto) => {
              const cats = Array.isArray(producto.categorias)
                ? producto.categorias
                : [];
              const mostradas = cats.slice(0, 2);
              const restantes = Math.max(0, cats.length - 2);
              const fecha = producto.updatedAt || producto.createdAt;
              return (
                <Box
                  key={producto._id}
                  sx={{
                    gridColumn: {
                      xs: "span 12",
                      sm: "span 6",
                      md: "span 4",
                      lg: "span 4",
                    },
                  }}
                >
                  <Card
                    variant="outlined"
                    sx={{
                      // Altura fija y responsive para todas las cards
                      height: { xs: 380, sm: 420, md: 460, lg: 480 },
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    {/* Imagen de alto fijo, no depende del contenido */}
                    <ImageProduct
                      url={producto.fotos?.[0]}
                      alt={producto.titulo}
                    />

                    <CardContent
                      sx={{
                        flexGrow: 1,
                        display: "flex",
                        flexDirection: "column",
                        gap: 1,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        sx={{
                          fontWeight: 600,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: 48, // ~2 líneas
                        }}
                      >
                        {producto.titulo || producto.nombre}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          minHeight: 40, // ~2 líneas
                        }}
                      >
                        {producto.descripcion}
                      </Typography>

                      {/* Categorías */}
                      {cats.length > 0 && (
                        <Box
                          sx={{ display: "flex", gap: 0.5, flexWrap: "wrap" }}
                        >
                          {mostradas.map((c) => (
                            <Chip
                              key={c}
                              label={c}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                          {restantes > 0 && (
                            <Chip
                              label={`+${restantes}`}
                              size="small"
                              variant="outlined"
                            />
                          )}
                        </Box>
                      )}

                      {/* Precio, Stock y Estado */}
                      <Box
                        mt={1}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="h6"
                          color="primary"
                          sx={{ fontWeight: 700 }}
                        >
                          {transformCurrencySymbol(producto.moneda)}{" "}
                          {producto.precio}
                        </Typography>
                        <Box sx={{ display: "flex", gap: 0.5 }}>
                          <Chip
                            label={`Stock: ${producto.stock}`}
                            size="small"
                            color={producto.stock > 0 ? "success" : "error"}
                          />
                          <Chip
                            label={producto.activo ? "Activo" : "Inactivo"}
                            size="small"
                            color={producto.activo ? "success" : "default"}
                          />
                        </Box>
                      </Box>

                      {/* Métricas */}
                      <Box
                        mt={1}
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Chip
                          label={`Vendidos: ${producto.vendidos ?? 0}`}
                          size="small"
                        />
                        {fecha && (
                          <Typography variant="caption" color="text.secondary">
                            {`Act: ${new Date(fecha).toLocaleDateString()}`}
                          </Typography>
                        )}
                      </Box>
                    </CardContent>

                    <CardActions
                      sx={{
                        p: 2,
                        pt: 0,
                        display: "flex",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={() =>
                          navigate(`/editar-producto/${producto._id}`)
                        }
                      >
                        Editar
                      </Button>
                    </CardActions>
                  </Card>
                </Box>
              );
            })}
        </Box>
      )}
    </Box>
  );
};

export default TabMisProductos;
