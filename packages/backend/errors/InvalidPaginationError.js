export default class InvalidPaginationError extends Error {
  constructor(page, limit) {
    super(`Paginación inválida: page=${page}, limit=${limit}`);
    this.name = "InvalidPaginationError";
  }
}
