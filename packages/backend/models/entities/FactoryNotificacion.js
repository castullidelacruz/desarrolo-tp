import { Notificacion } from "./Notificacion.js";
import { EstadoPedido } from "./EstadoPedido.js";
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

  crearSegunPedido(pedido) {
    let destinatario;
    let mensaje;

    const estadoHandlers = {
      [EstadoPedido.Pendiente]: () => {
        destinatario = pedido.getComprador();
        const total = pedido.calcularTotal();
        const productos = pedido.getItemsDescripcion();
        const direccion = pedido.getDireccionEntrega();

        mensaje = `El usuario ${destinatario} ha realizado un pedido.\nProductos: ${productos}\nTotal: ${total} ${pedido.getMoneda()}\nDirección: ${direccion}`;
      },
      [EstadoPedido.Enviado]: () => {
        mensaje = this.crearSegunEstadoPedido(pedido.getEstado());
        destinatario = pedido.getComprador();
      },
      [EstadoPedido.Cancelado]: () => {
        destinatario = pedido.getVendedor();
        mensaje = this.crearSegunEstadoPedido(pedido.getEstado());
      },
    };

    const handler = estadoHandlers[pedido.getEstado()];
    if (handler) {
      handler();
    } else {
      throw new Error(
        `Estado de pedido no manejado para notificación: ${pedido.getEstado()}`,
      );
    }

    return new Notificacion(
      crypto.randomUUID(),
      destinatario,
      mensaje,
      new Date(),
    );
  }
}
