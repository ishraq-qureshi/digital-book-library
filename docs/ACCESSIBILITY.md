# Accessibility Rules (target: WCAG 2.1 AA)

- **`lang`/`dir` correct on every page**, per the active locale. This is the
  single most important line for Urdu/Sindhi/Farsi/Arabic — it drives
  correct screen-reader pronunciation and native browser bidi handling.
- **Logical CSS properties, never physical.** `margin-inline-start`,
  `padding-inline-end`, `text-align: start` (Tailwind's `ms-`/`me-`/
  `text-start` utilities) — not `left`/`right` — so every component mirrors
  correctly under `dir="rtl"` without a parallel RTL stylesheet.
- **Status is never color-only.** Availability badges etc. pair an icon/text
  label with color, never color alone.
- **Every input has a real `<label>`,** not a placeholder standing in for
  one. Required fields marked `aria-required`; validation errors rendered
  as text adjacent to the field, translated.
- **Search/filter results are announced** via `aria-live="polite"` in the
  active locale ("12 results found"), not left for a screen reader to
  re-discover.
- **Keyboard reachability.** Every interactive element (search box, filter
  dropdowns, admin forms, modals, popovers) is reachable in a logical tab
  order with a visible focus state; tab order follows visual order in both
  LTR and RTL.
- **Modals trap focus** and return focus to the triggering element on
  close; closable via Escape and overlay click.
- **Directional icons mirror in RTL** (e.g. a "next page" chevron);
  non-directional icons don't.
- **Alt text.** Book covers get descriptive alt text (title + author, in
  the book's own language); decorative icons are `aria-hidden`.
- **Contrast checked in both themes**, for every locale/font — some scripts
  (e.g. Nastaliq) render visually denser than Latin text at the same size.
- **`prefers-reduced-motion` respected** — animations fall back to instant.
- **CI gate:** an automated accessibility check (axe) runs against the
  public page and admin forms, in one LTR and one RTL locale, before merge.
