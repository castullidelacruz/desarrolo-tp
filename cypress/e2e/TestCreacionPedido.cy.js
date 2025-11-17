describe("Flujo 2: Creación de Pedido", () => {
  it("crea un pedido exitosamente", () => {
    cy.visit("http://localhost:3000/login");

    cy.get('input[type="email"]').clear().type("audio.company@vendedor.com");
    cy.get('input[type="password"]').clear().type("audio.company");
    cy.contains("button", /ingresar/i).click();

    cy.contains("a.navbar__link", "Productos").click();

    cy.get(".product-card")
      .first()
      .within(() => {
        cy.contains(/carrito|🛒/i).click();
      });

    cy.on("window:alert", (msg) => {
      expect(msg).to.match(/añadido/i);
    });

    cy.get("button.cart").click();

    cy.get(".tabla-fila").should("have.length.at.least", 1);

    cy.contains("button", /checkout/i).click();

    cy.url().should("include", "/checkout");

    cy.get(".summary-item").should("have.length.at.least", 1);

    // 🟩 FIX inputs que se duplicaban
    cy.get('input[name="calle"]').clear().type("Av. Santa Fe", { delay: 0 });
    cy.get('input[name="altura"]').clear().type("3200", { delay: 0 });
    cy.get('input[name="codigoPostal"]').clear().type("1425", { delay: 0 });
    cy.get('input[name="provincia"]')
      .clear()
      .type("Buenos Aires", { delay: 0 });

    cy.contains("button", /confirmar compra/i).click();

    // 🟩 Esperar correctamente la redirección
    cy.url({ timeout: 8000 }).should("include", "/perfil");
  });
});
