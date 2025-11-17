import { EstadoPedido } from "../enums/EstadoPedido.js";

export class CambioEstadoPedido {
  constructor(fecha, estado, pedido, usuario, motivo) {
    if (!Object.values(EstadoPedido).includes(estado)) {
      throw new Error(`Estado de pedido inválido: ${estado}`);
    }

    this.fecha = fecha || new Date();
    this.estado = estado;
    this.pedido = pedido;
    this.usuario = usuario;
    this.motivo = motivo;
  }
}
