# kito

![Tests](https://github.com/hoogvliets/kito/workflows/Unit%20Tests/badge.svg)
![Code Quality](https://github.com/hoogvliets/kito/workflows/Code%20Quality/badge.svg)

Zero-infrastructure personal newsfeed aggregator and customizable dashboard. Runs entirely client-side with automated data fetching via GitHub Actions.

## Tech Stack

**Frontend**
- Vanilla JavaScript (ES6+)
- HTML5 + CSS3 (CSS custom properties for theming)
- Browser LocalStorage for persistence
- Client-side RSS/Atom parsing

**Deployment**
- GitHub Pages (static hosting)
- No build process required
- GitHub Actions for CI/CD only

## Architecture

```
┌─────────────────────────────────────────────────┐
│  GitHub Pages (static hosting)                  │
│  └─> Serves HTML/CSS/JS                         │
└─────────────────────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────┐
│  Browser (client-side app)                      │
│  ├─> Client-side RSS parsing                    │
│  ├─> Fetches Hacker News API                    │
│  ├─> LocalStorage for state                     │
│  └─> Intersection Observer for infinite scroll  │
└─────────────────────────────────────────────────┘
```

### Key Design Patterns

- **Dynamic Feed Pages**: User-configurable feed sources stored in `localStorage`
- **Feed Caching**: 30-minute TTL-based caching to reduce API calls
- **Widget System**: Modular widget architecture (bookmarks, launchpad, notes, weather, todos)
- **Lazy View Creation**: Feed page DOM elements created on-demand
- **State Management**: Single centralized state object with computed properties

## Quick Start

### Option 1: Using Devcontainer (Recommended)

The easiest way to get started is using the devcontainer:

1. Open the project in VS Code
2. Install the "Dev Containers" extension
3. Press `F1` and select "Dev Containers: Reopen in Container"
4. Once the container is ready, run: `npm run dev`
5. Visit http://localhost:8000

See [.devcontainer/README.md](.devcontainer/README.md) for more details.

### Option 2: Local Setup

```bash
# Clone the repository
git clone https://github.com/hoogvliets/kito.git
cd kito

# Install dependencies
npm install

# Run tests
npm test

# Start local development server
npm run dev
```

Visit http://localhost:8000

## Project Structure

```
/
├── .claude/                  # Claude Code configuration
│   ├── codebase.md          # Project documentation for AI
│   └── instructions.md      # Development guidelines
├── .github/workflows/        # CI/CD workflows
│   ├── test.yml             # Unit tests (Node 18.x, 20.x)
│   └── lint.yml             # Code quality checks
├── __tests__/               # Jest test suite (59 tests)
│   ├── state.test.js        # State management tests
│   ├── feeds.test.js        # Feed operations tests
│   ├── widgets.test.js      # Widget CRUD tests
│   └── utils.test.js        # Utility function tests
├── css/
│   └── styles.css           # All styling (light/dark themes)
├── js/
│   ├── app.js               # Main application (~2500 lines)
│   └── rss-parser.js        # Client-side RSS/Atom parser
├── index.html               # SPA entry point + templates
├── package.json             # Jest + test scripts
└── jest.config.js           # Test configuration
```

## Development

### Local Development Server

```bash
# Start the development server
npm run dev
```

The app will be available at http://localhost:8000

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

**Test Coverage**: 59 tests across state management, feeds, widgets, and utilities.

### Code Style

- Vanilla JavaScript (no frameworks)
- No build process or transpilation
- Use CSS custom properties for theming
- Keep functions pure where possible
- LocalStorage as single source of truth for user data

### State Management

All application state lives in a single `state` object in `js/app.js`:

```javascript
const state = {
    feedPages: [],         // User-configured feed sources
    sidebar: [],           // Hacker News items
    widgets: [],           // Dashboard widgets
    activeFeed: [],        // Computed: current view's feed
    filteredFeed: [],      // After applying filters
    userSettings: {
        read: [],          // Article IDs
        favorites: [],
        hidden: [],
        theme: 'light'     // 'light' | 'dark'
    },
    currentView: 'home',   // 'home' | feed page ID
    // ... pagination, filters, etc.
};
```

### LocalStorage Schema

**Key: `feed-pages-config`**
```javascript
[
  {
    id: "feeds",
    name: "Tech",
    order: 0,
    feedSources: ["https://example.com/feed"],
    data: [...] // Cached feed items
  }
]
```

**Key: `widgets-data`**
```javascript
[
  {
    id: "1234567890",
    type: "bookmarks|launchpad|notes|weather|todo",
    title: "Widget Title",
    // Type-specific fields...
  }
]
```

**Key: `newsfeed-settings`**
```javascript
{
  read: ["article-id-1", "article-id-2"],
  favorites: ["article-id-3"],
  hidden: ["article-id-4"],
  theme: "light"
}
```

### Widget Types

1. **Bookmarks** - Link list with titles
2. **Launchpad** - Grid of site favicons
3. **Notes** - Simple textarea
4. **Weather** - Current + 4-hour forecast (Open-Meteo API)
5. **Todo** - Task list with checkboxes

All widgets support drag-and-drop reordering.

### Adding a New Widget Type

1. Add template to `index.html`:
```html
<template id="widget-mytype-template">
  <!-- Widget structure -->
</template>
```

2. Update widget modal dropdown
3. Handle in `saveWidget()` function
4. Add rendering logic in `renderWidgets()`
5. Add any specific event handlers

### Feed Caching

Feeds are cached in LocalStorage with TTL:
- **Key format**: `feed-cache-{hash}`
- **TTL**: 30 minutes
- Reduces API calls and improves performance

### RSS Parsing

Client-side RSS/Atom parser in `js/rss-parser.js`:
- Supports both RSS 2.0 and Atom formats
- Extracts: title, link, description, author, published date
- Handles CORS via proxy when needed

## CI/CD

### GitHub Actions Workflows

**test.yml** - Runs on every push/PR to `main`
- Tests on Node.js 18.x and 20.x (matrix)
- Generates coverage report (20.x only)
- Uploads to Codecov

**lint.yml** - Code quality checks
- Scans for `console.log` statements
- Validates test success

### Branch Strategy

* `main` - Production branch (auto-deployed to GitHub Pages)
* `branch types:`
    - `feature/description`
    - `fix/description`
    - `docs/description`
    - `test/description`
    - `ci/description`
    - `ui/description`
    

## Configuration Import/Export

Users can export/import their configuration as YAML:
- All widgets
- User settings (theme, read/favorites/hidden)
- Feed page configurations

Custom YAML parser/stringifier (no external dependencies).

## API Usage

**Open-Meteo API** (Weather widget)
- Free, no API key required
- Geocoding: `https://geocoding-api.open-meteo.com/v1/search`
- Weather: `https://api.open-meteo.com/v1/forecast`

**Google Favicon API** (Launchpad widget)
- `https://www.google.com/s2/favicons?domain={domain}&sz=64`

**Hacker News API**
- `https://hacker-news.firebaseio.com/v0/topstories.json`

## Known Constraints

- **LocalStorage limit**: ~5-10MB total storage
- **No npm dependencies in production**: Pure vanilla JS in browser
- **CORS limitations**: Some RSS feeds may require proxy
- **Static hosting only**: No server-side processing

## Contributing

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch: `git checkout -b feature/my-feature`
4. Make your changes and add tests
5. Ensure all tests pass: `npm test`
6. Commit with descriptive message
7. Push to your fork and create a PR


## License

MIT

## Technical Details

**Browser Compatibility**
- Modern browsers with ES6+ support
- LocalStorage API
- Intersection Observer API
- CSS Custom Properties

**Performance Optimizations**
- Feed caching with TTL
- Infinite scroll (Intersection Observer)
- Lazy view creation
- Debounced event handlers

**Security Considerations**
- Content sanitization for user input
- No external script dependencies (except jest for testing)
- HTTPS only for API calls
- No sensitive data stored in LocalStorage
