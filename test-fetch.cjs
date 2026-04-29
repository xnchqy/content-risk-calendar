// -*- coding: utf-8 -*-
const http = require('http');

function fetch(url) {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve({ status: res.statusCode, contentType: res.headers['content-type'], body: data }));
        }).on('error', reject);
    });
}

async function main() {
    const urls = [
        'http://localhost:4322/',
        'http://localhost:4322/events/2026-01-01-元旦-跨年夜/'
    ];
    for (const u of urls) {
        const r = await fetch(u);
        console.log('URL:', u);
        console.log('Content-Type:', r.contentType);
        const charsetMatch = r.contentType.match(/charset=([^\s;]+)/);
        console.log('Charset from header:', charsetMatch ? charsetMatch[1] : 'not specified');
        const hasUTF8BOM = r.body.charCodeAt(0) === 0xFEFF;
        console.log('Has UTF8 BOM:', hasUTF8BOM);
        const chinese = r.body.match(/[\u4e00-\u9fff]/g);
        console.log('Chinese chars in body:', chinese ? chinese.length : 0);
        console.log('First 150 chars:', r.body.substring(0, 150));
        console.log('---');
    }
}

main().catch(console.error);
