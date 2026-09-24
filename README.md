# Toolshop E-Commerce Test Automation Framework

A Playwright + TypeScript test automation framework built against [Practice Software Testing (Toolshop)](https://practicesoftwaretesting.com), a public demo e-commerce application. Built from scratch as a learning project and portfolio piece, covering UI, API, authentication/authorization, payment, network mocking, cross-browser/mobile execution, and CI.

## Tech stack
- **Playwright** + **TypeScript**
- **@faker-js/faker** — dynamic test data
- **dotenv** — environment configuration
- GitHub Actions for CI

No other dependencies were added — the framework relies on Playwright's own built-in capabilities (auto-waiting, fixtures, `APIRequestContext`, tracing, network interception) rather than third-party test libraries.

## Project structure

```text
├── .github/workflows/playwright.yml   # CI pipeline (two jobs — see CI/CD section)
├── api/                                # Thin API clients (ApiClient + one class per resource)
│   ├── apiClient.ts
│   ├── authApi.ts
│   ├── invoicesApi.ts
│   ├── paymentApi.ts
│   └── productsApi.ts
├── data/
│   ├── session-store.ts                # Persists the auto-registered test account's credentials
│   └── user-factory.ts                 # Faker-based TestUser generator
├── pages/                              # Page Object Model
│   ├── CheckoutPage.ts                 # Full 4-step checkout wizard
│   ├── HomePage.ts
│   ├── LoginPage.ts
│   ├── ProductPage.ts
│   └── RegisterPage.ts
├── playwright/.auth/                   # Generated storageState (gitignored)
├── tests/
│   ├── api/                            # Pure API tests — no browser, no auth setup dependency
│   ├── e2e/                            # UI tests (Page Object–driven)
│   ├── network/                        # Network mocking / interception tests
│   ├── smoke/                          # Original setup smoke test
│   └── auth.setup.ts                   # Registers a fresh user via API, logs in via UI, saves storageState
├── types/
│   ├── payment.ts
│   └── product.ts
├── utils/
│   ├── jwt.ts                          # JWT decode/tamper helpers
│   └── mock-oauth.ts                   # Simulated OAuth2/OIDC helper
├── .env.example
└── playwright.config.ts
```

## Setup

```bash
git clone <your-repo-url>
cd Ecommerce-playwright
npm install
npx playwright install --with-deps
cp .env.example .env
```

`.env` needs:

```bash
BASE_URL=https://practicesoftwaretesting.com
API_BASE_URL=https://api.practicesoftwaretesting.com
ADMIN_EMAIL=admin@practicesoftwaretesting.com
ADMIN_PASSWORD=welcome01
```

No customer account credentials are needed — `auth.setup.ts` registers a brand-new account via the API on every run, so there's nothing to keep valid manually.

## Running tests

| Command | What it does |
|---|---|
| `npm test` | Full suite: all specs on Chromium, `@smoke`-tagged subset on Firefox/WebKit/Mobile Chrome |
| `npm run test:smoke` | Only `@smoke`-tagged tests, across every project |
| `npm run test:headed` | Runs headed (visible browser) |
| `npm run test:ui` | Playwright's interactive UI mode |
| `npm run test:debug` | Step-through debug mode |
| `npm run report` | Opens the last HTML report |

Playwright projects: `setup` (registers a user, saves session) → `api` (no browser, independent) → `chromium` (full suite) → `firefox` / `webkit` / `mobile-chrome` (smoke subset only, to keep run time reasonable).

## Architecture notes
- **Page Object Model** — Page classes hold locators and actions only; assertions live in tests.
- **`api/`** mirrors the POM pattern for HTTP: one client class per resource, no assertions inside.
- **Auth** — `auth.setup.ts` runs once per suite (`dependencies: ['setup']`), registering a fresh Faker-generated account via the API and logging in through the real UI to capture `storageState`. This removed a recurring problem early on where a fixed test account kept expiring.
- **Data-driven tests** — payment methods and validation-rule boundary cases are generated from arrays looped into `test()` calls at load time (see `tests/api/payment*.spec.ts`), rather than hand-duplicated tests.
- **Test tagging** — a handful of critical-path tests are tagged `@smoke` and filtered per-project via `grep`, so non-Chromium browsers only run a fast representative subset.

## CI/CD
Two separate GitHub Actions jobs:
- **`api-tests`** (required) — runs the `api` Playwright project only. No browser is launched, so it's fast and unaffected by the limitation below.
- **`ui-tests`** (`continue-on-error: true`) — runs the full browser-driven suite across all projects. See Known Limitations.

Both jobs upload the HTML report (and traces/screenshots/videos on failure) as build artifacts.

## Known Limitations
**Browser-driven CI runs are intermittently blocked by Cloudflare bot protection.** Toolshop is fronted by Cloudflare, which challenges automated browser traffic from data-center IP ranges (including GitHub-hosted runners) with a "Verify you are human" check. This is a documented, common limitation when testing public demo sites from cloud CI — other engineers automating this exact site report the same behavior, with tests passing reliably locally but not always from CI IPs.

This is why `ui-tests` runs as `continue-on-error`: a failure there reflects Cloudflare's infrastructure-level bot detection, not a defect in the test suite or the application. The `api-tests` job, which never launches a browser, is unaffected and runs as the required CI gate.

## Notable findings
Beyond coverage, this project surfaced real defects in the target application:
- **BUG-001** — `GET /users/refresh` returns `500` instead of the documented `401` for both malformed and expired tokens.
- **BUG-002** — If `GET /products` fails, the UI shows an infinite loading skeleton with no error message and no retry option.
- **BUG-003** — Rapidly clicking the payment "Confirm" button multiple times creates one duplicate invoice per extra click. A single, normal checkout is unaffected.

Each is documented as a test using `test.fail()`, asserting the *correct* expected behavior — so the test will flag an unexpected pass if the underlying bug is ever fixed.

## Not yet covered
Dialogs, iframes, drag-and-drop, and file upload/download were scoped out of this pass (Toolshop has limited native support for most of these) and are planned as a follow-up phase.
