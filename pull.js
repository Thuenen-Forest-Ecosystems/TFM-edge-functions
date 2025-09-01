const http = require('http');
const { exec } = require('child_process');
const crypto = require('crypto');

require('dotenv').config({ path: '.env' });


const HOST = '134.110.2.52';
// .env webhookKey
const SECRET = process.env.WEBHOOK_KEY
const PORT = 9000;
const currentDir = process.cwd();
const REPO_PATH = `${currentDir}`;

http.createServer((req, res) => {

  if (req.method !== 'POST') {
    res.writeHead(405);
    res.end('Method not allowed');
    return;
  }


  // check token
  const token = req.headers['x-hub-signature-256'] ? req.headers['x-hub-signature-256'].split('=')[1] : null;
  const hmac = crypto.createHmac('sha256', SECRET);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

  if (req.method === 'POST' && token === digest) {
    console.log('Received webhook request');
    
    exec(`cd ${REPO_PATH} && git pull`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        res.writeHead(500);
        res.end('Pull failed');
        return;
      }
      
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      res.writeHead(200);
      res.end('Repository updated successfully');
    });
    // docker restart edge-functions-container
    exec('docker restart edge-functions-container', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
    });

  } else {
    res.writeHead(403);
    res.end(`Invalid request ${req.method} ${token} !== ${SECRET}`);
  }
}).listen(PORT);

console.log(`Webhook server running on port http://${HOST}:${PORT} with secret ${SECRET}`);