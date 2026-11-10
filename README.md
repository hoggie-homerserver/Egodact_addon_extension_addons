# Egodact Addon SDK & Library

A minimal example addon for [Egodact](https://app.egodact.com), demonstrating menus, games, header buttons, sidebar panels and scheduling. Addons are **separate** browser extensions that talk to the host through DOM `CustomEvent`s only.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | Extension manifest. Loads `sdk.js`, then `lib.js`, then `content.js`. |
| `sdk.js` | Client SDK (v2). Bridges your addon to the Egodact host via DOM events. |
| `lib.js` | Egodact Addon Library (v1). UI widgets, game helpers, data and layout utilities. |
| `content.js` | Your addon logic. |

## Manifest

```json
{
  "manifest_version": 3,
  "name": "Egodact Addon: Example",
  "version": "1.8.0",
  "description": "Example addon for Egodact.",
  "content_scripts": [
    {
      "matches": ["https://app.egodact.com/*"],
      "js": ["sdk.js", "lib.js", "content.js"],
      "run_at": "document_idle"
    }
  ]
}
```

Script order matters: `sdk.js` first (defines `window.EgodactAddonClient`), then `lib.js` (defines `window.EgodactAddonLib`, uses the client), then your `content.js`.

## SDK API (`window.EgodactAddonClient`)

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
    icon: ''
});
```

### Register a button

```js
// Header button (top bar)
client.registerButton({
    addonId: 'my-addon',
    id: 'my-header-btn',
    title: 'My button',
    icon: '',
    position: 'header'
});

// Floating button (anywhere on screen)
client.registerButton({
    addonId: 'my-addon',
    id: 'my-floating-btn',
    title: 'My floating button',
    icon: '',
    position: 'floating',
    x: 100,
    y: 200,
    draggable: true
});
```

### Register a game

```js
client.registerGame({
    addonId: 'my-addon',
    id: 'my-game',
    title: 'My Game',
    description: 'Play it.',
    icon: ''
});
```

### Handle open events

```js
client.onOpen('my-menu', function () {
    client.openModal('My Menu', '<p>Hello!</p>');
});
```

### Other helpers

- `client.openModal(title, bodyHtml)` â€” opens a themed modal. Returns the backdrop element.
- `client.escapeHtml(text)` â€” escape HTML.
- `client.storage(prefix)` â€” returns `{ get(key, fallback), set(key, value), remove(key) }`.

## Addon Library (`window.EgodactAddonLib`)

```js
const L = window.EgodactAddonLib;
const { ui, game, data, layout, theme, el } = L;
```

### Theme

`theme()` returns the current colors (reads Egodact's CSS variables).

### UI widgets

`ui.button`, `ui.toggle`, `ui.input`, `ui.textarea`, `ui.select`, `ui.tabs`, `ui.list`, `ui.card`, `ui.panel`, `ui.row`, `ui.col`, `ui.toast`, `ui.modal`.

### Game helpers

`game.createCanvas`, `game.loop`, `game.input`, `game.clear`, `game.rect`, `game.circle`, `game.text`, `game.sprite`, `game.collide`, `game.center`.

### Data helpers

`data.storage`, `data.bus`, `data.state`, `data.fetchJSON`.

### Layout helpers

`layout.center`, `layout.grid`, `layout.scroll`. Plus generic `el(tag, props, ...children)`.

## Sidebar panels (weekplanning)

Panels appear as a **second bar next to the weekplanning window**:

```js
L.sidebar.add({
    addonId: 'my-addon',
    id: 'my-panel',
    title: 'My Panel',
    order: 10,
    render: function (container) {
        container.appendChild(ui.button('Click me', function () { ui.toast('Hi!'); }));
    }
});
```

Notes:
- Only **metadata** (`addonId`, `id`, `title`, `icon`, `order`) is sent to the host. The `render` function stays in your addon.
- The host dispatches `egodact:addon:open` with `{ id, containerId }` (strings only) once the panel's container is mounted. `L.sidebar.add` wires this to your `render(container)`.
- Never put functions or DOM nodes in `CustomEvent.detail` yourself â€” Chromium silently drops the whole event.
- Panels are removed automatically when the weekplanning closes and rebuilt when it reopens.
- To embed external/local content, use ui.iframe({ src, title, height, sandbox, allow }) inside ender(container). The host page CSP and your addon's web_accessible_resources determine what may load; for extension pages use chrome.runtime.getURL(...) as src.

## Scheduling

Fire a toast at a specific time:

```js
L.scheduler.schedule({
    addonId: 'my-addon',
    id: 'my-reminder',
    title: 'Reminder',
    message: 'Time to study!',
    delay: 10000
});

L.scheduler.cancel('my-reminder');
```

## Complete example

See `content.js` in this folder.

## Notes

- Disabled addons stay registered in the host's known list so they can be re-enabled.
- Floating button positions are saved in `localStorage` under `egodact_addon_btn_pos_<id>`.
- The host and the library are MV3-compatible (no `eval`).
- Addon icons should be SVG in the Egodact stroke style (no emoji).
