# Simple NodeJS What Is My IP Service

## Description

This is a simple NodeJS service that returns the client's IP address. It extracts the IP address from the incoming request headers or the socket and returns it as plain text. The service is available on `ip.b4sicallyf0x.com`.

## Prerequisites

- NodeJS
- NPM (Node Package Manager)

## Setup

1. Clone the repository to your local machine.

   ```sh
   git clone https://github.com/B4sicallyF0x/what-is-my-ip.git
   cd what-is-my-ip
   ```

2. Install the necessary dependencies.

   ```sh
   npm install
   ```

## Usage

1. Run the server.

   ```sh
   node server.js
   ```

2. The server will start running on port 80. You can change the port if needed by modifying the `port` variable in the script.

   ```js
   const port = 80;
   ```

3. When you visit the service URL (e.g., `http://localhost`), the service will return your IP address in plain text.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

