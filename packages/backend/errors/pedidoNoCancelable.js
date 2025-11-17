export default class PedidoNoCancelableError extends Error {
  constructor() {
    super();
    this.message = `El pedido no se puede cancelar. Los pedidos no se pueden cancelar si ya están en estado 'Enviado' o 'Entregado' o 'Cancelado'.`;
  }
}
