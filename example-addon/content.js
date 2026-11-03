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
        author: 'Egodact community'
    });

    client.registerMenu({
        addonId: 'example-addon',
        id: 'example-menu',
        title: 'Example menu',
        icon: '&#10024;'
    });

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
        description: 'Click the square as many times as you can.',
        icon: '&#127918;'
    });

    client.onOpen('example-menu', function () {
        const body = ui.card({
            title: 'Example Addon',
            children: [
                ui.row({ children: [
                    ui.button('Say hi', function () { ui.toast('Hello from the library!', { type: 'success' }); }),
                    ui.button('Danger', function () { ui.toast('Oops!', { type: 'error' }); }, { background: theme().gevaar, color: '#fff' })
                ]})
            ]
        });
        ui.modal('Example Addon', body);
    });

    client.onOpen('example-button', function () {
        client.openModal('Example Button', '<p>You clicked the example header button!</p>');
    });

    client.onOpen('example-clicker', function () {
        const store = data.storage('clicker');
        let score = store.get('score', 0);

        const { canvas, ctx, width, height } = game.createCanvas(null, 320, 220, { background: theme().veld });

        // The square stays put until clicked, then jumps to a new spot.
        let target = { x: width / 2 - 25, y: height / 2 - 25, w: 50, h: 50 };
        let flash = 0;
        let particles = [];
        let moveTimer = 10.0; // auto-move after 10s if not clicked (fallback)

        function newTarget() {
            target.x = Math.random() * (width - target.w);
            target.y = Math.random() * (height - target.h);
            moveTimer = 2.0;
        }

        const scoreEl = el('div', { text: 'Score: ' + score, style: { fontSize: '16px', fontWeight: 'bold', color: theme().tekst, marginBottom: '8px' } });

        // Generous hitbox so clicks register reliably.
        function tryHit(mx, my) {
            const pad = 10;
            if (mx >= target.x - pad && mx <= target.x + target.w + pad &&
                my >= target.y - pad && my <= target.y + target.h + pad) {
                score++;
                scoreEl.textContent = 'Score: ' + score;
                store.set('score', score);
                flash = 0.3;
                particles.push({ x: target.x + target.w / 2, y: target.y + target.h / 2, life: 0.5, color: theme().accent });
                newTarget();
                return true;
            }
            return false;
        }

        canvas.addEventListener('click', function (e) {
            const rect = canvas.getBoundingClientRect();
            tryHit(e.clientX - rect.left, e.clientY - rect.top);
        });
        canvas.addEventListener('pointerup', function (e) {
            const rect = canvas.getBoundingClientRect();
            tryHit(e.clientX - rect.left, e.clientY - rect.top);
        });

        const loop = game.loop(function (dt) {
            moveTimer -= dt;
            if (moveTimer <= 0) newTarget();
            flash = Math.max(0, flash - dt);
            particles = particles.filter(function (p) { p.life -= dt; return p.life > 0; });
        }, function () {
            game.clear(ctx, theme().veld);
            if (flash > 0) {
                ctx.globalAlpha = flash * 4;
                game.rect(ctx, target.x - 4, target.y - 4, target.w + 8, target.h + 8, theme().accent, { radius: 10 });
                ctx.globalAlpha = 1;
            }
            game.rect(ctx, target.x, target.y, target.w, target.h, theme().accent, { radius: 8 });
            ctx.strokeStyle = theme().tekst;
            ctx.lineWidth = 2;
            ctx.strokeRect(target.x, target.y, target.w, target.h);
            particles.forEach(function (p) {
                game.circle(ctx, p.x, p.y, 10 * p.life, p.color);
            });
            game.text(ctx, 'Click the square!', 8, 8, { color: theme().tekstZacht, size: 12 });
            game.text(ctx, 'Score: ' + score, 8, 26, { color: theme().tekst, size: 12, bold: true });
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
                input.destroy();
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
