# Egodact Addon Extension Addons

Example addons, client SDK and UI/game library for the Egodact Pantagora extension.

## Example addon

`example-addon/` is a minimal Manifest V3 extension that runs on `https://app.egodact.com/*`
and registers itself with the host via `sdk.js` (copied from the host's addon API).

## Making your own addon

1. Copy `example-addon/` to a new folder.
2. Edit `manifest.json` (name, version, description).
3. Write your logic in `content.js` using `window.EgodactAddonClient` and `window.EgodactAddonLib`.
4. Load the folder as an unpacked extension.

## Client SDK API (`window.EgodactAddonClient`)

- `client.registerAddon({ id, name, version, description, author })`
- `client.registerMenu({ addonId, id, title, icon })`
- `client.registerButton({ addonId, id, title, icon, position, x, y, draggable })`
  - `position`: `'header'` (top bar) or `'floating'` (anywhere on screen).
  - `x`, `y`: initial position in pixels (floating only).
  - `draggable`: `true` (user can drag + position is saved) or `false` (fixed).
- `client.registerGame({ addonId, id, title, description, icon })`
- `client.onOpen(id, callback)`
- `client.openModal(title, html)` — `html` may be a string or a DOM node.
- `client.escapeHtml(text)`
- `client.storage(prefix)` — returns `{ get, set, remove }`.
- `client.setButtonEnabled(addonId, id, enabled)` — toggle a button on/off at runtime (no reload).
- `client.isButtonEnabled(addonId, id)` — returns `true` if the button is enabled.

Use Egodact CSS variables (`--egd-*`) for theming and `localStorage` with a
prefixed key for storage.

## Addon Library (`window.EgodactAddonLib`)

Loaded from `lib.js` (copy it from `example-addon/lib.js` or from the host repo's
`Egodact Smart/lib.js`). Provides:

- `ui` — `button`, `toggle`, `input`, `textarea`, `select`, `tabs`, `list`,
  `card`, `panel`, `row`, `col`, `toast`, `modal`.
- `game` — `createCanvas`, `loop`, `input`, `clear`, `rect`, `circle`, `text`,
  `sprite`, `collide`, `center`.
- `data` — `storage`, `bus`, `state`, `fetchJSON`.
- `layout` — `center`, `grid`, `scroll`.
- `theme()` — current colors; `el(tag, props, ...children)` — DOM builder.

### Toggling buttons at runtime

```js
// Check state
const enabled = client.isButtonEnabled('my-addon', 'my-floating-btn');

// Toggle (removes/re-adds the button live, no reload)
client.setButtonEnabled('my-addon', 'my-floating-btn', false); // off
client.setButtonEnabled('my-addon', 'my-floating-btn', true);  // on
```

Use `ui.toggle(label, value, onChange)` to build a slider in your modal:

```js
const toggle = ui.toggle('My floating button', enabled, function (value) {
    client.setButtonEnabled('my-addon', 'my-floating-btn', value);
    ui.toast(value ? 'Enabled' : 'Disabled', { type: value ? 'success' : 'info' });
});
```

## Files in `example-addon/`

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest. |
| `sdk.js` | Client SDK (v2). |
| `lib.js` | Egodact Addon Library (v1). |
| `content.js` | Addon logic. |

## Notes

- Disabled addons stay registered in the host's known list so they can be re-enabled.
- Floating button positions are saved in `localStorage` under `egodact_addon_btn_pos_<id>`.
- Disabled button ids are stored in `localStorage` under `egodact_disabled_addon_buttons`.
- The host and the library are MV3-compatible (no `eval`).
