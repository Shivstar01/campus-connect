📸 CampusConnect - Architecture Snapshot (Milestone 1)
Current Status: Core Order Flow Complete (Menu -> Cart -> Checkout -> Home).
Tech Stack: React (Vite), React Router, Context API.

Core File Structure & Logic:

main.jsx: The entry point. Wraps the entire <App /> inside <BrowserRouter> (for routing) and <CartProvider> (for global state).

App.jsx: The Map. Contains the <Routes>:

/ renders <Menu />

/cart renders <Cart />

/checkout renders <Checkout />

CartContext.jsx: The Global Brain.

State: const [cart, setCart] = useState([])

Functions: addToCart, removeFromCart, clearCart.

Provider: Exports these tools to any component that uses useContext.

Menu.jsx: The Home Page.

Uses useState to hold a static array of foodItems (e.g., Veg Momos, Biryani).

Maps over the array to display items.

Uses addToCart from Context to add items when the button is clicked.

Cart.jsx: The Cart Page.

Reads cart from Context.

Calculates total price.

Uses <Link to="/checkout"> to navigate to the checkout form without refreshing the page.

Checkout.jsx: The Order Form.

Uses useState for controlled inputs (name, room).

Reads cart and clearCart from Context.

On submit: Validates inputs, triggers clearCart(), and uses useNavigate('/') to send the user back to the Menu.