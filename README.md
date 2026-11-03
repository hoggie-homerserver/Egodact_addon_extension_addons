# Egodact Addon Extension Addons

Example addons and SDK for the Egodact Pantagora extension.

## Example addon

`example-addon/` is a minimal Manifest V3 extension that runs on `https://app.egodact.com/*`
and registers itself with the host via `sdk.js` (copied from the host's addon API).

## Making your own addon

1. Copy `example-addon/` to a new folder.
2. Edit `manifest.json` (name, version, description).
3. Write your logic in `content.js` using `window.EgodactAddonClient`.
4. Load the folder as an unpacked extension.

## Client SDK API

- `client.registerAddon({ id, name, version, description, author })`
- `client.registerMenu({ addonId, id, title, icon })`
- `client.registerButton({ addonId, id, title })`
- `client.registerGame({ addonId, id, title, description, icon })`
- `client.onOpen(id, callback)`
- `client.openModal(title, html)`
- `client.escapeHtml(text)`

Use Egodact CSS variables (`--egd-*`) for theming and `localStorage` with a
prefixed key for storage.
