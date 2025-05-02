require('dotenv').config();

const { createClient } = require('redis');

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (error) => {
  console.error('Redis connection error:', error);
});

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected');
  } catch (error) {
    console.error('Redis not connect:', error);
  }
})();

module.exports = redisClient;
