import { z } from "zod";
import { EstadoPedido } from "../models/enums/EstadoPedido.js";
import { Moneda } from "../models/enums/Moneda.js";
import { TipoUsuario } from "../models/enums/TipoUsuario.js";

export class PedidoController {
  constructor(pedidoService) {
    this.pedidoService = pedidoService;
  }

  async crearPedido(req, res, next) {
    try {
      const result = pedidoSchemaZod.safeParse(req.body);

      if (!result.success) {
        return res.status(400).json({
          success: false,
          error: "Datos inválidos en la creación del pedido",
          detalles: result.error.issues,
        });
      }

      const nuevoPedido = await this.pedidoService.save(result.data);

      res.status(201).json({
        success: true,
        message: "Pedido creado con éxito",
        pedido: nuevoPedido,
      });
    } catch (error) {
      console.error("Error al crear pedido:", error);
      return next(error);
    }
  }

  async cancelarPedido(req, res, next) {
    try {
      const { pedido_id } = req.params;

      const pedidoCancelado =
        await this.pedidoService.cancelarPedido(pedido_id);

      res.status(200).json({
        success: true,
        message: "Pedido cancelado con éxito",
        pedido: pedidoCancelado,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPedidos(req, res, next) {
    const { tipoUsuario } = req.params;

    if (!Object.values(TipoUsuario).includes(tipoUsuario)) {
      return res.status(400).json({
        success: false,
        error: "Tipo de usuario inválido.",
      });
    }

    try {
      const pedidos = await this.pedidoService.obtenerPedidosPorUsuario(
        req.user.id,
        tipoUsuario,
      );

      res.status(200).json({
        success: true,
        data: pedidos,
      });
    } catch (error) {
      next(error);
    }
  }

  async obtenerPedidoPorId(req, res, next) {
    const { pedido_id } = req.params;

    try {
      const pedido = await this.pedidoService.obtenerPedidoPorId(pedido_id);

      if (!pedido) {
        return res.status(404).json({
          success: false,
          error: "Pedido no encontrado.",
        });
      }

      res.status(200).json({
        success: true,
        data: pedido,
      });
    } catch (error) {
      next(error);
    }
  }

  async marcarComoEnviado(req, res, next) {
    try {
      const { pedido_id, usuario_id } = req.params;

      const pedidoActualizado =
        await this.pedidoService.marcarPedidoComoEnviado(pedido_id, usuario_id);

      res.status(200).json({
        success: true,
        message: "Pedido marcado como enviado",
        pedido: pedidoActualizado,
      });
    } catch (error) {
      next(error);
    }
  }
}

const direccionEntregaSchemaZod = z.object({
  calle: z.string().min(1),
  altura: z.number().int().positive(),
  piso: z.string().optional(),
  departamento: z.string().optional(),
  codigoPostal: z.string().min(1),
  ciudad: z.string().min(1),
  provincia: z.string().min(1),
  pais: z.string().min(1),
  lat: z.number(),
  long: z.number(),
});

const itemPedidoSchemaZod = z.object({
  producto: z.string().min(1),
  cantidad: z.number().int().positive(),
  precioUnitario: z.number().nonnegative().optional(),
});

const cambioEstadoSchemaZod = z.object({
  fecha: z.coerce.date().optional(),
  estado: z.enum(Object.values(EstadoPedido)),
  usuario: z.string().min(1),
  motivo: z.string().optional(),
});

export const pedidoSchemaZod = z.object({
  comprador: z.string().min(1),
  items: z.array(itemPedidoSchemaZod).min(1),
  moneda: z.enum(Object.values(Moneda)),
  direccionEntrega: direccionEntregaSchemaZod,
  vendedor: z.string().min(1),
  estado: z.enum(Object.values(EstadoPedido)).optional(),
  fechaCreacion: z.coerce.date().optional(),
  historialEstados: z.array(cambioEstadoSchemaZod).optional(),
});
