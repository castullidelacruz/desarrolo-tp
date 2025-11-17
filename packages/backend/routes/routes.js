import healthCheckRoutes from "./healthCheckRoutes.js";
import productRoutes from "./productoRoutes.js";
import pedidoRoutes from "./pedidoRoutes.js";
import notificacionRoutes from "./notificacionRoutes.js";
import authRoutes from "./authRoutes.js";

const routes = [
  healthCheckRoutes,
  productRoutes,
  pedidoRoutes,
  authRoutes,
  notificacionRoutes,
];
export default routes;
