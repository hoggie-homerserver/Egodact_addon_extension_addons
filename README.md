# Egodact Addon Extension Addons

Deze repository bevat de **addon-compatibiliteitslaag** voor de
[Egodact Pantagora](https://github.com/hoggie-homerserver/Egodact_addon_extension) extensie,
plus een **SDK** en documentatie om zelf **losse browser-extensies (addons)** te maken
die samenwerken met Egodact.

## Structuur

```
Egodact Smart/   Basis-extensie (host) met addon-API
sdk/             Client-SDK voor addon-extensies
README.md        Deze documentatie
```

## Hoe het werkt

- De **host** (`Egodact Smart`) draait op `https://app.egodact.com/*`.
- Een **addon** is een aparte browser-extensie (Manifest V3) die ook op die URL draait.
- Addons registreren zich bij de host via `CustomEvent`s op `document`.
  Daardoor zijn geen extensie-ID's nodig.

Host-events:
- `egodact:host:ready` — host is klaar; addons kunnen registreren.
- `egodact:addon:register` — addon stuurt registratie (type: `addon|menu|button|game`).
- `egodact:addon:open` — host vraagt een addon een item te openen.

## Client-SDK gebruiken

Kopieer `sdk/egodact-addon-client.js` naar je addon-map als `sdk.js` en laad het
vóór je `content.js` in de manifest.

```js
const client = window.EgodactAddonClient;

client.registerAddon({
    id: 'mijn-addon',
    name: 'Mijn Addon',
    version: '1.0.0',
    description: 'Wat doet deze addon?',
    author: 'Jouw naam'
});

client.registerMenu({ addonId: 'mijn-addon', id: 'mijn-menu', title: 'Mijn menu', icon: '✨' });
client.registerButton({ addonId: 'mijn-addon', id: 'mijn-knop', title: 'Mijn knop' });
client.registerGame({ addonId: 'mijn-addon', id: 'mijn-game', title: 'Mijn game', description: '...', icon: '🎮' });

client.onOpen('mijn-menu', function () {
    client.openModal('Mijn menu', '<p>Inhoud hier</p>');
});
```

Helpers: `client.escapeHtml(tekst)` en `client.openModal(titel, html)`.

## Minimale addon-manifest

```json
{
  "manifest_version": 3,
  "name": "Egodact Addon: ...",
  "version": "1.0.0",
  "content_scripts": [{
    "matches": ["https://app.egodact.com/*"],
    "js": ["sdk.js", "content.js"],
    "run_at": "document_idle"
  }]
}
```

## Thema (donker/licht)

Gebruik de CSS-variabelen van Egodact zodat je addon meebeweegt:

`--egd-modal`, `--egd-veld`, `--egd-rand`,
`--egd-tekst`, `--egd-tekst-zacht`,
`--egd-accent`, `--egd-accent-tekst`,
`--egd-backdrop`, `--egd-schaduw`, `--egd-gevaar`.

## Opslag

Gebruik `localStorage` met een prefix om conflicten te vermijden:

```js
const KEY = 'egodact_addon_mijn-addon_mijn-data';
localStorage.setItem(KEY, JSON.stringify(waarde));
```

## Compatibiliteitsregels

1. Gebruik **unieke IDs** voor addon, menu-items, knoppen en games.
2. Gebruik `--egd-*` variabelen in plaats van vaste kleuren.
3. Zet modals in `#egodact-custom-modal-backdrop` (SDK doet dit).
4. Sluit modal bij klik op de backdrop (SDK doet dit).
5. Gebruik hoge `z-index` (999999+).
6. Test in donkere én lichte modus.

## Host-compatibiliteitslaag

`Egodact Smart/src/addon-api.js` biedt:
- `window.EgodactAddons` API (voor code in dezelfde extensie), en
- afhandeling van `CustomEvent`s voor losse addon-extensies.

`Egodact Smart/src/menus/addons-menu.js` toont het Addons-menu met geregistreerde
addons, menu's, knoppen en games.

Deze laag is bedoeld om later samengevoegd te worden met de hoofdrepo
(`Egodact_addon_extension`).

## SDK-bestand

Zie `sdk/egodact-addon-client.js`.
