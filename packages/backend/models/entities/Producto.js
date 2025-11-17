import { Moneda } from "../enums/Moneda.js";
import InvalidCurrencyError from "../../errors/invalidCurrency.js";
import ValorNegativoError from "../../errors/stockNegativoError.js";
import mongoose from "mongoose";

export class Producto {
  constructor({
    _id,
    vendedor,
    titulo,
    descripcion,
    categorias,
    precio,
    moneda,
    stock,
    fotos,
    activo,
  }) {
    if (!Object.values(Moneda).includes(moneda)) {
      throw new InvalidCurrencyError(moneda);
    }

    this._id = _id || new mongoose.Types.ObjectId();
    this.titulo = titulo;
    this.vendedor = vendedor;
    this.descripcion = descripcion;
    this.categorias = categorias;
    this.precio = precio;
    this.vendidos = 0;
    this.moneda = moneda;
    this.stock = stock;
    this.fotos = fotos;
    this.activo = activo || false;
  }
  // Getters

  getTitulo() {
    return this.titulo;
  }

  getVendedor() {
    return this.vendedor;
  }

  getDescripcion() {
    return this.descripcion;
  }

  getPrecio() {
    return this.precio;
  }

  getCategorias() {
    return this.categorias;
  }

  getStock() {
    return this.stock;
  }

  getActivo() {
    return this.activo;
  }

  getVendidos() {
    return this.vendidos;
  }

  // Setters
  setStock(nuevoStock) {
    if (nuevoStock < 0) {
      throw new ValorNegativoError();
    }
    this.stock = nuevoStock;
  }

  // Métodos de negocio
  estaDisponible(cantidad) {
    return this.getStock() >= cantidad && this.getActivo();
  }

  reducirStock(cantidad) {
    this.setStock(this.getStock() - cantidad);
  }

  aumentarStock(cantidad) {
    this.setStock(this.getStock() + cantidad);
  }

  menorPrecioEstricto(otroPrecio) {
    return this.getPrecio() < otroPrecio;
  }

  mayorPrecioEstricto(otroPrecio) {
    return this.getPrecio() > otroPrecio;
  }

  perteneceCategoria(categoria) {
    return this.getCategorias().includes(categoria);
  }

  filtroTitulo(titulo) {
    return this.getTitulo().toLowerCase().includes(titulo.toLowerCase());
  }

  filtroDescripcion(descripcion) {
    return this.getDescripcion()
      .toLowerCase()
      .includes(descripcion.toLowerCase());
  }
}
