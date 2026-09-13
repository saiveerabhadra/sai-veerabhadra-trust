const http = require('http');
const fs = require('fs');
const path = require('path');

const root = __dirname;
const port = process.env.PORT || 5500;
const donationsDir = path.join(root, 'donations');

const mimeTypes = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4'
};

function csvCell(value) {
  return '"' + String(value ?? '').replace(/"/g, '""') + '"';
}

function sendJson(response, statusCode, body) {
  response.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

function saveDonation(data) {
  const date = new Date().toISOString().slice(0, 10);
  const filePath = path.join(donationsDir, `donations-${date}.csv`);
  const headers = ['Date', 'Time', 'Donator Name', 'Program', 'Amount', 'UPI Transaction ID'];
  const now = new Date();
  const row = [
    date,
    now.toISOString(),
    data.donatorName,
    data.program,
    data.amount,
    data.upiTransactionId
  ].map(csvCell).join(',') + '\n';

  fs.mkdirSync(donationsDir, { recursive: true });
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, headers.map(csvCell).join(',') + '\n', 'utf8');
  }
  fs.appendFileSync(filePath, row, 'utf8');
}

function serveFile(request, response) {
  const requestPath = decodeURIComponent(request.url.split('?')[0]);
  const relativePath = requestPath === '/' ? 'index.html' : requestPath.replace(/^\/+/, '');
  const filePath = path.normalize(path.join(root, relativePath));

  if (!filePath.startsWith(root) || !fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    response.writeHead(404);
    response.end('Not found');
    return;
  }

  response.writeHead(200, { 'Content-Type': mimeTypes[path.extname(filePath).toLowerCase()] || 'application/octet-stream' });
  fs.createReadStream(filePath).pipe(response);
}

const server = http.createServer((request, response) => {
  if (request.method === 'POST' && request.url === '/api/donations') {
    let body = '';
    request.on('data', chunk => { body += chunk; });
    request.on('end', () => {
      try {
        const data = JSON.parse(body);
        if (!data.donatorName || !data.program || !data.amount || !data.upiTransactionId) {
          sendJson(response, 400, { error: 'All donation fields are required.' });
          return;
        }
        saveDonation(data);
        sendJson(response, 201, { message: 'Donation saved successfully.' });
      } catch (error) {
        sendJson(response, 400, { error: 'Invalid donation data.' });
      }
    });
    return;
  }

  if (request.method === 'GET') {
    serveFile(request, response);
    return;
  }

  response.writeHead(405);
  response.end('Method not allowed');
});

server.listen(port, () => {
  console.log(`Sai Veera Bhadra Trust website: http://localhost:${port}/`);
  console.log(`Daily donation files: ${donationsDir}`);
});
