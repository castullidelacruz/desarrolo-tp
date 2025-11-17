export default class ProductNotFound extends Error {
  constructor() {
    super();
    this.message = "El producto no fue encontrado.";
  }
}
