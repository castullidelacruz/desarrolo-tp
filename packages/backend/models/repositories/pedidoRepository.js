import { PedidoModel } from "../schemas/pedidoSchema.js";
import { TipoUsuario } from "../enums/TipoUsuario.js";

export class PedidoRepository {
  constructor() {
    this.model = PedidoModel;
  }

  async save(pedido) {
    const nuevoPedido = new this.model(pedido);
    return await nuevoPedido.save();
  }

  async findById(id) {
    return await this.model
      .findById(id)
      .populate("comprador")
      .populate("vendedor")
      .populate("items.producto");
  }

  async update(pedido) {
    return await this.model
      .findByIdAndUpdate(pedido._id, pedido, {
        new: true,
      })
      .populate("comprador")
      .populate("vendedor")
      .populate("items.producto");
  }

  async obtenerPedidosPorUsuario(usuario_id, tipoUsuario) {
    let match = {};

    if (tipoUsuario === TipoUsuario.Vendedor) {
      match = { vendedor: usuario_id };
    } else {
      match = { comprador: usuario_id };
    }

    return await this.model
      .find(match)
      .populate("items.producto", "titulo precio")
      .populate("vendedor", "nombre email")
      .populate("comprador", "nombre email")
      .sort({ fechaCreacion: -1 });
  }
}
