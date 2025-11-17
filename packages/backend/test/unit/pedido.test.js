import { Pedido } from "../../models/entities/Pedido.js";
import { EstadoPedido } from "../../models/enums/EstadoPedido.js";
import { Moneda } from "../../models/enums/Moneda.js";
import { Producto } from "../../models/entities/Producto.js";
import { ItemPedido } from "../../models/entities/ItemPedido.js";

describe("Pedido", () => {
  test("crear pedidos con parametros validos", () => {
    const pedido = new Pedido({
      _id: 1,
      comprador: "cliente1",
      items: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    expect(pedido._id).toBeDefined();
    expect(pedido.fechaCreacion).toEqual(new Date(2025, 9, 25));
    expect(pedido.estado).toBe(EstadoPedido.Pendiente);
  });

  test("crear pedidos con parametros invalidos", () => {
    expect(
      () =>
        new Pedido({
          id: 2,
          comprador: "cliente2",
          items: [],
          moneda: "Pesos_Argentinos", // inválida
          direccionEntrega: "direccion2",
          estado: EstadoPedido.Pendiente,
          fechaCreacion: new Date(),
          historialEstados: [],
        }),
    ).toThrow("Moneda inválida");
  });

  test("calcular total del pedido cuando no hay productos debe ser cero", () => {
    const pedido = new Pedido({
      id: 1,
      comprador: "cliente1",
      items: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    expect(pedido.calcularTotal()).toBe(0);
  });

  test("calcular total del pedido con productos", () => {
    const producto1 = new Producto({
      id: 1,
      titulo: "Producto 1",
      vendedor: "Vendedor 1",
      descripcion: "Descripcion del producto 1",
      precio: 100,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      fotos: "fotos1",
      activo: true,
    });
    const producto2 = new Producto({
      id: 2,
      titulo: "Producto 2",
      vendedor: "Vendedor 2",
      descripcion: "Descripcion del producto 2",
      precio: 200,
      moneda: Moneda.Dolar_Usa,
      stock: 5,
      fotos: "fotos2",
      activo: true,
    });

    const item1 = new ItemPedido(producto1, 2, 100); // 2 * 100 = 200
    const item2 = new ItemPedido(producto2, 1, 200); // 1 * 200 = 200
    const pedidoConProductos = new Pedido({
      id: 3,
      comprador: "cliente3",
      items: [item1, item2],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion3",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(),
      historialEstados: [],
    });

    expect(pedidoConProductos.calcularTotal()).toBe(400);
  });

  test("actualizar estado del pedido", () => {
    const pedido = new Pedido({
      id: 1,
      comprador: "cliente1",
      itemsPedido: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    pedido.actualizarEstado(EstadoPedido.Enviado, "admin1", "Pedido enviado");

    expect(pedido.estado).toBe(EstadoPedido.Enviado);
    expect(pedido.historialEstados.length).toBe(1);
    expect(pedido.historialEstados[0].estado).toBe(EstadoPedido.Enviado);
    expect(pedido.historialEstados[0].usuario).toBe("admin1");
    expect(pedido.historialEstados[0].motivo).toBe("Pedido enviado");
  });

  test("validar stock de los productos en el pedido si el pedido tiene  productos", () => {
    const producto1 = new Producto({
      id: 1,
      titulo: "Producto 1",
      vendedor: "Vendedor 1",
      descripcion: "Descripcion del producto 1",
      precio: 100,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      fotos: "fotos1",
      activo: true,
    });
    const producto2 = new Producto({
      id: 2,
      titulo: "Producto 2",
      vendedor: "Vendedor 2",
      descripcion: "Descripcion del producto 2",
      precio: 200,
      moneda: Moneda.Dolar_Usa,
      stock: 5,
      fotos: "fotos2",
      activo: true,
    });

    const item1 = new ItemPedido(producto1, 2, 100); // 2 * 100 = 200
    const item2 = new ItemPedido(producto2, 1, 200); // 1 * 200 = 200
    const pedidoConProductos = new Pedido({
      id: 3,
      comprador: "cliente3",
      items: [item1, item2],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion3",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(),
      historialEstados: [],
    });

    expect(pedidoConProductos.validarStock()).toBe(true);
  });

  test("validar stock de los productos en el pedido si el pedido tiene un producto sin stock", () => {
    const producto1 = new Producto({
      id: 1,
      titulo: "Producto 1",
      vendedor: "Vendedor 1",
      descripcion: "Descripcion del producto 1",
      precio: 100,
      moneda: Moneda.Dolar_Usa,
      stock: 10,
      fotos: "fotos1",
      activo: true,
    });
    const producto2 = new Producto({
      id: 2,
      titulo: "Producto 2",
      vendedor: "Vendedor 2",
      descripcion: "Descripcion del producto 2",
      precio: 200,
      moneda: Moneda.Dolar_Usa,
      stock: 0,
      fotos: "fotos2",
      activo: true,
    });

    const item1 = new ItemPedido(producto1, 2, 100); // 2 * 100 = 200
    const item2 = new ItemPedido(producto2, 1, 200); // 1 * 200 = 200
    const pedidoConProductos = new Pedido({
      id: 3,
      comprador: "cliente3",
      items: [item1, item2],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion3",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(),
      historialEstados: [],
    });

    expect(pedidoConProductos.validarStock()).toBe(false);
  });

  test("pedido no puede ser cancelado por ya estar enviado", () => {
    const pedido = new Pedido({
      id: 1,
      comprador: "cliente1",
      itemsPedido: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Enviado,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    expect(pedido.noSePuedeCancelar()).toBe(true);
  });

  test("pedido no puede ser cancelado por ya estar entregado", () => {
    const pedido = new Pedido({
      id: 1,
      comprador: "cliente1",
      itemsPedido: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Entregado,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    expect(pedido.noSePuedeCancelar()).toBe(true);
  });

  test("pedido puede ser cancelado", () => {
    const pedido = new Pedido({
      id: 2,
      comprador: "cliente2",
      itemsPedido: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion2",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    expect(pedido.noSePuedeCancelar()).toBe(false);
  });

  test("actualizar estado de pedido a enviado", () => {
    const pedido = new Pedido({
      id: 1,
      comprador: "cliente1",
      itemsPedido: [],
      moneda: Moneda.Dolar_Usa,
      direccionEntrega: "direccion1",
      estado: EstadoPedido.Pendiente,
      fechaCreacion: new Date(2025, 9, 25),
      historialEstados: [],
    });

    // Simular actualización de estado
    pedido.actualizarEstado(EstadoPedido.Enviado, "admin1", "Pedido enviado");

    expect(pedido.estado).toBe(EstadoPedido.Enviado);
    expect(pedido.historialEstados.length).toBe(1);
    expect(pedido.historialEstados[0].estado).toBe(EstadoPedido.Enviado);
    expect(pedido.historialEstados[0].usuario).toBe("admin1");
    expect(pedido.historialEstados[0].motivo).toBe("Pedido enviado");
  });
});
