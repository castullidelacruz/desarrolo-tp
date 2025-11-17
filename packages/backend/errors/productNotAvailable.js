export default class productNotAvailable extends Error {
  constructor(productName) {
    super();
    this.message = `El producto ${productName} no está disponible.`;
  }
}
