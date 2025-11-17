import React, { useState } from "react";
import "./AuthCard.css";
import { Link, useNavigate } from "react-router-dom";
import { register, login } from "../../../services/authService.js";

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  // Estados de validación por campo
  const [fieldErrors, setFieldErrors] = useState({
    nombre: "",
    email: "",
    telefono: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!formData.nombre.trim()) {
      newErrors.nombre = "El nombre es obligatorio";
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = "El nombre debe tener al menos 2 caracteres";
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = "El nombre no puede tener más de 100 caracteres";
    }

    // Validar email
    if (!formData.email.trim()) {
      newErrors.email = "El email es obligatorio";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Ingresa un email válido";
    }

    // Validar teléfono
    if (!formData.telefono.trim()) {
      newErrors.telefono = "El teléfono es obligatorio";
    } else if (!/^\d+$/.test(formData.telefono)) {
      newErrors.telefono = "El teléfono debe contener solo números";
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = "La contraseña es obligatoria";
    } else if (formData.password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Debes confirmar la contraseña";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validar formulario
    if (!validateForm()) {
      setError("Por favor, completa todos los campos correctamente.");
      return;
    }

    setLoading(true);

    const userInfo = {
      nombre: formData.nombre,
      email: formData.email,
      telefono: formData.telefono,
      password: formData.password,
      tipo: ["COMPRADOR"], // Por defecto, los usuarios que se registran son compradores
    };

    try {
      await register(userInfo);

      // Auto-login si el usuario marcó "recordarme" (opcional)
      // const remember = formData.get("remember") === "on";
      // if (remember) {
      //   await login({ email: userInfo.email, password: userInfo.password });
      // }

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
              className={`auth-input ${fieldErrors.nombre ? "auth-input-error" : ""}`}
              placeholder="Tu nombre"
              value={formData.nombre}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.nombre && (
              <p style={{ fontSize: "12px", color: "#c33", marginTop: "4px" }}>
                {fieldErrors.nombre}
              </p>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              className={`auth-input ${fieldErrors.email ? "auth-input-error" : ""}`}
              placeholder="tu@email.com"
              value={formData.email}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.email && (
              <p style={{ fontSize: "12px", color: "#c33", marginTop: "4px" }}>
                {fieldErrors.email}
              </p>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              name="telefono"
              type="text"
              className={`auth-input ${fieldErrors.telefono ? "auth-input-error" : ""}`}
              placeholder="Tu teléfono"
              value={formData.telefono}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.telefono && (
              <p style={{ fontSize: "12px", color: "#c33", marginTop: "4px" }}>
                {fieldErrors.telefono}
              </p>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              className={`auth-input ${fieldErrors.password ? "auth-input-error" : ""}`}
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.password ? (
              <p style={{ fontSize: "12px", color: "#c33", marginTop: "4px" }}>
                {fieldErrors.password}
              </p>
            ) : (
              <p style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                Mínimo 6 caracteres
              </p>
            )}
          </div>
          <div className="auth-field">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              className={`auth-input ${fieldErrors.confirmPassword ? "auth-input-error" : ""}`}
              placeholder="••••••••"
              value={formData.confirmPassword}
              onChange={handleChange}
              disabled={loading}
            />
            {fieldErrors.confirmPassword && (
              <p style={{ fontSize: "12px", color: "#c33", marginTop: "4px" }}>
                {fieldErrors.confirmPassword}
              </p>
            )}
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
