# Horizon Truth Client (v2)

## 📌 Project Governance

- 📜 [Project Charter](../PROJECT_CHARTER.md)
- 🤝 [Code of Conduct](../CODE_OF_CONDUCT.md)
- 🛠️ [Contributing Guide](../CONTRIBUTING.md)

---

## 🎯 Project Overview

**Horizon Truth Client (v2)** is the modern web interface for the Horizon Truth platform, built with cutting-edge web technologies. This client application provides users with an intuitive interface for tracking and verifying public claims, featuring real-time updates, responsive design, and seamless integration with the Horizon Truth API.

## 📚 Documentation

- **Project Documentation:** [docs.horizontruth.org](https://docs.horizontruth.org)
- **Backend API Documentation (Swagger):** [api.horizontruth.org/api/v1/docs](https://api.horizontruth.org/api/v1/docs)

## 🚀 Tech Stack

### Core Framework & Language
- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite 7.2](https://vitejs.dev/)
- **Language:** TypeScript 5.9
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) with `@tailwindcss/vite` plugin

### Testing & Quality
- **Testing Framework:** [Vitest 4.0](https://vitest.dev/)
- **Testing Library:** React Testing Library with Jest DOM
- **Linting:** ESLint 9 with TypeScript and React plugins
- **Type Checking:** TypeScript strict mode

### Development Tools
- **Hot Reload:** Vite HMR with React Refresh
- **UI Testing:** Vitest UI for visual test runner
- **Preview:** Vite Preview for production build validation

## 📂 Project Structure

```
src/
├── assets/              # Static assets (images, icons, fonts)
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Input, Modal)
│   ├── layout/         # Layout components (Header, Footer, Sidebar)
│   └── features/       # Feature-specific components
├── hooks/              # Custom React hooks
├── utils/              # Utility functions and helpers
├── types/              # TypeScript type definitions
├── App.tsx             # Root application component
├── main.tsx           # Application entry point
└── index.css          # Global styles and Tailwind imports

test/                   # Test files
├── setup.ts           # Test setup configuration
└── components/        # Component tests
```

## 🛠️ Quick Start

### Prerequisites

- Node.js v18 or higher
- npm, yarn, or pnpm (yarn recommended)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/Horizon-Truth/horizon-truth-client-v2.git
   cd horizon-truth-client-v2
   ```

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Configure environment variables**
   ```bash
   # Copy environment template for development
   cp .env.development .env.local
   ```

4. **Update the `.env.local` file** with your API URL and other configuration:
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_APP_NAME=Horizon Truth
   VITE_ENVIRONMENT=development
   ```

5. **Start the development server**
   ```bash
   yarn dev
   ```
   The application will be available at `http://localhost:5173`.

## 🌍 Environment Configuration

Vite uses environment variables prefixed with `VITE_`. Configuration files:

| File | Purpose | When to Use |
|------|---------|-------------|
| `.env.development` | Development defaults | Template for local development |
| `.env.staging` | Staging configuration | For staging deployments |
| `.env.production` | Production configuration | For production builds |
| `.env.local` | Local overrides | Git-ignored, for personal settings |

### Key Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_APP_NAME` | Application display name | `Horizon Truth` |
| `VITE_ENVIRONMENT` | Runtime environment | `development` |
| `VITE_SENTRY_DSN` | Sentry error tracking DSN | - |

## 📜 Available Scripts

### Development
```bash
yarn dev              # Start development server with HMR
yarn build            # Build for production
yarn preview          # Preview production build locally
```

### Code Quality
```bash
yarn lint             # Run ESLint with auto-fix
# Type checking is integrated into Vite build process
```

### Testing
```bash
yarn test             # Run tests in headless mode
yarn test:ui          # Open Vitest UI for visual test running
```

## 🧪 Testing Strategy

The project uses Vitest with React Testing Library for comprehensive testing:

### Test Configuration
- **Test Environment:** jsdom for browser-like environment
- **Setup:** Custom test setup in `test/setup.ts`
- **Coverage:** Built-in coverage reporting

### Running Tests
```bash
# Run all tests
yarn test

# Run tests in watch mode
yarn test --watch

# Run tests with UI
yarn test:ui

# Run specific test file
yarn test src/components/Button.test.tsx
```

### Writing Tests
- Tests are co-located with components or in `test/` directory
- Use `*.test.tsx` or `*.spec.tsx` naming convention
- Follow React Testing Library best practices

## 🎨 Styling & Design System

### Tailwind CSS 4
- Uses the new Tailwind CSS v4 with zero configuration
- Integrated via `@tailwindcss/vite` plugin
- Custom styles in `src/index.css`

### CSS Architecture
```css
/* src/index.css */
@import "tailwindcss";

/* Custom theme variables */
@theme {
  --color-primary: #2563eb;
  --color-secondary: #7c3aed;
}

/* Global styles */
body {
  font-feature-settings: "ss01", "ss02", "cv01", "cv02";
}
```

### Component Styling Pattern
```tsx
// Use Tailwind utility classes directly
const Button = ({ children }: ButtonProps) => (
  <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark">
    {children}
  </button>
);
```

## 🔧 Development Workflow

### Component Development
1. Create component in `src/components/`
2. Write tests in `src/components/ComponentName.test.tsx`
3. Export from `src/components/index.ts`
4. Use in feature components

### State Management
- React hooks for local state
- Context API for global state where needed
- Custom hooks for reusable logic

### API Integration
- Fetch or axios for API calls
- Custom hooks for data fetching (e.g., `useClaims`, `useUsers`)
- Error handling and loading states

## 🚀 Building for Production

### Production Build
```bash
yarn build
```
This will:
1. Run TypeScript compilation
2. Bundle with Vite
3. Optimize assets
4. Output to `dist/` directory

### Deployment
The `dist/` directory contains static files that can be deployed to:
- **Static Hosting:** Vercel, Netlify, GitHub Pages
- **Container:** Docker with Nginx
- **CDN:** CloudFront, Cloudflare

### Docker Example
```dockerfile
FROM node:18-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install && yarn build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## 🤝 Contributing

We welcome contributions! Please start by reading our:
- [Contributing Guide](../CONTRIBUTING.md) for development workflows.
- [Code of Conduct](../CODE_OF_CONDUCT.md) to understand our community standards.

### Development Checklist
1. ✅ Write tests for new features
2. ✅ Ensure all tests pass (`yarn test`)
3. ✅ Run linter (`yarn lint`)
4. ✅ Update documentation if needed
5. ✅ Follow TypeScript strict mode

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](../LICENSE) file for details.

---

> **For the complete project vision and governance model, please see the [Project Charter](../PROJECT_CHARTER.md).**

## 🔗 Related Repositories

- **Backend API:** [horizon-truth-api-v2](https://github.com/your-org/horizon-truth-api-v2)
- **Documentation:** [horizon-truth-docs](https://github.com/Horizon-Truth/horizon-truth-docs)