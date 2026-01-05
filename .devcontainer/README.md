# Devcontainer Setup

This devcontainer provides a consistent development environment for the kito project.

## What's Included

- **Node.js 20** - For running Jest tests
- **Python 3.11** - For the local development server
- **Git** - Version control
- **VS Code Extensions** - ESLint, Prettier, and other helpful tools

## Getting Started

1. **Open in Container**
   - Open VS Code
   - Press `F1` or `Cmd+Shift+P` (Mac) / `Ctrl+Shift+P` (Windows/Linux)
   - Select "Dev Containers: Reopen in Container"
   - Wait for the container to build (first time only)

2. **Start Development**
   ```bash
   # Run the development server
   npm run dev
   ```
   The app will be available at http://localhost:8000

3. **Run Tests**
   ```bash
   # Run all tests
   npm test

   # Watch mode
   npm run test:watch

   # Coverage report
   npm run test:coverage
   ```

## Port Forwarding

Port 8000 is automatically forwarded from the container to your host machine.

## Customization

Edit `.devcontainer/devcontainer.json` to:
- Add more VS Code extensions
- Change editor settings
- Install additional tools
- Modify the container image

## Troubleshooting

**Container won't build?**
- Make sure Docker is running
- Try "Dev Containers: Rebuild Container" from the command palette

**Port 8000 already in use?**
- Change the port in `devcontainer.json` under `forwardPorts`
- Update the `npm run dev` script in `package.json` accordingly
