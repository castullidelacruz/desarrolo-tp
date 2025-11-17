export default class InvalidPaginationError extends Error {
  constructor(page, limit) {
    super();
    this.message = `Parámetros de paginación inválidos: página (${page}), límite (${limit}). Ambos deben ser números enteros positivos.`;
  }
}
