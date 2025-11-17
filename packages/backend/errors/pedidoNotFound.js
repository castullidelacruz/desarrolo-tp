export default class PedidoNotFound extends Error {
  constructor() {
    super();
    this.message = "El pedido no fue encontrado.";
  }
}
