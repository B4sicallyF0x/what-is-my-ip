const http = require('http');
const { URL } = require('url');

const removePort = (s) => s.replace(/:\d+$/, '');
const stripIpv6Mapped = (ip) => ip.startsWith('::ffff:') ? ip.slice(7) : ip;


const isPrivate = (ip) => {
  
  if (/^(::1|fe80:|fec0:|fc00:|fd00:)/i.test(ip)) return true;

  
  return /^(10\.)|(127\.)|(192\.168\.)|(172\.(1[6-9]|2[0-9]|3[0-1])\.)|(169\.254\.)/.test(ip);
};

const preferredIpFromList = (list) => {
  for (const raw of list) {
    const ip = stripIpv6Mapped(removePort(raw.trim()));
    if (ip && !isPrivate(ip)) return ip;
  }
  
  const first = list[0];
  return first ? stripIpv6Mapped(removePort(first.trim())) : undefined;
};

const getClientIp = (req) => {
  
  const headers = req.headers;
  const candidates =
    headers['cf-connecting-ip'] ||
    headers['true-client-ip'] ||
    headers['x-real-ip'] ||
    headers['fastly-client-ip'] ||
    headers['x-client-ip'] ||
    headers['x-forwarded-for'];

  if (candidates) {
    const ips = String(candidates).split(',').map(s => s.trim()).filter(Boolean);
    const unique = [...new Set(ips)];
    const chosen = preferredIpFromList(unique);
    if (chosen) return chosen;
  }

  
  const sock = req.socket?.remoteAddress || '';
  return stripIpv6Mapped(removePort(sock));
};

const sendTxt = (res, ip) => {
  res.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  
  res.end(`${ip}\n`);
};

const sendJson = (res, ip) => {
  res.writeHead(200, {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
  });
  res.end(JSON.stringify({ ip }));
};

const requestListener = (req, res) => {
  const clientIp = getClientIp(req);
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const format = url.searchParams.get('format');

  
  const path = url.pathname.replace(/\/+$/, '') || '/';

  
  if (req.method === 'HEAD') {
    res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end();
  }

  
  if (format === 'json' || path === '/json' || req.headers.accept?.includes('application/json')) {
    return sendJson(res, clientIp);
  }

  
  return sendTxt(res, clientIp);
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
