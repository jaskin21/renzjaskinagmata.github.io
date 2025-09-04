# Expense Tracker Frontend

This is the React + Vite frontend for the Expense Tracker application. It provides a modern UI for managing expenses, viewing summaries, and interacting with the backend API.

---

## Setup Instructions

1. **Clone the repository**  
   Make sure you have the codebase locally.

2. **Install dependencies**  
   Open a terminal in the `client/` directory and run:
   ```sh
   npm install
   ```

3. **Environment Variables**  
   - Copy `.env.sample` to `.env` and update values as needed.
   - The key variable is:
     ```
     VITE_API_URL=http://localhost:5000/v1
     ```
     This should point to your backend API.

---

## How to Run Locally

1. **Start the development server**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) by default.

2. **Build for production**
   ```sh
   npm run build
   ```
   The output will be in the `dist/` folder.

---

## Assumptions & Decisions

- **API Endpoint:**  
  The frontend expects the backend to be running and accessible at the URL specified in `VITE_API_URL`.
- **Authentication:**  
  No authentication is implemented; all expense data is accessible to any user.
- **State Management:**  
  Uses Redux Toolkit for API calls and global state.
- **Styling:**  
  Tailwind CSS is used for rapid UI development.
- **Component Structure:**  
  UI components are organized by type and feature for maintainability.
- **Error Handling:**  
  Basic error handling is implemented via toast notifications and error boundaries.
- **Browser Support:**  
  Modern browsers (Chrome, Firefox, Edge) are supported.

---

## Project Structure

```
client/
  public/           # Static assets
  src/
    assets/         # Images and SVGs
    components/     # Reusable UI and feature components
    features/       # Feature-specific logic
    pages/          # Route-level components
    stores/         # Redux store and slices
    types/          # TypeScript types
    utils/          # Utility functions
  .env              # Environment variables
  package.json      # NPM dependencies and scripts
  vite.config.ts    # Vite configuration
  tailwind.config.js# Tailwind CSS config
```

---

## Other Essentials

- **Linting:**  
  Run `npm run lint` to check code quality.
- **Formatting:**  
  Prettier is recommended for code formatting.
- **Testing:**  
  No automated tests are included yet.
- **Contributing:**  
  Please open issues or pull requests for improvements.

---


For any questions or issues, please contact the maintainer or open an issue in the