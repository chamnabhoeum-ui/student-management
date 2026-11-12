const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const REGISTRATION_URL = process.env.REGISTRATION_URL || 'http://localhost:8081';
const DELETE_URL = process.env.DELETE_URL || 'http://delete-service:8082';

// Registration -> POST /api/register
app.use(createProxyMiddleware({
  target: REGISTRATION_URL,
  changeOrigin: true,
  pathFilter: '/api/register',
  pathRewrite: { '^/api/register': '/register' },
}));

// Delete student -> DELETE /api/students/:id
app.use(createProxyMiddleware({
  target: DELETE_URL,
  changeOrigin: true,
  pathFilter: '/api/students',
  pathRewrite: { '^/api/students': '/students' },
}));

app.get('/health', (req, res) => res.json({ status: 'api-gateway up' }));

app.listen(8080, () => console.log('API Gateway running on port 8080'));
