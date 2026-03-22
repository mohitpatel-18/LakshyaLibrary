import request from 'supertest';
import app from '../server.js';

describe('Authentication Tests', () => {
  describe('GET /health', () => {
    it('should return a healthy server response', async () => {
      const response = await request(app).get('/health');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Server is running');
      expect(response.body.timestamp).toBeDefined();
    });
  });

  describe('POST /api/auth/login', () => {
    it('should reject requests without credentials', async () => {
      const response = await request(app).post('/api/auth/login').send({});

      expect(response.status).toBeGreaterThanOrEqual(400);
    });
  });
});
