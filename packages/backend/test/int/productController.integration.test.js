import request from "supertest";
import { buildTestServer } from "./utils/buildTestServer.js";
import { ProductController } from "../../controllers/productController.js";
import { jest } from "@jest/globals";
import mongoose from "mongoose";
import { Moneda } from "../../models/enums/Moneda.js";

const server = buildTestServer();

const mockProductService = {
  getAll: jest.fn(),
};

const productController = new ProductController(mockProductService);

// Registrar rutas manualmente para usar el controller mock
server.app.get("/products/vendedor/:id", (req, res) =>
  productController.getBySellerId(req, res),
);

describe("GET /products/vendedor/:id", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("productos encontrados", async () => {
    const sellerId = new mongoose.Types.ObjectId();

    const sampleData = [
      {
        _id: new mongoose.Types.ObjectId(),
        vendedor: { _id: sellerId.toString(), nombre: "Juan Vendedor" },
        titulo: "Producto 1",
        descripcion: "Descripción 1",
        categorias: ["Electrónicos"],
        precio: 100,
        moneda: Moneda.Peso_Arg,
        stock: 10,
        fotos: [],
        activo: true,
        vendidos: 0,
      },
      {
        _id: new mongoose.Types.ObjectId(),
        vendedor: { _id: sellerId.toString(), nombre: "Juan Vendedor" },
        titulo: "Producto 2",
        descripcion: "Descripción 2",
        categorias: ["Ropa"],
        precio: 200,
        moneda: Moneda.Dolar_Usa,
        stock: 5,
        fotos: [],
        activo: true,
        vendidos: 0,
      },
    ];

    mockProductService.getAll.mockResolvedValue({
      pagina: 1,
      perPage: 2,
      total: 300,
      totalPaginas: 150,
      data: sampleData,
    });

    const res = await request(server.app).get(
      `/products/vendedor/${sellerId.toString()}?page=1&limit=2`,
    );

    expect(res.status).toBe(200);
    expect(res.body.pagina).toBe(1);
    expect(res.body.perPage).toBe(2);
    expect(res.body.total).toBe(300);
    expect(res.body.data).toHaveLength(2);
    expect(res.body.data[0].vendedor._id).toBe(sellerId.toString());
  });

  test("sin productos encontrados", async () => {
    const sellerId = new mongoose.Types.ObjectId();

    mockProductService.getAll.mockResolvedValue({
      pagina: 1,
      perPage: 10,
      total: 0,
      totalPaginas: 0,
      data: [],
    });

    const res = await request(server.app).get(
      `/products/vendedor/${sellerId.toString()}?page=1&limit=10`,
    );

    expect(res.status).toBe(200);
    expect(res.body.data).toHaveLength(0);
  });

  test("con filters adicionales", async () => {
    const sellerId = new mongoose.Types.ObjectId();

    const sampleData = [
      {
        _id: new mongoose.Types.ObjectId(),
        vendedor: { _id: sellerId.toString(), nombre: "Vendedor Filtro" },
        titulo: "Smartphone Premium",
        descripcion: "Teléfono de alta gama",
        categorias: ["Electrónicos"],
        precio: 800,
        moneda: Moneda.Dolar_Usa,
        stock: 3,
        fotos: [],
        activo: true,
        vendidos: 0,
      },
    ];

    mockProductService.getAll.mockResolvedValue({
      pagina: 2,
      perPage: 5,
      total: 150,
      totalPaginas: 30,
      data: sampleData,
    });

    const res = await request(server.app)
      .get(`/products/vendedor/${sellerId.toString()}`)
      .query({
        page: 2,
        limit: 5,
        categorias: "Electrónicos",
        precioMin: 500,
      });

    expect(res.status).toBe(200);
    expect(res.body.pagina).toBe(2);
    expect(res.body.perPage).toBe(5);
    expect(res.body.total).toBe(150);
    expect(res.body.data).toHaveLength(1);
    expect(res.body.data[0].titulo).toBe("Smartphone Premium");
    expect(res.body.data[0].precio).toBe(800);
  });

  test("ID de vendedor inválido", async () => {
    const invalidId = "12345";

    const res = await request(server.app).get(
      `/products/vendedor/${invalidId}?page=1&limit=5`,
    );

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toBe("ID de vendedor inválido");
  });

  test("paginación inválida", async () => {
    const sellerId = new mongoose.Types.ObjectId();

    // Mockeamos validateQueryParams para que devuelva directamente el res con status 400
    jest
      .spyOn(productController, "validateQueryParams")
      .mockImplementation((query, res) =>
        res.status(400).json({ error: "Parámetros de consulta inválidos" }),
      );

    const res = await request(server.app).get(
      `/products/vendedor/${sellerId.toString()}?page=abc&limit=xyz`,
    );

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("Parámetros de consulta inválidos");

    // Restauramos la implementación original
    productController.validateQueryParams.mockRestore();
  });
});
