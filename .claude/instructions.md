# kito - Development Instructions

## Core Principles

When working on this project, always adhere to these constraints:

1. **Zero Dependencies**: Pure vanilla JavaScript only (except CDN libraries like js-yaml)
2. **No Build Process**: Everything must run directly in the browser
3. **Client-Side Only**: No server-side processing - this runs on GitHub Pages
4. **LocalStorage**: All persistence uses browser localStorage (5-10MB limit)

## Code Style

- **ES6+**: Use modern JavaScript features
- **Template Literals**: Prefer template literals for HTML generation
- **Async/Await**: Use for asynchronous operations
- **Dataset Attributes**: Use `data-*` attributes for element-data association
- **Const/Let**: Never use `var`

## Architecture Patterns

### State Management
- All state in the single `state` object
- Always call `saveWidgets()` or `saveSettings()` after state changes
- Use computed getters for derived values (like `activeFeed`)

### DOM Manipulation
- Clone templates using `.content.cloneNode(true)`
- Use `.classList.add/remove('hidden')` for modals
- Generate IDs with `Date.now().toString()`

### Feed Management
- Use `Promise.allSettled()` for parallel feed fetching
- Respect the 30-minute cache TTL
- Maximum 10 feed pages enforced

## File Organization

- **JavaScript**: `js/app.js` (main logic), `js/rss-parser.js` (RSS utilities)
- **Styles**: `css/styles.css` (use CSS variables for theming)
- **Config**: `.claude/` for AI instructions, `config/` for feed configuration
- **Data**: `data/` for static JSON files (GitHub Actions generated)

## Before Committing

1. Test locally at `http://localhost:5500`
2. Check browser console for errors
3. Verify localStorage isn't corrupted
4. Test both light and dark themes
5. Ensure CORS-dependent features work (RSS feeds, weather, favicons)

## Git Commits

- Never commit to main
- Never push to main
- Use descriptive commit messages
- Test thoroughly before committing
- Don't commit secrets or credentials
- Follow existing commit message style (see `git log`)
- Always creates a PR when a feature is done and working, ask for confirmation to create the PR

## Git Branches
* Always pull new code from main before creating a new branche
* Always use an appropriate branch prefixes
* Choose from one of the following prefixes:
    - feature/ - new functionality
    - fix/ - bug fixes
    - ui/ - UI changes
    - ci/ - CI/CD changes
    - docs/ - documentation
    - refactor/ - code improvements without changing functionality
    - test/ - adding or updating tests

## Common Pitfalls

- **CORS**: RSS feeds must support CORS - always test with actual URLs
- **LocalStorage Limits**: Monitor total storage usage
- **Feed Caching**: Remember feeds cache for 30 minutes
- **Dynamic Views**: Views are created at runtime - check existence before accessing
- **Async Init**: Feed pages initialize asynchronously - ensure proper await

## When Adding Features

1. **Widgets**: Add template → Update modal → Add rendering logic → Add save/delete handlers
2. **Feed Pages**: Use the UI (Config view) - don't hardcode new pages
3. **Views**: Dynamic feed views auto-create; only add static views if absolutely necessary
4. **Settings**: Update both state and localStorage; maintain backward compatibility

## Helpful Commands

```bash
# Local server
python3 -m http.server 5500

# View localStorage (browser console)
localStorage.getItem('feed-pages-config')
localStorage.getItem('widgets-data')
localStorage.getItem('newsfeed-settings')

# Clear feed cache
Object.keys(localStorage).filter(k => k.startsWith('feed-cache-')).forEach(k => localStorage.removeItem(k))
```

## References

- Main documentation: `.claude/codebase.md`
- Feed config: `config/feed-pages.yaml`
- Settings: `.claude/settings.json`
