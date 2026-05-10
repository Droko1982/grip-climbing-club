/* ============================================
   GRIP Climbing Club — Interactions
   ============================================ */

(() => {
    'use strict';

    const $  = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isES = document.documentElement.lang.startsWith('es');

    /* ----- i18n strings ----- */
    const T = isES ? {
        openClosesAt:   (h) => `Abierto · cierra a las ${h}`,
        closedOpensAt:  (label) => `Cerrado · ${label}`,
        opensTodayAt:   (h) => `abre hoy a las ${h}`,
        opensTomorrow:  (h) => `abre mañana a las ${h}`,
        opensMonday:    (h) => `abre lunes a las ${h}`,
        tipLabel:       'Tip de hoy',
        achievement:    '🎯 Logro desbloqueado',
        sectionService: 'Conoces los servicios',
        sectionPrice:   'Viste los precios',
        sectionVisit:   'Sabes cómo es la primera visita',
        sectionColombia:'Conoces la cobertura nacional',
        sectionFaq:     'Resolviste las dudas',
        holdFound:      (n) => `Presa ${n}/5 encontrada · Sigue buscando…`,
        holdWin:        'Topo completo! 🧗',
        holdWinBody:    'Muestra este código en tu primera visita:',
        holdWinCode:    'PRIMER-ASCENSO',
        holdWinNote:    '10% off en tu pase de día.'
    } : {
        openClosesAt:   (h) => `Open · closes at ${h}`,
        closedOpensAt:  (label) => `Closed · ${label}`,
        opensTodayAt:   (h) => `opens today at ${h}`,
        opensTomorrow:  (h) => `opens tomorrow at ${h}`,
        opensMonday:    (h) => `opens Monday at ${h}`,
        tipLabel:       "Today's tip",
        achievement:    '🎯 Achievement unlocked',
        sectionService: 'You know our services',
        sectionPrice:   'You saw the pricing',
        sectionVisit:   "You know what the first visit is like",
        sectionColombia:'You know our national reach',
        sectionFaq:     'Questions answered',
        holdFound:      (n) => `Hold ${n}/5 found · keep looking…`,
        holdWin:        'Full topo! 🧗',
        holdWinBody:    'Show this code on your first visit:',
        holdWinCode:    'FIRST-ASCENT',
        holdWinNote:    '10% off your day pass.'
    };

    /* ----- Theme toggle ----- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const next = isLight ? 'dark' : 'light';
            if (next === 'light') document.documentElement.setAttribute('data-theme', 'light');
            else document.documentElement.removeAttribute('data-theme');
            try { localStorage.setItem('grip-theme', next); } catch (e) {}
            const meta = document.querySelector('meta[name="theme-color"]:not([media])');
            if (meta) meta.setAttribute('content', next === 'light' ? '#FAFBFC' : '#0B0E13');
        });
    }

    /* ----- Mobile menu ----- */
    const navToggle = $('#navToggle');
    const navMenu   = $('#navMenu');
    const nav       = $('#nav');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            const open = navToggle.classList.toggle('open');
            navMenu.classList.toggle('open', open);
            navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
            document.body.style.overflow = open ? 'hidden' : '';
        });
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                document.body.style.overflow = '';
            });
        });
    }

    /* ----- Footer year ----- */
    const yearEl = $('#year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    /* ----- Counter animation ----- */
    const animateCounter = (el) => {
        const target = parseInt(el.dataset.counter, 10);
        const suffix = el.dataset.suffix || '';
        if (Number.isNaN(target)) return;
        const duration = 1600;
        const start = performance.now();
        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - t, 3);
            el.textContent = Math.round(target * eased) + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
    };

    /* ----- Reveal-on-scroll ----- */
    const revealTargets = $$('.section__head, .section__text, .section__visual, .service, .pricing__card, .schedule, .location, .cta, .why, .step, .faq__item, .hero__content, .hero__visual, .path, .stat-big, .colombia-card, .colombia-banner, .parallax-strip__content, .stats-showcase__head');
    revealTargets.forEach(el => el.classList.add('reveal'));
    const counterTargets = $$('[data-counter]');

    if ('IntersectionObserver' in window) {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealTargets.forEach(el => io.observe(el));

        const counterIO = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterIO.unobserve(entry.target);
                }
            });
        }, { threshold: 0.4 });
        counterTargets.forEach(el => counterIO.observe(el));
    } else {
        revealTargets.forEach(el => el.classList.add('in'));
        counterTargets.forEach(el => animateCounter(el));
    }

    /* ----- Subtle parallax for hero glows ----- */
    const glows = $$('.hero__glow');
    if (glows.length && window.matchMedia('(min-width: 960px)').matches && !reduceMotion) {
        let ticking = false;
        window.addEventListener('mousemove', (e) => {
            if (ticking) return;
            ticking = true;
            requestAnimationFrame(() => {
                const x = (e.clientX / window.innerWidth) - .5;
                const y = (e.clientY / window.innerHeight) - .5;
                glows.forEach((glow, i) => {
                    const factor = (i + 1) * 12;
                    glow.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
                });
                ticking = false;
            });
        }, { passive: true });
    }

    /* ----- Active nav link on scroll ----- */
    const sections = $$('main section[id]');
    const navLinks = $$('.nav__menu a[href^="#"]');
    if ('IntersectionObserver' in window && sections.length) {
        const spy = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const id = entry.target.id;
                    navLinks.forEach(link => {
                        link.style.color = link.getAttribute('href') === `#${id}`
                            ? 'var(--text)' : '';
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        sections.forEach(s => spy.observe(s));
    }

    /* ----- FAQ accordion ----- */
    const faqItems = $$('.faq__item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => { if (other !== item) other.open = false; });
            }
        });
    });

    /* ----- Climb Rail (scroll-driven climber on rope) ----- */
    const rail = $('.climb-rail');
    const railClimber = $('.climb-rail__climber');
    const railGrades = $$('.climb-rail__grade');
    if (rail && railClimber) {
        // Position grades along the rope: V0 at top → V12 at bottom
        const grades = ['V0','V2','V4','V6','V8','V10','V12'];
        railGrades.forEach((el, i) => {
            const t = i / (railGrades.length - 1);
            el.style.top = (t * 100) + '%';
        });
        requestAnimationFrame(() => rail.classList.add('ready'));
    }

    /* ----- Scroll-aware nav + floating CTAs + parallax + climber ----- */
    const floatCta   = $('.float-cta');
    const bottomBar  = $('#bottomBar');
    const parallaxLayers = $$('.parallax-strip__bg, .stats-showcase__bg');
    const footer     = $('.footer');
    const routePath  = $('.route-line path');

    const onScroll = () => {
        const y = window.scrollY;
        const docH = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docH > 0 ? Math.min(y / docH, 1) : 0;

        if (nav) nav.classList.toggle('scrolled', y > 30);

        const nearFooter = footer && (window.innerHeight + y) > (footer.offsetTop - 60);
        if (floatCta)  floatCta.classList.toggle('show', y > 600 && !nearFooter);
        if (bottomBar) bottomBar.classList.toggle('show', y > 500 && !nearFooter);

        // Climber descent (proportional to scroll progress)
        if (railClimber && rail) {
            const railH = rail.clientHeight - railClimber.clientHeight;
            const offset = progress * railH;
            railClimber.style.transform = `translate(-50%, ${offset.toFixed(1)}px)`;

            // Mark passed grades
            railGrades.forEach((el, i) => {
                const t = i / (railGrades.length - 1);
                el.classList.toggle('passed', progress >= t - 0.02);
            });
        }

        // Route line draw progress
        if (routePath) {
            const len = routePath.getTotalLength ? routePath.getTotalLength() : 4000;
            routePath.style.setProperty('--len', len);
            routePath.style.setProperty('--off', (len * (1 - progress)).toFixed(1));
        }

        // Subtle parallax bgs
        if (!reduceMotion && parallaxLayers.length) {
            parallaxLayers.forEach(layer => {
                const section = layer.parentElement;
                if (!section) return;
                const rect = section.getBoundingClientRect();
                if (rect.bottom < 0 || rect.top > window.innerHeight) return;
                const p = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);
                const t = (p - 0.5) * 80;
                layer.style.transform = `translate3d(0, ${t.toFixed(1)}px, 0)`;
            });
        }
    };
    let scrollTicking = false;
    const scheduleScroll = () => {
        if (scrollTicking) return;
        scrollTicking = true;
        requestAnimationFrame(() => { onScroll(); scrollTicking = false; });
    };
    window.addEventListener('scroll', scheduleScroll, { passive: true });
    window.addEventListener('resize', scheduleScroll, { passive: true });
    onScroll();

    /* ----- Open-now status ----- */
    const computeStatus = () => {
        const now = new Date();
        const day = now.getDay();           // 0=Sun ... 6=Sat
        const minutes = now.getHours() * 60 + now.getMinutes();
        const fmt = (m) => {
            const h12 = ((Math.floor(m / 60) + 11) % 12) + 1;
            const am  = m < 12 * 60;
            return `${h12}${am ? 'AM' : 'PM'}`;
        };
        // Mon–Fri (1–5): 15:00–21:00
        // Sat (6): 14:00–18:00
        // Sun (0): closed
        if (day >= 1 && day <= 5) {
            if (minutes >= 15 * 60 && minutes < 21 * 60) {
                return { open: true, text: T.openClosesAt(fmt(21 * 60)) };
            }
            if (minutes < 15 * 60) {
                return { open: false, text: T.closedOpensAt(T.opensTodayAt(fmt(15 * 60))) };
            }
            // After 9PM Mon–Thu → opens tomorrow at 3PM. Fri → opens Sat at 2PM
            if (day === 5) return { open: false, text: T.closedOpensAt(T.opensTomorrow(fmt(14 * 60))) };
            return { open: false, text: T.closedOpensAt(T.opensTomorrow(fmt(15 * 60))) };
        }
        if (day === 6) {
            if (minutes >= 14 * 60 && minutes < 18 * 60) {
                return { open: true, text: T.openClosesAt(fmt(18 * 60)) };
            }
            if (minutes < 14 * 60) {
                return { open: false, text: T.closedOpensAt(T.opensTodayAt(fmt(14 * 60))) };
            }
            return { open: false, text: T.closedOpensAt(T.opensMonday(fmt(15 * 60))) };
        }
        // Sunday
        return { open: false, text: T.closedOpensAt(T.opensMonday(fmt(15 * 60))) };
    };
    const renderStatus = () => {
        const status = computeStatus();
        $$('[data-status-pill]').forEach(el => {
            el.dataset.state = status.open ? 'open' : 'closed';
            const txt = el.querySelector('.status-text');
            if (txt) txt.textContent = status.text;
        });
    };
    renderStatus();
    setInterval(renderStatus, 60 * 1000);

    /* ----- Chalk burst on CTA clicks ----- */
    const chalkBurst = (x, y) => {
        if (reduceMotion) return;
        const count = 18;
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'chalk-particle';
            const angle = Math.random() * Math.PI * 2;
            const dist = 30 + Math.random() * 70;
            const dx = Math.cos(angle) * dist;
            const dy = Math.sin(angle) * dist - 20;
            const size = 4 + Math.random() * 6;
            p.style.left = x + 'px';
            p.style.top  = y + 'px';
            p.style.setProperty('--dx', dx + 'px');
            p.style.setProperty('--dy', dy + 'px');
            p.style.setProperty('--size', size + 'px');
            document.body.appendChild(p);
            setTimeout(() => p.remove(), 800);
        }
    };
    const burstFromEvent = (e) => {
        const target = e.currentTarget;
        const rect = target.getBoundingClientRect();
        const x = (e.clientX || (rect.left + rect.width / 2));
        const y = (e.clientY || (rect.top + rect.height / 2));
        chalkBurst(x, y);
    };
    $$('.btn--primary, .nav__cta, .bottom-bar__btn--primary').forEach(btn => {
        btn.addEventListener('click', burstFromEvent);
    });

    /* ----- Cursor chalk trail (sparse) ----- */
    if (!reduceMotion && window.matchMedia('(hover: hover)').matches) {
        let lastT = 0;
        document.addEventListener('mousemove', (e) => {
            const now = performance.now();
            if (now - lastT < 60) return;            // throttle
            // Only on chalkable zones
            const t = e.target.closest('.hero, .hero__photo, .btn--primary, .nav__cta, .stat-big, .path, .pricing__card--featured, .gallery__item, .stats-showcase, .parallax-strip');
            if (!t) return;
            lastT = now;
            const d = document.createElement('span');
            d.className = 'cursor-chalk';
            d.style.left = e.clientX + 'px';
            d.style.top  = e.clientY + 'px';
            document.body.appendChild(d);
            setTimeout(() => d.remove(), 600);
        }, { passive: true });
    }

    /* ----- Toast helper ----- */
    const showToast = (html, opts = {}) => {
        const t = document.createElement('div');
        t.className = 'toast' + (opts.variant ? ' toast--' + opts.variant : '');
        t.innerHTML = html;
        document.body.appendChild(t);
        requestAnimationFrame(() => t.classList.add('show'));
        const dur = opts.duration || 2800;
        setTimeout(() => {
            t.classList.remove('show');
            setTimeout(() => t.remove(), 450);
        }, dur);
    };

    /* ----- Hidden holds ----- */
    const HOLDS_KEY = 'grip-holds-v1';
    const TOTAL_HOLDS = 5;
    let foundHolds = new Set();
    try {
        foundHolds = new Set(JSON.parse(localStorage.getItem(HOLDS_KEY) || '[]'));
    } catch (e) {}

    $$('.hidden-hold').forEach(btn => {
        const id = btn.dataset.hold;
        if (foundHolds.has(id)) btn.classList.add('found');
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (foundHolds.has(id)) return;
            foundHolds.add(id);
            try { localStorage.setItem(HOLDS_KEY, JSON.stringify([...foundHolds])); } catch (e2) {}
            btn.classList.add('found');
            chalkBurst(e.clientX, e.clientY);
            if (foundHolds.size >= TOTAL_HOLDS) {
                showToast(
                    `<strong>${T.holdWin}</strong>${T.holdWinBody}<br><code>${T.holdWinCode}</code><small>${T.holdWinNote}</small>`,
                    { variant: 'win', duration: 7000 }
                );
            } else {
                showToast(`<strong>${T.holdFound(foundHolds.size)}</strong>`, { duration: 2200 });
            }
        });
    });

    /* ----- Tip of the day ----- */
    const tipsES = [
        'Mantén las <strong>caderas pegadas al muro</strong> — ahorras fuerza de brazos.',
        '<strong>Mira tus pies</strong> antes de cada movimiento, no solo las manos.',
        'Inhala antes del movimiento, <strong>exhala al ejecutarlo</strong>. La respiración estabiliza.',
        'Si tu antebrazo arde, <strong>baja el dedo gordo del pie</strong>: estás tirando demasiado de manos.',
        '<strong>Movimiento estático &gt; dinámico</strong> cuando vas aprendiendo. Controla, no saltes.',
        '<strong>Estira hombros y dedos</strong> antes de subir. La lesión llega cuando no calentaste.',
        'Un buen escalador <strong>descansa mejor que escala</strong>. Sacúdete entre intentos.',
        'Si la presa es pequeña, <strong>baja el talón</strong>: convierte el pie en gancho.',
        '<strong>Lee la ruta antes de tocarla.</strong> 30 segundos de observación = 3 minutos de fuerza.',
        'En boulder, <strong>cae con las rodillas dobladas</strong>, nunca con las piernas estiradas.',
        'Cuando no encuentres el siguiente movimiento, <strong>cambia de pie</strong>. A veces es solo eso.',
        '<strong>Brazos derechos</strong> en los reposos. Tus tendones aguantan más que tus bíceps.',
        'La <strong>fuerza de dedos</strong> se entrena con paciencia, no con sesiones largas.',
        '<strong>Magnesio solo cuando sudas.</strong> Más no es mejor.',
        'Si vas a caerte, <strong>cae mirando al muro</strong>, nunca de espalda.',
        'El <strong>top no es el final</strong> de la ruta — bajar bien también suma.',
        'Un día de descanso a la semana = <strong>20% más fuerza el resto del mes</strong>.',
        '<strong>Compara contra ti</strong>, no contra el del lado. Cada cuerpo escala diferente.',
        'La <strong>técnica vence a la fuerza</strong>. Siempre.',
        '<strong>Pies primero, manos después.</strong> La regla de oro del que escala bien.',
        'Si tiemblas, es porque <strong>tienes el brazo doblado</strong>. Estira y respira.',
        '<strong>Calentar 10 minutos</strong> evita 10 lesiones.',
        'Cuando una ruta no sale, <strong>cámbiala por una más fácil</strong>. La técnica se aprende abajo.',
        '<strong>Hidrátate antes</strong>, no en medio de la sesión. Calambres = mal manejo de agua.',
        'Una ruta resuelta con elegancia <strong>vale más que tres con tropiezos</strong>.',
        '<strong>Ojos al destino</strong>, manos al presente. Visualiza el siguiente agarre.',
        'Si te bloqueas, <strong>baja, descansa y vuelve a leer</strong>. El movimiento aparece.',
        '<strong>Confía en tus pies.</strong> Los pies de gato agarran más de lo que crees.',
        '<strong>El miedo se entrena.</strong> Sube poco a poco, no de un día para otro.',
        'En climbing, <strong>la cabeza pesa más que el cuerpo</strong>. Cálmala y todo fluye.'
    ];
    const tipsEN = [
        'Keep your <strong>hips close to the wall</strong> — save your arms.',
        '<strong>Look at your feet</strong> before every move, not just your hands.',
        'Inhale before, <strong>exhale during the move</strong>. Breath stabilizes.',
        'If your forearm burns, <strong>drop your big toe</strong>: you are over-pulling.',
        '<strong>Static over dynamic</strong> while learning. Control, do not jump.',
        '<strong>Stretch shoulders and fingers</strong> before climbing. Injuries come from cold tissue.',
        'A good climber <strong>rests better than they climb</strong>. Shake out between burns.',
        'On small holds, <strong>drop your heel</strong>: turn your foot into a hook.',
        '<strong>Read the route before you touch it.</strong> 30 seconds of beta = 3 minutes of power.',
        'In bouldering, <strong>land with bent knees</strong>, never straight legs.',
        'When stuck on a move, <strong>change a foot</strong>. Often that is all it is.',
        '<strong>Straight arms</strong> on rests. Tendons last longer than biceps.',
        '<strong>Finger strength</strong> trains slowly, not in long sessions.',
        '<strong>Chalk only when you sweat.</strong> More is not better.',
        'If you fall, <strong>face the wall</strong>, never your back.',
        'The <strong>top is not the end</strong> — downclimbing well counts too.',
        'One rest day a week = <strong>20% more strength</strong> the rest of the month.',
        '<strong>Compare to yourself</strong>, not the climber next to you. Every body climbs different.',
        '<strong>Technique beats strength.</strong> Always.',
        '<strong>Feet first, hands second.</strong> The golden rule of good climbing.',
        'If you shake, your <strong>arm is bent</strong>. Straighten and breathe.',
        '<strong>10 minutes of warm-up</strong> prevents 10 injuries.',
        'When a route shuts you down, <strong>climb an easier one</strong>. Skill grows from the bottom up.',
        '<strong>Hydrate before</strong>, not mid-session. Cramps = water mismanagement.',
        'A route climbed with grace <strong>beats three sloppy sends</strong>.',
        '<strong>Eyes on the destination</strong>, hands on the present. Visualize the next hold.',
        'When stuck, <strong>come down, rest, re-read</strong>. The move appears.',
        '<strong>Trust your feet.</strong> Climbing shoes grip more than you think.',
        '<strong>Fear is trainable.</strong> Go up gradually, not all at once.',
        'In climbing, <strong>your head weighs more than your body</strong>. Calm it and flow follows.'
    ];
    const tips = isES ? tipsES : tipsEN;
    const tipEl = $('#tipText');
    if (tipEl) {
        const dayOfYear = (() => {
            const d = new Date();
            const start = new Date(d.getFullYear(), 0, 0);
            return Math.floor((d - start) / 86400000);
        })();
        tipEl.innerHTML = tips[dayOfYear % tips.length];
    }

    /* ----- Achievements (scroll milestones) ----- */
    const SESSION_KEY = 'grip-achievements-v1';
    let achieved = new Set();
    try { achieved = new Set(JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]')); } catch (e) {}

    const milestones = [
        { id: 'servicios', label: T.sectionService },
        { id: 'precios',   label: T.sectionPrice },
        { id: 'primera-vez', label: T.sectionVisit },
        { id: 'colombia',  label: T.sectionColombia },
        { id: 'faq',       label: T.sectionFaq }
    ];

    if ('IntersectionObserver' in window) {
        let queue = Promise.resolve();
        const ach = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                const id = entry.target.id;
                const m = milestones.find(x => x.id === id);
                if (!m || achieved.has(id)) return;
                achieved.add(id);
                try { sessionStorage.setItem(SESSION_KEY, JSON.stringify([...achieved])); } catch (e) {}
                queue = queue.then(() => new Promise(res => {
                    showToast(
                        `<strong>${T.achievement}</strong><small>${m.label}</small>`,
                        { variant: 'achievement', duration: 2400 }
                    );
                    setTimeout(res, 2600);
                }));
                ach.unobserve(entry.target);
            });
        }, { threshold: 0.5 });
        milestones.forEach(m => {
            const el = document.getElementById(m.id);
            if (el && !achieved.has(m.id)) ach.observe(el);
        });
    }
})();
