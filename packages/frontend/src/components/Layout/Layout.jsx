import React from "react";
import PropTypes from "prop-types";
import Navbar from "./Navbar/Navbar";
import Footer from "./Footer/Footer";
import "./Layout.css";
import { Outlet } from "react-router-dom";
import { useCarrito } from "../pages/Carrito/CarritoContext.jsx";

const Layout = () => {
  const { carrito } = useCarrito();
  return (
    <div className="layout">
      <Navbar carrito={carrito}></Navbar>
      <main className="layout__content">
        <Outlet></Outlet>
      </main>
      <Footer></Footer>
    </div>
  );
};

export default Layout;

Layout.propTypes = {
  carrito: PropTypes.array,
};
