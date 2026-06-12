# CLAUDE.md

## Purpose

This file is the system prompt for LLMs working in this repository.
It describes the project, the working rules, and the default operating style for implementing the GaneshaGoods frontend.

## Project overview

You are working on **GaneshaGoods**, a web e-commerce frontend for OSKM ITB 2026.
The frontend is built with:

- **Next.js 16 App Router**
- **React 19**
- **TypeScript strict mode**
- **Bun** as the runtime and package manager
- **Tailwind CSS** for styling
- Generated API client code under `src/api/`

The app is organized around role-based commerce flows:

- public/auth pages: login, signup, verify OTP, onboarding
- main user pages: products, cart, checkout, payment, profile, history
- admin pages: dashboard item, dashboard transaction, hand over

## Core product scope

Keep the implementation aligned with `docs/SPEC.md`.
The frontend should support:

- authentication and onboarding flows
- role-aware product catalog access
- product detail pages with variants and images
- cart management with partial checkout
- checkout and payment flows
- profile and transaction history
- admin-only dashboards and QR handover flow

## Non-negotiable working rules

1. **Read the relevant docs before coding.**
   - If the task touches Next.js behavior, read the relevant guide in `node_modules/next/dist/docs/` first.
   - Follow `AGENTS.md` and the spec in `docs/SPEC.md`.
2. **Use Bun commands.**
   - Prefer `bun install`, `bun run`, `bunx`, etc. when installing or running project tools.
3. **Prefer small, targeted changes.**
   - Change only what is needed.
   - Preserve existing conventions and folder structure.
4. **Keep TypeScript strict and explicit.**
   - Avoid `any` unless there is a strong reason.
   - Prefer typed props, typed helpers, and clear return types.
5. **Do not invent auth logic prematurely.**
   - Auth integration may be incomplete.
   - If auth is not ready, keep token hooks/helpers isolated and easy to wire later.
6. **Respect role boundaries.**
   - Public/auth routes should not require the main layout navbar.
   - Main routes should assume authenticated access.
   - Admin routes must remain admin-only.
7. **Keep the UI accessible and responsive.**
   - Use semantic HTML.
   - Support keyboard interaction.
   - Preserve mobile-first responsiveness.
8. **Do not overwrite generated API files unless explicitly asked.**
   - Generated code lives under `src/api/`.
   - Prefer adapting app code around the generated client.

## Frontend structure

Use the following organization as the default mental model:

- `src/app/`
  - App Router pages, layouts, route groups, error and not-found pages
- `src/components/`
  - UI primitives and domain components
  - `layout/`, `auth/`, `product/`, `cart/`, `checkout/`, `payment/`, `admin/`
- `src/domains/`
  - Domain-level API wrappers, hooks, stores, and types
- `src/lib/`
  - Shared utilities such as API client setup, token helpers, and formatting helpers
- `src/types/`
  - Global declarations
- `src/api/`
  - Generated OpenAPI client code

## Route and feature expectations

### Auth flow

- `/login`
- `/signup`
- `/verify-otp`
- `/onboarding`

### Main flow

- `/products`
- `/products/[id]`
- `/cart`
- `/checkout`
- `/payment/[orderId]`
- `/profile`
- `/history`

### Admin flow

- `/admin/dashboard-item`
- `/admin/dashboard-transaction`
- `/admin/hand-over`

### Shared layout behavior

- Use a root layout for shared providers and global shell.
- Keep auth routes visually separate from the main navbar/footer shell when required.
- Ensure 404 and global error handling remain in place.

## Domain conventions

When implementing features, keep the frontend aligned with these business concepts:

- users have roles: `umum`, `panitia`, `admin`
- product types include merchandise, collaboration, and kit panitia
- cart supports quantity updates and partial checkout
- checkout supports pickup or delivery
- payment uses QRIS or other configured methods
- history includes pickup QR codes with expiration
- admin features include item dashboard, transaction dashboard, and hand over QR scanning

## API client guidance

- Use the configured API client in `src/lib/api-client.ts`.
- Prefer hooks/interceptors over ad hoc fetch logic.
- Attach tokens through the client layer, not scattered across components.
- Keep the API client replaceable and easy to extend once auth is fully available.

## Implementation style

- Think in domains, not just files.
- Prefer reusable components over duplicated page-specific markup.
- Keep data fetching, state management, and presentational UI separated when practical.
- Use loading, empty, and error states deliberately.
- For forms, prefer predictable validation and clear error messages.
- For role-gated pages, make the guard behavior explicit.

## Verification workflow

After changes, verify the work with the smallest useful check:

- lint if the change is mostly TypeScript/React
- typecheck if types changed
- run targeted tests or build steps when relevant

If a command fails because of pre-existing project issues, call that out clearly and do not over-correct unrelated files.

## Communication style

- Be concise and practical.
- Mention exact file paths when you change files.
- Explain important trade-offs briefly.
- Ask clarifying questions when the request is underspecified.
- Do not claim work was done unless it was actually written to disk.

## Working principle

Make the frontend feel coherent, predictable, and easy to extend.
Optimize for clarity, maintainability, and alignment with the product spec rather than cleverness.
