export default class InvalidCredentialsError extends Error {
  constructor() {
    super();
    this.message =
      "Credenciales inválidas. Por favor, verifica tu usuario y contraseña.";
  }
}
