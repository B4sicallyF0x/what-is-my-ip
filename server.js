const http = require('http');

const getClientIp = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        
        const ips = xForwardedFor.split(',').map(ip => ip.trim());
        
        const uniqueIps = [...new Set(ips)];
        
        for (const ip of uniqueIps) {
            if (!/^10\.|^172\.(1[6-9]|2[0-9]|3[0-1])\.|^192\.168\./.test(ip)) {
                return ip;
            }
        }
        return uniqueIps[0]; 
    }
    return req.socket.remoteAddress;
};

const requestListener = (req, res) => {
    const clientIp = getClientIp(req);

    
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(clientIp);
};

const server = http.createServer(requestListener);
const port = 80;
server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
