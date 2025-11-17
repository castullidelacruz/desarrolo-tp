import mongoose from "mongoose";

const notificacionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    tipo: {
      type: String,
      enum: ["confirmacion_pedido", "pedido_enviado", "pedido_cancelado"],
      required: true,
    },
    pedidoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pedido",
      required: false,
    },
    pedidoNumero: {
      type: String,
      required: false,
    },
    producto: {
      type: String,
      required: false,
    },
    estado: {
      type: String,
      required: false,
    },
    categoria: {
      // 'compra' | 'venta' - ayuda al frontend a agrupar notificaciones
      type: String,
      required: false,
    },
    mensaje: {
      type: String,
      required: true,
    },
    leida: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    collection: "notificaciones",
  },
);

export const NotificacionModel = mongoose.model(
  "Notificacion",
  notificacionSchema,
);
