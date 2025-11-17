import jwt from "jsonwebtoken";
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

export const generateToken = (user) => {
  const payload = {
    id: user._id,
    tipo: user.tipo,
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token verificado correctamente:", decoded);
    return decoded;
  } catch (error) {
    console.error("❌ Error verificando token:", error.message);
    return null;
  }
};
