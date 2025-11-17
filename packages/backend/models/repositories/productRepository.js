import { ProductModel } from "../schemas/productSchema.js";

export class ProductRepository {
  constructor() {
    this.model = ProductModel;
  }

  async findByPage(page, elementsPerPage, filters = {}, sortOption = {}) {
    if (page < 1 || elementsPerPage < 1) {
      throw new Error(
        "Número de página y elementos por página deben ser mayores a 0",
      );
    }

    const offset = (page - 1) * elementsPerPage;

    sortOption =
      typeof sortOption === "object" && sortOption !== null ? sortOption : {};

    return await this.model
      .find(filters)
      .sort(sortOption)
      .skip(offset)
      .limit(elementsPerPage)
      .populate("vendedor")
      .lean();
  }

  async findAll(filters = {}) {
    return await this.model.find(filters).populate("vendedor").lean();
  }

  async findById(id) {
    return await this.model.findById(id).populate("vendedor").lean();
  }

  async findByTitulo(titulo) {
    return await this.model.findOne({ titulo }).populate("vendedor").lean();
  }

  async findBySellerId(sellerId) {
    return await this.model
      .find({ vendedor: sellerId })
      .populate("vendedor")
      .lean();
  }

  async count(filters = {}) {
    return await this.model.countDocuments(filters);
  }

  async save(productData) {
    const product = new this.model(productData);
    const saved = await product.save();
    return await this.model.findById(saved._id).populate("vendedor").lean();
  }

  async update(id, updateData) {
    return await this.model
      .findByIdAndUpdate(id, updateData, { new: true })
      .populate("vendedor")
      .lean();
  }
}
