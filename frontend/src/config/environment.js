// Environment configuration
const config = {
  development: {
    API_BASE_URL: 'http://localhost:8080/api',
    DEBUG: true,
    CACHE_TTL: 30000, // 30 seconds
  },
  production: {
    API_BASE_URL: process.env.REACT_APP_API_URL || 'https://your-api-domain.com/api',
    DEBUG: false,
    CACHE_TTL: 300000, // 5 minutes
  },
  test: {
    API_BASE_URL: 'http://localhost:8080/api',
    DEBUG: true,
    CACHE_TTL: 0, // No cache in tests
  },
};

const environment = process.env.NODE_ENV || 'development';

export default config[environment];
