import React, { useEffect, useState } from "react";
import Hero from "./hero/Hero.jsx";
import "./Home.css";
import Header from "./header/Header.jsx";
import ProductCarousel from "./productoCarousel/ProductCarousel.jsx";
import { getProductosDestacados } from "../../../services/productService.js";

const Home = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const cargarProductos = async () => {
    try {
      const response = await getProductosDestacados();

      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos iniciales:", error);
    }
  };

  useEffect(() => {
    cargarProductos();
  }, []);

  //esto se deberia hacer en el back con query params
  const filterProducts = (searchText) => {
    const filtered = products.filter((product) =>
      product.titulo.toLowerCase().includes(searchText.toLowerCase()),
    );
    setFilteredProducts(filtered);
  };

  return (
    <>
      <Header></Header>
      <Hero filterProducts={filterProducts}></Hero>
      <ProductCarousel
        products={filteredProducts.length > 0 ? filteredProducts : products}
      ></ProductCarousel>
    </>
  );
};

export default Home;
