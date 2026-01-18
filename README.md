# Horizon Truth Frontend

This is the frontend for the **Horizon Truth** platform, built with modern web technologies for a fast and responsive user experience.

## 🚀 Tech Stack

- **Framework:** [React 19](https://react.dev/)
- **Build Tool:** [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS 4](https://tailwindcss.com/)
- **Language:** TypeScript

## 📂 Project Structure

- `src/assets/`: Static assets like images and icons.
- `src/App.tsx`: Main application component.
- `src/main.tsx`: Application entry point.
- `src/index.css`: Global styles and Tailwind configuration.

## 🛠 Setup & Installation

### Prerequisites

- Node.js (v18 or higher)
- [Yarn](https://yarnpkg.com/) (recommended) or npm

### Installation

1. Clone the repository.
2. Install dependencies:
   ```bash
   yarn install
   ```
3. Set up environment variables:
   - Development: Copy `.env.development` to `.env.local`
   - Staging: Copy `.env.staging` to `.env.staging`
   ```bash
   cp .env.development .env.local
   ```

## 🌍 Environment Variables

The frontend uses Vite's environment variable system.
- `VITE_API_URL`: The base URL for the backend API.

During development, you can use `.env.development` (or `.env.local`). For staging builds, use `.env.staging`.

## 📜 Available Scripts

- `yarn dev`: Start the development server.
- `yarn build`: Build the application for production.
- `yarn lint`: Run ESLint to find and fix code quality issues.
- `yarn preview`: Preview the production build locally.

## 🎨 Styling

We use **Tailwind CSS 4** with the `@tailwindcss/vite` plugin for efficient styling. Global styles are managed in `src/index.css`.
