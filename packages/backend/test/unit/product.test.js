import { Producto } from "../../models/entities/Producto.js";
import { Moneda } from "../../models/enums/Moneda.js";
import InvalidCurrencyError from "../../errors/invalidCurrency.js";
import ValorNegativoError from "../../errors/stockNegativoError.js";

describe("Producto", () => {
  const productoBase = () => {
    return new Producto({
      vendedor: "Usuario123",
      titulo: "Laptop Gaming",
      descripcion: "Laptop de alta gama para gaming",
      categorias: ["Electrónicos", "Gaming"],
      precio: 1500,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      vendidos: 0,
      fotos: ["foto1.jpg", "foto2.jpg"],
      activo: true,
    });
  };

  describe("Constructor", () => {
    test("Crea producto con todos los parámetros válidos", () => {
      const producto = productoBase();

      expect(producto.getTitulo()).toBe("Laptop Gaming");
      expect(producto.getVendedor()).toBe("Usuario123");
      expect(producto.getDescripcion()).toBe("Laptop de alta gama para gaming");
      expect(producto.getCategorias()).toEqual(["Electrónicos", "Gaming"]);
      expect(producto.getPrecio()).toBe(1500);
      expect(producto.moneda).toBe(Moneda.Dolar_Usa);
      expect(producto.getStock()).toBe(10);
      expect(producto.fotos).toEqual(["foto1.jpg", "foto2.jpg"]);
      expect(producto.getActivo()).toBe(true);
      expect(producto._id).toBeDefined();
    });

    test("Genera ID automáticamente cuando no se proporciona", () => {
      const producto1 = productoBase();
      const producto2 = productoBase();

      expect(producto1._id).toBeDefined();
      expect(producto2._id).toBeDefined();
      expect(producto1._id).not.toBe(producto2._id);
    });

    test("Usa ID proporcionado cuando se especifica", () => {
      const customId = "custom-id-123";
      const producto = new Producto({
        _id: customId,
        vendedor: "Usuario123",
        titulo: "Test Product",
        descripcion: "Descripción test",
        categorias: ["Test"],
        precio: 100,
        moneda: Moneda.Peso_Arg,
        stock: 5,
        vendidos: 0,
        fotos: [],
        activo: true,
      });

      expect(producto._id).toBeDefined();
    });

    test("Establece activo como false por defecto", () => {
      const producto = new Producto({
        vendedor: "Usuario123",
        titulo: "Test Product",
        descripcion: "Descripción test",
        categorias: ["Test"],
        precio: 100,
        moneda: Moneda.Peso_Arg,
        stock: 5,
        vendidos: 0,
        fotos: [],
      });

      expect(producto.getActivo()).toBe(false);
    });

    test("Lanza InvalidCurrencyError con moneda inválida", () => {
      expect(() => {
        new Producto({
          vendedor: "Usuario123",
          titulo: "Test Product",
          descripcion: "Descripción test",
          categorias: ["Test"],
          precio: 100,
          moneda: "EURO_INVALID",
          stock: 5,
          fotos: [],
          activo: true,
          vendidos: 0,
        });
      }).toThrow(InvalidCurrencyError);
    });

    test("Establece 0 como vendidos", () => {
      const producto = productoBase();
      expect(producto.getVendidos()).toBe(0);
    });
  });

  describe("Getters", () => {
    test("getTitulo retorna el título correcto", () => {
      const producto = productoBase();
      expect(producto.getTitulo()).toBe("Laptop Gaming");
    });

    test("getVendedor retorna el vendedor correcto", () => {
      const producto = productoBase();
      expect(producto.getVendedor()).toBe("Usuario123");
    });

    test("getDescripcion retorna la descripción correcta", () => {
      const producto = productoBase();
      expect(producto.getDescripcion()).toBe("Laptop de alta gama para gaming");
    });

    test("getPrecio retorna el precio correcto", () => {
      const producto = productoBase();
      expect(producto.getPrecio()).toBe(1500);
    });

    test("getCategorias retorna las categorías correctas", () => {
      const producto = productoBase();
      expect(producto.getCategorias()).toEqual(["Electrónicos", "Gaming"]);
    });

    test("getStock retorna el stock correcto", () => {
      const producto = productoBase();
      expect(producto.getStock()).toBe(10);
    });

    test("getActivo retorna el estado activo correcto", () => {
      const producto = productoBase();
      expect(producto.getActivo()).toBe(true);
    });
  });

  describe("setStock", () => {
    test("Establece stock válido correctamente", () => {
      const producto = productoBase();
      producto.setStock(20);
      expect(producto.getStock()).toBe(20);
    });

    test("Permite stock de valor cero", () => {
      const producto = productoBase();
      producto.setStock(0);
      expect(producto.getStock()).toBe(0);
    });

    test("Lanza ValorNegativoError con stock negativo", () => {
      const producto = productoBase();
      expect(() => {
        producto.setStock(-1);
      }).toThrow(ValorNegativoError);
    });
  });

  describe("estaDisponible", () => {
    test("Retorna true cuando hay stock suficiente y está activo", () => {
      const producto = productoBase();
      expect(producto.estaDisponible(5)).toBe(true);
    });

    test("Retorna true cuando la cantidad solicitada es igual al stock", () => {
      const producto = productoBase();
      expect(producto.estaDisponible(10)).toBe(true);
    });

    test("Retorna false cuando no hay stock suficiente", () => {
      const producto = productoBase();
      expect(producto.estaDisponible(15)).toBe(false);
    });

    test("Retorna false cuando el producto no está activo", () => {
      const producto = new Producto({
        vendedor: "Usuario123",
        titulo: "Test Product",
        descripcion: "Descripción test",
        categorias: ["Test"],
        precio: 100,
        moneda: Moneda.Peso_Arg,
        stock: 10,
        fotos: [],
        activo: false,
      });

      expect(producto.estaDisponible(5)).toBe(false);
    });
  });

  describe("reducirStock", () => {
    test("Reduce el stock correctamente", () => {
      const producto = productoBase();
      producto.reducirStock(3);
      expect(producto.getStock()).toBe(7);
    });

    test("Permite reducir stock a cero", () => {
      const producto = productoBase();
      producto.reducirStock(10);
      expect(producto.getStock()).toBe(0);
    });

    test("Lanza ValorNegativoError cuando el resultado sería negativo", () => {
      const producto = productoBase();
      expect(() => {
        producto.reducirStock(15);
      }).toThrow(ValorNegativoError);
    });
  });

  describe("aumentarStock", () => {
    test("Aumenta el stock correctamente", () => {
      const producto = productoBase();
      producto.aumentarStock(5);
      expect(producto.getStock()).toBe(15);
    });

    test("Permite aumentar desde stock cero", () => {
      const producto = productoBase();
      producto.setStock(0);
      producto.aumentarStock(5);
      expect(producto.getStock()).toBe(5);
    });
  });

  describe("Comparaciones de precio", () => {
    test("menorPrecioEstricto retorna true cuando el precio es menor", () => {
      const producto = productoBase();
      expect(producto.menorPrecioEstricto(2000)).toBe(true);
    });

    test("menorPrecioEstricto retorna false cuando el precio es igual", () => {
      const producto = productoBase();
      expect(producto.menorPrecioEstricto(1500)).toBe(false);
    });

    test("menorPrecioEstricto retorna false cuando el precio es mayor", () => {
      const producto = productoBase();
      expect(producto.menorPrecioEstricto(1000)).toBe(false);
    });

    test("mayorPrecioEstricto retorna true cuando el precio es mayor", () => {
      const producto = productoBase();
      expect(producto.mayorPrecioEstricto(1000)).toBe(true);
    });

    test("mayorPrecioEstricto retorna false cuando el precio es igual", () => {
      const producto = productoBase();
      expect(producto.mayorPrecioEstricto(1500)).toBe(false);
    });

    test("mayorPrecioEstricto retorna false cuando el precio es menor", () => {
      const producto = productoBase();
      expect(producto.mayorPrecioEstricto(2000)).toBe(false);
    });
  });

  describe("perteneceCategoria", () => {
    test("Retorna true cuando el producto pertenece a la categoría", () => {
      const producto = productoBase();
      expect(producto.perteneceCategoria("Gaming")).toBe(true);
      expect(producto.perteneceCategoria("Electrónicos")).toBe(true);
    });

    test("Retorna false cuando el producto no pertenece a la categoría", () => {
      const producto = productoBase();
      expect(producto.perteneceCategoria("Ropa")).toBe(false);
      expect(producto.perteneceCategoria("Hogar")).toBe(false);
    });
  });

  describe("filtroTitulo", () => {
    test("Retorna true cuando el título contiene el texto buscado", () => {
      const producto = productoBase();
      expect(producto.filtroTitulo("Laptop")).toBe(true);
      expect(producto.filtroTitulo("Gaming")).toBe(true);
      expect(producto.filtroTitulo("laptop")).toBe(true); // case insensitive
      expect(producto.filtroTitulo("GAMING")).toBe(true); // case insensitive
    });

    test("Retorna false cuando el título no contiene el texto buscado", () => {
      const producto = productoBase();
      expect(producto.filtroTitulo("Teléfono")).toBe(false);
      expect(producto.filtroTitulo("Desktop")).toBe(false);
    });

    test("Funciona con texto parcial", () => {
      const producto = productoBase();
      expect(producto.filtroTitulo("Lap")).toBe(true);
      expect(producto.filtroTitulo("top")).toBe(true);
      expect(producto.filtroTitulo("Gam")).toBe(true);
    });
  });

  describe("filtroDescripcion", () => {
    test("Retorna true cuando la descripción contiene el texto buscado", () => {
      const producto = productoBase();
      expect(producto.filtroDescripcion("alta gama")).toBe(true);
      expect(producto.filtroDescripcion("gaming")).toBe(true);
      expect(producto.filtroDescripcion("LAPTOP")).toBe(true); // case insensitive
    });

    test("Retorna false cuando la descripción no contiene el texto buscado", () => {
      const producto = productoBase();
      expect(producto.filtroDescripcion("económica")).toBe(false);
      expect(producto.filtroDescripcion("oficina")).toBe(false);
    });

    test("Funciona con texto parcial", () => {
      const producto = productoBase();
      expect(producto.filtroDescripcion("alta")).toBe(true);
      expect(producto.filtroDescripcion("gama")).toBe(true);
      expect(producto.filtroDescripcion("Laptop de")).toBe(true);
    });
  });
});
