import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useRef,
} from "react";
import PropTypes from "prop-types";

const STORAGE_KEY = "miapp_carrito_v1";

const CarritoContext = createContext(null);

export const useCarrito = () => {
  const ctx = useContext(CarritoContext);
  if (!ctx) throw new Error("useCarrito debe usarse dentro de CarritoProvider");
  return ctx;
};

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
      return [];
    } catch (e) {
      console.error("Error leyendo carrito desde localStorage:", e);
      return [];
    }
  });

  const saveTimeout = useRef(null);
  useEffect(() => {
    if (saveTimeout.current) clearTimeout(saveTimeout.current);
    saveTimeout.current = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
      } catch (e) {
        console.error("Error guardando carrito en localStorage:", e);
      }
    }, 300);
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, [carrito]);

  const obtenerCantidadTotal = () =>
    carrito.reduce((sum, it) => sum + (Number(it.cantidad) || 0), 0);

  const validarProducto = (producto) => {
    if (!producto) return false;
    if (!producto._id && !producto.id) return false;
    return true;
  };

  const agregarAlCarrito = (producto, cantidad) => {
    if (!validarProducto(producto)) {
      console.warn("Producto inválido, no se agregó al carrito:", producto);
      return;
    }

    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
      console.warn("Cantidad inválida:", cantidad);
      return;
    }

    const vendedorNuevo = producto.vendedor?._id || producto.vendedor;

    if (carrito.length > 0) {
      const first = carrito[0];

      const vendedorActual =
        first.vendedor?._id ||
        first.vendedor ||
        first.producto?.vendedor?._id ||
        first.producto?.vendedor;

      if (vendedorActual !== vendedorNuevo) {
        const aceptar = window.confirm(
          "Tu carrito contiene productos de otro vendedor. ¿Deseas reemplazarlo?",
        );

        if (!aceptar) return false;

        // 🟢 Crear carrito normalizado
        const id = producto._id || producto.id;

        setCarrito([
          {
            ...producto,
            _id: id,
            cantidad: Number(cantidad),
          },
        ]);

        return;
      }
    }

    if (!validarProducto(producto)) {
      console.warn("Producto inválido, no se agregó al carrito:", producto);
      return;
    }
    if (!cantidad || isNaN(cantidad) || Number(cantidad) <= 0) {
      console.warn("Cantidad inválida, no se agregó al carrito:", cantidad);
      return;
    }

    // 🟢 Lógica normal de agregado
    const id = producto._id || producto.id;

    setCarrito((prev) => {
      const idx = prev.findIndex((p) => p._id === id);

      if (idx > -1) {
        const copy = [...prev];
        copy[idx] = {
          ...copy[idx],
          cantidad: Number(copy[idx].cantidad || 0) + Number(cantidad),
        };
        return copy;
      }

      return [
        ...prev,
        {
          ...producto,
          _id: id,
          cantidad: Number(cantidad),
        },
      ];
    });
  };

  const actualizarCantidad = (_id, cantidad) => {
    setCarrito((prev) => {
      const copy = prev
        .map((p) => {
          if ((p._id || p.id) === _id) {
            return { ...p, cantidad: Math.max(0, Number(cantidad) || 0) };
          }
          return p;
        })
        .filter((p) => (p.cantidad || 0) > 0);
      return copy;
    });
  };

  const eliminarProducto = (_id) => {
    setCarrito((prev) => prev.filter((p) => (p._id || p.id) !== _id));
  };

  const limpiarCarrito = () => setCarrito([]);

  const value = useMemo(
    () => ({
      carrito,
      setCarrito,
      agregarAlCarrito,
      actualizarCantidad,
      eliminarProducto,
      limpiarCarrito,
      obtenerCantidadTotal,
    }),
    [carrito],
  );

  return (
    <CarritoContext.Provider value={value}>{children}</CarritoContext.Provider>
  );
};

CarritoProvider.propTypes = {
  children: PropTypes.node,
};
