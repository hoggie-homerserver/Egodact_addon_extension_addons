(function () {
    'use strict';
    const client = window.EgodactAddonClient;
    if (!client) return;

    client.registerAddon({
        id: 'example-addon',
        name: 'Example Addon',
        version: '1.6.0',
        description: 'A minimal example addon with a menu, a game, a header button and a floating button.',
        author: 'Egodact community'
    });

    client.registerMenu({
        addonId: 'example-addon',
        id: 'example-menu',
        title: 'Example menu',
        icon: '&#10024;'
    });

    // Header-knop in de topbalk van Egodact.
    client.registerButton({
        addonId: 'example-addon',
        id: 'example-button',
        title: 'Example header button',
        icon: '&#11088;',
        position: 'header'
    });

    // Zwevende knop: overal op het scherm te slepen.
    // De positie wordt onthouden in localStorage.
    client.registerButton({
        addonId: 'example-addon',
        id: 'example-floating-button',
        title: 'Example floating button (sleep mij)',
        icon: '&#128204;',
        position: 'floating',
        x: 24,
        y: 180,
        draggable: true
    });

    client.registerGame({
        addonId: 'example-addon',
        id: 'example-clicker',
        title: 'Example Clicker',
        description: 'Click as fast as you can.',
        icon: '&#127918;'
    });

    client.onOpen('example-menu', function () {
        client.openModal('Example Addon', '<p>Hello from an addon!</p>');
    });

    client.onOpen('example-button', function () {
        client.openModal('Example Button', '<p>You clicked the example header button!</p>');
    });

    client.onOpen('example-floating-button', function () {
        client.openModal('Example Floating Button', '<p>This button can be dragged anywhere on the screen.</p>');
    });

    client.onOpen('example-clicker', function () {
        let score = 0;
        const backdrop = client.openModal('Example Clicker', `
            <div style="display:flex;flex-direction:column;gap:12px;align-items:center;">
                <p style="margin:0;">Click the button as many times as you can.</p>
                <button id="ex-click" type="button" style="padding:12px 20px;font-size:16px;font-weight:bold;border:none;border-radius:6px;background:var(--egd-accent,#90caf9);color:var(--egd-accent-tekst,#0d47a1);cursor:pointer;">Click me</button>
                <div id="ex-score" style="font-size:14px;color:var(--egd-tekst-zacht,#b0b0b0);">Score: 0</div>
            </div>
        `);
        const btn = backdrop.querySelector('#ex-click');
        const status = backdrop.querySelector('#ex-score');
        btn.addEventListener('click', function () {
            score++;
            status.textContent = 'Score: ' + score;
        });
    });
})();
