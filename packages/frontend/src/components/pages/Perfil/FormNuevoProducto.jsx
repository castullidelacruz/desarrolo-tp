import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../../../store/AuthContext.jsx";
import { crearProducto } from "../../../services/productService.js";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  MenuItem,
  Alert,
  Select,
  IconButton,
  ImageList,
  ImageListItem,
  OutlinedInput,
  ImageListItemBar,
  InputLabel,
  FormControl,
  ListItemText,
  Checkbox,
  Chip,
  FormHelperText,
} from "@mui/material";
import { PhotoCamera, Delete, ArrowBack } from "@mui/icons-material";
import { categorias } from "../../../mockdata/categorias.js";

const FormNuevoProducto = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    moneda: "",
    stock: "",
    categorias: [],
    fotos: [],
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { token } = useAuth();
  const alertRef = useRef(null);

  const monedas = [
    { value: "PESO_ARG", label: "$" },
    { value: "DOLAR_USA", label: "USD$" },
    { value: "REAL", label: "R$" },
  ];

  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 300,
      },
    },
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImageUpload = (e) => {
    const newFiles = Array.from(e.target.files);
    const currentCount = formData.fotos.length;
    const maxAllowed = 3;
    const availableSlots = maxAllowed - currentCount;

    if (newFiles.length > availableSlots) {
      alert(
        `Solo puedes subir un máximo de ${maxAllowed} fotos. Seleccionaste ${newFiles.length} nuevas, pero solo quedan ${availableSlots} espacios.`,
      );
      return; // Detener la subida si excede el límite
    }

    // Validar que todos los archivos sean imágenes
    const validImageTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
    ];
    const invalidFiles = newFiles.filter(
      (file) => !validImageTypes.includes(file.type.toLowerCase()),
    );

    if (invalidFiles.length > 0) {
      alert(
        `Solo se permiten archivos de imagen (JPEG, PNG, WebP).\n\nArchivos rechazados:\n${invalidFiles.map((f) => f.name).join("\n")}`,
      );
      e.target.value = null; // Limpiar el input
      return;
    }

    // Validar tamaño de archivos (5MB máximo por archivo)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = newFiles.filter((file) => file.size > maxSize);

    if (oversizedFiles.length > 0) {
      alert(
        `Algunos archivos exceden el tamaño máximo de 5MB:\n\n${oversizedFiles.map((f) => `${f.name} (${(f.size / 1024 / 1024).toFixed(2)}MB)`).join("\n")}`,
      );
      e.target.value = null; // Limpiar el input
      return;
    }

    newFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({
          ...prev,
          fotos: [
            ...prev.fotos,
            {
              id: Date.now() + Math.random(),
              url: event.target.result,
              file: file, // Guardamos el objeto File para enviarlo al backend
            },
          ],
        }));
      };
      reader.readAsDataURL(file); // Usamos Data URL para la previsualización
    });

    // Importante: Limpiar el valor del input file para permitir subir la misma imagen si es necesario
    e.target.value = null;
  };

  const removeImage = (imageId) => {
    setFormData((prev) => ({
      ...prev,
      fotos: prev.fotos.filter((foto) => foto.id !== imageId),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = "La descripción es obligatoria";
    }

    if (!formData.precio || formData.precio <= 0) {
      newErrors.precio = "El precio debe ser mayor a 0";
    }

    if (!formData.stock || formData.stock < 0) {
      newErrors.stock = "El stock no puede ser negativo";
    }

    if (!formData.categorias || formData.categorias.length === 0) {
      newErrors.categorias = "Selecciona al menos una categoría";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    // 1. Crear un objeto FormData
    const productFormData = new FormData();

    // 2. Adjuntar los campos de texto al FormData
    productFormData.append("titulo", formData.nombre.trim());
    productFormData.append("descripcion", formData.descripcion.trim());
    productFormData.append("categorias", JSON.stringify(formData.categorias)); // JSON.stringify para arrays
    productFormData.append("precio", Number(formData.precio));
    productFormData.append("moneda", formData.moneda);
    productFormData.append("stock", Number(formData.stock));
    productFormData.append("activo", true); // u otros campos booleanos/estáticos

    // 3. Adjuntar los archivos de imagen. El backend buscará 'fotos'
    formData.fotos.forEach((foto) => {
      productFormData.append("fotos", foto.file); // ¡Aquí adjuntamos el objeto File!
    });

    try {
      // Obtener token desde el contexto
      if (!token) {
        setErrors({
          submit: "No autenticado. Inicia sesión para poder publicar.",
        });
        setLoading(false);
        return;
      }

      const { data, success } = await crearProducto(productFormData, token);

      // La API puede devolver diferentes formatos; asumimos éxito por status 201
      setSuccess(true);

      // Redirigir al perfil después de 1.5 segundos para buena UX
      setTimeout(() => {
        navigate("/perfil");
      }, 1500);
    } catch (error) {
      console.error("Error al crear producto:", error);

      // Manejo de errores normalizados por apiCall
      if (error.data && error.data.details) {
        // Zod u otro detalle de validación del backend
        const details = error.data.details;
        // Intentar mapear issues a errores de campo si tienen path
        const fieldErrors = {};
        if (details.issues && Array.isArray(details.issues)) {
          details.issues.forEach((iss) => {
            const path = iss.path && iss.path[0];
            if (path) {
              // mapear nombre de campo: titulo -> nombre, categorias -> categoria
              if (path === "titulo")
                fieldErrors.nombre = iss.message || "Inválido";
              else if (path === "categorias")
                fieldErrors.categorias = iss.message || "Inválido";
              else fieldErrors[path] = iss.message || "Inválido";
            }
          });
        }
        setErrors((prev) => ({
          ...prev,
          ...fieldErrors,
          submit: error.message,
        }));
      } else if (error.message) {
        setErrors((prev) => ({ ...prev, submit: error.message }));
      } else {
        setErrors((prev) => ({
          ...prev,
          submit: "Error al crear el producto. Intenta nuevamente.",
        }));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate("/perfil");
  };

  // Cuando aparezcan errores de submit, mover foco al alert para accesibilidad
  useEffect(() => {
    if (errors && errors.submit && alertRef.current) {
      try {
        alertRef.current.focus();
      } catch (e) {
        // ignore
      }
    }
  }, [errors]);

  if (success) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <Alert
          severity="success"
          sx={{ maxWidth: 400 }}
          role="status"
          aria-live="polite"
        >
          <Typography variant="h6">¡Producto creado exitosamente!</Typography>
          <Typography>Redirigiendo al perfil...</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box maxWidth="md" mx="auto" p={3}>
      <Box display="flex" alignItems="center" mb={3}>
        <IconButton onClick={handleCancel} sx={{ mr: 1 }}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h4">Publicar Nuevo Producto</Typography>
      </Box>

      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            {/* Error general de submit */}
            {errors.submit && (
              <Box tabIndex={-1} ref={alertRef}>
                <Alert severity="error" role="alert" aria-live="assertive">
                  {errors.submit}
                </Alert>
              </Box>
            )}
            <Box display="flex" flexDirection="column" gap={3}>
              {/* Nombre del producto */}
              <TextField
                fullWidth
                label="Nombre del producto"
                name="nombre"
                value={formData.nombre}
                onChange={handleInputChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
                required
              />

              {/* Descripción */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Descripción"
                name="descripcion"
                value={formData.descripcion}
                onChange={handleInputChange}
                error={!!errors.descripcion}
                helperText={errors.descripcion}
                required
              />

              {/* Precio */}
              <TextField
                fullWidth
                type="number"
                label="Precio"
                name="precio"
                value={formData.precio}
                onChange={handleInputChange}
                error={!!errors.precio}
                helperText={errors.precio}
                required
              />

              {/* Moneda */}
              <TextField
                fullWidth
                select
                label="Moneda*"
                name="moneda"
                value={formData.moneda}
                onChange={handleInputChange}
              >
                {monedas.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>

              {/* Stock */}
              <TextField
                fullWidth
                type="number"
                label="Stock disponible"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                error={!!errors.stock}
                helperText={errors.stock}
                required
              />

              {/* Categorías - select múltiple con checkmarks y chips */}
              <FormControl fullWidth error={!!errors.categorias} required>
                <InputLabel id="categorias-label">Categorías</InputLabel>
                <Select
                  labelId="categorias-label"
                  id="categorias-select"
                  multiple
                  name="categorias"
                  value={formData.categorias}
                  onChange={(e) => {
                    const { value } = e.target;
                    setFormData((prev) => ({
                      ...prev,
                      categorias:
                        typeof value === "string" ? value.split(",") : value,
                    }));
                    if (errors.categorias) {
                      setErrors((prev) => ({ ...prev, categorias: "" }));
                    }
                  }}
                  input={<OutlinedInput label="Categorías" />}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} size="small" />
                      ))}
                    </Box>
                  )}
                  MenuProps={MenuProps}
                >
                  {categorias.map((categoria) => (
                    <MenuItem key={categoria.id} value={categoria.nombre}>
                      <Checkbox
                        checked={formData.categorias.includes(categoria.nombre)}
                      />
                      <ListItemText primary={categoria.nombre} />
                    </MenuItem>
                  ))}
                </Select>
                {errors.categorias && (
                  <FormHelperText>{errors.categorias}</FormHelperText>
                )}
              </FormControl>

              {/* Fotos */}
              <Box>
                <Typography variant="h6" gutterBottom>
                  Fotos del producto (Máximo 3)
                </Typography>

                <input
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  style={{ display: "none" }}
                  id="image-upload"
                  multiple
                  type="file"
                  onChange={handleImageUpload}
                  // DESHABILITAR el input si ya hay 3 fotos
                  disabled={formData.fotos.length >= 3}
                />
                <label htmlFor="image-upload">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<PhotoCamera />}
                    sx={{ mb: 2 }}
                    // DESHABILITAR el botón si ya hay 3 fotos
                    disabled={formData.fotos.length >= 3}
                  >
                    Agregar Fotos ({formData.fotos.length}/3)
                  </Button>
                </label>

                {formData.fotos.length > 0 && (
                  <ImageList cols={3} gap={8}>
                    {formData.fotos.map((foto) => (
                      <ImageListItem key={foto.id}>
                        <img src={foto.url} alt="preview" loading="lazy" />
                        <ImageListItemBar
                          position="top"
                          actionIcon={
                            <IconButton
                              sx={{ color: "white" }}
                              onClick={() => removeImage(foto.id)}
                            >
                              <Delete />
                            </IconButton>
                          }
                        />
                      </ImageListItem>
                    ))}
                  </ImageList>
                )}
              </Box>

              {/* Acciones */}
              <Box display="flex" justifyContent="flex-end" gap={2}>
                <Button variant="outlined" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button
                  variant="contained"
                  color="primary"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? "Creando..." : "Crear Producto"}
                </Button>
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default FormNuevoProducto;
