import axios from 'axios';

const apiKey = process.env.APILLON_API_KEY;
const apiSecret = process.env.APILLON_API_SECRET;

const apillonAuthAPI = axios.create({
  baseURL: 'https://api.apillon.io/auth',
  headers: {
    Authorization: `Basic ${Buffer.from(`${apiKey}:${apiSecret}`).toString(
      'base64'
    )}`,
  },
});

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept'
  );

  if (req.method === 'GET') {
    const response = await apillonAuthAPI.get('/session-token');
    res.status(response.status).json(response.data);
  } else if (req.method === 'POST') {
    const { token } = req.body;
    const response = await apillonAuthAPI.post('/verify-login', { token });
    res.status(response.status).json(response.data);
  } else {
    res.status(405).end();
  }
}
