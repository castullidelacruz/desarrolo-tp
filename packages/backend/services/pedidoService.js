import { EstadoPedido } from "../models/enums/EstadoPedido.js";
import PedidoNoCancelableError from "../errors/pedidoNoCancelable.js";
import PedidoNotFound from "../errors/pedidoNotFound.js";
import ProductNotFound from "../errors/productNotFound.js";
import UserNotFound from "../errors/userNotFound.js";
import mongoose from "mongoose";
import ProductNotStock from "../errors/productNotStock.js";
import { FactoryNotificacion } from "../models/entities/FactoryNotificacion.js";

export class PedidoService {
  constructor(
    pedidoRepository,
    productRepository,
    usuarioRepository,
    notificacionService = null,
  ) {
    this.pedidoRepository = pedidoRepository;
    this.productRepository = productRepository;
    this.usuarioRepository = usuarioRepository;
    this.notificacionService = notificacionService;
    this.factoryNotificacion = new FactoryNotificacion("ES");
  }

  async save(data) {
    let total = 0;
    const itemsValidados = [];
    let primerProductoTitulo = null;

    const vendedores = [];
    for (const item of data.items) {
      const producto = await this.productRepository.findById(item.producto);
      if (!producto) throw new ProductNotFound();
      vendedores.push(producto.vendedor.toString());

      if (producto.stock < item.cantidad && producto.activo) {
        throw new ProductNotStock(producto.titulo || producto.nombre);
      }

      const precioUnitario = item.precioUnitario ?? producto.precio;
      const subtotal = precioUnitario * item.cantidad;
      total += subtotal;

      itemsValidados.push({
        producto: new mongoose.Types.ObjectId(item.producto),
        cantidad: item.cantidad,
        precioUnitario,
      });
      if (
        !primerProductoTitulo &&
        producto &&
        (producto.titulo || producto.nombre)
      ) {
        primerProductoTitulo = producto.titulo || producto.nombre;
      }
    }
    const setVendedores = new Set(vendedores);
    if (setVendedores.size > 1) {
      throw new Error(
        "Solo se pueden generar pedidos con productos de un único vendedor",
      );
    }

    const pedido = {
      comprador: new mongoose.Types.ObjectId(data.comprador),
      items: itemsValidados,
      moneda: data.moneda,
      direccionEntrega: data.direccionEntrega,
      estado: EstadoPedido.Pendiente,
      total,
      vendedor: new mongoose.Types.ObjectId(data.vendedor),
      historialEstados: [
        {
          estado: EstadoPedido.Pendiente,
          fecha: new Date(),
          usuario: new mongoose.Types.ObjectId(data.comprador),
          motivo: "Creación del pedido",
        },
      ],
    };

    const saved = await this.pedidoRepository.save(pedido);

    // Actualizar stock de los productos
    for (const item of itemsValidados) {
      const producto = await this.productRepository.findById(item.producto);
      if (!producto) throw new ProductNotFound();

      const nuevoStock = producto.stock - item.cantidad;

      await this.productRepository.update(producto._id, { stock: nuevoStock });
    }

    // Crear notificaciones para comprador y vendedor usando el Factory
    try {
      if (this.notificacionService) {
        const pedidoNumero = `#${saved._id}`;
        const fechaCreacion =
          saved.historialEstados?.[0]?.fecha ||
          saved.fechaCreacion ||
          new Date();

        // Usar el factory para crear las notificaciones
        const notificaciones = this.factoryNotificacion.crearNotificacionDB(
          saved,
          EstadoPedido.Pendiente,
          pedidoNumero,
          primerProductoTitulo,
          fechaCreacion
        );

        // Crear cada notificación en la base de datos
        for (const notifData of notificaciones) {
          await this.notificacionService.crear(
            notifData.userId,
            notifData.tipo,
            notifData.mensaje,
            notifData.pedidoId,
            notifData.pedidoNumero,
            notifData.categoria,
            notifData.producto,
            notifData.fecha,
            notifData.estado,
          );
        }
      }
    } catch (err) {
      console.error("Error creando notificaciones de pedido:", err);
    }

    return saved;
  }

  async obtenerPedidosPorUsuario(usuario_id, tipoUsuario) {
    const pedidos = await this.pedidoRepository.obtenerPedidosPorUsuario(
      usuario_id,
      tipoUsuario,
    );
    return pedidos;
  }

  async obtenerPedidoPorId(pedido_id) {
    const pedido = await this.pedidoRepository.findById(pedido_id);
    return pedido;
  }

  async cancelarPedido(pedido_id) {
    const pedido = await this.pedidoRepository.findById(pedido_id);
    if (!pedido) throw new PedidoNotFound();

    if (pedido.noSePuedeCancelar()) {
      throw new PedidoNoCancelableError();
    }

    pedido.actualizarEstado(
      EstadoPedido.Cancelado,
      pedido.comprador,
      "Pedido cancelado por el usuario",
    );

    const pedidoActualizado = await this.pedidoRepository.update(pedido);

    try {
      if (this.notificacionService) {
        const pedidoNumero = `#${pedidoActualizado._id}`;

        // Obtener el vendedor del pedido directamente
        const vendedorId =
          pedidoActualizado.vendedor?._id || pedidoActualizado.vendedor;

        const productoTitulo =
          pedidoActualizado.items?.[0]?.producto?.titulo ||
          pedidoActualizado.items?.[0]?.producto?.nombre ||
          null;
        const cambioCancelado =
          (pedidoActualizado.historialEstados || [])
            .slice()
            .reverse()
            .find((h) => h.estado === EstadoPedido.Cancelado) ||
          (pedidoActualizado.historialEstados || []).slice(-1)[0];
        const fechaCancelado = cambioCancelado?.fecha || new Date();
        
        // Usar el factory para crear la notificación de cancelación
        const notificaciones = this.factoryNotificacion.crearNotificacionDB(
          pedidoActualizado,
          EstadoPedido.Cancelado,
          pedidoNumero,
          productoTitulo,
          fechaCancelado
        );

        // Crear cada notificación en la base de datos
        for (const notifData of notificaciones) {
          await this.notificacionService.crear(
            notifData.userId,
            notifData.tipo,
            notifData.mensaje,
            notifData.pedidoId,
            notifData.pedidoNumero,
            notifData.categoria,
            notifData.producto,
            notifData.fecha,
            notifData.estado,
          );
        }
      }
    } catch (err) {
      console.error("Error creando notificación de pedido cancelado:", err);
    }

    return pedidoActualizado;
  }

  async marcarPedidoComoEnviado(pedido_id, usuario_id) {
    var pedido = await this.pedidoRepository.findById(pedido_id);
    if (!pedido) {
      return null;
    }

    var usuario = await this.usuarioRepository.findById(usuario_id);
    if (!usuario) {
      throw new UserNotFound();
    }

    let esVendedorDeAlgunProducto = false;

    let primerProductoTitulo = null;
    for (const item of pedido.items) {
      const productoDoc = await this.productRepository.findById(
        item.producto._id,
      );
      if (!productoDoc) {
        throw new ProductNotFound();
      }

      if (productoDoc.vendedor._id == usuario_id) {
        esVendedorDeAlgunProducto = true;
      }
      if (!primerProductoTitulo && productoDoc) {
        primerProductoTitulo = productoDoc.titulo || productoDoc.nombre || null;
      }
    }

    if (!esVendedorDeAlgunProducto) {
      throw new UserNotFound("El usuario no es vendedor de este pedido");
    }

    pedido.actualizarEstado(
      EstadoPedido.Enviado,
      usuario_id,
      "Pedido marcado como enviado por el vendedor",
    );

    const pedidoActualizado = await this.pedidoRepository.update(pedido);
    try {
      if (this.notificacionService) {
        const pedidoNumero = `#${pedidoActualizado._id}`;
        const cambioEnviado =
          (pedidoActualizado.historialEstados || [])
            .slice()
            .reverse()
            .find((h) => h.estado === EstadoPedido.Enviado) ||
          (pedidoActualizado.historialEstados || []).slice(-1)[0];
        const fechaEnviado = cambioEnviado?.fecha || new Date();
        
        // Usar el factory para crear la notificación de envío
        const notificaciones = this.factoryNotificacion.crearNotificacionDB(
          pedidoActualizado,
          EstadoPedido.Enviado,
          pedidoNumero,
          primerProductoTitulo,
          fechaEnviado
        );

        // Crear cada notificación en la base de datos
        for (const notifData of notificaciones) {
          await this.notificacionService.crear(
            notifData.userId,
            notifData.tipo,
            notifData.mensaje,
            notifData.pedidoId,
            notifData.pedidoNumero,
            notifData.categoria,
            notifData.producto,
            notifData.fecha,
            notifData.estado,
          );
        }
      }
    } catch (err) {
      console.error("Error creando notificación de pedido enviado:", err);
    }

    return pedidoActualizado;
  }
}
