import React, { useEffect, useRef, useState } from "react";
import { FaBell } from "react-icons/fa";
import "./NotificationsBell.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../store/AuthContext";

const API_BASE_URL = "http://localhost:8000";

export default function NotificationsBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 6;
  const ref = useRef();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !user) return;

    let mounted = true;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(
          `${API_BASE_URL}/notificaciones/usuario/${user._id}`,
        );
        if (!mounted) return;
        const data = Array.isArray(res.data) ? res.data : res.data.data || [];
        setNotifications(data);
      } catch (err) {
        console.error("Error al cargar notificaciones:", err);
        setNotifications([]);
      }
    };
    fetchNotifications();
    return () => (mounted = false);
  }, [user, isAuthenticated]);

  const unreadCount = notifications.filter((n) => !n.leida).length;

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  const extractPedidoFromMessage = (msg) => {
    if (!msg) return null;

    const match = msg.match(/#\w+-?\d+/i);
    return match ? match[0] : null;
  };

  const extractProductFromMessage = (msg) => {
    if (!msg) return null;

    const prodMatch = msg.match(/Productos:\s*([^\n]+)/i);
    if (prodMatch && prodMatch[1]) {
      const first = prodMatch[1].split(",")[0].split("\n")[0].trim();
      return first;
    }

    return null;
  };

  const getProductSummary = (n) => {
    // Si tiene producto directamente en la notificación
    if (n.producto) return n.producto;

    // Si tiene pedidoId populado con items
    if (
      n.pedidoId &&
      Array.isArray(n.pedidoId.items) &&
      n.pedidoId.items.length > 0
    ) {
      return (
        n.pedidoId.items
          .slice(0, 3)
          .map(
            (i) =>
              `${i.producto?.titulo || i.producto?.nombre || "Producto"}${i.cantidad ? " x " + i.cantidad : ""}`,
          )
          .join(", ") + (n.pedidoId.items.length > 3 ? "..." : "")
      );
    }

    // Si tiene items directamente
    if (Array.isArray(n.items) && n.items.length > 0) {
      return (
        n.items
          .slice(0, 3)
          .map(
            (i) =>
              `${i.producto?.titulo || i.producto?.nombre || i.nombre || "Producto"}${i.cantidad ? " x " + i.cantidad : ""}`,
          )
          .join(", ") + (n.items.length > 3 ? "..." : "")
      );
    }

    const ext = extractProductFromMessage(n.mensaje);
    if (ext) return ext;
    return "Producto";
  };

  const stripHash = (s) => (s ? s.replace(/^#/, "") : s);

  //Onclick!
  const onNotificationClick = (n) => {
    setNotifications((prev) =>
      prev.map((x) => (x === n ? { ...x, leida: true } : x)),
    );

    const id = n._id || n.id;
    if (id) {
      axios.patch(`${API_BASE_URL}/notificaciones/${id}/leida`).catch((err) => {
        console.warn(
          "No se pudo marcar notificación como leída en backend",
          err?.message || err,
        );
      });
    }

    const pedidoNumero =
      n.pedidoNumero || extractPedidoFromMessage(n.mensaje) || null;
    let pedidoId = null;

    if (typeof n.pedidoId === "string") {
      pedidoId = n.pedidoId;
    } else if (n.pedidoId && n.pedidoId._id) {
      pedidoId = n.pedidoId._id;
    } else if (pedidoNumero) {
      pedidoId = stripHash(pedidoNumero);
    }

    setOpen(false);
    if (pedidoId) {
      navigate(`/perfil?pedido=${pedidoId}`);
    } else {
      navigate("/perfil");
    }
  };

  const tipoEsVenta = (t) => {
    return ["pedido_cancelado"].includes(t);
  };

  const totalPages = Math.max(1, Math.ceil(notifications.length / pageSize));
  const visibleNotifications = notifications.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize,
  );

  const grouped = visibleNotifications.reduce(
    (acc, n) => {
      const key =
        n.categoria === "venta" || tipoEsVenta(n.tipo) ? "ventas" : "compras";
      acc[key].push(n);
      return acc;
    },
    { compras: [], ventas: [] },
  );

  return (
    <div className="notifications-root" ref={ref}>
      <button
        className="notifications-button"
        aria-label={`Notificaciones, ${unreadCount} sin leer`}
        onClick={() => setOpen((v) => !v)}
      >
        <FaBell />
        {unreadCount > 0 && (
          <span className="notifications-badge">{unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notifications-panel">
          <h4>Mis compras</h4>
          {grouped.compras.length === 0 ? (
            <div className="no-notifications">
              No hay notificaciones de compras
            </div>
          ) : (
            grouped.compras.map((n) => (
              <div
                key={n._id || n.id}
                onClick={() => onNotificationClick(n)}
                className={`notification-item ${n.leida ? "leida" : "no-leida"}`}
              >
                <div className="notif-left">
                  <div className="notif-title">
                    {n.pedidoNumero ||
                      extractPedidoFromMessage(n.mensaje) ||
                      "Notificación"}
                  </div>
                  <div className="notif-product">{getProductSummary(n)}</div>
                  <div className="notif-meta">
                    {n.pedidoId?.estado || n.estado || ""} •{" "}
                    {formatDate(n.createdAt || n.fecha)}
                  </div>
                </div>
              </div>
            ))
          )}

          <h4>Mis ventas</h4>
          {grouped.ventas.length === 0 ? (
            <div className="no-notifications">
              No hay notificaciones de ventas
            </div>
          ) : (
            grouped.ventas.map((n) => (
              <div
                key={n._id || n.id}
                onClick={() => onNotificationClick(n)}
                className={`notification-item ${n.leida ? "leida" : "no-leida"}`}
              >
                <div className="notif-left">
                  <div className="notif-title">
                    {n.pedidoNumero ||
                      extractPedidoFromMessage(n.mensaje) ||
                      "Notificación"}
                  </div>
                  <div className="notif-product">{getProductSummary(n)}</div>
                  <div className="notif-meta">
                    {n.pedidoId?.estado || n.estado || ""} •{" "}
                    {formatDate(n.createdAt || n.fecha)}
                  </div>
                </div>
              </div>
            ))
          )}

          {notifications.length > pageSize && (
            <div className="notifications-pagination">
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => {
                  setCurrentPage(1);
                }}
              >
                «
              </button>
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              >
                ‹
              </button>
              <span className="page-info">
                {currentPage} / {totalPages}
              </span>
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
              >
                ›
              </button>
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => {
                  setCurrentPage(totalPages);
                }}
              >
                »
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
