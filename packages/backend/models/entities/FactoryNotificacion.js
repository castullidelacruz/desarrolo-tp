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


  crearNotificacionDB(pedidoData, estado, pedidoNumero, productoTitulo, fecha) {
    const handlers = {
      [EstadoPedido.Pendiente]: () => {
        const notificaciones = [];
        
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
