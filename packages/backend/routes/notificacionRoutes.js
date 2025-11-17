import { Router } from "express";
import { NotificacionesController } from "../controllers/notificacionesController.js";
import { loggerMiddleware } from "../middlewares/loggerMiddleware.js";

const router = Router();
const basePath = "/notificaciones";

export default function notificacionRoutes(getController) {
  const controller = getController(NotificacionesController);
  router.use(loggerMiddleware);

  // Crear una notificación
  router.post(basePath, (req, res) => controller.crear(req, res));

  // Obtener todas las notificaciones del usuario
  router.get(`${basePath}/usuario/:userId`, (req, res) =>
    controller.obtenerPorUsuario(req, res),
  );

  // Obtener las no leídas
  router.get(`${basePath}/no-leidas/:userId`, (req, res) =>
    controller.obtenerNoLeidas(req, res),
  );

  // Obtener las leídas
  router.get(`${basePath}/leidas/:userId`, (req, res) =>
    controller.obtenerLeidas(req, res),
  );

  // Marcar como leída
  router.patch(`${basePath}/:id/leida`, (req, res) =>
    controller.marcarComoLeida(req, res),
  );

  return router;
}
