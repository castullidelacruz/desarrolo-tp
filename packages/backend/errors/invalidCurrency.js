export default class InvalidCurrencyError extends Error {
  constructor(currency) {
    super();
    this.message = "La moneda " + currency + " no es válida.";
  }
}
