import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAz2eiNUPsx-0XszCWve11dNK725Jchwnk';

// We have to use the REST API manually because the SDK doesn't let us easily forge a Referer header
async function test() {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Referer': 'http://localhost:5173/', // Mock the local dev server
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: "Hello" }] }]
      })
    });
    
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Response:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Fetch Error:', error);
  }
}

test();
