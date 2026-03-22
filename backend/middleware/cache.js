import NodeCache from 'node-cache';

// Create cache instance
const cache = new NodeCache({
  stdTTL: 600, // 10 minutes default TTL
  checkperiod: 120, // Check for expired keys every 2 minutes
  useClones: false,
});

/**
 * Cache middleware
 * Usage: router.get('/endpoint', cacheMiddleware(300), controller)
 */
export const cacheMiddleware = (duration = 300) => {
  return (req, res, next) => {
    // Only cache GET requests
    if (req.method !== 'GET') {
      return next();
    }

    const key = `${req.originalUrl || req.url}`;
    const cachedResponse = cache.get(key);

    if (cachedResponse) {
      console.log(`[CACHE HIT] ${key}`);
      return res.json(cachedResponse);
    }

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json
    res.json = (data) => {
      // Cache the response
      cache.set(key, data, duration);
      console.log(`[CACHE SET] ${key} (TTL: ${duration}s)`);
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache by key pattern
 */
export const clearCache = (pattern) => {
  const keys = cache.keys();
  const matchedKeys = keys.filter(key => key.includes(pattern));
  
  matchedKeys.forEach(key => cache.del(key));
  console.log(`[CACHE CLEAR] Cleared ${matchedKeys.length} keys matching "${pattern}"`);
  
  return matchedKeys.length;
};

/**
 * Clear all cache
 */
export const clearAllCache = () => {
  cache.flushAll();
  console.log('[CACHE CLEAR] All cache cleared');
};

/**
 * Get cache stats
 */
export const getCacheStats = () => {
  return cache.getStats();
};

export default cache;
