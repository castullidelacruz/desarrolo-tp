import { apiCall } from "./apiCall.js";

export const getProductoById = async (productId) => {
  return apiCall(`/productos/${productId}`, {
    method: "GET",
  });
};

export const getProductos = async ({
  descripcion,
  page = 1,
  minPrice,
  maxPrice,
  categorias,
  nombre,
  limit = 20,
  moneda,
  orderby,
} = {}) => {
  const params = {};

  if (descripcion) params.descripcion = descripcion;
  if (page !== undefined && page !== null) params.page = Number(page);
  if (minPrice !== undefined && minPrice !== null)
    params.minPrice = Number(minPrice);
  if (maxPrice !== undefined && maxPrice !== null)
    params.maxPrice = Number(maxPrice);
  if (Array.isArray(categorias) && categorias.length > 0)
    params.categorias = categorias.join(",");
  if (nombre) params.nombre = nombre;
  if (limit !== undefined && limit !== null) params.limit = Number(limit);
  if (moneda) params.moneda = moneda;
  if (orderby) params.orderby = orderby;

  return await apiCall("/productos", {
    method: "GET",
    params,
  });
};

export const getProductosDestacados = async () => {
  const params = {
    limit: 10,
    orderby: "mas_vendido",
  };
  return apiCall("/productos", {
    method: "GET",
    params,
  });
};

export const getMisProductos = async (token) => {
  return apiCall(`/productos/vendedor`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const crearProducto = async (productData, token) => {
  return apiCall("/productos", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
    data: productData,
  });
};

export const actualizarProducto = async (productId, productData, token) => {
  return apiCall(`/productos/${productId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: productData,
  });
};
