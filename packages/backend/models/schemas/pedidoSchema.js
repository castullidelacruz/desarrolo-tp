import mongoose from "mongoose";
import { Pedido } from "../entities/Pedido.js";
import { Moneda } from "../enums/Moneda.js";
import direccionEntregaSchema from "./direccionEntregaSchema.js";
import { EstadoPedido } from "../enums/EstadoPedido.js";
import cambioEstadoSchema from "./cambioEstadoSchema.js";
import itemPedidoSchema from "./itemPedidoSchema.js";

const pedidoSchema = new mongoose.Schema(
  {
    comprador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    items: { type: [itemPedidoSchema], required: true },
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    moneda: { type: String, enum: Object.values(Moneda), required: true },
    total: { type: Number, required: false },
    direccionEntrega: { type: direccionEntregaSchema, required: true },
    estado: {
      type: String,
      enum: Object.values(EstadoPedido),
      default: EstadoPedido.PENDIENTE,
    },
    fechaCreacion: { type: Date, default: Date.now },
    historialEstados: { type: [cambioEstadoSchema], default: [] },
  },
  {
    timestamps: true,
    collection: "pedidos",
  },
);

pedidoSchema.loadClass(Pedido);

export const PedidoModel = mongoose.model("Pedido", pedidoSchema);
