# Agent Instructions — Fashion E-Commerce Project

You are implementing the project described in `PRD.md` and `technical-architecture.md`,
both in this repo's root. These two documents are the **source of truth**. Read both
files completely before writing any code, and re-read the relevant section before
starting each new phase.

If anything in this file conflicts with the two source documents, the documents win —
flag the conflict to the user instead of silently resolving it.

---

## 1. Work in phases, not all at once

Follow the roadmap in `PRD.md` §11 (Development Roadmap) **in order**:

`Phase 0 (Foundation) → 1 (Storefront MVP) → 2 (WhatsApp Checkout) → 3 (Admin Core) →
4 (Admin Advanced) → 5 (Hardening & QA) → 6 (Launch)`

Rules:
- Before starting a phase, write a short implementation checklist for that phase only
  and share it with the user before generating a large volume of code.
- Do not start the next phase until the user confirms the current one is done.
- Do not implement features from a later phase "while you're at it," even if it seems
  efficient. Flag the idea instead — don't unilaterally expand scope.
- Do not implement anything from PRD.md §13 (Future Features) unless explicitly asked.

## 2. Don't deviate from the design docs silently

- Folder structure: follow `technical-architecture.md` §3 exactly. If you think a
  deviation is justified, explain why and ask before doing it.
- Database schema: implement the Prisma schema as a direct mirror of the SQL in
  `technical-architecture.md` §5. Don't add/remove/rename tables or columns beyond
  what's implied by the PRD without asking first.
- API contract: follow the endpoints, methods, and request/response shapes in
  `technical-architecture.md` §6. If a frontend need doesn't fit an existing endpoint,
  propose the new/changed endpoint before building around a workaround.
- Tech stack: use exactly what's specified in `technical-architecture.md` §1 (Nuxt,
  NestJS, Prisma, PostgreSQL, Redis, etc.) unless the user approves a substitution.

## 3. Non-negotiable technical rules

- TypeScript strict mode across all apps (storefront, admin, api).
- All admin mutations must be authorized **server-side** via RBAC guards — never rely
  on frontend role checks as the security boundary (see `technical-architecture.md` §6.10).
- Validate and sanitize all inputs server-side (DTOs + validation pipes), regardless of
  frontend validation.
- Never hardcode secrets, API keys, or DB credentials. Use environment variables and
  keep a `.env.example` up to date whenever a new variable is introduced.
- Stock/inventory changes must always go through an `inventory_adjustments` record —
  never mutate `stock_quantity` directly without an audit trail row.
- Orders must snapshot customer/product/price data at time of order (per schema notes
  in `technical-architecture.md` §5) — never rely solely on live joins to `products`/
  `customers` for historical order data.

## 4. WhatsApp checkout — critical business logic, don't improvise

- No payment gateway integration in this project. Checkout creates an `orders` row
  with status `pending_whatsapp`, generates the formatted message, and redirects to
  a `wa.me` deep link.
- If the redirect fails or is blocked, show the fallback screen (copyable message +
  clickable link) — see `PRD.md` §8 and Functional Requirement FR-C-15/16.
- Do not change this flow to call any real WhatsApp Business API without being asked —
  the design intentionally avoids that for v1.

## 5. When the docs are silent or ambiguous

- For low-stakes implementation details (e.g. exact spacing, a helper function's
  internal structure): make a reasonable, documented assumption and keep moving —
  note the assumption in your summary.
- For anything touching security, data integrity, pricing/stock correctness, or the
  order/checkout flow: stop and ask rather than guessing.

## 6. Definition of done (per feature/module)

Before marking something complete, confirm:
- [ ] Matches the acceptance criteria of the relevant user story in `PRD.md` §7
- [ ] Passes lint and type-check
- [ ] Has at least basic unit/integration test coverage for business logic
- [ ] No secrets or credentials committed
- [ ] `.env.example` and any relevant docs updated if new config was introduced

## 7. Git & commits

- Commit in small, logical, descriptive units — not one giant commit per phase.
- Don't rewrite/force-push shared history.
- Open questions or assumptions that need user sign-off go in the commit/PR
  description, not buried in code comments only.

## 8. Reporting back

After each work session or phase, summarize:
- What was built, mapped to the specific PRD/roadmap item(s) it satisfies
- Any assumptions made (§5) or deviations proposed (§2), with reasoning
- What's next, and any blockers/questions for the user

---

*If you are Claude Code: this file can also be copied/renamed to `CLAUDE.md` in the
repo root so it's loaded automatically every session. Other agentic tools (Cursor,
Windsurf, Copilot Workspace, etc.) generally support `AGENTS.md` natively as well.*
