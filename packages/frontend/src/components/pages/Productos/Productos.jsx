import React, { useEffect, useState } from "react";
import { getProductos } from "../../../services/productService.js";
import "./Productos.css";
import PropTypes from "prop-types";
import ProductCard from "./ProductoCard.jsx";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../../pages/Carrito/CarritoContext.jsx";
import { categorias as categoriasDisponibles } from "../../../mockdata/categorias.js";

const initialFilters = {
  descripcion: "",
  page: 1,
  minPrice: null,
  maxPrice: null,
  categorias: [],
  nombre: "",
  limit: 10,
  moneda: "",
  orderby: "",
};

const monedasDisponibles = ["PESO_ARG", "DOLAR_USA", "REAL"];

const ordenesDisponibles = [
  { value: "", label: "Sin orden" },
  { value: "mas_vendido", label: "Más vendido" },
  { value: "asc", label: "Menor precio" },
  { value: "desc", label: "Mayor precio" },
];

const Catalogo = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalPages, setTotalPages] = useState(1);
  const [mostrarFiltros, setMostrarFiltros] = useState(false);
  const { agregarAlCarrito } = useCarrito();
  const [filterValidationError, setFilterValidationError] = useState("");

  useEffect(() => {
    const fetchProductos = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await getProductos(appliedFilters);

        setProductos(data.data || []);
        setTotalPages(data.totalPaginas || 1);
      } catch (err) {
        setError("Error al cargar productos");
      } finally {
        setLoading(false);
      }
    };
    fetchProductos();

    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [appliedFilters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "categorias") {
      setFilters((prev) => {
        const newCats = checked
          ? [...prev.categorias, value]
          : prev.categorias.filter((cat) => cat !== value);
        return { ...prev, categorias: newCats, page: 1 };
      });
    } else {
      setFilters((prev) => ({ ...prev, [name]: value, page: 1 }));
    }
  };

  const handlePageChange = (dir) => {
    setAppliedFilters((prev) => ({
      ...prev,
      page: Math.max(1, Number(prev.page) + dir),
    }));
  };

  const handleOrderChange = (e) => {
    setFilters((prev) => ({ ...prev, orderby: e.target.value }));
  };

  const handleLimitChange = (e) => {
    setFilters((prev) => ({ ...prev, limit: Number(e.target.value), page: 1 }));
  };

  const applyFilters = () => {
    // Regla de negocio: si hay minPrice o maxPrice o se ordena por precio (asc/desc), moneda es obligatoria
    const hasPriceFilter =
      (filters.minPrice !== null && filters.minPrice !== "") ||
      (filters.maxPrice !== null && filters.maxPrice !== "");
    const ordersByPrice =
      filters.orderby === "asc" || filters.orderby === "desc";
    if ((hasPriceFilter || ordersByPrice) && !filters.moneda) {
      setFilterValidationError(
        "Debe seleccionar una moneda si filtra por precio o si ordena por precio.",
      );
      return;
    }
    setFilterValidationError("");
    setAppliedFilters({ ...filters, page: 1 });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    applyFilters();
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setFilterValidationError("");
  };

  return (
    <>
      <h2 style={{ color: "#2d2d2d", marginBottom: "1.5rem" }}>
        Explorar Productos
      </h2>

      {/* Botón para mostrar filtros en móviles */}
      <button
        className="toggle-filters-btn"
        onClick={() => setMostrarFiltros(!mostrarFiltros)}
      >
        {mostrarFiltros ? "Ocultar Filtros" : "Mostrar Filtros"}
      </button>

      <div className="productos-page">
        <aside className={`sidebar ${mostrarFiltros ? "sidebar-visible" : ""}`}>
          <h3>Filtros</h3>

          <form onSubmit={handleSubmit}>
            <div className="filter-section">
              <label htmlFor="nombre-filter">Nombre</label>
              <input
                id="nombre-filter"
                type="text"
                name="nombre"
                placeholder="Buscar por nombre"
                value={filters.nombre}
                onChange={handleChange}
              />
            </div>

            <div className="filter-section">
              <label htmlFor="descripcion-filter">Descripción</label>
              <input
                id="descripcion-filter"
                type="text"
                name="descripcion"
                placeholder="Buscar por descripción"
                value={filters.descripcion}
                onChange={handleChange}
              />
            </div>

            <div className="filter-section">
              <label htmlFor="moneda-filter">Moneda</label>
              <select
                id="moneda-filter"
                name="moneda"
                value={filters.moneda}
                onChange={handleChange}
              >
                <option value="">Cualquiera</option>
                {monedasDisponibles.map((m) => (
                  <option key={m} value={m}>
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-section">
              <label htmlFor="minPrice-filter">
                Precio
                {!filters.moneda && (
                  <span className="info-tooltip" aria-label="Información">
                    ℹ
                    <span className="tooltip-text">
                      Seleccione una moneda para habilitar filtros de precio.
                    </span>
                  </span>
                )}
              </label>
              <div
                className="price-inputs"
                style={{ display: "flex", gap: "8px", marginTop: 6 }}
              >
                <input
                  id="minPrice-filter"
                  type="number"
                  name="minPrice"
                  placeholder="Mínimo"
                  value={filters.minPrice}
                  onChange={handleChange}
                  min={0}
                  disabled={!filters.moneda}
                  title={
                    !filters.moneda ? "Seleccione moneda primero" : undefined
                  }
                />
                <input
                  id="maxPrice-filter"
                  type="number"
                  name="maxPrice"
                  placeholder="Máximo"
                  value={filters.maxPrice}
                  onChange={handleChange}
                  min={0}
                  disabled={!filters.moneda}
                  title={
                    !filters.moneda ? "Seleccione moneda primero" : undefined
                  }
                />
              </div>
            </div>

            <div className="filter-section">
              <label>Categorías</label>
              <div className="checkbox-group">
                {categoriasDisponibles.map((cat) => (
                  <label key={cat.id}>
                    <input
                      type="checkbox"
                      name="categorias"
                      value={cat.nombre}
                      checked={filters.categorias.includes(cat.nombre)}
                      onChange={handleChange}
                    />
                    {cat.nombre}
                  </label>
                ))}
              </div>
            </div>

            <div className="filter-section">
              <label htmlFor="limit-filter">Productos por página</label>
              <input
                id="limit-filter"
                type="number"
                name="limit"
                value={filters.limit}
                onChange={handleLimitChange}
                min={1}
              />
            </div>

            <div className="filter-section" style={{ display: "flex", gap: 8 }}>
              <button type="submit" className="btn btn-primary">
                Buscar
              </button>
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn btn-secondary"
              >
                Limpiar filtros
              </button>
            </div>
            {filterValidationError && (
              <p
                className="status-message error-message"
                style={{ marginTop: 8 }}
              >
                {filterValidationError}
              </p>
            )}
          </form>
        </aside>

        <main className="main-content">
          <div className="toolbar">
            <label htmlFor="orderby-select">
              Ordenar por:
              {!filters.moneda && (
                <span className="info-tooltip" aria-label="Información">
                  ℹ
                  <span className="tooltip-text">
                    Seleccione una moneda para ordenar por precio.
                  </span>
                </span>
              )}
            </label>
            <select
              id="orderby-select"
              name="orderby"
              value={filters.orderby}
              onChange={handleOrderChange}
            >
              {ordenesDisponibles.map((o) => (
                <option
                  key={o.value}
                  value={o.value}
                  disabled={
                    !filters.moneda && (o.value === "asc" || o.value === "desc")
                  }
                  title={
                    !filters.moneda && (o.value === "asc" || o.value === "desc")
                      ? "Seleccione moneda primero"
                      : undefined
                  }
                >
                  {o.label}
                </option>
              ))}
            </select>
          </div>

          {loading ? (
            <p className="status-message">Cargando productos...</p>
          ) : error ? (
            <p className="status-message error-message">{error}</p>
          ) : (
            <>
              {productos.length === 0 ? (
                <p className="status-message">
                  No se encontraron productos con los filtros aplicados.
                </p>
              ) : (
                <div className="productos-grid">
                  {productos.map((prod) => (
                    <ProductCard
                      key={prod._id || prod.id}
                      prod={prod}
                      navigate={navigate}
                      actualizarCarrito={agregarAlCarrito}
                    />
                  ))}
                </div>
              )}

              <div className="pagination">
                <button
                  onClick={() => handlePageChange(-1)}
                  disabled={appliedFilters.page <= 1}
                >
                  &larr; Anterior
                </button>
                <span>
                  Página {appliedFilters.page} de {totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(1)}
                  disabled={appliedFilters.page >= totalPages}
                >
                  Siguiente &rarr;
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </>
  );
};

Catalogo.propTypes = {
  actualizarCarrito: PropTypes.func.isRequired,
};

export default Catalogo;
