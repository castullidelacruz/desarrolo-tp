import { Producto } from "../../models/entities/Producto.js";
import { Moneda } from "../../models/enums/Moneda.js";
import { ProductService } from "../../services/productService.js";
import { expect, jest } from "@jest/globals";
import InvalidPaginationError from "../../errors/paginadoError.js";

describe("ProductService.getAll", () => {
  const mockRepo = {
    findByPage: jest.fn(),
    count: jest.fn(),
  };

  const productService = new ProductService(mockRepo);

  const crearProductosSample = () => [
    new Producto({
      vendedor: "Usuario1",
      titulo: "Laptop Gaming",
      descripcion: "Laptop de alta gama para gaming",
      categorias: ["Electrónicos", "Gaming"],
      precio: 1500,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      fotos: ["foto1.jpg"],
      vendidos: 0,
      activo: true,
    }),
    new Producto({
      vendedor: "Usuario2",
      titulo: "Mouse Inalámbrico",
      descripcion: "Mouse ergonómico inalámbrico",
      categorias: ["Electrónicos", "Accesorios"],
      precio: 50,
      moneda: Moneda.Dolar_Usa,
      stock: 25,
      vendidos: 0,
      fotos: ["mouse1.jpg"],
      activo: true,
    }),
    new Producto({
      vendedor: "Usuario3",
      titulo: "Teclado Mecánico",
      descripcion: "Teclado mecánico RGB",
      categorias: ["Electrónicos", "Gaming"],
      precio: 120,
      moneda: Moneda.Dolar_Usa,
      vendidos: 0,
      stock: 15,
      fotos: ["teclado1.jpg"],
      activo: true,
    }),
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("Estructura de paginación con números válidos", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(10);

    // ejecución
    const resultado = await productService.getAll(2, 3, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      2,
      3,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      pagina: 2,
      perPage: 3,
      total: 10,
      totalPaginas: Math.ceil(10 / 3),
      data: sampleData,
    });
  });

  test("Estructura de paginación con strings numéricos", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(10);

    // ejecución
    const resultado = await productService.getAll("2", "3", {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      2,
      3,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      pagina: 2,
      perPage: 3,
      total: 10,
      totalPaginas: Math.ceil(10 / 3),
      data: sampleData,
    });
  });

  test("Normaliza valores fuera de rango (página negativa y límite excesivo)", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(500);

    // ejecución
    const resultado = await productService.getAll(-1, 600, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      1,
      100,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      pagina: 1,
      perPage: 100,
      total: 500,
      totalPaginas: Math.ceil(500 / 100),
      data: sampleData,
    });
  });

  test("Normaliza página cero a página 1", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(15);

    // ejecución
    const resultado = await productService.getAll(0, 5, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      1,
      5,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      pagina: 1,
      perPage: 5,
      total: 15,
      totalPaginas: 3,
      data: sampleData,
    });
  });

  test("Normaliza límite cero a límite 1", async () => {
    // preparación
    const sampleData = crearProductosSample().slice(0, 1);

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(20);

    // ejecución
    const resultado = await productService.getAll(1, 0, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      1,
      1,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      pagina: 1,
      perPage: 1,
      total: 20,
      totalPaginas: 20,
      data: sampleData,
    });
  });

  test("Maneja respuesta vacía del repositorio (null)", async () => {
    // preparación
    mockRepo.findByPage.mockResolvedValue(null);
    mockRepo.count.mockResolvedValue(0);

    // ejecución
    const resultado = await productService.getAll(1, 10, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      1,
      10,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).not.toHaveBeenCalled(); // No debe llamarse si no hay productos

    expect(resultado).toEqual({
      success: false,
      message: "No se encontraron productos con los filters aplicados.",
      data: [],
    });
  });

  test("Maneja respuesta vacía del repositorio (array vacío)", async () => {
    // preparación
    mockRepo.findByPage.mockResolvedValue([]);
    mockRepo.count.mockResolvedValue(0);

    // ejecución
    const resultado = await productService.getAll(1, 10, {});

    // comparación de resultados
    expect(mockRepo.findByPage).toHaveBeenCalledWith(
      1,
      10,
      {},
      { createdAt: -1 },
    );
    expect(mockRepo.count).not.toHaveBeenCalled(); // No debe llamarse si no hay productos

    expect(resultado).toEqual({
      success: false,
      message: "No se encontraron productos con los filters aplicados.",
      data: [],
    });
  });

  test("Calcula totalPaginas correctamente con división exacta", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(30); // 30 / 10 = 3 páginas exactas

    // ejecución
    const resultado = await productService.getAll(2, 10, {});

    // comparación de resultados
    expect(resultado.totalPaginas).toBe(3);
    expect(resultado.total).toBe(30);
    expect(resultado.perPage).toBe(10);
  });

  test("Calcula totalPaginas correctamente con división no exacta", async () => {
    // preparación
    const sampleData = crearProductosSample();

    mockRepo.findByPage.mockResolvedValue(sampleData);
    mockRepo.count.mockResolvedValue(37); // 37 / 10 = 3.7, ceil = 4 páginas

    // ejecución
    const resultado = await productService.getAll(1, 10, {});

    // comparación de resultados
    expect(resultado.totalPaginas).toBe(4);
    expect(resultado.total).toBe(37);
    expect(resultado.perPage).toBe(10);
  });

  test("Maneja valores de página y límite como strings no numéricos", async () => {
    // preparación - no es necesario mockear ya que debería fallar antes de llegar al repositorio

    // ejecución y comparación de resultados - Debe lanzar error
    await expect(productService.getAll("abc", "xyz", {})).rejects.toThrow(
      InvalidPaginationError,
    );

    // verificación de que no se llamaron los métodos del repositorio
    expect(mockRepo.findByPage).not.toHaveBeenCalled();
    expect(mockRepo.count).not.toHaveBeenCalled();
  });
});
