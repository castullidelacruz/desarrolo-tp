import React, { useState } from "react";
import "./AuthCard.css";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../../../services/authService.js";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      setLoading(false);
      return;
    }

    const userInfo = {
      nombre: formData.get("nombre"),
      email: formData.get("email"),
      telefono: formData.get("telefono"),
      password: password,
      tipo: ["COMPRADOR"], // Por defecto, los usuarios que se registran son compradores
    };

    try {
      await register(userInfo);

      const remember = formData.get("remember") === "on";
      if (remember) {
        await login({ email: userInfo.email, password: userInfo.password });
      }

      navigate("/login", {
        replace: true,
        state: { message: "¡Cuenta creada exitosamente! Inicia sesión." },
      });
    } catch (err) {
      setError(err.message || "Error al crear la cuenta. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <form className="auth-card" onSubmit={onSubmit}>
          <h2 className="auth-title">Crear cuenta</h2>
          <p className="auth-sub">Unite a Tienda Sol</p>

          {error && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#fee",
                color: "#c33",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

          <div className="auth-field">
            <label htmlFor="nombre">Nombre</label>
            <input
              id="nombre"
              name="nombre"
              type="text"
              minLength={2}
              maxLength={100}
              className="auth-input"
              placeholder="Tu nombre"
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className="auth-input"
              placeholder="tu@email.com"
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="telefono">Telefono</label>
            <input
              id="telefono"
              name="telefono"
              type="tel"
              className="auth-input"
              placeholder="Tu telefono"
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              minLength={6}
              className="auth-input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              minLength={6}
              className="auth-input"
              placeholder="••••••••"
              required
              disabled={loading}
            />
          </div>
          <div className="auth-actions">
            <button
              className="button button--primary"
              type="submit"
              disabled={loading}
            >
              {loading ? "Creando cuenta..." : "Registrarme"}
            </button>
          </div>
          <div className="auth-hint">
            <label>
              <input type="checkbox" name="remember" disabled={loading} />{" "}
              Recordarme
            </label>
          </div>
          <p className="auth-hint">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Register;
