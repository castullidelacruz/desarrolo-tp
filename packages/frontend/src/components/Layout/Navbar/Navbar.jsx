import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import { FaShoppingCart } from "react-icons/fa";
import NotificationsBell from "../../notificacion/NotificationsBell";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useAuth } from "../../../store/AuthContext";

const Navbar = ({ carrito }) => {
  const navigate = useNavigate();
  const [cantidadTotal, setCantidadTotal] = useState(0);
  const { isAuthenticated } = useAuth();

  const irACarrito = () => {
    navigate("/carrito");
  };

  const cantProductosEnCarrito = () => {
    let suma = 0;
    for (const producto of carrito) {
      suma += producto.cantidad;
    }
    return suma;
  };

  useEffect(() => {
    setCantidadTotal(cantProductosEnCarrito());
  }, [carrito]);
  return (
    <header className="navbar-bg">
      <nav className="navbar">
        <div className="navbar-section center">
          <div className="brand">
            <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
              <h1>Tienda Sol</h1>
            </Link>
          </div>
        </div>

        <div className="navbar-section left"></div>

        <div className="navbar-section right main-actions">
          <div className="menu-items">
            <ul>
              <li>
                <Link to="/productos" className="navbar__link">
                  Productos
                </Link>
              </li>
              {isAuthenticated ? (
                <li>
                  <Link to="/perfil" className="navbar__link">
                    Perfil
                  </Link>
                </li>
              ) : (
                <li>
                  <Link to="/login" className="navbar__link">
                    Iniciar Sesión
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {isAuthenticated && <NotificationsBell />}
          <button
            className="cart"
            onClick={irACarrito}
            aria-label={`Carrito de compras con ${cantidadTotal} artículos`}
          >
            <FaShoppingCart color="black" />
            <span className="cart-count">{cantidadTotal}</span>
          </button>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;

Navbar.propTypes = {
  carrito: PropTypes.array,
};
