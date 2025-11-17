import mongoose from "mongoose";

const direccionEntregaSchema = new mongoose.Schema(
  {
    calle: { type: String, required: true },
    altura: { type: Number, required: true },
    piso: { type: String, required: false },
    departamento: { type: String, required: false },
    codigoPostal: { type: String, required: true },
    ciudad: { type: String, required: true },
    provincia: { type: String, required: true },
    pais: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
  },
  {
    _id: false,
  },
);

export default direccionEntregaSchema;
