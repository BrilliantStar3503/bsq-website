# Insurance Solutions Experience — V1 Release Summary

**Tag:** `v1.0.0-insurance-solutions-experience`
**Branch merged:** `feature/goal-first-solutions-registry` → `main`
**Status:** Production baseline. Architecture considered stable — future work should extend it, not redesign it.

This document is the permanent historical record of how the `/products` experience went from an independent product-page catalog to a single, goal-first, registry-driven visitor journey.

---

## 1. Objectives Achieved

The original brief: visitors had to return to the homepage to browse another product, every product page was an independent destination, and the site felt like a catalog rather than a financial advisor. The objective was to redesign the *visitor journey*, not just the product pages — built around customer needs before products.

**Achieved.** The complete journey is now:

```
Home
 → Insurance Solutions (goal-first global nav)
   → Insurance Solutions Landing Page
     → Choose a Financial Goal
       → Recommended Insurance Solutions (grouped by goal)
         → Solution Detail (breadcrumbed, switcher-nav-connected)
           → Related Solutions (ranked by shared goal)
             → Consultation (pre-contextualized)
 → Financial Assessment (entry point, optional)
   → Recommended Financial Goal (derived from gaps)
     → Recommended Insurance Solution
       → Consultation (pre-selected, same component)
```

A visitor never returns to `/` to browse another solution, never has to think in product-mechanics terms (VUL / Traditional) to choose one, and the Financial Assessment now hands off into the same goal vocabulary instead of running as a parallel, disconnected feature.

---

## 2. Major Architectural Decisions

| Decision | Why |
|---|---|
| **Goal-first, not category-first** | Visitors think in life goals ("protect my family"), not insurance mechanics ("VUL plan"). `internalCategory`/`category`/`addressesGaps` stayed internal-only; the only visitor-facing taxonomy is `financialGoals`. |
| **Extend the existing Assessment engine, don't rebuild it** | `computeScore()` and `recommendation-engine.ts` were already sophisticated, tested, hand-authored business logic. Phase 5 added a thin bridge (`getGoalForGap`) on top rather than merging or replacing either engine. |
| **One universal consultation component** | `ProductAppointmentSection` grew an optional `product`/`goalId` API instead of spawning a second form for the goal-agnostic landing-page use case. |
| **`position: fixed` + scroll-tracking over CSS `position: sticky`** | `html`/`body`'s pre-existing `overflow-x: hidden` breaks `sticky`'s containing-block resolution in this app — discovered, root-caused, and worked around via `useStickyOnScroll`, matching the pattern the existing header already used. |
| **Reduce, don't just relocate, navigation chrome** | A mid-project review found 3 stacked orientation bars before any content on solution pages. Resolved by folding the breadcrumb into the switcher nav (2 bars), not just restyling. |
| **Separate telemetry validation from UTM validation** | `sanitizeSource()` (closed marketing vocabulary) and `sanitizeEventSource()` (structured, prefix-based interaction taxonomy) were conflated under one function and one allowlist. Split them — zero risk to existing UTM attribution, restored full context to click tracking. |

---

## 3. New Registry Capabilities (`lib/products.ts`)

- `financialGoals: FinancialGoal[]` — the 5 visitor-facing goals (Protect My Family, Protect My Income, Prepare for Retirement, Grow My Wealth, Secure My Child's Future), each with an ordered, curated `productIds` list.
- `internalCategory` on `PruProduct` — protection/investment/retirement, navigation-grouping only, never visitor-facing.
- `gapToGoal` — maps the assessment engine's gap vocabulary to financial goals, without coupling the scoring engine to marketing copy.
- Helpers: `getProductsForGoal`, `getGoalsForProduct`, `getGoalForGap`, `getFinancialGoal`.
- `lib/goal-icons.ts` — centralized goal-icon resolution (`GOAL_ICONS`, `getGoalIcon`), used by the global header, `GoalCard`, and built to be the third consumer for the assessment results page.
- `EVENT_SOURCE_PREFIXES` (`lib/api-guard.ts`) — structured, pattern-validated event-source registry for `/api/track-click`.

Adding insurance solution #6–50 requires: one `PruProduct` entry + adding its id to the relevant `financialGoals.productIds` arrays. Navigation, the landing page, related solutions, and breadcrumbs all update automatically — verified true by tracing every consumer, not assumed.

---

## 4. Visitor Journey Improvements

- **Dead link eliminated in 3 separate locations** — `/prulifetime` (a route that never existed) was hardcoded in the global header's product dropdown, the in-experience header's product list, and the assessment results screen's recommendation cards. All three were symptoms of the same root cause (hardcoded, duplicated product lists) and were fixed once, structurally, by making every surface registry-derived.
- **Three hardcoded product lists consolidated into one registry-derived source.**
- **Taxonomy overlap resolved** — a visitor no longer sees three different classification languages (goal, internal category, plan mechanics) in one viewport.
- **Orientation chrome reduced** from 3 stacked bars to 2 on solution pages, with the hero now visible sooner.
- **Related Solutions reranked** from shared assessment-gap-ID overlap to shared financial-goal overlap — recommendations now read as "this serves the same goal," not an internal scoring coincidence.
- **Assessment → Consultation handoff** — recommendation cards now route to `/products/<slug>#appointment`, landing directly on a form that already knows which product the visitor was just shown.
- **Analytics attribution restored** — interaction telemetry (`/api/track-click`) now preserves full contextual detail (which product, which goal, which score) instead of collapsing to `source: "unknown"` for nearly every click sitewide.

---

## 5. Deferred Items (Intentional — Do Not Treat as Bugs)

These were identified, evaluated, and explicitly deferred because they're maintainability improvements, not visitor-experience or correctness issues:

- Shared `framer-motion` variant consolidation (`fadeUp`/`stagger` duplicated across a few files).
- Shared design-constant consolidation (`PRU_RED`/`GRAY_BG`/`GRAY_LINE` redeclared per-file — a pre-existing codebase convention, expanded but not introduced by this initiative).
- Additional internal code consolidation generally.

Address only when they provide measurable value — not before.

---

## 6. Known Follow-Up Work (Out of This Release's Scope)

- **`/api/capture-lead` discards `body.source` entirely**, hardcoding `'bsq_financial_assessment'` regardless of what's sent (e.g. `ProductFunnelPage`'s `product_funnel_<slug>` context is silently dropped). Found during the analytics-attribution fix, confirmed unrelated to and unaffected by that fix. Needs its own follow-up task.
- **No `robots.txt` / `sitemap.xml` / global `metadataBase`** anywhere on the site — pre-existing, sitewide, not specific to Insurance Solutions.
- **Browser compatibility** (Safari/Firefox/older Edge rendering) was not independently verified — everything used is broadly-supported evergreen-browser CSS/JS, but no real cross-browser test matrix was run.
- **`AssessmentFlow.tsx` recommendation cards use raw `<img>`** instead of `next/image` — pre-existing, unoptimized, untouched by this initiative.
- **Consultation dropdown on the landing page** lists raw product names with no goal context — flagged during the final experience review as the one remaining friction point; earmarked to resolve naturally once assessment-goal context is threaded further into that form, not blocking.

---

## 7. Process Notes

Every phase (1 through 5, plus a 4.5 cleanup pass and two post-launch review passes) was implemented, then independently verified — `tsc`, `eslint` diffed against its pre-existing baseline, a full production build, and in-browser testing — before moving to the next. No phase was implemented without an explicit approval checkpoint. This record exists so that future work on this architecture can trust what's documented here without re-deriving it from the commit history.
