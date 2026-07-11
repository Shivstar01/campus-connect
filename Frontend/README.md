# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.





BACKENDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD


📸 CampusConnect - Architecture Snapshot (End of Phase 2: The Server Bridge)
Current Status: Full-Stack connection achieved. The React frontend successfully sends data to the Node backend via fetch(), and the Kitchen dashboard polls the server for live updates. Data is currently stored in server RAM (volatile).
Tech Stack: React (Vite), Tailwind CSS v4, Node.js, Express.js, CORS (NEW).

Core File Structure & Logic:

backend/server.js (NEW): * Configured Express server on Port 5000.

Added CORS middleware to accept cross-origin requests from React.

Created POST /api/orders to receive and store incoming carts.

Created GET /api/orders to send live data back to the frontend.

src/Checkout.jsx: Upgraded to an async function. Packages the cart state into a JSON object and fires a POST request to the Express server.

src/Orders.jsx: Upgraded to fetch live data from the server using useEffect. Implemented a 5-second polling interval (setInterval) to automatically pull new incoming orders without refreshing.

src/Home.jsx: Built a premium, mobile-first splash screen with a full-screen gradient and CTA to navigate to the menu.