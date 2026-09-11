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

  ---

## Architectural decisions

### State separation: server state, client state, delivery

Rather than reaching for a single monolithic store (Redux, etc.), state is split by what it actually is:

- **Server state** (ingredients, favorites, user profile) lives in TanStack Query. It's already remote, needs caching, retries, invalidation.
- **Client state** (auth token) lives in a Zustand store, persisted to localStorage so sessions survive refreshes.
- **Delivery mechanisms** (theme, language) use Context — cross-cutting concerns that don't need reactivity beyond "value changes → re-render".

### ID-based JWT subject

The JWT subject is the user's numeric ID

### Optimistic updates with race handling

Favoriting ingredients uses optimistic updates via TanStack Query's `onMutate`/`onError`/`onSettled`. `cancelQueries` prevents in-flight background refetches from overwriting the optimistic value. The backend enforces uniqueness via a DB constraint; the API layer swallows `DataIntegrityViolationException` so double-clicks or concurrent requests still converge on the desired state without leaking errors to the user.

### Feature-based folder structure

```
src/features/
├── auth/          (login, register, JWT store, guards)
├── ingredients/   (list, filter, favorites)
├── recipes/       (search, results modal)
└── user/          (profile, forms, mutations)
```

Each feature owns its components, hooks, and mutations.

### Feature extraction over inline logic

Pure logic (filter functions, validation, token expiry checks) is extracted from components into standalone modules. Makes them testable in isolation and reusable. Example: `filterIngredients(ingredients, search, foodType, language)` is a pure function tested with Vitest without rendering any components.

### Auth guards via TanStack Router `beforeLoad`

Route protection runs before the route mounts — `beforeLoad` reads the token from the persisted store, checks expiry, and redirects if invalid. Both directions: authenticated routes redirect to login, and the login route redirects authenticated users to the app. No flash of protected content.

### i18n with structural type safety

Translation objects for each language use `satisfies` in TypeScript to enforce structural equality — adding a key to one language forces adding it to all others at compile time. No runtime missing-key surprises.

### Bilingual search

Ingredient search matches against both the English and the currently-active language's translation. A Portuguese user typing "frango" and an English user typing "chicken" both find the same ingredient. Data flowing to the recipe API stays English (Spoonacular's language), only display changes.

### Rate limiting on the backend

Auth endpoints (`/auth/login`, `/auth/register`) are rate-limited via Bucket4j: 5 requests per minute per IP. Protects against brute-force attempts without adding user friction. Documented as in-memory (single-instance) with the production upgrade path being Redis-backed buckets for horizontal scaling.

---


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
