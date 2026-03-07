import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';

const html = `
<!DOCTYPE html>
<html>
<body>
  <div id="output">Waiting...</div>
  <script type="importmap">
    {
      "imports": {
        "@google/generative-ai": "https://esm.run/@google/generative-ai"
      }
    }
  </script>
  <script type="module">
    import { GoogleGenerativeAI } from '@google/generative-ai';
    const API_KEY = 'AIzaSyAz2eiNUPsx-0XszCWve11dNK725Jchwnk';
    
    async function test() {
      try {
        const genAI = new GoogleGenerativeAI(API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent('Hello');
        document.getElementById('output').textContent = 'SUCCESS: ' + result.response.text();
      } catch (err) {
        document.getElementById('output').textContent = 'ERROR: ' + err.message;
      }
    }
    test();
  </script>
</body>
</html>
`;

async function test() {
  const server = http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });
  server.listen(5174);

  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  try {
    await page.goto('http://localhost:5174');
    await page.waitForFunction('document.getElementById("output").textContent !== "Waiting..."');
    const output = await page.evaluate(() => document.getElementById("output").textContent);
    console.log(output);
  } catch (err) {
    console.error(err);
  } finally {
    await browser.close();
    server.close();
  }
}

test();
