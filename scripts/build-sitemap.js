#!/usr/bin/env node
/* Do.Qix sitemap generator.
   Scans site/*.html, derives URL + lastmod (from git), writes site/sitemap.xml.
   Run via `npm run build:sitemap` (also wired into `npm run build`). */

'use strict';

const fs = require('fs');
const path = require('path');
const cp = require('child_process');

const SITE_DIR = path.join(__dirname, '..', 'site');
const DESIGN_DIR = path.join(__dirname, '..', 'design');
const OUTPUT = path.join(SITE_DIR, 'sitemap.xml');
const BASE_URL = 'https://digitaloperations.co.za/doqix';

/* Pages that must NOT be indexed. */
const EXCLUDE = new Set([
    '404.html',
    'thank-you.html'
]);

/* Per-page priority + changefreq. Default applies if not listed. */
const PAGE_META = {
    'index.html':                 { priority: '1.0', changefreq: 'weekly'  },
    'services.html':              { priority: '0.9', changefreq: 'monthly' },
    'products.html':              { priority: '0.8', changefreq: 'monthly' },
    'contact.html':               { priority: '0.8', changefreq: 'monthly' },
    'privacy-policy.html':        { priority: '0.3', changefreq: 'yearly'  },
    'terms-and-conditions.html':  { priority: '0.3', changefreq: 'yearly'  },
    'build-terms.html':           { priority: '0.3', changefreq: 'yearly'  }
};
const DEFAULT_META = { priority: '0.5', changefreq: 'monthly' };

/* Map a site/<file>.html to its design source path so we can ask git
   for the right lastmod. The design tree mirrors site but with a
   per-page subfolder. Where there's no obvious source, fall back to
   the site file's own mtime. */
function designSourceFor(filename) {
    if (filename === '404.html')  return path.join(DESIGN_DIR, '404', '404.html');
    if (filename === 'thank-you.html') return path.join(DESIGN_DIR, 'thank-you', 'thank-you.html');
    const stem = filename.replace(/\.html$/, '');
    const candidate = path.join(DESIGN_DIR, stem, filename);
    return fs.existsSync(candidate) ? candidate : null;
}

function gitLastModified(filePath) {
    try {
        const out = cp.execFileSync('git', ['log', '-1', '--format=%cI', '--', filePath], {
            stdio: ['ignore', 'pipe', 'ignore']
        }).toString().trim();
        return out || null;
    } catch (e) { return null; }
}

function fileMtime(filePath) {
    try { return fs.statSync(filePath).mtime.toISOString(); }
    catch (e) { return new Date().toISOString(); }
}

function pageUrl(filename) {
    if (filename === 'index.html') return BASE_URL + '/';
    return BASE_URL + '/' + filename;
}

function buildSitemap() {
    const files = fs.readdirSync(SITE_DIR)
        .filter(f => f.endsWith('.html'))
        .filter(f => !EXCLUDE.has(f))
        .sort();

    const entries = files.map(f => {
        const designPath = designSourceFor(f);
        const sitePath = path.join(SITE_DIR, f);
        const lastmod = (designPath && gitLastModified(designPath))
                     || gitLastModified(sitePath)
                     || fileMtime(sitePath);
        const meta = PAGE_META[f] || DEFAULT_META;
        return {
            loc: pageUrl(f),
            lastmod: lastmod.split('T')[0],   /* yyyy-mm-dd is enough for sitemap */
            priority: meta.priority,
            changefreq: meta.changefreq
        };
    });

    const xml = [
        '<?xml version="1.0" encoding="UTF-8"?>',
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    ];
    entries.forEach(e => {
        xml.push('  <url>');
        xml.push('    <loc>' + e.loc + '</loc>');
        xml.push('    <lastmod>' + e.lastmod + '</lastmod>');
        xml.push('    <changefreq>' + e.changefreq + '</changefreq>');
        xml.push('    <priority>' + e.priority + '</priority>');
        xml.push('  </url>');
    });
    xml.push('</urlset>');
    xml.push('');

    fs.writeFileSync(OUTPUT, xml.join('\n'), 'utf8');
    console.log('[build-sitemap] Wrote ' + entries.length + ' URLs to ' + path.relative(process.cwd(), OUTPUT));
    entries.forEach(e => console.log('  ' + e.priority + '  ' + e.lastmod + '  ' + e.loc));
}

if (require.main === module) buildSitemap();
module.exports = buildSitemap;
