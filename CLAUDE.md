when creating a new component or any sections - see if it already exists and reuse.
each time a component is created - it should be in a way that it can shared or reused in another component
dont hardcode values - use tokens

# CSS authoring rules

## Component styles belong in _components.css
- ALL component CSS must live in `components/_components.css` — never in a component HTML file's inline `<style>` block
- HTML files may only contain demo-scaffold styles (e.g. `.demo-group`, `.variants-row`) that are specific to the design system doc layout and have no reuse value
- Before writing any CSS class, grep `_components.css` to check if it already exists — reuse it, don't duplicate it
- After adding new component styles to `_components.css`, remove the equivalent rules from any HTML file's `<style>` block

## Token rules
- Never hardcode color, spacing, radius, typography, or transition values — always use a token from `css/app-tokens.css`
- Never hardcode pixel widths that represent "fill available space" — use `100%` or a flex/grid layout token
- Width tokens that cap a component to a fixed max-width (e.g. `--foo-width-expanded`) must be set to `100%` unless the fixed size is intentional for a floating/overlay component

## Adding new component pages
- Each time a new component page is created, add its nav entry to the `#ds-nav` sidebar in **every** existing HTML file in `components/`
- Each time a new component page is created, add a card entry for it in `index.html` (the main gallery) — include a `data-name` attribute with relevant search keywords and a representative `card__preview` thumbnail
- Icons in component demos must use Phosphor **bold** weight — use class `ph-bold ph-<icon-name>` and link `https://unpkg.com/@phosphor-icons/web@2.1.1/src/bold/style.css`
- **Component ordering is strictly A–Z** — the AI Components section in `#ds-nav` and the card grid in `index.html` must always be sorted alphabetically by component name. When adding a new component, insert it in the correct alphabetical position in both places (not at the end).

## Sidenav panel / view switching
- Panel visibility is controlled by `.sidenav__panel` / `.sidenav__panel--active` (defined in `_components.css`)
- Nav items that switch views must use `data-view` attributes; panels must use `data-panel` attributes
- Main content panels use `.main__panel` / `.main__panel--active`
