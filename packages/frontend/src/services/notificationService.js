import { apiCall } from "./apiCall.js";

const fetchNotifications = async (userId) => {
  const response = await apiCall(`/notificaciones/usuario/${userId}`, {
    method: "GET",
  });
  return response;
};

const marcarLeida = async (notificationId) => {
    const response = await apiCall(`/notificaciones/${notificationId}/leida`, {
        method: "PATCH",
    });
    return response;
};

export { fetchNotifications, marcarLeida };