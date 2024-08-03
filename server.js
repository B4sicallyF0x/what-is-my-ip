const http = require('http');

const requestListener = (req, res) => {
    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    // Responder con texto plano
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(clientIp);
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
