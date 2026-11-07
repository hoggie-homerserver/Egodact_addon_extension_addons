# Egodact Addon Extension Addons

Example addons, client SDK and UI/game library for the Egodact Pantagora extension.

---

## Getting started

1. Copy the `example-addon/` folder to a new folder.
2. Edit `manifest.json` (name, version, description).
3. Write your logic in `content.js`.
4. Load the folder as an unpacked extension in your browser.

Your addon runs on `https://app.egodact.com/*` and talks to the Egodact host through `sdk.js`.

---

## Client SDK (`window.EgodactAddonClient`)

```js
const client = window.EgodactAddonClient;
```

### Register your addon

```js
client.registerAddon({
    id: 'my-addon',
    name: 'My Addon',
    version: '1.0.0',
    description: 'What it does.',
    author: 'You'
});
```

### Register a menu entry

```js
client.registerMenu({
    addonId: 'my-addon',
    id: 'my-menu',
    title: 'My Menu',
    icon: '✨'          // emoji or SVG
});
```

### Register a hamburger dropdown item

Menu items in the **hamburger next to your name** are opt-in. Register them via
the library, otherwise the hamburger stays hidden:

```js
const L = window.EgodactAddonLib;

L.hamburger.add({
    addonId: 'my-addon',
    id: 'my-menu',        // same id you pass to client.onOpen(...)
    title: 'My Menu',
    icon: '<svg ...></svg>',   // optional, SVG string or text
    order: 10                  // optional, lower = higher up
});

L.hamburger.onOpen('my-menu', function () {
    // open your panel
});
```

`L.ui.showInDropdown(...)` and `L.ui.onDropdownOpen(...)` are aliases.

Only items registered through this helper appear in the hamburger. Plain
`client.registerMenu()` entries stay in the Addons library.

### Register a button

```js
// In the top bar
client.registerButton({
    addonId: 'my-addon',
    id: 'my-header-btn',
    title: 'My button',
    icon: '⭐',          // emoji or SVG string
    position: 'header'
});

// Anywhere on screen
client.registerButton({
    addonId: 'my-addon',
    id: 'my-floating-btn',
    title: 'My floating button',
    icon: '📌',
    position: 'floating',
    x: 100,              // starting x (pixels)
    y: 200,              // starting y (pixels)
    draggable: true      // can the user drag it? (default: true)
});
```

### Register a game

```js
client.registerGame({
    addonId: 'my-addon',
    id: 'my-game',
    title: 'My Game',
    description: 'Play it.',
    icon: '🎮'
});
```

### Handle open events

```js
client.onOpen('my-menu', function () {
    client.openModal('My Menu', '<p>Hello!</p>');
});
```

### Other helpers

- `client.openModal(title, html)` — opens a themed popup. `html` can be a string or a DOM element.
- `client.escapeHtml(text)` — escape HTML.
- `client.storage(prefix)` — returns `{ get(key, fallback), set(key, value), remove(key) }`.
- `client.setButtonEnabled(addonId, id, enabled)` — turn a button on/off live (no reload).
- `client.isButtonEnabled(addonId, id)` — check if a button is on.

---

## Addon Library (`window.EgodactAddonLib`)

Loaded from `lib.js`. Gives you ready-made UI and game helpers so you don't
have to build everything from scratch.

```js
const L = window.EgodactAddonLib;
const { ui, game, data, theme, el } = L;
```

### Theme

```js
const t = theme();
// t.modal, t.veld, t.paneel, t.rand, t.tekst, t.tekstZacht,
// t.accent, t.accentTekst, t.gevaar, t.uit, t.donker, t.headerIcoon
```

### UI widgets

```js
ui.button('Click me', onClick, { background, color, icon });
ui.toggle('Enable', true, function (value) {});
ui.input({ placeholder, value, width, onChange });
ui.textarea({ rows, value, placeholder, onChange });
ui.select({ options: [{ value, label }], value, onChange });
ui.tabs([{ title, render, html }], { active });
ui.list(items, function (item, i) { return node; }, { gap });
ui.card({ title, children, html, background, padding });
ui.panel({ children, html, background, border, padding, radius });
ui.row({ children, gap, align, justify, wrap });
ui.col({ children, gap, align, justify });
ui.toast('Saved!', { type: 'success', background, color, duration });
ui.modal('Title', bodyOrHtml, { background, width });
```

Toast types: `success` (accent), `error` (red), `info` (green). Override with `background`/`color`.

### Game helpers

```js
const { canvas, ctx, width, height } = game.createCanvas(parent, 320, 220, { background });
const input = game.input();              // keyboard + mouse state
const loop = game.loop(updateFn, renderFn, { maxDt });
game.clear(ctx, color);
game.rect(ctx, x, y, w, h, color, { radius, stroke, lineWidth });
game.circle(ctx, x, y, r, color, { stroke, lineWidth });
game.text(ctx, 'score: 10', x, y, { color, size, bold, align });
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

### DOM builder

```js
const node = el('div', { class: 'foo', style: { color: 'red' }, text: 'hi', onClick: fn }, child1, child2);
```

### Storage (per addon)

```js
const store = client.storage('my-addon');
store.get('key', defaultValue);
store.set('key', value);
store.remove('key');
```

### Challenges (from the Egodact board)

```js
client.getChallenges().then(function (list) {
    // list: [{ id, name, color, fase, einddatum, users, werelden, ... }]
});

client.onChallengesChanged(function (list) {
    // called when the host fetches new challenge data
});
```

### Theme changes

```js
client.onThemeChange(function (detail) {
    // detail: { theme: 'dark' | 'light', dark: boolean }
});
```

### Toast / notifications

```js
client.toast('Opgeslagen!', { type: 'success' });
client.toast('Fout', { type: 'error', duration: 5000 });
```

Toast types: `success`, `error`, `info`, `warning`.

### Topbar slots (ordering without DOM poking)

```js
client.registerButton({
    addonId: 'my-addon',
    id: 'my-btn',
    title: 'My button',
    icon: '⭐',
    position: 'header',
    slot: 'name',     // 'name' (next to user name) or 'actions' (default)
    order: 5          // lower = earlier
});
```

Older addons that omit `slot`/`order` keep the previous behaviour.

### Toggling buttons at runtime

```js
const enabled = client.isButtonEnabled('my-addon', 'my-floating-btn');

client.setButtonEnabled('my-addon', 'my-floating-btn', false); // hide
client.setButtonEnabled('my-addon', 'my-floating-btn', true);  // show
```

Build a slider in a modal:

```js
const toggle = ui.toggle('My floating button', enabled, function (value) {
    client.setButtonEnabled('my-addon', 'my-floating-btn', value);
    ui.toast(value ? 'Enabled' : 'Disabled', { type: value ? 'success' : 'info' });
});
ui.modal('Settings', ui.card({ title: 'Settings', children: [toggle] }));
```

---

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
- Use Egodact CSS variables (`--egd-*`) for theming.
