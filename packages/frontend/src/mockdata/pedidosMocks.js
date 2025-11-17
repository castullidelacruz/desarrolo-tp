export const MOCK_USUARIO = {
  _id: "u-1",
  nombre: "Juan Pérez",
  email: "juan.perez@example.com",
  telefono: "+54 9 11 1234-5678",
  tipo: "COMPRADOR_VENDEDOR",
  fechaAlta: "2024-01-15T00:00:00.000Z",
};

export const MOCK_PEDIDOS_COMPRA = [
  {
    _id: "pc-1001",
    fechaCreacion: "2025-09-10T10:30:00.000Z",
    estado: "ENTREGADO",
    moneda: "ARS",
    total: 25999.99,
    comprador: {
      _id: "u-1",
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
    },
    direccionEntrega: {
      calle: "Av. Siempre Viva",
      altura: "742",
      ciudad: "Buenos Aires",
      provincia: "CABA",
      codigoPostal: "1000",
      pais: "AR",
    },
    items: [
      {
        producto: { _id: "p-1", nombre: "Auriculares Bluetooth XZ" },
        cantidad: 1,
        precioUnitario: 19999.99,
      },
      {
        producto: { _id: "p-2", nombre: "Cable USB-C" },
        cantidad: 2,
        precioUnitario: 3000,
      },
    ],
    historialEstados: [
      { estado: "PENDIENTE", fecha: "2025-09-10T10:31:00.000Z" },
      { estado: "CONFIRMADO", fecha: "2025-09-10T11:00:00.000Z" },
      { estado: "ENVIADO", fecha: "2025-09-11T09:00:00.000Z" },
      { estado: "ENTREGADO", fecha: "2025-09-13T16:20:00.000Z" },
    ],
  },
  {
    _id: "pc-1002",
    fechaCreacion: "2025-10-01T14:15:00.000Z",
    estado: "CONFIRMADO",
    moneda: "USD",
    total: 120.0,
    comprador: {
      _id: "u-1",
      nombre: "Juan Pérez",
      email: "juan.perez@example.com",
    },
    items: [
      {
        producto: { _id: "p-3", nombre: "Mochila Urbana" },
        cantidad: 1,
        precioUnitario: 120.0,
      },
    ],
  },
];

export const MOCK_PEDIDOS_VENTA = [
  {
    _id: "pv-2001",
    fechaCreacion: "2025-10-05T08:10:00.000Z",
    estado: "PENDIENTE",
    moneda: "ARS",
    total: 54999.0,
    comprador: {
      _id: "u-2",
      nombre: "María Gómez",
      email: "maria.gomez@example.com",
      telefono: "+54 9 11 5555-1111",
    },
    items: [
      {
        producto: { _id: "p-10", nombre: "Smartwatch Fit 2" },
        cantidad: 1,
        precioUnitario: 54999.0,
      },
    ],
  },
  {
    _id: "pv-2002",
    fechaCreacion: "2025-10-08T12:45:00.000Z",
    estado: "ENVIADO",
    moneda: "ARS",
    total: 89999.0,
    comprador: {
      _id: "u-3",
      nombre: "Carlos Ruiz",
      email: "carlos.ruiz@example.com",
    },
    items: [
      {
        producto: { _id: "p-11", nombre: 'Bicicleta MTB 29\"' },
        cantidad: 1,
        precioUnitario: 89999.0,
      },
    ],
  },
];

export const MOCK_PRODUCTOS = [
  {
    _id: "p-10",
    nombre: "Smartwatch Fit 2",
    descripcion: "Reloj inteligente con monitoreo de ritmo cardíaco y GPS.",
    precio: 54999,
    moneda: "ARS",
    stock: 12,
    fotos: ["https://picsum.photos/seed/watch/600/400"],
    activo: true,
  },
  {
    _id: "p-11",
    nombre: 'Bicicleta MTB 29"',
    descripcion: "Cuadro de aluminio, frenos a disco, 24 velocidades.",
    precio: 89999,
    moneda: "ARS",
    stock: 5,
    fotos: ["https://picsum.photos/seed/bike/600/400"],
    activo: true,
  },
  {
    _id: "p-12",
    nombre: "Auriculares In-Ear Pro",
    descripcion: "Cancelación activa de ruido, estuche de carga inalámbrica.",
    precio: 29999,
    moneda: "ARS",
    stock: 0,
    fotos: ["https://picsum.photos/seed/earbuds/600/400"],
    activo: false,
  },
];
