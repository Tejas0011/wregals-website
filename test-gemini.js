import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyAz2eiNUPsx-0XszCWve11dNK725Jchwnk';
const genAI = new GoogleGenerativeAI(API_KEY);

async function test() {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent('Hello');
    console.log(result.response.text());
  } catch (error) {
    console.error('API Error:', error.message);
    if (error.status) console.error('Status:', error.status);
    if (error.details) console.error('Details:', error.details);
  }
}

test();
