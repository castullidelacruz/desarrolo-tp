import InvalidCredentialsError from "../errors/invalidCredentials.js";
import InvalidCurrencyError from "../errors/invalidCurrency.js";
import ValorNegativoError from "../errors/stockNegativoError.js";
import InvalidPaginationError from "../errors/paginadoError.js";
import PedidoNoCancelableError from "../errors/pedidoNoCancelable.js";
import PedidoNotFound from "../errors/pedidoNotFound.js";
import productNotAvailable from "../errors/productNotAvailable.js";
import ProductNotFound from "../errors/productNotFound.js";
import ProductNotStock from "../errors/productNotStock.js";
import UserNotFound from "../errors/userNotFound.js";
import ConflictError from "../errors/conflictError.js";

export function globalErrorMiddleware(err, _req, res, _next) {
  console.error("Error capturado por globalErrorMiddleware:", err);

  // Errores de autenticación (401 Unauthorized)
  if (err instanceof InvalidCredentialsError) {
    return res.status(401).json({ success: false, error: err.message });
  }

  // Errores de validación / Bad Request (400)
  if (
    err instanceof InvalidCurrencyError ||
    err instanceof ValorNegativoError ||
    err instanceof InvalidPaginationError ||
    err instanceof PedidoNoCancelableError ||
    err instanceof productNotAvailable ||
    err instanceof ProductNotStock ||
    err instanceof ConflictError
  ) {
    return res.status(400).json({ success: false, error: err.message });
  }

  // Errores de recursos no encontrados (404 Not Found)
  if (
    err instanceof PedidoNotFound ||
    err instanceof ProductNotFound ||
    err instanceof UserNotFound
  ) {
    return res.status(404).json({ success: false, error: err.message });
  }

  // Errores de validación de Zod
  if (err.name === "ZodError") {
    return res.status(400).json({
      success: false,
      error: "Datos de validación incorrectos",
      issues: err.issues,
    });
  }

  // Error genérico del servidor (500 Internal Server Error)
  console.error("Error no manejado:", err);
  res.status(500).json({
    success: false,
    error: "Ups. Algo sucedió en el servidor.",
  });
}
