📸 CampusConnect - Architecture Snapshot (Milestone 2)
Current Status: Full Order Lifecycle Complete (Menu -> Cart -> Checkout -> Global Vault -> Kitchen Screen).
Tech Stack: React (Vite), React Router, Context API.

Core File Structure & Logic:

main.jsx: The entry point. Wraps the <App /> inside <BrowserRouter> (for routing) and <CartProvider> (for global state).

App.jsx: The Map. Contains the <Routes>:

/ renders <Menu />

/cart renders <Cart />

/checkout renders <Checkout />

/orders renders <Orders /> (NEW)

CartContext.jsx: The Global Brain.

State: cart (array of current items), orders (array of finished order receipts) (NEW).

Functions: addToCart, clearCart, addOrder (NEW).

Menu.jsx: The Home Page.

Displays foodItems. Uses addToCart.

Contains a <Link to="/orders"> to navigate to the Kitchen without breaking React's memory. (NEW)

Cart.jsx: The Cart Page.

Displays cart items and total price. Uses <Link to="/checkout">.

Checkout.jsx: The Order Form.

Controlled inputs (name, room).

On Submit: Calculates the cart total, bundles a newOrder object (name, room, items, total), triggers addOrder(newOrder) to save to the vault, triggers clearCart(), and uses useNavigate('/') to send the user home. (UPDATED)

Orders.jsx: The Kitchen Screen. (NEW)

Reads the orders array from Context.

Conditionally renders a "Kitchen empty" message OR maps through the vault to display individual order cards.













📸 CampusConnect - Architecture Snapshot (End of Phase 1: UI Polish)
Current Status: MVP UI Complete. Full Order Lifecycle is functioning and fully styled with a modern, mobile-first design (Blinkit/Zepto aesthetic). Data is currently volatile (lost on page refresh).
Tech Stack: React (Vite), React Router, Context API, Tailwind CSS v4 (NEW).

Core File Structure & Logic:

vite.config.js & src/index.css: Updated to run the new Tailwind CSS v4 Vite plugin (@tailwindcss/vite) and @import "tailwindcss";.

main.jsx: The entry point. Wraps the <App /> inside <BrowserRouter> and <CartProvider>.

App.jsx: The Map. Contains the routing logic (/, /cart, /checkout, /orders).

CartContext.jsx: The Global Brain.

State: cart (current items), orders (finished receipts).

Pending: Needs localStorage integration to prevent data loss on refresh.

Menu.jsx: The Home Page.

UI: 2-column mobile grid, floating header, interactive "ADD +" buttons with scale effects.

Cart.jsx: The Cart Page.

UI: Custom Empty State (🛒 emoji, browse button). Clean item list with dynamic total calculation and a prominent checkout CTA.

Checkout.jsx: The Order Form.

Logic: Defensive programming added (redirects to Home if cart is empty). Validates inputs before placing an order.

UI: Order summary card, floating focus rings on input fields (focus:ring-orange-200).

Orders.jsx: The Kitchen Dashboard.

UI: Custom Empty State (🍳 emoji). Live order cards feature decorative side borders, dynamic ID generation (starting at #101), and "New Order" status badges.