export class Notificacion {
  constructor(id, usuarioDestino, mensaje, fechaAlta) {
    this.id = id;
    this.usuarioDestino = usuarioDestino;
    this.mensaje = mensaje;
    this.fechaAlta = fechaAlta || new Date();
    this.leida = false;
    this.fechaLeida = null;
  }

  marcarComoLeida() {
    this.leida = true;
    this.fechaLeida = new Date();
  }
}
