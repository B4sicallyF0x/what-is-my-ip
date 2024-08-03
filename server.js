const http = require('http');

const getClientIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // Si hay múltiples IPs en x-forwarded-for, toma la primera
        return xForwardedFor.split(',')[0].trim();
    }
    return req.socket.remoteAddress;
};

const requestListener = (req, res) => {
    const clientIp = getClientIp(req);

    // Responder con texto plano
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(clientIp);
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
