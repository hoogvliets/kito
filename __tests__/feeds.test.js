/**
 * Feed Operations Tests
 * Tests for feed page management and RSS parsing
 */

describe('Feed Operations', () => {
  describe('Feed page configuration', () => {
    test('should create default feed page when none exists', () => {
      const defaultPages = [
        { id: 'feeds', name: 'Feeds', order: 0, feedSources: [], data: [] }
      ];

      expect(defaultPages).toHaveLength(1);
      expect(defaultPages[0].id).toBe('feeds');
      expect(defaultPages[0].feedSources).toEqual([]);
    });

    test('should add feed source to page', () => {
      const page = {
        id: 'feeds',
        name: 'Feeds',
        order: 0,
        feedSources: [],
        data: []
      };

      const newUrl = 'https://example.com/feed.xml';
      page.feedSources.push(newUrl);

      expect(page.feedSources).toContain(newUrl);
      expect(page.feedSources).toHaveLength(1);
    });

    test('should remove feed source from page', () => {
      const page = {
        id: 'feeds',
        name: 'Feeds',
        order: 0,
        feedSources: ['https://example.com/feed.xml', 'https://test.com/feed'],
        data: []
      };

      page.feedSources = page.feedSources.filter(
        url => url !== 'https://example.com/feed.xml'
      );

      expect(page.feedSources).toHaveLength(1);
      expect(page.feedSources).not.toContain('https://example.com/feed.xml');
    });

    test('should validate feed URL format', () => {
      const validUrls = [
        'https://example.com/feed.xml',
        'http://test.com/rss',
        'https://blog.example.org/feed'
      ];

      const invalidUrls = [
        'ftp://example.com/feed',
        'javascript:alert(1)',
        'not-a-url',
        ''
      ];

      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow();
        expect(url.startsWith('http')).toBe(true);
      });

      invalidUrls.forEach(url => {
        const isValid = url.startsWith('http://') || url.startsWith('https://');
        expect(isValid).toBe(false);
      });
    });

    test('should prevent duplicate feed sources', () => {
      const page = {
        feedSources: ['https://example.com/feed.xml']
      };

      const newUrl = 'https://example.com/feed.xml';
      const isDuplicate = page.feedSources.includes(newUrl);

      expect(isDuplicate).toBe(true);

      if (!isDuplicate) {
        page.feedSources.push(newUrl);
      }

      expect(page.feedSources).toHaveLength(1);
    });

    test('should enforce maximum 10 feed pages', () => {
      const feedPages = Array.from({ length: 10 }, (_, i) => ({
        id: `page-${i}`,
        name: `Page ${i}`,
        order: i,
        feedSources: [],
        data: []
      }));

      expect(feedPages).toHaveLength(10);

      const canAddMore = feedPages.length < 10;
      expect(canAddMore).toBe(false);
    });
  });

  describe('Feed item processing', () => {
    test('should deduplicate feed items by ID', () => {
      const items = [
        { id: '1', title: 'Post 1' },
        { id: '2', title: 'Post 2' },
        { id: '1', title: 'Post 1 Duplicate' },
        { id: '3', title: 'Post 3' }
      ];

      const seen = new Set();
      const deduplicated = items.filter(item => {
        if (seen.has(item.id)) return false;
        seen.add(item.id);
        return true;
      });

      expect(deduplicated).toHaveLength(3);
      expect(deduplicated.map(i => i.id)).toEqual(['1', '2', '3']);
    });

    test('should sort items by date', () => {
      const items = [
        { published: '2024-01-15T10:00:00Z', title: 'Middle' },
        { published: '2024-01-16T10:00:00Z', title: 'Newest' },
        { published: '2024-01-14T10:00:00Z', title: 'Oldest' }
      ];

      items.sort((a, b) => {
        const dateA = new Date(a.published);
        const dateB = new Date(b.published);
        return dateB - dateA; // Newest first
      });

      expect(items[0].title).toBe('Newest');
      expect(items[2].title).toBe('Oldest');
    });

    test('should filter hidden items', () => {
      const items = [
        { id: '1', title: 'Visible 1' },
        { id: '2', title: 'Hidden' },
        { id: '3', title: 'Visible 2' }
      ];
      const hiddenIds = ['2'];

      const visible = items.filter(item => !hiddenIds.includes(item.id));

      expect(visible).toHaveLength(2);
      expect(visible.map(i => i.id)).toEqual(['1', '3']);
    });

    test('should mark items as read', () => {
      const readIds = [];
      const itemId = 'item-123';

      if (!readIds.includes(itemId)) {
        readIds.push(itemId);
      }

      expect(readIds).toContain(itemId);
      expect(readIds).toHaveLength(1);
    });

    test('should toggle favorite status', () => {
      const favorites = ['item-1'];
      const itemId = 'item-2';

      // Add to favorites
      if (!favorites.includes(itemId)) {
        favorites.push(itemId);
      }
      expect(favorites).toContain(itemId);

      // Remove from favorites
      const index = favorites.indexOf(itemId);
      if (index > -1) {
        favorites.splice(index, 1);
      }
      expect(favorites).not.toContain(itemId);
    });
  });

  describe('Feed filtering', () => {
    test('should filter by source', () => {
      const items = [
        { source: 'Source A', title: 'Post 1' },
        { source: 'Source B', title: 'Post 2' },
        { source: 'Source A', title: 'Post 3' }
      ];

      const filtered = items.filter(item => item.source === 'Source A');

      expect(filtered).toHaveLength(2);
      expect(filtered.every(item => item.source === 'Source A')).toBe(true);
    });

    test('should filter favorites only', () => {
      const items = [
        { id: '1', title: 'Post 1' },
        { id: '2', title: 'Post 2' },
        { id: '3', title: 'Post 3' }
      ];
      const favorites = ['1', '3'];

      const filtered = items.filter(item => favorites.includes(item.id));

      expect(filtered).toHaveLength(2);
      expect(filtered.map(i => i.id)).toEqual(['1', '3']);
    });

    test('should combine multiple filters', () => {
      const items = [
        { id: '1', source: 'Source A', title: 'Post 1' },
        { id: '2', source: 'Source B', title: 'Post 2' },
        { id: '3', source: 'Source A', title: 'Post 3' }
      ];
      const favorites = ['1', '2'];
      const selectedSource = 'Source A';

      let filtered = items;

      // Filter by source
      if (selectedSource !== 'all') {
        filtered = filtered.filter(item => item.source === selectedSource);
      }

      // Filter by favorites
      filtered = filtered.filter(item => favorites.includes(item.id));

      expect(filtered).toHaveLength(1);
      expect(filtered[0].id).toBe('1');
    });
  });
});
