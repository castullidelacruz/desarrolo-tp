function buildVendedorFilter(vendedor) {
  if (!vendedor) return {};
  return { vendedor: vendedor };
}

function buildNombreFilter(nombre) {
  if (!nombre) return {};
  return { titulo: { $regex: nombre, $options: "i" } };
}

function buildDescripcionFilter(descripcion) {
  if (!descripcion) return {};
  return { descripcion: { $regex: descripcion, $options: "i" } };
}

function buildCategoriaFilter(categorias) {
  if (!categorias) return {};
  let categoriasArray;

  if (typeof categorias === "string" && categorias.startsWith("[")) {
    try {
      categoriasArray = JSON.parse(categorias);
    } catch {
      throw new Error("Invalid category format");
    }
  } else {
    categoriasArray = Array.isArray(categorias) ? categorias : [categorias];
  }

  return { categorias: { $all: categoriasArray } };
}

function buildPrecioMaximoFilter(maxPrice) {
  if (!maxPrice) return {};
  const precio = parseFloat(maxPrice);
  return { precio: { $lt: precio } };
}

function buildPrecioMinimoFilter(minPrice) {
  if (!minPrice) return {};
  const precio = parseFloat(minPrice);
  return { precio: { $gt: precio } };
}

function buildMonedaFilter(monedaValue) {
  if (!monedaValue) return {};
  return { moneda: { $eq: monedaValue } };
}

export function buildMongoQuery(filters) {
  const {
    vendedor,
    nombre,
    categorias,
    descripcion,
    maxPrice,
    minPrice,
    moneda,
  } = filters;

  const query = {};

  // Combinar todos los filters en una sola query de MongoDB
  Object.assign(query, buildVendedorFilter(vendedor));
  Object.assign(query, buildNombreFilter(nombre));
  Object.assign(query, buildDescripcionFilter(descripcion));
  Object.assign(query, buildCategoriaFilter(categorias));
  Object.assign(query, buildMonedaFilter(moneda));

  // Para los filters de precio, combinarlos en un solo objeto
  const precioFilter = {};
  const maxPriceFilter = buildPrecioMaximoFilter(maxPrice);
  const minPriceFilter = buildPrecioMinimoFilter(minPrice);

  if (maxPriceFilter.precio) {
    Object.assign(precioFilter, maxPriceFilter.precio);
  }
  if (minPriceFilter.precio) {
    Object.assign(precioFilter, minPriceFilter.precio);
  }

  if (Object.keys(precioFilter).length > 0) {
    query.precio = precioFilter;
  }

  return query;
}
