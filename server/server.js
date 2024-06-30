const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { Readable } = require('stream');
const httpProxy = require('http-proxy');
require('dotenv').config();

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const WILDCARD_API_BASE_URL = 'https://api.gptsapi.net/v1';

// 创建一个代理服务器
const proxy = httpProxy.createProxyServer();

// 代理中间件
app.use('/proxy', (req, res) => {
  const targetUrl = req.url.slice(1);
  
  if (!targetUrl) {
    return res.status(400).send('No target URL provided');
  }

  proxy.web(req, res, { target: targetUrl, changeOrigin: true }, (err) => {
    if (err) {
      console.error('Proxy error:', err);
      res.status(500).send('Proxy error');
    }
  });
});


// Helper function to validate API key
const validateApiKey = (req, res, next) => {
  const apiKey = req.headers['authorization']?.split(' ')[1] || req.headers['x-api-key'];
  if (!apiKey) {
    return res.status(401).json({ error: 'API key is required' });
  }
  req.apiKey = apiKey;
  next();
};

// Model list endpoint
app.get('/api/models', validateApiKey, async (req, res) => {
  try {
    const response = await axios.get(`${WILDCARD_API_BASE_URL}/models`, {
      headers: { 'Authorization': `Bearer ${req.apiKey}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching models:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred while fetching models' });
  }
});

// Chat completion endpoint (non-streaming)
app.post('/api/chat', validateApiKey, async (req, res) => {
  try {
    const response = await axios.post(`${WILDCARD_API_BASE_URL}/chat/completions`, req.body, {
      headers: { 'Authorization': `Bearer ${req.apiKey}` }
    });
    res.json(response.data);
  } catch (error) {
    console.error('Error in chat completion:', error.response?.data || error.message);
    res.status(500).json({ error: 'An error occurred during chat completion' });
  }
});

// Streaming chat completion endpoint
app.post('/api/chat/stream', validateApiKey, async (req, res) => {
  req.body.stream = true;
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    const response = await axios.post(`${WILDCARD_API_BASE_URL}/chat/completions`, req.body, {
      headers: { 'Authorization': `Bearer ${req.apiKey}` },
      responseType: 'stream'
    });

    const stream = new Readable({
      read() {}
    });

    response.data.on('data', (chunk) => {
      console.log('Received chunk:', chunk.toString()); // 添加日志
      stream.push(chunk);
    });

    response.data.on('end', () => {
      console.log('Stream ended'); // 添加日志
      stream.push(null);
    });

    stream.on('error', (error) => {
      console.error('Stream error:', error); // 添加错误日志
      res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming' })}\n\n`);
      res.end();
    });

    stream.pipe(res);
  } catch (error) {
    console.error('Error in streaming chat:', error.response?.data || error.message);
    res.write(`data: ${JSON.stringify({ error: 'An error occurred during streaming chat' })}\n\n`);
    res.end();
  }
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });