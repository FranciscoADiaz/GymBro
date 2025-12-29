const request = require('supertest');
const express = require('express');
const routes = require('../src/routes/index.routes');

const app = express();
app.use('/api', routes);

describe('health', () => {
  it('returns ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

