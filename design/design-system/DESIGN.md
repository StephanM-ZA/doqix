# Design System Documentation: The Kinetic Engine

## 1. Overview & Creative North Star

### Creative North Star: "The Kinetic Engine"
This design system is built on the philosophy of **Engineered Fluidity**. We are not building a static interface; we are designing a high-performance machine in motion. The aesthetic moves away from generic SaaS "flatness" and embraces an editorial, dark-mode atmosphere that feels both industrial and premium.

To achieve this, we prioritize:
*   **Intentional Asymmetry:** Breaking the 12-column grid with overlapping elements and offset typography to suggest a bespoke, human-engineered touch.
*   **Luminous Depth:** Using light as a functional material. Teal ambient glows signify "active energy," while deep surface nesting creates a sense of physical hardware.
*   **High-Contrast Editorial:** Leveraging massive, tight-tracked typography against expansive negative space to command authority.

---

## 2. Color Theory & Surface Architecture

### Palette Implementation
The palette is anchored in deep obsidian tones, punctuated by high-energy accents. 
*   **Primary (`#00e5a0`):** Electric Teal. Used for "Active" states, automation triggers, and data visualization.
*   **Secondary (`#ff8000`):** Warm Amber. Used sparingly for human-centric elements: CTAs, notifications, or "Attention" states. It provides the "Warmth" in our high-tech environment.

### The "No-Line" Rule
**Explicit Instruction:** Designers are prohibited from using 1px solid borders to define sections. Layout boundaries must be defined solely through:
1.  **Background Shifts:** Transitioning from `surface` to `surface_container_low`.
2.  **Tonal Transitions:** Using subtle `primary` radial gradients to "lift" a section without a hard edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of nested physical trays. 
*   **Base:** `surface_dim` (#131318) for the main page background.
*   **The Tray:** `surface_container_low` for large section blocks.
*   **The Component:** `surface_container_highest` for individual interactive cards.
This "nesting" creates a high-end, tactile feel without the clutter of lines or heavy shadows.

### The "Glass & Gradient" Rule
To evoke "automated motion," floating elements (like the navigation bar) must use **Glassmorphism**:
*   **Fill:** `surface` at 60% opacity.
*   **Blur:** 20px–40px Backdrop Blur.
*   **Signature Texture:** Use a linear gradient on Primary CTAs transitioning from `primary_fixed` to `primary_container` at a 135° angle. This adds "soul" to the automation.

---

## 3. Typography: Editorial Authority

We use **Inter** exclusively. The power of this system lies in the radical contrast between weight and tracking.

*   **Display-LG (H1):** 72px / 900 Weight.
    *   *Tracking:* -0.04em (Tight).
    *   *Purpose:* Hero statements. It should feel "Engineered"—solid, heavy, and immovable.
*   **Headline-MD:** 1.75rem / 700 Weight. 
    *   *Tracking:* -0.02em.
*   **Body-LG:** 1rem / 400 Weight.
    *   *Leading:* 1.6 (Generous).
    *   *Purpose:* Long-form technical explanations. Ensure high contrast against background using `on_background` (#e4e1e9).
*   **Label-SM:** 0.6875rem / 600 Weight.
    *   *Tracking:* 0.05em (Spaced).
    *   *Transform:* Uppercase.
    *   *Purpose:* Metadata, small captions, and "status" indicators.

---

## 4. Elevation & Depth

### The Layering Principle
Depth is achieved through **Tonal Layering** rather than structural lines. Stacking `surface_container_lowest` cards on `surface_container_low` sections creates a natural, soft lift.

### Ambient Shadows
For floating elements, use "Luminous Shadows." 
*   **Blur:** 40px–80px.
*   **Color:** Use `surface_tint` at 4%–8% opacity. This makes the shadow feel like a reflection of light rather than a dark void.

### The "Ghost Border" Fallback
If accessibility requires a container boundary, use a **Ghost Border**:
*   **Stroke:** 1px.
*   **Color:** `outline_variant` at 15% opacity.
*   **Effect:** It should be felt, not seen.

---

## 5. Components

### Pill Buttons (The Action Engine)
*   **Radius:** `full` (9999px).
*   **Primary:** `primary_container` background with `on_primary_container` text.
*   **Hover State:** Scale 102%, increase brightness of the teal gradient.
*   **Motion:** Use a 400ms "Spring" transition for all button states to mimic mechanical precision.

### Large Rounded Cards
*   **Radius:** `lg` (2rem / 32px) for outer containers; `md` (1.5rem / 24px) for inner content.
*   **Construction:** Use `surface_container` with no border. 
*   **Rule:** Forbid divider lines within cards. Use `spacing-lg` (vertical whitespace) to separate heading from content.

### Custom Banner (The "Status Pill")
*   **Style:** A horizontal pill with a teal-tinted background (`primary` at 10% opacity).
*   **Border:** `outline` token at 20% opacity.
*   **Icon:** Always include a small `primary` circle (8px) to the left of the text to signify "System Active."

### Vertical Step Timeline
*   **Nodes:** 12px circles using the `primary` token.
*   **Connecting Lines:** 2px width using `outline_variant`. 
*   **Motion:** As the user scrolls, the line should "fill" from top to bottom with a `primary` color gradient.

### Atmosphere Gradients
*   Place large (800px+), low-opacity (5-10%) radial gradients of `primary` behind key value propositions. This creates the "Atmospheric Glow" that defines the brand's engineered warmth.

---

## 6. Do’s and Don’ts

### Do:
*   **Use breathing room:** If you think there's enough white space, add 16px more.
*   **Mix weights:** Pair `Display-LG (900)` with `Body-MD (400)` for high-end contrast.
*   **Animate intentionally:** Elements should slide into place with a slight "overshoot" to feel like precision machinery.

### Don't:
*   **Use 100% Black:** Never use #000000. Stick to `surface_dim` (#131318) to maintain the premium "ink" look.
*   **Use traditional dividers:** No horizontal rules. Use background color steps.
*   **Over-glow:** Keep ambient gradients subtle. If the user notices the gradient before the text, it is too bright.
*   **Use Sharp Corners:** Everything must feel engineered yet ergonomic. Stick to the `Roundedness Scale`.