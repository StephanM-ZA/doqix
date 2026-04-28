#!/usr/bin/env node
/* Do.Qix sitemap CI check.
   Fails the build if any indexable site/*.html is missing from sitemap.xml,
   or if sitemap.xml lists URLs that no longer exist as files. */

'use strict';

const fs = require('fs');
const path = require('path');

const SITE_DIR = path.join(__dirname, '..', 'site');
const SITEMAP = path.join(SITE_DIR, 'sitemap.xml');
const BASE_URL = 'https://digitaloperations.co.za/doqix';

const EXCLUDE = new Set(['404.html', 'thank-you.html']);

function urlForFile(filename) {
    return filename === 'index.html' ? BASE_URL + '/' : BASE_URL + '/' + filename;
}

function fileForUrl(url) {
    if (!url.startsWith(BASE_URL)) return null;
    const tail = url.slice(BASE_URL.length).replace(/^\//, '');
    return tail === '' ? 'index.html' : tail;
}

function readSitemapUrls() {
    if (!fs.existsSync(SITEMAP)) {
        console.error('[check-sitemap] FAIL: site/sitemap.xml does not exist');
        process.exit(1);
    }
    const xml = fs.readFileSync(SITEMAP, 'utf8');
    const re = /<loc>([^<]+)<\/loc>/g;
    const urls = [];
    let m;
    while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
    return urls;
}

function main() {
    const expected = new Set(
        fs.readdirSync(SITE_DIR)
          .filter(f => f.endsWith('.html'))
          .filter(f => !EXCLUDE.has(f))
          .map(urlForFile)
    );
    const actual = new Set(readSitemapUrls());

    const missing = [];
    expected.forEach(u => { if (!actual.has(u)) missing.push(u); });
    const extra = [];
    actual.forEach(u => {
        if (!expected.has(u)) extra.push(u);
    });

    if (missing.length === 0 && extra.length === 0) {
        console.log('[check-sitemap] OK: ' + expected.size + ' URLs match between site/ and sitemap.xml');
        return;
    }

    console.error('[check-sitemap] FAIL');
    if (missing.length) {
        console.error('  Missing from sitemap (HTML files exist but not listed):');
        missing.forEach(u => console.error('    + ' + u));
    }
    if (extra.length) {
        console.error('  Extra in sitemap (listed but no matching HTML file in site/):');
        extra.forEach(u => console.error('    - ' + u));
    }
    console.error('  Run `npm run build:sitemap` to regenerate.');
    process.exit(1);
}

if (require.main === module) main();
module.exports = main;
