import React from "react";
import "./Header.css";

const Header = () => {
  return (
    <section className="header">
      <div className="header__inner">
        <h1 className="header__title">Bienvenido a Tienda Sol</h1>
        <p className="header__subtitle">
          Tu destino online para productos con la mejor energía
        </p>
      </div>
    </section>
  );
};

export default Header;
