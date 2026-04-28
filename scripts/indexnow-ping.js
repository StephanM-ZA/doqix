#!/usr/bin/env node
/* Do.Qix IndexNow ping.
   Runs in CI after deploy. Notifies Bing, Yandex, Seznam, Naver, Yep that
   the listed URLs have changed. Google does not participate in IndexNow.

   Key file lives at site/<key>.txt and is served at:
     https://digitaloperations.co.za/doqix/<key>.txt
   The IndexNow spec allows a non-root keyLocation when the host root
   isn't ours to write to (which is the case here — the GitHub Pages
   site lives at a subpath). */

'use strict';

const fs = require('fs');
const path = require('path');
const https = require('https');

const SITE_DIR = path.join(__dirname, '..', 'site');
const SITEMAP = path.join(SITE_DIR, 'sitemap.xml');
const HOST = 'digitaloperations.co.za';
const KEY = '535193b33cb18a785693767808453d51';
const KEY_LOCATION = 'https://' + HOST + '/doqix/' + KEY + '.txt';
const ENDPOINT = 'https://api.indexnow.org/indexnow';

function readSitemapUrls() {
    const xml = fs.readFileSync(SITEMAP, 'utf8');
    const re = /<loc>([^<]+)<\/loc>/g;
    const urls = [];
    let m;
    while ((m = re.exec(xml)) !== null) urls.push(m[1].trim());
    return urls;
}

function ping(urls) {
    return new Promise((resolve, reject) => {
        const body = JSON.stringify({
            host: HOST,
            key: KEY,
            keyLocation: KEY_LOCATION,
            urlList: urls
        });
        const req = https.request(ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                'Content-Length': Buffer.byteLength(body)
            }
        }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, body: data }));
        });
        req.on('error', reject);
        req.write(body);
        req.end();
    });
}

async function main() {
    const urls = readSitemapUrls();
    if (urls.length === 0) {
        console.error('[indexnow] no URLs in sitemap, skipping');
        return;
    }
    console.log('[indexnow] notifying ' + urls.length + ' URLs');
    try {
        const r = await ping(urls);
        if (r.status >= 200 && r.status < 300) {
            console.log('[indexnow] OK (HTTP ' + r.status + ')');
        } else {
            /* Non-2xx is a soft fail — log but don't break the deploy. */
            console.warn('[indexnow] non-success: HTTP ' + r.status + ' ' + r.body);
        }
    } catch (e) {
        console.warn('[indexnow] error (non-fatal): ' + e.message);
    }
}

if (require.main === module) main();
