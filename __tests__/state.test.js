/**
 * State Management Tests
 * Tests for localStorage operations and state persistence
 */

describe('State Management', () => {
  describe('localStorage operations', () => {
    test('should save and load feed pages config', () => {
      const mockConfig = [
        { id: 'feeds', name: 'Feeds', order: 0, feedSources: [] }
      ];

      localStorage.setItem('feed-pages-config', JSON.stringify(mockConfig));
      const loaded = JSON.parse(localStorage.getItem('feed-pages-config'));

      expect(loaded).toEqual(mockConfig);
      expect(loaded[0].id).toBe('feeds');
    });

    test('should save and load user settings', () => {
      const mockSettings = {
        read: ['item1', 'item2'],
        favorites: ['item1'],
        hidden: [],
        theme: 'dark'
      };

      localStorage.setItem('newsfeed-settings', JSON.stringify(mockSettings));
      const loaded = JSON.parse(localStorage.getItem('newsfeed-settings'));

      expect(loaded).toEqual(mockSettings);
      expect(loaded.theme).toBe('dark');
      expect(loaded.read).toHaveLength(2);
    });

    test('should save and load widgets data', () => {
      const mockWidgets = [
        {
          id: '123',
          type: 'bookmarks',
          title: 'My Links',
          links: [{ title: 'Google', url: 'https://google.com' }]
        }
      ];

      localStorage.setItem('widgets-data', JSON.stringify(mockWidgets));
      const loaded = JSON.parse(localStorage.getItem('widgets-data'));

      expect(loaded).toEqual(mockWidgets);
      expect(loaded[0].type).toBe('bookmarks');
      expect(loaded[0].links).toHaveLength(1);
    });

    test('should handle empty localStorage gracefully', () => {
      expect(localStorage.getItem('feed-pages-config')).toBeNull();
      expect(localStorage.getItem('newsfeed-settings')).toBeNull();
      expect(localStorage.getItem('widgets-data')).toBeNull();
    });

    test('should clear all data', () => {
      localStorage.setItem('test-key', 'test-value');
      expect(localStorage.getItem('test-key')).toBe('test-value');

      localStorage.clear();
      expect(localStorage.getItem('test-key')).toBeNull();
    });
  });

  describe('Feed cache operations', () => {
    test('should cache feed data with timestamp', () => {
      const mockFeedData = {
        timestamp: Date.now(),
        data: [{ id: '1', title: 'Test Post' }]
      };

      const cacheKey = 'feed-cache-test';
      localStorage.setItem(cacheKey, JSON.stringify(mockFeedData));
      const cached = JSON.parse(localStorage.getItem(cacheKey));

      expect(cached.timestamp).toBeDefined();
      expect(cached.data).toHaveLength(1);
    });

    test('should detect expired cache', () => {
      const TTL = 1800000; // 30 minutes
      const oldTimestamp = Date.now() - (TTL + 1000); // Expired

      const mockFeedData = {
        timestamp: oldTimestamp,
        data: [{ id: '1', title: 'Old Post' }]
      };

      localStorage.setItem('feed-cache-test', JSON.stringify(mockFeedData));
      const cached = JSON.parse(localStorage.getItem('feed-cache-test'));

      const isExpired = Date.now() - cached.timestamp > TTL;
      expect(isExpired).toBe(true);
    });

    test('should detect valid cache', () => {
      const TTL = 1800000; // 30 minutes
      const recentTimestamp = Date.now() - 1000; // 1 second ago

      const mockFeedData = {
        timestamp: recentTimestamp,
        data: [{ id: '1', title: 'Recent Post' }]
      };

      localStorage.setItem('feed-cache-test', JSON.stringify(mockFeedData));
      const cached = JSON.parse(localStorage.getItem('feed-cache-test'));

      const isExpired = Date.now() - cached.timestamp > TTL;
      expect(isExpired).toBe(false);
    });
  });
});
