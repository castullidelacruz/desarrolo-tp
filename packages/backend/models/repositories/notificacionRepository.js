import { NotificacionModel } from "../schemas/notificacionSchema.js";

export class NotificacionRepository {
  async crear(data) {
    return await NotificacionModel.create(data);
  }

  async obtenerPorUsuario(userId) {
    return await NotificacionModel.find({ userId })
      .sort({ createdAt: -1 })
      .populate("pedidoId");
  }

  async obtenerSegunLeido(userId, leidaBoolean) {
    return await NotificacionModel.find({ userId, leida: leidaBoolean });
  }

  async marcarComoLeida(id) {
    return await NotificacionModel.findByIdAndUpdate(
      id,
      { leida: true },
      { new: true },
    );
  }
}
