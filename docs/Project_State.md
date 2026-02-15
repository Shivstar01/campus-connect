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