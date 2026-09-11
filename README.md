# Recipe Finder — Frontend

A full-stack recipe discovery app. Users pick ingredients they have on hand, and the app finds recipes they can make.

**Live app:** [https://recipe-finder.recipes](https://recipe-finder.recipes)
**Backend repo:** [recipe-finder-backend](https://github.com/miguelmateusmf/recipe-finder-backend)

---

## Stack

**Framework & tooling**
- React 19 + TypeScript
- Vite (dev server + build)
- TanStack Router (type-safe file-based routing)
- pnpm (package manager)

**State management**
- TanStack Query — server state (data fetching, caching, mutations)
- Zustand — client state (auth token, persisted to localStorage)
- React Context — theme, language

**UI**
- MUI (Material UI) — component library
- Tailwind CSS — utility styling

**API**
- Axios with interceptors
- Spoonacular API for recipe search (frontend-direct call)
- Custom Spring Boot backend for user data, favorites, ingredients (recipe-finder-backend)

**Testing**
- Vitest + Testing Library (unit + integration)
- Cypress (E2E)

**i18n**
- Custom translation system, English + Portuguese

## Testing

**Unit** (Vitest)
- `filterIngredients` — pure filter logic, all branches (search, type, combined, empty)
- `isTokenExpired` — token decoding, malformed input, valid/expired cases

**Integration** (Vitest + Testing Library)
- `IngredientResults` — renders with mock data, asserts filtering reaches the DOM. Virtualized table mocked.
- `PasswordForm` — validation logic + submit flow: mismatch shows error and disables submit; matching passwords fire the mutation.

**E2E** (Cypress)
- Login flow — form fill → intercept → redirect → assert search page and stubbed ingredients render
- Register flow — modal open → form fill → intercept → redirect
- Auth guards — logged-in user redirected away from `/`, logged-out user redirected away from `/search`

Backend requests are stubbed via `cy.intercept` for determinism. Tests run against the real router and real components.

---

## Local development

```bash
pnpm install
pnpm dev              # dev server (port 5173)
pnpm test             # Vitest watch mode
pnpm cypress          # Cypress interactive
pnpm build            # production build
```

Requires `.env` (template in `.env.example`):
```
VITE_SPOONACULAR_API_KEY=your_spoonacular_key
VITE_API_BASE_URL=http://localhost:8080
```

Backend must be running (see backend repo) for the API to work.

---

## AWS deployment

The app runs on AWS with HTTPS end-to-end, a custom domain, and a CDN-backed frontend.

### Architecture

```
User browser
    ↓ HTTPS
CloudFront (frontend distribution) ── SSL cert (ACM us-east-1)
    ↓
S3 bucket (static hosting, public read)
    → serves index.html + assets

Frontend JS calls:
    ↓ HTTPS
api.recipe-finder.recipes
    ↓ (Route 53 alias)
Application Load Balancer ── SSL cert (ACM eu-west-1)
    ↓ HTTP (within VPC)
ECS Fargate task (Spring Boot container)
    ↓
RDS Postgres 17
```

## Future work

Deferred consciously for MVP scope:
- **Refresh tokens** — currently a single JWT with 24h expiry. Production would use short-lived (15 min) access tokens + long-lived refresh tokens for better security/UX.
- **Ingredient translations table** — ingredient names are translated frontend-side via a static map (`ingredientNames.ts`). A production system would model this as an `ingredient_translations` table (`ingredient_id`, `language`, `name`) to scale beyond two languages without frontend changes.
- **Saved recipes / dietary restrictions / most-used ingredients** — planned features on the roadmap.
- **Secrets Manager** — task environment variables hold secrets in plaintext. Production would pull from AWS Secrets Manager.
- **CI/CD** — currently manual builds and deploys. GitHub Actions pipeline would automate build → test → push → deploy on merge to main.
