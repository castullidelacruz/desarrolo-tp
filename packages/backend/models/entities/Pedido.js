import { CambioEstadoPedido } from "./CambioEstadoPedido.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import { Moneda } from "../enums/Moneda.js";

export class Pedido {
  constructor({
    _id,
    comprador,
    items,
    moneda,
    direccionEntrega,
    estado,
    fechaCreacion,
    historialEstados,
  }) {
    if (!Object.values(Moneda).includes(moneda)) {
      throw new Error(`Moneda inválida: ${moneda}`);
    }

    if (!Object.values(EstadoPedido).includes(estado)) {
      throw new Error(`Estado de pedido inválido: ${estado}`);
    }

    this._id = _id;
    this.comprador = comprador;
    this.items = items;
    this.total = null;
    this.moneda = moneda;
    this.direccionEntrega = direccionEntrega;
    this.estado = estado || EstadoPedido.Pendiente;
    this.fechaCreacion = fechaCreacion || new Date();
    this.historialEstados = historialEstados || [];
  }

  calcularTotal() {
    this.total = this.items.reduce((total, item) => total + item.subtotal(), 0);
    return this.total;
  }

  actualizarEstado(estadoPedido, usuario, motivo) {
    this.estado = estadoPedido;

    const nuevoEstadoPedido = new CambioEstadoPedido(
      new Date(), // fecha
      estadoPedido, // estado
      this.id, // pedido
      usuario, // usuario
      motivo, // motivo
    );

    this.historialEstados.push(nuevoEstadoPedido);
  }

  validarStock() {
    return this.items.every((item) =>
      item.producto.estaDisponible(item.cantidad),
    );
  }

  getVendedor() {
    return this.items[0].producto.vendedor;
  }

  getItemsDescripcion() {
    return this.items
      .map((item) => `${item.producto.titulo} x${item.cantidad}`)
      .join(", ");
  }

  getComprador() {
    return this.comprador;
  }

  getEstado() {
    return this.estado;
  }

  getDireccionEntrega() {
    return this.direccionEntrega.descripcionCorta();
  }

  noSePuedeCancelar() {
    return (
      this.estado === EstadoPedido.Enviado ||
      this.estado === EstadoPedido.Entregado ||
      this.estado === EstadoPedido.Cancelado ||
      (this.historialEstados || []).some(
        (he) =>
          he.estado === EstadoPedido.Enviado ||
          he.estado === EstadoPedido.Entregado ||
          he.estado === EstadoPedido.Cancelado,
      )
    );
  }
}
