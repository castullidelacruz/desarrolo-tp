import mongoose from "mongoose";
import { z } from "zod";
import { Moneda } from "../models/enums/Moneda.js";
import InvalidCurrencyError from "../errors/invalidCurrency.js";
import InvalidPaginationError from "../errors/paginadoError.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export class ProductController {
  constructor(productService) {
    this.productService = productService;
  }

  async getAll(req, res) {
    const { page = 1, limit = 25, orderby } = req.query;

    const validationError = validateQueryParams(req.query, res);
    if (validationError) return validationError;

    let filters;
    if (req.query.categorias != null) {
      filters = {
        ...req.query,
        categorias: formatearCategorias(req.query.categorias),
      };
    } else {
      filters = { ...req.query };
    }

    const products = await this.productService.getAll(
      page,
      limit,
      filters,
      orderby,
    );
    return res.status(200).json(products);
  }

  async getById(req, res) {
    const productId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de producto inválido" });
    }
    const product = await this.productService.getById(productId);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, error: "Producto no encontrado" });
    }
    return res.status(200).json({ success: true, data: product });
  }

  async getBySellerId(req, res) {
    const { page = 1, limit = 25, orderby } = req.query;
    const sellerId = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de vendedor inválido" });
    }

    const validationError = validateQueryParams(req.query, res);
    if (validationError) return validationError;

    const filters = {
      ...req.query,
      vendedor: sellerId,
      categorias: formatearCategorias(req.query.categorias),
    };

    const filteredProducts = await this.productService.getAll(
      page,
      limit,
      filters,
      orderby,
    );

    return res.status(200).json(filteredProducts);
  }

  async getSellerProducts(req, res) {
    const sellerId = req.user.id;

    const products = await this.productService.getBySellerId(sellerId);

    return res.status(200).json({
      success: true,
      data: products,
    });
  }

  async create(req, res) {
    const productData = req.body;
    const files = req.files;

    console.log("=== CREATE PRODUCTO ===");
    console.log("Body:", productData);
    console.log("Files:", files);

    // Validar que si hay archivos, sean imágenes válidas
    if (files && files.length > 0) {
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const invalidFiles = files.filter(
        (file) => !validImageTypes.includes(file.mimetype),
      );

      if (invalidFiles.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Tipo de archivo no válido",
          details: `Solo se permiten imágenes (JPEG, PNG, WebP). Archivos rechazados: ${invalidFiles.map((f) => f.originalname).join(", ")}`,
        });
      }
    }

    // Transformar datos de FormData (strings) a tipos correctos
    const transformedData = {
      ...productData,
      precio: productData.precio ? Number(productData.precio) : undefined,
      stock: productData.stock ? Number(productData.stock) : undefined,
      vendidos: productData.vendidos ? Number(productData.vendidos) : undefined,
      activo: productData.activo === "true" || productData.activo === true,
      categorias: Array.isArray(productData.categorias)
        ? productData.categorias
        : productData.categorias
          ? JSON.parse(productData.categorias)
          : [],
    };

    console.log("Datos transformados:", transformedData);

    const validation = newProductSchema.safeParse(transformedData);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Datos de producto inválidos",
        details: validation.error,
      });
    }

    transformedData.vendedor = req.user.id;

    if (files && files.length > 0) {
      console.log("Subiendo", files.length, "imágenes a Cloudinary...");
      const uploadPromises = files.map((file) => {
        const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64",
        )}`;
        return uploadToCloudinary(base64File);
      });

      const uploadResults = await Promise.all(uploadPromises);
      transformedData.fotos = uploadResults.map((result) => result.secure_url);
      console.log("URLs de Cloudinary:", transformedData.fotos);
    }

    const newProduct = await this.productService.create(transformedData);
    return res.status(201).json(newProduct);
  }

  async update(req, res) {
    const productId = req.params.id;
    const productData = req.body;
    const files = req.files;

    console.log("=== UPDATE PRODUCTO ===");
    console.log("Product ID:", productId);
    console.log("Body:", productData);
    console.log("Files:", files);

    // Validar que si hay archivos, sean imágenes válidas
    if (files && files.length > 0) {
      const validImageTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
      ];
      const invalidFiles = files.filter(
        (file) => !validImageTypes.includes(file.mimetype),
      );

      if (invalidFiles.length > 0) {
        return res.status(400).json({
          success: false,
          error: "Tipo de archivo no válido",
          details: `Solo se permiten imágenes (JPEG, PNG, WebP). Archivos rechazados: ${invalidFiles.map((f) => f.originalname).join(", ")}`,
        });
      }
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res
        .status(400)
        .json({ success: false, error: "ID de producto inválido" });
    }

    // Transformar datos de FormData (strings) a tipos correctos
    const transformedData = {
      ...productData,
      precio: productData.precio ? Number(productData.precio) : undefined,
      stock: productData.stock ? Number(productData.stock) : undefined,
      vendidos: productData.vendidos ? Number(productData.vendidos) : undefined,
      activo: productData.activo === "true" || productData.activo === true,
      categorias: Array.isArray(productData.categorias)
        ? productData.categorias
        : productData.categorias
          ? JSON.parse(productData.categorias)
          : [],
      fotos:
        productData.fotos && typeof productData.fotos === "string"
          ? JSON.parse(productData.fotos)
          : productData.fotos || [],
    };

    console.log("Datos transformados:", transformedData);

    const validation = existingProductSchema.safeParse(transformedData);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: "Datos de producto inválidos",
        details: validation.error,
      });
    }

    if (transformedData.vendedor !== req.user.id)
      return res.status(403).json({
        success: false,
        error: "No autorizado para modificar este producto",
      });

    if (files && files.length > 0) {
      console.log("Subiendo", files.length, "imágenes a Cloudinary...");
      const uploadPromises = files.map((file) => {
        const base64File = `data:${file.mimetype};base64,${file.buffer.toString(
          "base64",
        )}`;
        return uploadToCloudinary(base64File);
      });

      const uploadResults = await Promise.all(uploadPromises);
      const newPhotos = uploadResults.map((result) => result.secure_url);
      console.log("Nuevas URLs de Cloudinary:", newPhotos);

      // Si ya hay fotos, las agregamos a las existentes
      if (transformedData.fotos && Array.isArray(transformedData.fotos)) {
        transformedData.fotos = [...transformedData.fotos, ...newPhotos];
        console.log("Fotos combinadas:", transformedData.fotos);
      } else {
        transformedData.fotos = newPhotos;
        console.log("Fotos nuevas:", transformedData.fotos);
      }
    }

    const updatedProduct = await this.productService.update(
      productId,
      transformedData,
    );
    if (!updatedProduct) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }
    return res.status(200).json(updatedProduct);
  }
}

const newProductSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string(),
  categorias: z.array(z.string()),
  precio: z.number().min(0),
  vendidos: z.number().min(0).optional(),
  moneda: z.enum(Object.values(Moneda)),
  stock: z.number().min(0).optional(),
  activo: z.boolean(),
});

const existingProductSchema = z.object({
  titulo: z.string().min(1),
  descripcion: z.string(),
  vendedor: z.string().min(1),
  categorias: z.array(z.string()),
  precio: z.number().min(0),
  vendidos: z.number().min(0).optional(),
  moneda: z.enum(Object.values(Moneda)),
  stock: z.number().min(0).optional(),
  fotos: z.array(z.string()).optional(),
  activo: z.boolean(),
});

const queryParamsSchema = z
  .object({
    page: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "PAGINATION_ERROR",
      })
      .transform((val) => (val ? Number(val) : undefined)),
    limit: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "PAGINATION_ERROR",
      })
      .transform((val) => (val ? Number(val) : undefined)),
    minPrice: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "PRICE_ERROR",
      })
      .transform((val) => (val ? Number(val) : undefined)),
    maxPrice: z
      .string()
      .optional()
      .refine((val) => !val || !isNaN(Number(val)), {
        message: "PRICE_ERROR",
      })
      .transform((val) => (val ? Number(val) : undefined)),
    moneda: z
      .enum(Object.values(Moneda), {
        errorMap: () => ({ message: "CURRENCY_ERROR" }),
      })
      .optional(),
    descripcion: z.string().optional(),
    nombre: z.string().optional(),
    orderby: z.enum(["asc", "desc", "mas_vendido"]).optional(),
    categorias: z.union([z.string(), z.array(z.string())]).optional(),
  })
  .refine(
    (data) => {
      return (
        !((data.minPrice || data.maxPrice) && !data.moneda) &&
        !((data.orderby === "asc" || data.orderby === "desc") && !data.moneda)
      );
    },
    {
      message: "CURRENCY_MISSING_ERROR",
    },
  );

const validateQueryParams = (query, res) => {
  try {
    queryParamsSchema.parse(query);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.issues[0];

      switch (firstError.message) {
        case "PAGINATION_ERROR":
          throw new InvalidPaginationError(query.page, query.limit);
        case "PRICE_ERROR":
          return res
            .status(400)
            .json({ error: "Parámetros de precio inválidos" });
        case "CURRENCY_ERROR":
          throw new InvalidCurrencyError(query.moneda);
        case "CURRENCY_MISSING_ERROR":
          return res
            .status(400)
            .json({ error: "Parámetro de moneda faltante" });
        default:
          console.error("Error de validación desconocido:", firstError);
          return res
            .status(400)
            .json({ error: "Parámetros de consulta inválidos" });
      }
    }
    throw error;
  }
};

const formatearCategorias = (categorias) => {
  if (!categorias) return [];
  if (Array.isArray(categorias))
    return categorias.map((c) => String(c).trim()).filter(Boolean);

  if (typeof categorias === "string") {
    try {
      const decoded = decodeURIComponent(categorias);
      return decoded
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    } catch (_e) {
      return categorias
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean);
    }
  }

  return [String(categorias)];
};
