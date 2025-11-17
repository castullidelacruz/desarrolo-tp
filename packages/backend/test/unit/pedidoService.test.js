import { Pedido } from "../../models/entities/Pedido.js";
import { EstadoPedido } from "../../models/enums/EstadoPedido.js";
import { Moneda } from "../../models/enums/Moneda.js";
import { PedidoService } from "../../services/pedidoService.js";
import { jest, test, describe, beforeEach, expect } from "@jest/globals";
import { Producto } from "../../models/entities/Producto.js";
import PedidoNotFound from "../../errors/pedidoNotFound.js";
import ProductNotFound from "../../errors/productNotFound.js";
import UserNotFound from "../../errors/userNotFound.js";
import PedidoNoCancelableError from "../../errors/pedidoNoCancelable.js";
import ProductNotStock from "../../errors/productNotStock.js";

describe("Service de pedido", () => {
  let pedidoRepositoryMock;
  let productRepositoryMock;
  let usuarioRepositoryMock;
  let pedidoService;
  let notificacionServiceMock;

  beforeEach(() => {
    pedidoRepositoryMock = {
      save: jest.fn(),
      findById: jest.fn(),
      update: jest.fn(),
      obtenerPedidosPorUsuario: jest.fn(),
      obtenerPedidoPorId: jest.fn(),
      actualizarPedido: jest.fn(),
    };

    productRepositoryMock = {
      findById: jest.fn(),
      updateStock: jest.fn(),
    };

    usuarioRepositoryMock = {
      findById: jest.fn(),
    };

    notificacionServiceMock = {
      crear: jest.fn(),
    };

    pedidoService = new PedidoService(
      pedidoRepositoryMock,
      productRepositoryMock,
      usuarioRepositoryMock,
      notificacionServiceMock,
    );
  });

  test("crear pedido con parámetros válidos", async () => {
    const productoId = "507f1f77bcf86cd799439011";
    const compradorId = "507f1f77bcf86cd799439012";

    const producto = new Producto({
      _id: productoId,
      vendedor: "507f1f77bcf86cd799439013",
      titulo: "Producto Test",
      descripcion: "Descripción",
      categorias: ["Electrónicos"],
      precio: 100,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      fotos: [],
      activo: true,
    });

    productRepositoryMock.findById.mockResolvedValue(producto);
    productRepositoryMock.updateStock.mockResolvedValue({
      ...producto,
      stock: 8,
    });
    pedidoRepositoryMock.save.mockResolvedValue({
      _id: "507f1f77bcf86cd799439099",
      historialEstados: [{ fecha: new Date() }],
    });

    const pedidoData = {
      comprador: compradorId,
      items: [{ producto: productoId, cantidad: 2 }],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: {
        calle: "Av. Siempre Viva",
        altura: 742,
        piso: "1",
        departamento: "A",
        codigoPostal: "1001",
        ciudad: "Buenos Aires",
        provincia: "Buenos Aires",
        pais: "Argentina",
        lat: -34.6037,
        long: -58.3816,
      },
      vendedor: producto.vendedor,
    };

    const result = await pedidoService.save(pedidoData);

    expect(productRepositoryMock.findById).toHaveBeenCalledWith(productoId);
    expect(pedidoRepositoryMock.save).toHaveBeenCalled();
    expect(result._id).toBe("507f1f77bcf86cd799439099");
    expect(notificacionServiceMock.crear).toHaveBeenCalled();
  });

  test("crear pedido con producto inexistente", async () => {
    productRepositoryMock.findById.mockResolvedValue(null);

    const pedidoData = {
      comprador: "user123",
      items: [{ producto: "idInvalido", cantidad: 1 }],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: { calle: "Av. Siempre Viva", altura: 742 },
      vendedor: "vendedor123",
    };

    await expect(pedidoService.save(pedidoData)).rejects.toThrow(
      ProductNotFound,
    );
  });

  test("cancelar pedido válido", async () => {
    const pedido = new Pedido({
      _id: "pedido123",
      comprador: "user123",
      items: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: { calle: "Av. Siempre Viva", altura: 742 },
      estado: EstadoPedido.Pendiente,
      historialEstados: [],
    });

    pedido.noSePuedeCancelar = jest.fn().mockReturnValue(false);
    pedido.actualizarEstado = jest.fn();

    pedidoRepositoryMock.findById.mockResolvedValue(pedido);
    pedidoRepositoryMock.update.mockResolvedValue({
      _id: "pedido123",
      estado: EstadoPedido.Cancelado,
      items: [],
    });

    const result = await pedidoService.cancelarPedido("pedido123");

    expect(pedido.noSePuedeCancelar).toHaveBeenCalled();
    expect(pedido.actualizarEstado).toHaveBeenCalledWith(
      EstadoPedido.Cancelado,
      pedido.comprador,
      "Pedido cancelado por el usuario",
    );
    expect(result.estado).toBe(EstadoPedido.Cancelado);
  });

  test("cancelar pedido no existente", async () => {
    pedidoRepositoryMock.findById.mockResolvedValue(null);

    await expect(pedidoService.cancelarPedido("pedidoX")).rejects.toThrow(
      PedidoNotFound,
    );
  });

  test("obtener pedidos por usuario", async () => {
    const pedido1 = new Pedido({
      _id: "p1",
      comprador: "cliente1",
      items: [],
      moneda: Moneda.Dolar_Usa,
      estado: EstadoPedido.Pendiente,
      historialEstados: [],
    });
    const pedido2 = new Pedido({
      _id: "p2",
      comprador: "cliente1",
      items: [],
      moneda: Moneda.Dolar_Usa,
      estado: EstadoPedido.Enviado,
      historialEstados: [],
    });

    pedidoRepositoryMock.obtenerPedidosPorUsuario.mockResolvedValue([
      pedido1,
      pedido2,
    ]);

    const pedidos = await pedidoService.obtenerPedidosPorUsuario(
      "cliente1",
      "comprador",
    );

    expect(pedidos).toHaveLength(2);
    expect(pedidos[0].comprador).toBe("cliente1");
    expect(pedidos[1].comprador).toBe("cliente1");
    expect(pedidoRepositoryMock.obtenerPedidosPorUsuario).toHaveBeenCalledWith(
      "cliente1",
      "comprador",
    );
  });

  test("actualizar estado de pedido a enviado", async () => {
    const pedidoMock = new Pedido({
      _id: "p1",
      comprador: "cliente1",
      items: [
        {
          producto: {
            _id: "prod1",
            vendedor: { _id: "admin1" },
            titulo: "Prod1",
          },
        },
      ],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "Calle Falsa 123",
      estado: EstadoPedido.Pendiente,
      historialEstados: [],
    });

    const usuarioMock = { _id: "admin1", nombre: "Administrador" };

    pedidoMock.actualizarEstado = jest.fn();

    pedidoRepositoryMock.findById.mockResolvedValue(pedidoMock);
    usuarioRepositoryMock.findById.mockResolvedValue(usuarioMock);
    productRepositoryMock.findById.mockResolvedValue({
      _id: "prod1",
      vendedor: { _id: "admin1" },
      titulo: "Prod1",
    });
    pedidoRepositoryMock.update.mockResolvedValue({
      ...pedidoMock,
      estado: EstadoPedido.Enviado,
    });

    const pedidoActualizado = await pedidoService.marcarPedidoComoEnviado(
      "p1",
      "admin1",
    );

    expect(pedidoActualizado.estado).toBe(EstadoPedido.Enviado);
    expect(pedidoMock.actualizarEstado).toHaveBeenCalledWith(
      EstadoPedido.Enviado,
      "admin1",
      "Pedido marcado como enviado por el vendedor",
    );
    expect(pedidoRepositoryMock.findById).toHaveBeenCalledWith("p1");
    expect(usuarioRepositoryMock.findById).toHaveBeenCalledWith("admin1");
    expect(pedidoRepositoryMock.update).toHaveBeenCalledWith(pedidoMock);
  });
});
