# Test Suite for Kito

Comprehensive unit tests for the kito newsfeed aggregator and dashboard.

## Test Coverage

### State Management Tests (`state.test.js`)
- localStorage operations for feed pages, settings, and widgets
- Feed cache operations with TTL validation
- Data persistence and retrieval

### Feed Operations Tests (`feeds.test.js`)
- Feed page configuration (CRUD operations)
- Feed URL validation
- Feed item deduplication and sorting
- Item filtering (by source, favorites, read status)
- Maximum feed page limit enforcement

### Widget Tests (`widgets.test.js`)
- Widget creation for all 5 types:
  - Bookmarks
  - Launchpad
  - Notes
  - Weather
  - Todo
- Widget modification (add/remove items, update content)
- Widget deletion
- Widget persistence to localStorage
- Widget validation and URL checking
- Drag and drop reordering

### Utility Functions Tests (`utils.test.js`)
- Date formatting and relative time calculations
- Domain extraction from URLs
- URL validation and sanitization
- YAML parsing
- String truncation
- HTML entity escaping
- Pagination calculations

## Running Tests

### Install Dependencies
```bash
npm install
```

### Run All Tests
```bash
npm test
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Generate Coverage Report
```bash
npm run test:coverage
```

Coverage reports will be generated in the `coverage/` directory.

## Test Structure

```
__tests__/
├── setup.js          # Test configuration and mocks
├── state.test.js     # State management tests
├── feeds.test.js     # Feed operations tests
├── widgets.test.js   # Widget tests
└── utils.test.js     # Utility function tests
```

## Mocks

The test suite includes mocks for:
- **localStorage**: In-memory storage implementation
- **fetch**: Mock for testing API calls
- **DOM**: JSDOM environment for browser APIs

## Writing New Tests

1. Create a new test file in `__tests__/` with `.test.js` extension
2. Import required dependencies from `@jest/globals`
3. Use `describe()` blocks to group related tests
4. Use `test()` or `it()` for individual test cases
5. Follow the existing patterns for consistency

## Notes

- Tests are isolated and don't affect actual localStorage
- Each test runs in a clean environment
- Mocks are reset before each test
- Tests focus on logic and data manipulation rather than DOM rendering
