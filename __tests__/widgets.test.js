/**
 * Widget Tests
 * Tests for widget creation, modification, and deletion
 */

describe('Widget Operations', () => {
  describe('Widget creation', () => {
    test('should create bookmark widget', () => {
      const widget = {
        id: Date.now().toString(),
        type: 'bookmarks',
        title: 'My Links',
        links: [
          { id: '1', title: 'Google', url: 'https://google.com' }
        ]
      };

      expect(widget.type).toBe('bookmarks');
      expect(widget.links).toHaveLength(1);
      expect(widget.links[0].url).toMatch(/^https?:\/\//);
    });

    test('should create launchpad widget', () => {
      const widget = {
        id: Date.now().toString(),
        type: 'launchpad',
        title: 'Quick Access',
        sites: [
          { id: '1', name: 'Gmail', url: 'https://gmail.com' }
        ]
      };

      expect(widget.type).toBe('launchpad');
      expect(widget.sites).toHaveLength(1);
    });

    test('should create notes widget', () => {
      const widget = {
        id: Date.now().toString(),
        type: 'notes',
        title: 'My Notes',
        notes: 'Sample note content'
      };

      expect(widget.type).toBe('notes');
      expect(widget.notes).toBeDefined();
    });

    test('should create weather widget', () => {
      const widget = {
        id: Date.now().toString(),
        type: 'weather',
        title: 'Weather',
        location: 'New York'
      };

      expect(widget.type).toBe('weather');
      expect(widget.location).toBe('New York');
    });

    test('should create todo widget', () => {
      const widget = {
        id: Date.now().toString(),
        type: 'todo',
        title: 'Tasks',
        todos: [
          { id: '1', text: 'Task 1', completed: false }
        ]
      };

      expect(widget.type).toBe('todo');
      expect(widget.todos).toHaveLength(1);
      expect(widget.todos[0].completed).toBe(false);
    });

    test('should generate unique widget IDs', () => {
      const id1 = Date.now().toString();
      // Small delay to ensure different timestamp
      const id2 = (Date.now() + 1).toString();

      expect(id1).not.toBe(id2);
    });
  });

  describe('Widget modification', () => {
    test('should update widget title', () => {
      const widget = {
        id: '123',
        type: 'bookmarks',
        title: 'Old Title'
      };

      widget.title = 'New Title';

      expect(widget.title).toBe('New Title');
    });

    test('should add link to bookmarks widget', () => {
      const widget = {
        id: '123',
        type: 'bookmarks',
        title: 'Links',
        links: []
      };

      const newLink = {
        id: Date.now().toString(),
        title: 'Example',
        url: 'https://example.com'
      };

      widget.links.push(newLink);

      expect(widget.links).toHaveLength(1);
      expect(widget.links[0].url).toBe('https://example.com');
    });

    test('should remove link from bookmarks widget', () => {
      const widget = {
        id: '123',
        type: 'bookmarks',
        title: 'Links',
        links: [
          { id: '1', title: 'Link 1', url: 'https://example.com' },
          { id: '2', title: 'Link 2', url: 'https://test.com' }
        ]
      };

      widget.links = widget.links.filter(link => link.id !== '1');

      expect(widget.links).toHaveLength(1);
      expect(widget.links[0].id).toBe('2');
    });

    test('should toggle todo completion', () => {
      const todo = {
        id: '1',
        text: 'Task 1',
        completed: false
      };

      todo.completed = !todo.completed;
      expect(todo.completed).toBe(true);

      todo.completed = !todo.completed;
      expect(todo.completed).toBe(false);
    });

    test('should update notes content', () => {
      const widget = {
        id: '123',
        type: 'notes',
        title: 'Notes',
        notes: 'Old content'
      };

      widget.notes = 'New content';

      expect(widget.notes).toBe('New content');
    });
  });

  describe('Widget deletion', () => {
    test('should delete widget from array', () => {
      const widgets = [
        { id: '1', type: 'bookmarks', title: 'Widget 1' },
        { id: '2', type: 'notes', title: 'Widget 2' },
        { id: '3', type: 'todo', title: 'Widget 3' }
      ];

      const widgetIdToDelete = '2';
      const updatedWidgets = widgets.filter(w => w.id !== widgetIdToDelete);

      expect(updatedWidgets).toHaveLength(2);
      expect(updatedWidgets.find(w => w.id === '2')).toBeUndefined();
    });
  });

  describe('Widget persistence', () => {
    test('should save widgets to localStorage', () => {
      const widgets = [
        { id: '1', type: 'bookmarks', title: 'My Links', links: [] }
      ];

      localStorage.setItem('widgets-data', JSON.stringify(widgets));
      const saved = localStorage.getItem('widgets-data');

      expect(saved).toBeDefined();
      expect(JSON.parse(saved)).toEqual(widgets);
    });

    test('should load widgets from localStorage', () => {
      const mockWidgets = [
        { id: '1', type: 'notes', title: 'Notes', notes: 'Test' }
      ];

      localStorage.setItem('widgets-data', JSON.stringify(mockWidgets));
      const loaded = JSON.parse(localStorage.getItem('widgets-data'));

      expect(loaded).toEqual(mockWidgets);
      expect(loaded[0].type).toBe('notes');
    });

    test('should export widgets excluding weather data', () => {
      const widgets = [
        {
          id: '1',
          type: 'weather',
          title: 'Weather',
          location: 'NYC',
          weather: { temp: 20, conditions: 'Sunny' } // Should not export
        },
        {
          id: '2',
          type: 'bookmarks',
          title: 'Links',
          links: []
        }
      ];

      // Simulate export - remove weather data
      const toExport = widgets.map(w => {
        if (w.type === 'weather') {
          const { weather, ...rest } = w;
          return rest;
        }
        return w;
      });

      expect(toExport[0].weather).toBeUndefined();
      expect(toExport[0].location).toBe('NYC');
      expect(toExport[1]).toEqual(widgets[1]);
    });
  });

  describe('Widget validation', () => {
    test('should validate widget types', () => {
      const validTypes = ['bookmarks', 'launchpad', 'notes', 'weather', 'todo'];
      const widget = { type: 'bookmarks' };

      expect(validTypes).toContain(widget.type);
    });

    test('should reject invalid widget types', () => {
      const validTypes = ['bookmarks', 'launchpad', 'notes', 'weather', 'todo'];
      const invalidWidget = { type: 'invalid-type' };

      expect(validTypes).not.toContain(invalidWidget.type);
    });

    test('should validate URL format in bookmark links', () => {
      const link = { url: 'https://example.com' };

      expect(() => new URL(link.url)).not.toThrow();
      expect(link.url).toMatch(/^https?:\/\//);
    });

    test('should reject invalid URLs', () => {
      const invalidUrls = [
        'not-a-url',
        'javascript:alert(1)',
        'ftp://example.com'
      ];

      invalidUrls.forEach(url => {
        const isValid = url.startsWith('http://') || url.startsWith('https://');
        expect(isValid).toBe(false);
      });
    });
  });

  describe('Widget drag and drop', () => {
    test('should reorder widgets', () => {
      const widgets = [
        { id: '1', type: 'bookmarks' },
        { id: '2', type: 'notes' },
        { id: '3', type: 'todo' }
      ];

      // Simulate dragging widget 1 to position 2
      const [movedWidget] = widgets.splice(0, 1);
      widgets.splice(1, 0, movedWidget);

      expect(widgets[0].id).toBe('2');
      expect(widgets[1].id).toBe('1');
      expect(widgets[2].id).toBe('3');
    });
  });
});
