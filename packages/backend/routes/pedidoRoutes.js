import { PedidoController } from "../controllers/pedidoController.js";
import { Router } from "express";
import { loggerMiddleware } from "../middlewares/loggerMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const pedidoPath = "/pedidos";

export default function pedidoRoutes(getController) {
  const router = Router();

  router.use(loggerMiddleware);

  router.post(pedidoPath, (req, res, next) => {
    try {
      const controller = getController(PedidoController);
      controller.crearPedido(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  router.put(`${pedidoPath}/:pedido_id/cancelacion`, (req, res, next) => {
    try {
      const controller = getController(PedidoController);
      controller.cancelarPedido(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  //Obtener pedidos de un usuario
  router.get(`${pedidoPath}/:tipoUsuario`, authMiddleware, (req, res, next) => {
    try {
      const controller = getController(PedidoController);
      controller.obtenerPedidos(req, res, next);
    } catch (error) {
      next(error);
    }
  });

  //Obtener un pedido por ID
  router.get(
    `${pedidoPath}/detalle/:pedido_id`,
    authMiddleware,
    (req, res, next) => {
      try {
        const controller = getController(PedidoController);
        controller.obtenerPedidoPorId(req, res, next);
      } catch (error) {
        next(error);
      }
    },
  );

  //Actualizar estado del pedido
  router.patch(
    `${pedidoPath}/:pedido_id/enviar/:usuario_id`,
    (req, res, next) => {
      try {
        const controller = getController(PedidoController);
        controller.marcarComoEnviado(req, res, next);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
