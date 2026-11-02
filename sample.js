const http = require('http');
const fs = require('fs');
const { exec } = require('child_process');

const imgBase64 = fs.readFileSync('C:/Users/adnan/.gemini/antigravity/brain/078d4d98-1e5f-4cc6-9e8c-a785f65c73b2/.user_uploaded/media_1793503044984_87c77b6b.png').toString('base64');

const server = http.createServer((req, res) => {
  if (req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html><html><body>
      <img id="img" src="data:image/png;base64,` + imgBase64 + `" />
      <canvas id="c"></canvas>
      <script>
        const img = document.getElementById('img');
        img.onload = () => {
          const c = document.getElementById('c');
          c.width = img.width;
          c.height = img.height;
          const ctx = c.getContext('2d');
          ctx.drawImage(img, 0, 0);
          
          // Sample regions
          const pLeft = Array.from(ctx.getImageData(50, 100, 1, 1).data);
          const pWhiteBlob = Array.from(ctx.getImageData(100, 150, 1, 1).data);
          const pRight = Array.from(ctx.getImageData(800, 100, 1, 1).data);
          
          fetch('/report', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ pLeft, pWhiteBlob, pRight })
          });
        };
      </script></body></html>
    `);
  } else if (req.method === 'POST') {
    let body = '';
    req.on('data', d => body += d);
    req.on('end', () => {
      console.log('SAMPLE_RESULT:', body);
      res.writeHead(200);
      res.end('ok');
      process.exit(0);
    });
  }
});

server.listen(9881, () => {
  exec('"C:\\\\Program Files\\\\Google\\\\Chrome\\\\Application\\\\chrome.exe" --headless=new http://localhost:9881');
});
