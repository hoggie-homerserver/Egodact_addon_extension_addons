(function () {
    'use strict';
    const client = window.EgodactAddonClient;
    const L = window.EgodactAddonLib;
    if (!client || !L) return;

    const { ui, game, data, theme, el } = L;

    client.registerAddon({
        id: 'example-addon',
        name: 'Example Addon',
        version: '1.8.0',
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

    // Sidebar panel in the weekplanning sidebar.
    L.sidebar.add({
        addonId: 'example-addon',
        id: 'example-sidebar',
        title: 'Example panel',
        order: 10,
        render: function (container) {
            container.appendChild(el('div', { text: 'Hello from the sidebar!', style: { fontSize: '12px', color: theme().tekst, marginBottom: '6px' } }));
            container.appendChild(ui.button('Toast', function () {
                ui.toast('Sidebar button clicked!', { type: 'success' });
            }, { padding: '4px 8px', fontSize: '11px' }));
            // Voorbeeld: scrollbare Shorts-feed in het sidebar-paneel.
            container.appendChild(ui.shortsFeed({
                ids: [
                    'dQw4w9WgXcQ',
                    '9bZkp7q19f0'
                ],
                height: '400px',
                autoplay: false
            }));
        }
    });

    // Scheduled reminder (fires after 10 seconds).
    L.scheduler.schedule({
        addonId: 'example-addon',
        id: 'example-reminder',
        title: 'Example reminder',
        message: 'This is a scheduled reminder from the example addon!',
        delay: 10000
    });

    client.onOpen('example-menu', function () {
        client.openModal('Example Addon', '<p>Hello from an addon!</p>');
    });

    client.onOpen('example-button', function () {
        client.openModal('Example Button', '<p>You clicked the example header button!</p>');
    });

    client.onOpen('example-clicker', function () {
        let score = 0;
        const store = data.storage('clicker');
        score = store.get('score', 0);

        const { canvas, ctx, width, height } = game.createCanvas(null, 320, 220, { background: theme().veld });
        let target = { x: width / 2 - 20, y: height / 2 - 20, w: 40, h: 40, vx: 120, vy: 90 };
        let particles = [];

        const scoreEl = el('div', { text: 'Score: ' + score, style: { fontSize: '16px', fontWeight: 'bold', color: theme().tekst, marginBottom: '8px' } });

        canvas.addEventListener('click', function (e) {
            const rect = canvas.getBoundingClientRect();
            const mx = e.clientX - rect.left;
            const my = e.clientY - rect.top;
            if (mx >= target.x && mx <= target.x + target.w && my >= target.y && my <= target.y + target.h) {
                score++;
                scoreEl.textContent = 'Score: ' + score;
                store.set('score', score);
                particles.push({ x: target.x + target.w / 2, y: target.y + target.h / 2, life: 0.5, color: theme().accent });
                target.x = Math.random() * (width - target.w);
                target.y = Math.random() * (height - target.h);
            }
        });

        const loop = game.loop(function (dt) {
            target.x += target.vx * dt;
            target.y += target.vy * dt;
            if (target.x <= 0 || target.x + target.w >= width) target.vx *= -1;
            if (target.y <= 0 || target.y + target.h >= height) target.vy *= -1;
            particles = particles.filter(function (p) { p.life -= dt; return p.life > 0; });
        }, function () {
            game.clear(ctx, theme().veld);
            game.rect(ctx, target.x, target.y, target.w, target.h, theme().accent, { radius: 6 });
            particles.forEach(function (p) {
                game.circle(ctx, p.x, p.y, 8 * p.life, p.color);
            });
            game.text(ctx, 'Click the square!', 8, 8, { color: theme().tekstZacht, size: 12 });
        });

        const body = ui.col({ children: [scoreEl, canvas, ui.button('Reset score', function () {
            score = 0;
            scoreEl.textContent = 'Score: 0';
            store.set('score', 0);
        }, { background: theme().uit, color: '#fff' })] });

        const backdrop = ui.modal('Example Clicker', body);
        const observer = new MutationObserver(function () {
            if (!document.body.contains(backdrop)) {
                loop.stop();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
