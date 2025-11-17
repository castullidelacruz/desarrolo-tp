import { isObjectIdOrHexString } from "mongoose";
import { UsuarioModel } from "../schemas/usuarioSchema.js";

export class UsuarioRepository {
  constructor() {
    this.model = UsuarioModel;
  }

  async findById(id) {
    if (!id) {
      return null;
    }
    if (!isObjectIdOrHexString(id)) {
      return null;
    }
    return await this.model.findById(id);
  }

  async findByEmail(email) {
    return await this.model.findOne({ email });
  }

  async save(user) {
    return await new this.model(user).save();
  }

  async update(id, updateData) {
    return await this.model.findByIdAndUpdate(id, updateData, { new: true });
  }
}
