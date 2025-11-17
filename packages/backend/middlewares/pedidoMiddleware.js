import PedidoNoCancelableError from "../errors/pedidoNoCancelable.js";
import PedidoNotFound from "../errors/pedidoNotFound.js";
import productNotAvailable from "../errors/productNotAvailable.js";
import UserNotFound from "../errors/userNotFound.js";
import ProductNotFound from "../errors/productNotFound.js";

export function pedidoErrorHandler(err, _req, res, _next) {
  console.error("Error en pedido:", err);

  if (err instanceof PedidoNoCancelableError) {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err instanceof PedidoNotFound) {
    return res.status(404).json({ success: false, error: err.message });
  }

  if (err instanceof ProductNotFound) {
    return res.status(404).json({ success: false, error: err.message });
  }

  if (err instanceof productNotAvailable) {
    return res.status(400).json({ success: false, error: err.message });
  }

  if (err instanceof UserNotFound) {
    return res.status(404).json({ success: false, error: err.message });
  }

  res
    .status(500)
    .json({ success: false, error: "Ups. Algo sucedio en el servidor." });
}
