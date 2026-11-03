(function () {
    'use strict';
    const client = window.EgodactAddonClient;
    if (!client) return;

    client.registerAddon({
        id: 'example-addon',
        name: 'Example Addon',
        version: '1.0.0',
        description: 'A minimal example addon.',
        author: 'Egodact community'
    });

    client.registerMenu({
        addonId: 'example-addon',
        id: 'example-menu',
        title: 'Example menu',
        icon: '?'
    });

    client.onOpen('example-menu', function () {
        client.openModal('Example Addon', '<p>Hello from an addon!</p>');
    });
})();