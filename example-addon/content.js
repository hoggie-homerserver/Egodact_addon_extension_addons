(function () {
    'use strict';
    const client = window.EgodactAddonClient;
    if (!client) return;

    client.registerAddon({
        id: 'example-addon',
        name: 'Example Addon',
        version: '1.6.0',
        description: 'A minimal example addon with a menu and a game.',
        author: 'Egodact community'
    });

    client.registerMenu({
        addonId: 'example-addon',
        id: 'example-menu',
        title: 'Example menu',
        icon: '&#10024;'
    });

    // Header-knop in de topbalk van Egodact (SVG-icoon in Egodact-stijl).
    client.registerButton({
        addonId: 'example-addon',
        id: 'example-button',
        title: 'Example header button',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;display:block;pointer-events:none;"><path d="M9 7V2"></path><path d="M15 7V2"></path><rect x="5" y="7" width="14" height="10" rx="2"></rect><path d="M12 17v5"></path></svg>`,
        position: 'header'
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
