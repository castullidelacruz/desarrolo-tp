import mongoose from "mongoose";

const itemPedidoSchema = new mongoose.Schema(
  {
    producto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Producto",
      required: true,
    },
    cantidad: { type: Number, required: true },
    precioUnitario: { type: Number, required: true },
  },
  { _id: false },
);

export default itemPedidoSchema;
