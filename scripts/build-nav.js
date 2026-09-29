#!/usr/bin/env node
/*
 * Bake the header and footer into site/*.html as static HTML.
 *
 * Why: header.js and footer.js inject the nav with innerHTML at runtime, so the
 * HTML GitHub Pages actually serves contains zero internal links. Crawlers that
 * do not execute JavaScript (Seznam, Naver, Yep, and inconsistently Bing and
 * Yandex) saw a site with no navigation, and Google only picked the links up in
 * its delayed second rendering pass.
 *
 * How, without duplicating the nav definition: this script executes the real
 * header.js / footer.js against a minimal DOM stub and captures the markup they
 * produce. There is still exactly one source of truth for the nav, and it is
 * still those two files. Nothing is copy-pasted.
 *
 * The scripts still ship: they detect pre-rendered markup and only attach
 * behaviour (dropdowns, hamburger, active state) instead of rebuilding.
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, 'site');

function renderComponent(jsFile, elementId) {
    const src = fs.readFileSync(path.join(SITE, 'js', jsFile), 'utf8');
    const target = { innerHTML: '', querySelectorAll: () => [], querySelector: () => null,
                     addEventListener: () => {}, classList: { add: () => {}, remove: () => {}, toggle: () => {} } };
    const noop = () => {};
    const stubEl = () => ({ querySelectorAll: () => [], querySelector: () => null,
                            addEventListener: noop, classList: { add: noop, remove: noop, toggle: noop },
                            getAttribute: () => null, setAttribute: noop, style: {} });
    const sandbox = {
        window: { location: { pathname: '/doqix/index.html', search: '', href: 'https://digitaloperations.co.za/doqix/index.html' },
                  addEventListener: noop, matchMedia: () => ({ matches: false, addEventListener: noop }) },
        document: {
            getElementById: (id) => (id === elementId ? target : null),
            querySelectorAll: () => [], querySelector: () => null,
            addEventListener: noop, body: stubEl(), documentElement: stubEl(),
            createElement: stubEl,
        },
        console, setTimeout: noop, clearTimeout: noop,
    };
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    try {
        vm.runInContext(src, sandbox, { filename: jsFile, timeout: 5000 });
    } catch (err) {
        throw new Error(`could not render ${jsFile}: ${err.message}`);
    }
    if (!target.innerHTML.trim()) throw new Error(`${jsFile} produced no markup`);
    return target.innerHTML;
}

function inject(html, id, markup) {
    // Idempotent: replaces whatever is currently inside the placeholder.
    const re = new RegExp(`(<div id="${id}">)([\\s\\S]*?)(</div>\\s*(?:<script|<button|\\n))`, 'i');
    if (!re.test(html)) return { html, changed: false };
    return { html: html.replace(re, `$1${markup}$3`), changed: true };
}

const header = renderComponent('header.js', 'site-header');
const footer = renderComponent('footer.js', 'site-footer');

let touched = 0, skipped = [];
for (const file of fs.readdirSync(SITE).filter((f) => f.endsWith('.html'))) {
    const p = path.join(SITE, file);
    let html = fs.readFileSync(p, 'utf8');
    const before = html;
    let r = inject(html, 'site-header', header); html = r.html;
    const hadHeader = r.changed;
    r = inject(html, 'site-footer', footer); html = r.html;
    const hadFooter = r.changed;
    if (!hadHeader && !hadFooter) { skipped.push(file); continue; }
    if (html !== before) { fs.writeFileSync(p, html); }
    touched++;
}

console.log(`[build-nav] baked header+footer into ${touched} page(s) in site/`);
if (skipped.length) console.log(`[build-nav] no placeholders in: ${skipped.join(', ')}`);

// Guard: the whole point is static links. Fail the build if they are missing.
const probe = fs.readFileSync(path.join(SITE, 'index.html'), 'utf8');
const required = ['services.html', 'products.html', 'voltiq.html', 'contact.html'];
const missing = required.filter((href) => !probe.includes(`href="${href}"`));
if (missing.length) {
    console.error(`[build-nav] FAILED: site/index.html still has no static link to: ${missing.join(', ')}`);
    process.exit(1);
}
console.log('[build-nav] verified: homepage carries static links to ' + required.join(', '));
