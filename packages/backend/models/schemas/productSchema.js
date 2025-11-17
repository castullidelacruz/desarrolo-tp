import mongoose from "mongoose";
import { Moneda } from "../enums/Moneda.js";
import { Producto } from "../entities/Producto.js";

const productSchema = new mongoose.Schema(
  {
    vendedor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },
    titulo: { type: String, required: true },
    descripcion: { type: String, required: true },
    categorias: { type: [String], required: true, default: [] },
    precio: { type: Number, required: true, min: 0 },
    vendidos: { type: Number, default: 0, min: 0 },
    moneda: { type: String, enum: Object.values(Moneda), required: true },
    stock: { type: Number, required: true, min: 0, default: 0 },
    fotos: { type: [String], default: [] },
    activo: { type: Boolean, default: true },
  },
  { timestamps: true, collection: "productos" },
);

productSchema.loadClass(Producto);

export const ProductModel = mongoose.model("Producto", productSchema);
