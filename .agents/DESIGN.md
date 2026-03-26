# Design System Document: The Editorial Node

## 1. Overview & Creative North Star

This design system moves away from the "standard bootstrap" look of tech communities toward a high-end editorial experience.

**Creative North Star: "The Editorial Node"**
Our vision is to treat community information as curated content rather than a database. We bridge the gap between technical precision and human-centric connection. The aesthetic utilizes intentional asymmetry, generous whitespace (derived from our `Spacing Scale`), and a sophisticated layering of surfaces to create a sense of digital "physicality." We don't just list events; we showcase a movement.

## 2. Colors & Surface Architecture

The palette is rooted in the high-energy `#e84a5f`, supported by a nuanced spectrum of architectural neutrals.

### The "No-Line" Rule

**Explicit Instruction:** You are prohibited from using 1px solid borders for sectioning or containment.
Boundaries must be defined solely through:

- **Background Color Shifts:** A `surface-container-low` section sitting on a `surface` background.
- **Tonal Transitions:** Using the `surface-container` tiers (Lowest to Highest) to define nesting.

### Surface Hierarchy & Nesting

Treat the UI as a series of stacked sheets of fine material.

- **The Base:** Use `surface` (#f1fbff) for the primary background.
- **The Section:** Use `surface-container-low` (#eaf5fa) for large content areas.
- **The Detail:** Use `surface-container-highest` (#e84a5f) for interactive elements like input fields or active state cards.

### The "Glass & Gradient" Rule

To elevate the experience, floating elements (Modals, Navigation Bars, Hovering Tooltips) should utilize **Glassmorphism**.

- **Backdrop Blur:** 12px to 20px.
- **Fill:** A semi-transparent version of `surface` (e.g., 80% opacity).
- **Signature Gradient:** For high-impact CTAs, use a subtle linear gradient from `primary` (#b11f3b) to `primary_container` (#d33b51) at a 135-degree angle. This adds "soul" to the technical interface.

## 3. Typography

The typography system balances the technical nature of developers with the premium feel of a lifestyle brand.

- **Display & Headlines (Space Grotesk):** This typeface offers a "technical-humanist" feel. Its geometric traps and expressive terminals convey innovation. Use `display-lg` for hero statements with tight letter-spacing (-0.02em).
- **Body & Titles (Inter):** Chosen for its exceptional legibility and neutral tone. It provides the "clean" developer-friendly feel requested.
- **Technical Details:** Where code snippets or technical metadata (e.g., repo sizes, timestamps) appear, use a monospace font-family at `label-sm` scale to provide a subtle "hacker" nod.

## 4. Elevation & Depth

Depth is achieved through **Tonal Layering** rather than structural shadows.

- **The Layering Principle:** Place a `surface-container-lowest` card on a `surface-container-low` section. This creates a soft, natural lift that feels like high-quality paper.
- **Ambient Shadows:** If a floating effect is required (e.g., a "Join Us" button or a featured Event Card), use an extra-diffused shadow:
- _Blur:_ 32px
- _Spread:_ -4px
- _Opacity:_ 6% of the `on_surface` color.
- **The "Ghost Border" Fallback:** If accessibility demands a container edge, use a Ghost Border: `outline_variant` at **15% opacity**. Never 100%.

## 5. Components

### Buttons

- **Primary:** High-polish gradient (`primary` to `primary_container`). Large padding (Scale 3 on sides, 2 on top/bottom). `Roundedness: md`.
- **Secondary:** No fill. `Ghost Border` (15% opacity `outline`). `on_surface` text.
- **Tertiary:** No fill, no border. Underline only on hover.

### Community Group Cards

Forbid the use of divider lines.

- **Style:** A `surface-container-low` base that shifts to `surface-container-highest` on hover.
- **Layout:** Use asymmetrical spacing—more padding at the top (Scale 6) than the bottom (Scale 4) to create an editorial "header" feel within the card.

### Filtered Video Library & Chips

- **Chips:** Use `secondary_container` with `on_secondary_container` text. When selected, use `primary` with `on_primary`.
- **Video Cards:** Use a 16:9 aspect ratio for thumbnails. Overlay a glassmorphic "Play" button in the center. Metadata should use `body-sm` for the description and a monospace `label-sm` for the video duration.

### Input Fields & Search

- **Style:** Minimalist. No border. Use `surface-container-highest` as the fill.
- **State:** On focus, the background remains, but a 2px `primary` underline animates from the center.

## 6. Do’s and Don’ts

### Do:

- **Embrace Whitespace:** If you think there is enough space, add one more step from the `Spacing Scale`. Space is a luxury.
- **Nesting Surfaces:** Use the `surface-container` tiers to guide the eye. The darker/more saturated the container, the more "nested" it should feel.
- **Intentional Asymmetry:** Align text to the left but allow imagery or decorative branding elements to "break" the grid and bleed off-screen.

### Don’t:

- **No Hard Outlines:** Never use a 100% opaque border to separate a sidebar or a card. It breaks the editorial flow.
- **No Pure Black:** Even in Dark Mode, use the `surface` and `on_surface` tokens. Pure #000000 kills the "premium" depth.
- **No Standard Shadows:** Avoid the "fuzzy grey" shadow. If you must use a shadow, tint it with the primary or surface color to keep it integrated with the environment.
- **No Over-Crowding:** Don't try to fit 5 event cards in a row. Use 2 or 3 to allow the brand's personality to breathe.
