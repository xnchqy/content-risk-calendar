// -*- coding: utf-8 -*-
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const dist = 'C:\\Users\\xn\\.qclaw\\workspace-agent-12b2bbb2\\content-risk-calendar\\dist';
const PORT = 4322;

const MIME = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
    '.json': 'application/json; charset=utf-8',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
};

const server = http.createServer((req, res) => {
    let pathname = decodeURIComponent(url.parse(req.url).pathname);
    let filepath = path.join(dist, pathname);

    if (fs.existsSync(filepath) && fs.statSync(filepath).isDirectory()) {
        const index = path.join(filepath, 'index.html');
        if (fs.existsSync(index)) filepath = index;
    }

    if (!fs.existsSync(filepath)) {
        res.writeHead(404);
        res.end('404 Not Found: ' + pathname);
        return;
    }

    const ext = path.extname(filepath).toLowerCase();
    const ctype = MIME[ext] || 'text/plain; charset=utf-8';
    res.writeHead(200, { 'Content-Type': ctype });
    fs.createReadStream(filepath).pipe(res);
});

server.listen(PORT, () => {
    console.log('Preview server running at http://localhost:' + PORT + '/');
    console.log('Press Ctrl+C to stop.');
});

process.on('uncaughtException', (e) => {
    console.error('Server error:', e.message);
    process.exit(1);
});
