import React from "react";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer" id="contacto">
      <div className="footer__inner">
        <p className="footer__brand">Tienda Sol</p>
        <p className="footer__copy">
          © {new Date().getFullYear()} Tienda Sol. Todos los derechos
          reservados.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
