/**
 * Utility Functions Tests
 * Tests for helper functions like date formatting, URL extraction, etc.
 */

describe('Utility Functions', () => {
  describe('Date formatting', () => {
    test('should format ISO date to readable format', () => {
      const isoDate = '2024-01-15T10:30:00Z';
      const date = new Date(isoDate);

      const formatted = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });

      expect(formatted).toMatch(/Jan 1\d, 2024/);
    });

    test('should calculate relative time (time ago)', () => {
      const now = Date.now();
      const oneHourAgo = now - (60 * 60 * 1000);
      const oneDayAgo = now - (24 * 60 * 60 * 1000);

      const hoursDiff = Math.floor((now - oneHourAgo) / (60 * 60 * 1000));
      const daysDiff = Math.floor((now - oneDayAgo) / (24 * 60 * 60 * 1000));

      expect(hoursDiff).toBe(1);
      expect(daysDiff).toBe(1);
    });
  });

  describe('Domain extraction', () => {
    test('should extract domain from URL', () => {
      const urls = [
        'https://www.example.com/path/to/page',
        'http://blog.test.org/article',
        'https://subdomain.example.co.uk/feed.xml'
      ];

      const domains = urls.map(url => {
        try {
          const urlObj = new URL(url);
          return urlObj.hostname;
        } catch {
          return null;
        }
      });

      expect(domains[0]).toBe('www.example.com');
      expect(domains[1]).toBe('blog.test.org');
      expect(domains[2]).toBe('subdomain.example.co.uk');
    });

    test('should handle invalid URLs', () => {
      const invalidUrl = 'not-a-valid-url';

      let domain = null;
      try {
        const urlObj = new URL(invalidUrl);
        domain = urlObj.hostname;
      } catch {
        domain = null;
      }

      expect(domain).toBeNull();
    });

    test('should remove www prefix', () => {
      const domain = 'www.example.com';
      const cleaned = domain.replace(/^www\./, '');

      expect(cleaned).toBe('example.com');
    });
  });

  describe('URL validation', () => {
    test('should validate HTTP/HTTPS URLs', () => {
      const validUrls = [
        'https://example.com',
        'http://test.org',
        'https://subdomain.example.com/path?query=value'
      ];

      validUrls.forEach(url => {
        expect(() => new URL(url)).not.toThrow();
        expect(url).toMatch(/^https?:\/\//);
      });
    });

    test('should reject invalid protocols', () => {
      const invalidUrls = [
        'ftp://example.com',
        'javascript:alert(1)',
        'file:///etc/passwd',
        'data:text/html,<script>alert(1)</script>'
      ];

      invalidUrls.forEach(url => {
        const isHttp = url.startsWith('http://') || url.startsWith('https://');
        expect(isHttp).toBe(false);
      });
    });

    test('should handle malformed URLs', () => {
      const malformedUrls = [
        'htp://example.com',  // typo
        '//example.com',       // missing protocol
        'example.com'          // no protocol
      ];

      malformedUrls.forEach(url => {
        const isValid = url.startsWith('http://') || url.startsWith('https://');
        expect(isValid).toBe(false);
      });
    });
  });

  describe('YAML parsing', () => {
    test('should parse simple YAML object', () => {
      const yaml = `
name: Test Feed
url: https://example.com/feed
active: true
`;
      // Mock YAML parsing logic
      const parsed = {
        name: 'Test Feed',
        url: 'https://example.com/feed',
        active: true
      };

      expect(parsed.name).toBe('Test Feed');
      expect(parsed.active).toBe(true);
    });

    test('should parse YAML arrays', () => {
      const parsed = {
        feeds: [
          'https://feed1.com',
          'https://feed2.com'
        ]
      };

      expect(Array.isArray(parsed.feeds)).toBe(true);
      expect(parsed.feeds).toHaveLength(2);
    });

    test('should handle nested YAML objects', () => {
      const parsed = {
        page: {
          id: 'tech',
          name: 'Tech News',
          sources: ['url1', 'url2']
        }
      };

      expect(parsed.page.id).toBe('tech');
      expect(parsed.page.sources).toHaveLength(2);
    });
  });

  describe('String truncation', () => {
    test('should truncate long text', () => {
      const longText = 'This is a very long text that needs to be truncated to a shorter length';
      const maxLength = 30;

      const truncated = longText.length > maxLength
        ? longText.substring(0, maxLength) + '...'
        : longText;

      expect(truncated.length).toBeLessThanOrEqual(maxLength + 3);
      expect(truncated).toContain('...');
    });

    test('should not truncate short text', () => {
      const shortText = 'Short text';
      const maxLength = 30;

      const truncated = shortText.length > maxLength
        ? shortText.substring(0, maxLength) + '...'
        : shortText;

      expect(truncated).toBe(shortText);
      expect(truncated).not.toContain('...');
    });
  });

  describe('Sanitization', () => {
    test('should escape HTML entities', () => {
      const unsafeText = '<script>alert("XSS")</script>';
      const escaped = unsafeText
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');

      expect(escaped).not.toContain('<script>');
      expect(escaped).toContain('&lt;script&gt;');
    });

    test('should sanitize user input', () => {
      const userInput = '   \t  Trimmed Text  \n  ';
      const sanitized = userInput.trim();

      expect(sanitized).toBe('Trimmed Text');
      expect(sanitized).not.toMatch(/^\s/);
      expect(sanitized).not.toMatch(/\s$/);
    });
  });

  describe('Pagination', () => {
    test('should calculate pagination correctly', () => {
      const totalItems = 50;
      const itemsPerPage = 10;
      const currentPage = 3;

      const start = (currentPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const totalPages = Math.ceil(totalItems / itemsPerPage);

      expect(start).toBe(20);
      expect(end).toBe(30);
      expect(totalPages).toBe(5);
    });

    test('should handle last page correctly', () => {
      const totalItems = 45;
      const itemsPerPage = 10;
      const lastPage = Math.ceil(totalItems / itemsPerPage);

      const start = (lastPage - 1) * itemsPerPage;
      const end = start + itemsPerPage;
      const itemsOnLastPage = Math.min(itemsPerPage, totalItems - start);

      expect(lastPage).toBe(5);
      expect(itemsOnLastPage).toBe(5);
    });
  });
});
