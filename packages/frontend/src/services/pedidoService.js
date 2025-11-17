import { apiCall } from "./apiCall.js";

export const getPedidos = async (token, tipoUsuario) => {
  const tipo = tipoUsuario.toUpperCase();
  return apiCall(`/pedidos/${tipo}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const cancelarPedido = async (pedidoId) => {
  return apiCall(`/pedidos/${pedidoId}/cancelacion`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const crearPedido = async (pedidoData, token) => {
  return apiCall(`/pedidos`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    data: pedidoData,
  });
};

export const marcarComoEnviado = async (pedidoId, usuarioId, token) => {
  return apiCall(`/pedidos/${pedidoId}/enviar/${usuarioId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getPedidoById = async (pedidoId, token) => {
  return apiCall(`/pedidos/detalle/${pedidoId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
