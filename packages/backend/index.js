import "dotenv/config";
import express from "express";
import { Server } from "./server.js";
import routes from "./routes/routes.js";
import { MongoDBClient } from "./config/database.js";

import { HealthController } from "./controllers/healthController.js";

import { ProductController } from "./controllers/productController.js";
import { ProductService } from "./services/productService.js";
import { ProductRepository } from "./models/repositories/productRepository.js";

import { PedidoController } from "./controllers/pedidoController.js";
import { PedidoService } from "./services/pedidoService.js";
import { PedidoRepository } from "./models/repositories/pedidoRepository.js";

import { NotificacionRepository } from "./models/repositories/notificacionRepository.js";
import { NotificacionService } from "./services/notificacionService.js";
import { NotificacionesController } from "./controllers/notificacionesController.js";

import { AuthController } from "./controllers/authController.js";
import { AuthService } from "./services/authService.js";

import { UsuarioRepository } from "./models/repositories/usuarioRepository.js";
import { globalErrorMiddleware } from "./middlewares/globalErrorMiddleware.js";

import "./models/schemas/usuarioSchema.js";

const PORT = process.env.PORT || process.env.SERVER_PORT || 3000;

const app = express();

// Se envía al server el puerto
const server = new Server(app, PORT);

const healthcontroller = new HealthController();

const usuarioRepository = new UsuarioRepository();

server.setController(HealthController, healthcontroller);

const productRepository = new ProductRepository();
const productService = new ProductService(productRepository, usuarioRepository);
const productController = new ProductController(productService);

server.setController(ProductController, productController);

const pedidoRepository = new PedidoRepository();
const notificacionRepository = new NotificacionRepository();
const notificacionService = new NotificacionService(notificacionRepository);
const pedidoService = new PedidoService(
  pedidoRepository,
  productRepository,
  usuarioRepository,
  notificacionService,
);
const pedidoController = new PedidoController(pedidoService);

server.setController(PedidoController, pedidoController);

const notificacionesController = new NotificacionesController(
  notificacionService,
);

server.setController(NotificacionesController, notificacionesController);

const authService = new AuthService(usuarioRepository);
const authController = new AuthController(authService);

server.setController(AuthController, authController);

routes.forEach((route) => server.addRoute(route));

server.configureRoutes();

server.app.use(globalErrorMiddleware);

server.launch();

MongoDBClient.connect();
