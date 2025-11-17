import { ProductController } from "../controllers/productController.js";
import { Router } from "express";
import { loggerMiddleware } from "../middlewares/loggerMiddleware.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { multerMiddleware } from "../middlewares/multerMiddleware.js";

const productPath = "/productos";

export default function productRoutes(getController) {
  const router = Router();

  router.use(loggerMiddleware);

  router.get(productPath, async (req, res, next) => {
    try {
      await getController(ProductController).getAll(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.get(productPath + `/vendedor/:id`, async (req, res, next) => {
    try {
      await getController(ProductController).getBySellerId(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.get(
    productPath + `/vendedor`,
    authMiddleware,
    async (req, res, next) => {
      try {
        await getController(ProductController).getSellerProducts(req, res);
      } catch (error) {
        next(error);
      }
    },
  );

  router.get(productPath + `/:id`, async (req, res, next) => {
    try {
      await getController(ProductController).getById(req, res);
    } catch (error) {
      next(error);
    }
  });

  router.post(
    productPath,
    [authMiddleware, multerMiddleware().array("fotos", 3)],
    async (req, res, next) => {
      try {
        await getController(ProductController).create(req, res);
      } catch (error) {
        next(error);
      }
    },
  );

  router.put(
    productPath + `/:id`,
    [authMiddleware, multerMiddleware().array("fotos", 3)],
    async (req, res, next) => {
      try {
        await getController(ProductController).update(req, res);
      } catch (error) {
        next(error);
      }
    },
  );

  return router;
}
