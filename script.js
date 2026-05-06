/* ============================================
   GRIP Climbing Club — Interactions
   ============================================ */

(() => {
    'use strict';

    const $ = (sel, ctx = document) => ctx.querySelector(sel);
    const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

    /* ----- Theme toggle ----- */
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const next = isLight ? 'dark' : 'light';
            if (next === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            try { localStorage.setItem('grip-theme', next); } catch (e) {}
            // Update theme-color meta for mobile chrome
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

    /* ----- Scroll-aware nav ----- */
    let lastScroll = 0;
    const onScroll = () => {
        const y = window.scrollY;
        if (nav) nav.classList.toggle('scrolled', y > 30);

        // Floating CTA: show after scrolling past hero
        const floatCta = $('.float-cta');
        if (floatCta) floatCta.classList.toggle('show', y > 600);

        lastScroll = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

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
            const value = Math.round(target * eased);
            el.textContent = value + suffix;
            if (t < 1) requestAnimationFrame(tick);
            else el.textContent = target + suffix;
        };
        requestAnimationFrame(tick);
    };

    /* ----- Reveal-on-scroll ----- */
    const revealTargets = $$('.section__head, .section__text, .section__visual, .service, .pricing__card, .schedule, .location, .cta, .why, .step, .faq__item, .hero__content, .hero__visual');
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
    if (glows.length && window.matchMedia('(min-width: 960px)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
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
                            ? 'var(--text)'
                            : '';
                    });
                }
            });
        }, { rootMargin: '-50% 0px -50% 0px' });
        sections.forEach(s => spy.observe(s));
    }

    /* ----- FAQ: close others when one opens ----- */
    const faqItems = $$('.faq__item');
    faqItems.forEach(item => {
        item.addEventListener('toggle', () => {
            if (item.open) {
                faqItems.forEach(other => {
                    if (other !== item) other.open = false;
                });
            }
        });
    });
})();
