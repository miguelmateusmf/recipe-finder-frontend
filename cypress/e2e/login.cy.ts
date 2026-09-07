describe("Login flow", () => {
  it("logs in and lands on the search page with ingredients", () => {
    // Stub the login request — return a fake valid token
    cy.intercept("POST", "**/auth/login", {
      statusCode: 200,
      body: {
        token: makeFakeToken(),
      },
    }).as("login");

    // Stub the ingredients the search page fetches after login
    cy.intercept("GET", "**/api/ingredients", {
      statusCode: 200,
      body: [
        { id: 1, name: "Chicken", foodType: "MEAT" },
        { id: 2, name: "Apple", foodType: "FRUIT" },
        { id: 3, name: "Rice", foodType: "CEREALS" },
      ],
    }).as("ingredients");

    // Stub favorites (search page also calls this)
    cy.intercept("GET", "**/api/favorites/ids", {
      statusCode: 200,
      body: [],
    }).as("favorites");

    // Stub the user profile (header/guard may fetch it)
    cy.intercept("GET", "**/api/users/me", {
      statusCode: 200,
      body: {
        id: 1,
        email: "test@test.com",
        firstName: "Miguel",
        lastName: "Test",
      },
    }).as("me");

    // Start at the login page
    cy.visit("/");

    // Fill and submit the form
    cy.get('input[type="email"]').type("test@test.com");
    cy.get('input[type="password"]').type("password123");
    cy.get('button[type="submit"]').click();

    // Wait for login to resolve
    cy.wait("@login");

    // Should redirect to /search
    cy.url().should("include", "/search");

    // Ingredients should render
    cy.wait("@ingredients");
    cy.contains("Chicken").should("be.visible");
    cy.contains("Apple").should("be.visible");
  });
});

// Build a fake JWT with a future expiry so the auth guard passes
function makeFakeToken(): string {
  const payload = { sub: "1", exp: Math.floor(Date.now() / 1000) + 3600 };
  const base64 = btoa(JSON.stringify(payload));
  return `header.${base64}.signature`;
}
