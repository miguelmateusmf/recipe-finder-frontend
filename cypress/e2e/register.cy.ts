describe("Register flow", () => {
  it("registers a new user and lands on search", () => {
    cy.intercept("POST", "**/auth/register", {
      statusCode: 200,
      body: { token: makeFakeToken() },
    }).as("register");

    cy.intercept("GET", "**/api/ingredients", {
      statusCode: 200,
      body: [{ id: 1, name: "Chicken", foodType: "MEAT" }],
    }).as("ingredients");
    cy.intercept("GET", "**/api/favorites/ids", { statusCode: 200, body: [] });
    cy.intercept("GET", "**/api/users/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "new@test.com",
        firstName: "New",
        lastName: "User",
      },
    });

    cy.visit("/");

    // Open the register modal
    cy.contains("button", /register/i).click();

    // Scope everything to the modal so we don't hit the login form underneath
    cy.get('[role="dialog"]').within(() => {
      cy.get('input[type="email"]').type("new@test.com");
      // two password fields in the modal: password, then confirm
      cy.get('input[type="password"]').eq(0).type("password123");
      cy.get('input[type="password"]').eq(1).type("password123");
      cy.get('button[type="submit"]').click();
    });

    cy.wait("@register");
    cy.url().should("include", "/search");
    cy.contains("Chicken").should("be.visible");
  });
});

function makeFakeToken(): string {
  const payload = { sub: "1", exp: Math.floor(Date.now() / 1000) + 3600 };
  return `header.${btoa(JSON.stringify(payload))}.sig`;
}
