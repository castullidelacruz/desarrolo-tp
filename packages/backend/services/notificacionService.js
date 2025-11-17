export class NotificacionService {
  constructor(notificacionRepository) {
    this.notificacionRepository = notificacionRepository;
  }

  async crear(
    userId,
    tipo,
    mensaje,
    pedidoId = null,
    pedidoNumero = null,
    categoria = null,
    producto = null,
    fecha = null,
    estado = null,
  ) {
    try {
      const payload = {
        userId,
        tipo,
        mensaje,
        leida: false,
      };
      if (pedidoId) payload.pedidoId = pedidoId;
      if (pedidoNumero) payload.pedidoNumero = pedidoNumero;
      if (categoria) payload.categoria = categoria;
      if (producto) payload.producto = producto;
      if (fecha) payload.createdAt = fecha;
      if (estado) payload.estado = estado;
      console.log("Payload de notificación:", payload);

      const notificacion = await this.notificacionRepository.crear(payload);
      return notificacion;
    } catch (error) {
      console.error("Error en NotificacionService.crear:", error);
      throw new Error("No se pudo crear la notificación");
    }
  }

  async obtenerPorUsuario(userId) {
    try {
      return await this.notificacionRepository.obtenerPorUsuario(userId);
    } catch (error) {
      console.error("Error en NotificacionService.obtenerPorUsuario:", error);
      throw new Error("No se pudieron obtener las notificaciones del usuario");
    }
  }

  async obtenerNoLeidas(userId) {
    try {
      return await this.notificacionRepository.obtenerSegunLeido(userId, false);
    } catch (error) {
      console.error("Error en NotificacionService.obtenerNoLeidas:", error);
      throw new Error("No se pudieron obtener las notificaciones no leídas");
    }
  }

  async obtenerLeidas(userId) {
    try {
      return await this.notificacionRepository.obtenerSegunLeido(userId, true);
    } catch (error) {
      console.error("Error en NotificacionService.obtenerLeidas:", error);
      throw new Error("No se pudieron obtener las notificaciones leídas");
    }
  }

  async marcarComoLeida(id) {
    try {
      const notificacion =
        await this.notificacionRepository.marcarComoLeida(id);
      if (!notificacion) throw new Error("Notificación no encontrada");
      return notificacion;
    } catch (error) {
      console.error("Error en NotificacionService.marcarComoLeida:", error);
      throw new Error("No se pudo marcar la notificación como leída");
    }
  }
}
