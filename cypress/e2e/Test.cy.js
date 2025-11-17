describe("Flujo 1: Búsqueda de Productos y Visualización de Resultados", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/login");
    cy.wait(2000);
  });

  it("should search products with filters and display results", () => {
    // Login como COMPRADOR
    cy.contains("button", /Ingresar/i).click();
    cy.get('input[type="email"]').type("audio.company@vendedor.com");
    cy.get('input[type="password"]').type("audio.company");
    cy.contains("button", /Ingresar/i).click();

    cy.wait(2000);

    // Navegar a búsqueda de productos
    cy.contains("a", /buscar|productos/i).click();

    // Completar filtros
    cy.get('input[placeholder*="Buscar por nombre"]').type("Auriculares");
    cy.get('input[type="checkbox"][value="Electrónica"]').check();
    cy.get('input[type="checkbox"][value="Audio"]').check();
    cy.get('select[name="moneda"]').select("PESO_ARG");
    cy.get('select[name="orderby"]').select("Más vendido");
    cy.get('input[type="number"]').first().type("10000", { force: true });
    cy.get('input[type="number"][placeholder="Máximo"]')
      .last()
      .type("40000", { force: true });

    // Hacer clic en buscar
    cy.contains("button", /buscar/i).click();

    cy.wait(2000);

    // Verificar productos
    cy.get('[class*="product"]').should("have.length.at.least", 3);

    // Seleccionar el primer producto (click en "Ver detalle")
    cy.get('[class*="product"]')
      .first()
      .within(() => {
        cy.contains("button", /ver detalle/i).click();
      });

    // Asegurar que estamos en la página de detalle
    cy.url().should("include", "/product");
    cy.wait(1000);

    // Hacer clic en "Comprar"
    cy.contains("button", /comprar/i).click();
  });
});
