# Design System

Full brand concept (palette rationale, mark, type pairing) was designed as
"Kitaabi" — see the published identity artifact linked from the project
history; the tokens below are what actually ship in code.

## Tokens (light / dark, CSS variables)

| Token | Light | Dark | Use |
|---|---|---|---|
| `--ink` | `#1C2B47` | `#EDE6D3` | primary text |
| `--ink-soft` | `#55607A` | `#A9AFC4` | secondary text |
| `--paper` | `#ECE4D2` | `#10182B` | page background |
| `--paper-dim` | `#E2D8C0` | `#182236` | card/surface background |
| `--accent` | `#D68A2D` | `#E9A94A` | availability, focus, active filter, CTA |
| `--line` | `rgba(28,43,71,.14)` | `rgba(237,230,211,.12)` | hairline borders |

All AA-contrast-checked in both themes. Don't hardcode a hex in a component —
pull from the token.

## Fonts

- Display (wordmark, headings): **Fraunces**.
- Body/UI chrome: **Work Sans**.
- Arabic-script rendering (Urdu/Sindhi/Farsi/Arabic content and UI):
  **Amiri**.
- Data/mono (ISBNs, hex values, code): **IBM Plex Mono**.

Load via `next/font` with Google Fonts, not a runtime `<link>` — keeps it
self-contained and avoids layout shift.

## Component-to-pattern mapping (don't re-decide per feature)

| Pattern | Component |
|---|---|
| Destructive confirmation (delete book/taxonomy value) | shadcn/ui `Dialog`, focus-trapped |
| Filter multi-select, language switcher, account menu | shadcn/ui `Popover`/`DropdownMenu` |
| Mutation success/error feedback | shadcn/ui `Toast`, `aria-live` |
| Search results / table loading | shadcn/ui `Skeleton`, never a bare spinner |
| Buttons | shadcn/ui `Button` variants: primary / secondary / destructive / ghost |

No new one-off component when an existing token/primitive already covers
the case.

## Motion

150-200ms, standard ease, for page/section transitions, modal/popover
open-close, toast enter/exit. Respect `prefers-reduced-motion` (instant, no
animation).

## Theme toggle

Light/dark, defaults to system preference (`prefers-color-scheme`), user
override persisted client-side, switch in the header next to the language
switcher.
