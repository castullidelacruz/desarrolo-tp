import React, { useState, useEffect } from "react";
import "./AuthCard.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../store/AuthContext.jsx";

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { user, login: loginUser } = useAuth();
  const location = useLocation();
  const [infoMessage, setInfoMessage] = useState("");

  useEffect(() => {
    if (user) {
      navigate("/perfil", { replace: true });
    }
  }, [user, navigate]);

  useEffect(() => {
    if (location && location.state && location.state.message) {
      setInfoMessage(location.state.message);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const credentials = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      await loginUser(credentials);
    } catch (err) {
      setError(
        err.message || "Error al iniciar sesión. Verifica tus credenciales.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="auth-page">
        <form className="auth-card" onSubmit={onSubmit}>
          <h2 className="auth-title">Iniciar sesión</h2>
          <p className="auth-sub">Bienvenido de vuelta a Tienda Sol</p>

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

          {infoMessage && (
            <div
              style={{
                padding: "10px",
                marginBottom: "15px",
                backgroundColor: "#e6f4ea",
                color: "#1b5e20",
                borderRadius: "4px",
                fontSize: "14px",
              }}
            >
              {infoMessage}
            </div>
          )}

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
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
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
              {loading ? "Ingresando..." : "Ingresar"}
            </button>
          </div>
          <div className="auth-hint">
            <label>
              <input type="checkbox" name="remember" disabled={loading} />{" "}
              Recordarme
            </label>
          </div>
          <p className="auth-hint">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </form>
      </div>
    </>
  );
};

export default Login;
