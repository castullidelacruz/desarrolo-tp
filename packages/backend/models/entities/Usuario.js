import { TipoUsuario } from "../enums/TipoUsuario.js";

export class Usuario {
  constructor({ _id, nombre, email, telefono, password, tipo, fechaAlta }) {
    if (!Object.values(TipoUsuario).includes(tipo)) {
      throw new Error(`Tipo de usuario inválido: ${tipo}`);
    }

    this._id = _id;
    this.nombre = nombre;
    this.email = email;
    this.telefono = telefono;
    this.password = password;
    this.tipo = tipo;
    this.fechaAlta = fechaAlta || new Date();
  }
}
