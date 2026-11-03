(function () {
    'use strict';
    const client = window.EgodactAddonClient;
    const L = window.EgodactAddonLib;
    if (!client || !L) return;

    const { ui, game, data, theme, el } = L;

    client.registerAddon({
        id: 'example-addon',
        name: 'Example Addon',
        version: '1.7.0',
        description: 'Example addon using the Egodact Addon Library.',
        author: 'MaxiTaxi'
    });

    client.registerMenu({
        addonId: 'example-addon',
        id: 'example-menu',
        title: 'Example menu',
        icon: '&#10024;'
    });

    // Header button in the top bar.
    client.registerButton({
        addonId: 'example-addon',
        id: 'example-button',
        title: 'Example header button',
        icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="opacity:1;display:block;pointer-events:none;"><path d="M9 7V2"></path><path d="M15 7V2"></path><rect x="5" y="7" width="14" height="10" rx="2"></rect><path d="M12 17v5"></path></svg>`,
        position: 'header'
    });

    // Floating button (anywhere on screen).
    client.registerButton({
        addonId: 'example-addon',
        id: 'example-floating-btn',
        title: 'Example floating button',
        icon: '📌',
        position: 'floating',
        x: 670,
        y: 300,
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
        const body = ui.card({
            title: 'Example Addon',
            children: [
                ui.row({ children: [
                    ui.button('Say hi', function () { ui.toast('Hello from the library!', { type: 'success' }); }),
                    ui.button('Danger', function () { ui.toast('Oops!', { type: 'error' }); }, { background: theme().gevaar, color: '#fff' }),
                    ui.button('Info', function () { ui.toast('This is an info message.', { type: 'info' }); }, { background: '#2e7d32', color: '#fff' })
                ]})
            ]
        });
        ui.modal('Example Addon', body);
    });

    // Header button opens a panel to toggle the floating button on/off.
    client.onOpen('example-button', function () {
        const enabled = client.isButtonEnabled('example-addon', 'example-floating-btn');
        const status = el('div', { text: enabled ? 'Floating button is ON' : 'Floating button is OFF', style: { fontSize: '13px', color: theme().tekstZacht, marginBottom: '8px' } });

        const toggle = ui.toggle('Floating button', enabled, function (value) {
            client.setButtonEnabled('example-addon', 'example-floating-btn', value);
            status.textContent = value ? 'Floating button is ON' : 'Floating button is OFF';
            ui.toast(value ? 'Floating button enabled' : 'Floating button disabled', { type: value ? 'success' : 'info' });
            // Re-render without full reload: ask host to update.
            // (Host removes/adds the button via voegKnoppenToe.)
        });

        const body = ui.card({
            title: 'Example Button',
            children: [toggle, status]
        });
        ui.modal('Example Button', body);
    });

    client.onOpen('example-clicker', function () {
        const store = data.storage('clicker');
        let score = store.get('score', 0);

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
