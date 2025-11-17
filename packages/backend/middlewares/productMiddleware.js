import InvalidCurrencyError from "../errors/invalidCurrency.js";
import ValorNegativoError from "../errors/stockNegativoError.js";
import InvalidPaginationError from "../errors/paginadoError.js";

export function productErrorHandler(err, _req, res, _next) {
  if (err.constructor.name === InvalidCurrencyError.name) {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.constructor.name === ValorNegativoError.name) {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err.constructor.name === InvalidPaginationError.name) {
    return res.status(400).json({ success: false, error: err.message });
  }
  console.error("Unhandled error in productErrorHandler:", err);
  res
    .status(500)
    .json({ success: false, error: "Ups. Algo sucedio en el servidor." });
}
