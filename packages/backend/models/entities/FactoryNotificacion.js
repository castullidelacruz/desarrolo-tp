import { EstadoPedido } from "../enums/EstadoPedido.js";
import { mensajesEN } from "../configStrings/mensajeEN.js";
import { mensajesES } from "../configStrings/mensajesES.js";

export class FactoryNotificacion {
  constructor(idioma = "ES") {
    if (idioma === "EN") {
      this.mensajes = mensajesEN;
    } else {
      this.mensajes = mensajesES;
    }
  }

  crearSegunEstadoPedido(estado) {
    return this.mensajes[estado] || this.mensajes["DEFAULT"];
  }

  /**
   * Crea una notificación para la base de datos según el estado del pedido
   * @param {Object} pedidoData - Datos del pedido populados desde MongoDB
   * @param {string} estado - Estado del pedido
   * @param {string} pedidoNumero - Número del pedido (ej: #123)
   * @param {string} productoTitulo - Título del primer producto
   * @param {Date} fecha - Fecha del cambio de estado
   * @returns {Object} Objeto con los datos de la notificación
   */
  crearNotificacionDB(pedidoData, estado, pedidoNumero, productoTitulo, fecha) {
    const handlers = {
      [EstadoPedido.Pendiente]: () => {
        // Notificaciones para comprador y vendedor cuando se crea el pedido
        const notificaciones = [];
        
        // Notificación para el comprador
        notificaciones.push({
          userId: pedidoData.comprador?._id || pedidoData.comprador,
          tipo: "confirmacion_pedido",
          mensaje: `Tu pedido ${pedidoNumero} fue creado exitosamente`,
          pedidoId: pedidoData._id,
          pedidoNumero,
          categoria: "compra",
          producto: productoTitulo,
          estado: EstadoPedido.Pendiente,
          fecha,
        });

        // Notificación para el vendedor
        notificaciones.push({
          userId: pedidoData.vendedor?._id || pedidoData.vendedor,
          tipo: "confirmacion_pedido",
          mensaje: `Tienes un nuevo pedido ${pedidoNumero}`,
          pedidoId: pedidoData._id,
          pedidoNumero,
          categoria: "venta",
          producto: productoTitulo,
          estado: EstadoPedido.Pendiente,
          fecha,
        });

        return notificaciones;
      },
      [EstadoPedido.Enviado]: () => {
        // Notificación para el comprador
        return [{
          userId: pedidoData.comprador?._id || pedidoData.comprador,
          tipo: "pedido_enviado",
          mensaje: `Tu pedido ${pedidoNumero} fue enviado`,
          pedidoId: pedidoData._id,
          pedidoNumero,
          categoria: "compra",
          producto: productoTitulo,
          estado: EstadoPedido.Enviado,
          fecha,
        }];
      },
      [EstadoPedido.Cancelado]: () => {
        // Notificación para el vendedor
        return [{
          userId: pedidoData.vendedor?._id || pedidoData.vendedor,
          tipo: "pedido_cancelado",
          mensaje: `El pedido ${pedidoNumero} fue cancelado`,
          pedidoId: pedidoData._id,
          pedidoNumero,
          categoria: "venta",
          producto: productoTitulo,
          estado: EstadoPedido.Cancelado,
          fecha,
        }];
      },
    };

    const handler = handlers[estado];
    if (!handler) {
      throw new Error(
        `Estado de pedido no manejado para notificación: ${estado}`,
      );
    }

    return handler();
  }
}
