import { generateToken } from "../utils/auth.js";
import { hashingPassword, comparePassword } from "../utils/passwordUtils.js";
import InvalidCredentialsError from "../errors/invalidCredentials.js";

export class AuthService {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  async createUser(userData) {
    userData.password = await hashingPassword(userData.password);
    const user = await this.userRepository.save(userData);
    return user;
  }

  async login(email, password) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      console.log("User not found for email:", email);
      throw new InvalidCredentialsError();
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      console.log("Authentication failed");
      throw new InvalidCredentialsError();
    }

    const token = generateToken(user);
    return { user: user, accessToken: token };
  }
}
