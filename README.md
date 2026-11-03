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
  - `icon`: emoji or SVG string.
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

### UI widgets

```js
ui.button('Click me', onClick, { background, color, icon, padding, fontSize, radius });
ui.toggle('Enable', true, function (value) { });
ui.input({ type, placeholder, value, width, onChange });
ui.textarea({ rows, value, placeholder, onChange });
ui.select({ options: [{ value, label }], value, onChange });
ui.tabs([{ title, render, html }], { active });
ui.list(items, function (item, i) { return node; }, { gap });
ui.card({ title, children, html, background, padding });
ui.panel({ children, html, background, border, padding, radius });
ui.row({ children, gap, align, justify, wrap });
ui.col({ children, gap, align, justify });
ui.toast('Saved!', { type: 'success', background, color, duration, bottom });
ui.modal('Title', bodyOrHtml, { background, width });
```

Toast types: `'success'` (accent), `'error'` (red), `'info'` (green). Override with `background`/`color`.

### Game helpers

```js
const { canvas, ctx, width, height } = game.createCanvas(parent, 320, 220, { background, radius });
const input = game.input();              // keyboard + mouse state
const loop = game.loop(updateFn, renderFn, { maxDt });
game.clear(ctx, color);
game.rect(ctx, x, y, w, h, color, { radius, stroke, lineWidth });
game.circle(ctx, x, y, r, color, { stroke, lineWidth });
game.text(ctx, 'score: 10', x, y, { color, size, bold, align, baseline, shadow });
game.sprite(ctx, img, x, y, w, h, { flipX });
game.collide(a, b);                    // AABB
game.center(canvas);
loop.stop(); loop.pause(); loop.resume();
input.consumeClick();
```

`createCanvas` scales by `devicePixelRatio` for crisp rendering on high-DPI displays.

### Data helpers

```js
const store = data.storage('my-addon');
store.get('key', defaultValue);
store.set('key', value);
store.remove('key');

const bus = data.bus;
bus.on('event', function (payload) {});
bus.emit('event', payload);

const state = data.state(initialValue);
state.get(); state.set(next); state.subscribe(function (value) {});

data.fetchJSON(url, opts).then(function (json) {});
```

### Layout helpers

```js
layout.center(node);
layout.grid(3, { gap: 8, children: [...] });
layout.scroll(node, { maxHeight: '300px' });
```

### Generic DOM builder

```js
const node = el('div', { class: 'foo', style: { color: 'red' }, text: 'hi', onClick: fn }, child1, child2);
```

### Theme

```js
const t = theme();
// t.modal, t.veld, t.paneel, t.rand, t.tekst, t.tekstZacht,
// t.accent, t.accentTekst, t.gevaar, t.uit, t.donker, t.headerIcoon, ...
```

### Toggling buttons at runtime

```js
const enabled = client.isButtonEnabled('my-addon', 'my-floating-btn');
client.setButtonEnabled('my-addon', 'my-floating-btn', false); // hide
client.setButtonEnabled('my-addon', 'my-floating-btn', true);  // show
```

Use `ui.toggle(label, value, onChange)` to build a slider in your modal:

```js
const toggle = ui.toggle('My floating button', enabled, function (value) {
    client.setButtonEnabled('my-addon', 'my-floating-btn', value);
    ui.toast(value ? 'Enabled' : 'Disabled', { type: value ? 'success' : 'info' });
});
ui.modal('Settings', ui.card({ title: 'Settings', children: [toggle] }));
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
- The library is dependency-free and works as a plain content script.
