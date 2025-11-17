export class NotificacionesController {
  constructor(notificacionService) {
    this.notificacionService = notificacionService;
  }

  async crear(req, res) {
    try {
      const { userId, tipo } = req.body;

      const mensajes = {
        confirmacion_pedido: "Tu pedido ha sido confirmado.",
        pedido_enviado: "Tu pedido ha sido enviado.",
        pedido_cancelado: "Tu pedido ha sido cancelado.",
      };

      if (!mensajes[tipo]) {
        return res
          .status(400)
          .json({ message: "Tipo de notificación inválido" });
      }

      const { pedidoId, pedidoNumero, categoria } = req.body;

      const notificacion = await this.notificacionService.crear(
        userId,
        tipo,
        mensajes[tipo],
        pedidoId,
        pedidoNumero,
        categoria,
      );

      res.status(201).json(notificacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerPorUsuario(req, res) {
    try {
      const notificaciones = await this.notificacionService.obtenerPorUsuario(
        req.params.userId,
      );
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerNoLeidas(req, res) {
    try {
      const notificaciones = await this.notificacionService.obtenerNoLeidas(
        req.params.userId,
      );
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async obtenerLeidas(req, res) {
    try {
      const notificaciones = await this.notificacionService.obtenerLeidas(
        req.params.userId,
      );
      res.json(notificaciones);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  async marcarComoLeida(req, res) {
    try {
      const notificacion = await this.notificacionService.marcarComoLeida(
        req.params.id,
      );
      res.json(notificacion);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
}
