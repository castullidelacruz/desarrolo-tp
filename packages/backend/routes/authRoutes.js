import { Router } from "express";
import { AuthController } from "../controllers/authController.js";
import { loggerMiddleware } from "../middlewares/loggerMiddleware.js";

const basePath = "/auth";

export default function authRoutes(getController) {
  const router = Router();

  router.use(loggerMiddleware);

  router.post(`${basePath}/login`, async (req, res, next) => {
    try {
      await getController(AuthController).login(req, res);
    } catch (error) {
      console.error("Error in /login route:", error);
      next(error);
    }
  });
  router.post(`${basePath}/register`, async (req, res, next) => {
    try {
      await getController(AuthController).register(req, res);
    } catch (error) {
      console.error("Error in /register route:", error);
      next(error);
    }
  });

  return router;
}
