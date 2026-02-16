import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaPlus, FaMinus, FaTicketAlt, FaShoppingBag } from "react-icons/fa";
import "./css/FoodOrdering.css";

// --- MOCK DATA ---
const HAS_ACTIVE_BOOKING = true;
const USER_SEAT = "B4";
const MOVIE_NAME = "Chennai Express";

// ⚠️ REPLACE THESE PATHS WITH YOUR ACTUAL IMAGES LATER
const MENU_ITEMS = [
  { id: 1, name: "Salted Popcorn", price: 250, category: "Popcorn", img: "/saltedpopcorn.png" },
  { id: 2, name: "Caramel Popcorn", price: 300, category: "Popcorn", img: "/caramelpopcorn.png" },
  { id: 3, name: "Cheese Popcorn", price: 280, category: "Popcorn", img: "/caramelpopcorn.png" },
  { id: 4, name: "Coca Cola", price: 150, category: "Drinks", img: "/pepsi.png" },
  { id: 5, name: "Iced Tea", price: 180, category: "Drinks", img: "/icetea.png" },
  { id: 6, name: "Nachos Combo", price: 450, category: "Combos", img: "/nachos.png" },
  { id: 7, name: "Burger Combo", price: 500, category: "Combos", img: "/burger.png" },
];

const CATEGORIES = ["All", "Popcorn", "Drinks", "Combos"];

const FoodOrdering = () => {
  const [cart, setCart] = useState({});
  const [activeCategory, setActiveCategory] = useState("All");

  // Filter Items based on category
  const filteredItems = activeCategory === "All" 
    ? MENU_ITEMS 
    : MENU_ITEMS.filter(item => item.category === activeCategory);

  // --- CART LOGIC ---
  const addToCart = (item) => {
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeFromCart = (item) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[item.id] > 1) newCart[item.id] -= 1;
      else delete newCart[item.id];
      return newCart;
    });
  };

  const totalItems = Object.values(cart).reduce((a, b) => a + b, 0);
  const totalAmount = Object.keys(cart).reduce((sum, id) => {
    const item = MENU_ITEMS.find((i) => i.id === parseInt(id));
    return sum + item.price * cart[id];
  }, 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (!HAS_ACTIVE_BOOKING) return <div className="no-booking"><h2>No Active Ticket</h2></div>;

  return (
    <div className="food-page">
      <motion.div 
        className="food-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-text">
          <h1>Ordering for <span>{MOVIE_NAME}</span></h1>
          <p>Delivering to Seat <span className="seat-badge">{USER_SEAT}</span></p>
        </div>
      </motion.div>

      {/* CATEGORY TABS */}
      <div className="category-tabs">
        {CATEGORIES.map(cat => (
          <button 
            key={cat} 
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* MENU GRID */}
      <motion.div 
        className="menu-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory} // Triggers re-animation on category change
      >
        {filteredItems.map((item) => {
          const quantity = cart[item.id] || 0;
          return (
            <motion.div 
              key={item.id} 
              className="food-card"
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
            >
              <div className="img-container">
                {/* Fallback image if file not found */}
                <img 
                  src={item.img} 
                  alt={item.name} 
                  onError={(e) => e.target.src = "https://via.placeholder.com/150?text=Yummy"} 
                />
              </div>
              
              <div className="food-info">
                <div className="info-top">
                  <h3>{item.name}</h3>
                  <span className="price">₹{item.price}</span>
                </div>
                
                <div className="action-row">
                  {quantity === 0 ? (
                    <motion.button 
                      className="add-btn" 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => addToCart(item)}
                    >
                      ADD <FaPlus />
                    </motion.button>
                  ) : (
                    <div className="counter-pill">
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => removeFromCart(item)}>
                        <FaMinus />
                      </motion.button>
                      <span>{quantity}</span>
                      <motion.button whileTap={{ scale: 0.8 }} onClick={() => addToCart(item)}>
                        <FaPlus />
                      </motion.button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* FLOATING CHECKOUT BAR */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div 
            className="cart-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="cart-left">
              <div className="icon-circle"><FaShoppingBag /></div>
              <div className="cart-text">
                <span className="count">{totalItems} Items</span>
                <span className="total">Total: ₹{totalAmount}</span>
              </div>
            </div>
            <motion.button 
              className="pay-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => alert("Redirecting to Payment Gateway...")}
            >
              Proceed to Pay
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodOrdering;