import { buildMongoQuery } from "../utils/productFilters.js";
import InvalidPaginationError from "../errors/paginadoError.js";
import UserNotFound from "../errors/userNotFound.js";
import { TipoUsuario } from "../models/enums/TipoUsuario.js";
import ConflictError from "../errors/conflictError.js";
import ProductNotFound from "../errors/productNotFound.js";

export class ProductService {
  constructor(productRepository, userRepository) {
    this.productRepository = productRepository;
    this.userRepository = userRepository;
  }

  async getById(productId) {
    return await this.productRepository.findById(productId);
  }

  async getAll(page, limit, filters = {}, orderBy) {
    const pageNumber = Math.max(Number(page), 1);
    const elementsPerPage = Math.min(Math.max(Number(limit), 1), 100);

    console.log("Filters received in service:", filters);

    if (isNaN(pageNumber) || isNaN(elementsPerPage)) {
      throw new InvalidPaginationError(page, limit);
    }

    const sortOption =
      orderBy === "asc"
        ? { precio: 1 }
        : orderBy === "desc"
          ? { precio: -1 }
          : orderBy === "mas_vendido"
            ? { vendidos: -1 }
            : { createdAt: -1 };

    // Convertir filters a consulta de MongoDB
    const mongoQuery = buildMongoQuery(filters);
    const products = await this.productRepository.findByPage(
      pageNumber,
      elementsPerPage,
      mongoQuery,
      sortOption,
    );

    if (!products || products?.length === 0) {
      return {
        success: false,
        message: "No se encontraron productos con los filters aplicados.",
        data: [],
      };
    }

    const total = await this.productRepository.count(mongoQuery);
    const totalPages = Math.ceil(total / elementsPerPage);

    return {
      pagina: pageNumber,
      perPage: elementsPerPage,
      total: total,
      totalPaginas: totalPages,
      data: products,
    };
  }

  async getBySellerId(sellerId) {
    const seller = await this.userRepository.findById(sellerId);
    if (!seller) {
      throw new UserNotFound();
    }
    return await this.productRepository.findBySellerId(sellerId);
  }

  async create(productData) {
    const seller = await this.userRepository.findById(productData.vendedor);
    if (!seller) {
      throw new UserNotFound();
    }

    console.log("Seller found:", productData);

    const existente = await this.productRepository.findByTitulo(
      productData.titulo,
    );
    if (existente) {
      throw new ConflictError(
        `Ya existe un producto con ese titulo '${productData.titulo}'`,
      );
    }

    if (!seller.tipo.includes(TipoUsuario.Vendedor)) {
      await this.userRepository.update(seller.id, {
        tipo: [...seller.tipo, TipoUsuario.Vendedor],
      });
    }

    return await this.productRepository.save(productData);
  }

  async update(productId, productData) {
    const existente = await this.productRepository.findById(productId);
    if (!existente) {
      throw new ProductNotFound();
    }

    if (productData.titulo !== undefined) existente.titulo = productData.titulo;
    if (productData.descripcion !== undefined)
      existente.descripcion = productData.descripcion;
    if (productData.precio !== undefined) existente.precio = productData.precio;
    if (productData.fotos !== undefined) existente.fotos = productData.fotos;
    if (productData.categorias !== undefined)
      existente.categorias = productData.categorias;
    if (productData.stock !== undefined) existente.stock = productData.stock;
    if (productData.moneda !== undefined) existente.moneda = productData.moneda;
    if (productData.vendidos !== undefined)
      existente.vendidos = productData.vendidos;
    if (productData.activo !== undefined) existente.activo = productData.activo;

    return await this.productRepository.update(productId, existente);
  }
}
