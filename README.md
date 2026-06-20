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