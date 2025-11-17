export class DireccionEntrega {
  constructor({
    calle,
    altura,
    piso,
    departamento,
    codigoPostal,
    ciudad,
    provincia,
    pais,
    lat,
    long,
  }) {
    this.calle = calle;
    this.altura = altura;
    this.piso = piso;
    this.departamento = departamento;
    this.codigoPostal = codigoPostal;
    this.ciudad = ciudad;
    this.provincia = provincia;
    this.pais = pais;
    this.lat = lat;
    this.long = long;
  }

  descripcionCorta() {
    var desc = `${this.calle} ${this.altura}`;
    if (this.piso) {
      desc += `, Piso ${this.piso}`;
    }
    if (this.departamento) {
      desc += `, Depto ${this.departamento}`;
    }
    desc += `, ${this.ciudad}, ${this.provincia}, ${this.pais}`;
    return desc;
  }
}
