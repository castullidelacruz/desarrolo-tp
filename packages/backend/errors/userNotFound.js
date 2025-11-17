export default class UserNotFound extends Error {
  constructor(message = "Usuario no encontrado") {
    super(message);
  }
}
