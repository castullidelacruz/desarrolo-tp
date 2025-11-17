export default class ProductNotStock extends Error {
  constructor(productName) {
    super();
    this.message = `El producto ${productName} no tiene stock suficiente.`;
  }
}
