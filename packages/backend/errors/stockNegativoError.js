export default class ValorNegativoError extends Error {
  constructor() {
    super();
    this.message = "El stock no puede ser negativo.";
  }
}
