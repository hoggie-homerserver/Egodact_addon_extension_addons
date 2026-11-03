// ============================================================
// EGODACT ADDON CLIENT SDK
// ============================================================
// Kopieer dit bestand in je addon-extensie en laad het vóór je
// addon-code. Het biedt een kleine wrapper rond de CustomEvent-brug
// met de Egodact basis-extensie.
//
// Gebruik:
//   EgodactAddonClient.registerAddon({ id, name, version, description, author });
//   EgodactAddonClient.registerMenu({ addonId, id, title, icon });
//   EgodactAddonClient.onOpen(id, function () { ... });

(function () {
    'use strict';

    function dispatch(type, meta) {
        try {
            document.dispatchEvent(new CustomEvent('egodact:addon:register', {
                detail: { type: type, meta: meta }
            }));
        } catch (err) {
            console.error('Egodact addon dispatch mislukt:', err);
        }
    }

    const listeners = Object.create(null);

    document.addEventListener('egodact:addon:open', function (event) {
        const id = (event && event.detail && event.detail.id) || null;
        const cbs = listeners[id] || [];
        cbs.forEach(function (cb) {
            try { cb(); } catch (err) { console.error(err); }
        });
    });

    const EgodactAddonClient = {
        registerAddon: function (meta) { dispatch('addon', meta || {}); },
        registerMenu: function (meta) { dispatch('menu', meta || {}); },
        registerButton: function (meta) { dispatch('button', meta || {}); },
        registerGame: function (meta) { dispatch('game', meta || {}); },
        onOpen: function (id, cb) {
            if (!listeners[id]) listeners[id] = [];
            listeners[id].push(cb);
        },
        // Hulp: eigen modal maken in addon-stijl (gebruikt Egodact CSS-vars)
        openModal: function (titel, bodyHtml) {
            const bestaand = document.getElementById('egodact-custom-modal-backdrop');
            if (bestaand) bestaand.remove();
            const backdrop = document.createElement('div');
            backdrop.id = 'egodact-custom-modal-backdrop';
            Object.assign(backdrop.style, {
                position: 'fixed', top: '0', left: '0', width: '100vw', height: '100vh',
                backgroundColor: 'var(--egd-backdrop, rgba(0,0,0,0.65))', zIndex: '9999999',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'Arial, sans-serif'
            });
            const modal = document.createElement('div');
            Object.assign(modal.style, {
                backgroundColor: 'var(--egd-modal, #424242)', color: 'var(--egd-tekst, #fff)',
                width: 'min(520px, calc(100vw - 32px))', maxHeight: 'calc(100vh - 32px)',
                boxSizing: 'border-box', overflow: 'hidden', borderRadius: '6px', padding: '24px',
                display: 'flex', flexDirection: 'column', gap: '16px', boxShadow: 'var(--egd-schaduw, 0 4px 12px rgba(0,0,0,.3))'
            });
            modal.innerHTML = '<div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--egd-rand,#555);padding-bottom:10px;margin-bottom:5px;"><h2 style="margin:0;font-size:22px;font-weight:500;">' + titel + '</h2><button id="egodact-modal-sluiten" type="button" style="background:var(--egd-accent,#90caf9);border:none;color:var(--egd-accent-tekst,#0d47a1);cursor:pointer;padding:8px 14px;font-weight:bold;font-size:13px;border-radius:4px;">Sluiten</button></div><div style="overflow-y:auto;min-height:0;max-height:calc(100vh - 190px);padding-right:4px;display:flex;flex-direction:column;gap:10px;">' + bodyHtml + '</div>';
            backdrop.appendChild(modal);
            document.body.appendChild(backdrop);
            const sluit = function () { backdrop.remove(); };
            modal.querySelector('#egodact-modal-sluiten').addEventListener('click', sluit);
            backdrop.addEventListener('click', function (e) { if (e.target === backdrop) sluit(); });
            return backdrop;
        },
        escapeHtml: function (t) {
            return String(t == null ? '' : t).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
        }
    };

    window.EgodactAddonClient = EgodactAddonClient;

    // Wacht op host-ready of registreer direct (events worden alsnog afgehandeld).
    function registreer() {
        document.dispatchEvent(new CustomEvent('egodact:addon:client-ready'));
    }
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', registreer);
    } else {
        registreer();
    }
})();
