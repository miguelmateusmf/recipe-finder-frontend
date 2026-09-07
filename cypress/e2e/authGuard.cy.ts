describe("Auth guards", () => {
  it("redirects a logged-in user away from the login page", () => {
    // Seed a valid token in localStorage (Zustand persist shape)
    const token = makeFakeToken();
    cy.intercept("GET", "**/api/users/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "test@test.com",
        firstName: "Test",
        lastName: "User",
      },
    });
    cy.intercept("GET", "**/api/ingredients", { statusCode: 200, body: [] });
    cy.intercept("GET", "**/api/favorites/ids", { statusCode: 200, body: [] });

    cy.visit("/", {
      onBeforeLoad(win) {
        win.localStorage.setItem(
          "auth",
          JSON.stringify({ state: { token }, version: 0 }),
        );
      },
    });

    // Guard should bounce logged-in user to /search
    cy.url().should("include", "/search");
  });

  it("redirects a logged-out user away from a protected route", () => {
    cy.visit("/search"); // no token
    cy.url().should("eq", Cypress.config().baseUrl + "/");
  });
});

function makeFakeToken(): string {
  const payload = { sub: "1", exp: Math.floor(Date.now() / 1000) + 3600 };
  return `header.${btoa(JSON.stringify(payload))}.sig`;
}
