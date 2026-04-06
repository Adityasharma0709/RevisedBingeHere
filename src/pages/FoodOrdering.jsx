import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import "./css/FoodOrdering.css";

const MENU_ITEMS = [
  {
    id: 1,
    name: "Salted Popcorn",
    price: 250,
    category: "Popcorn",
    img: "/saltedpopcorn.png",
  },
  {
    id: 2,
    name: "Caramel Popcorn",
    price: 300,
    category: "Popcorn",
    img: "/caramelpopcorn.png",
  },
  {
    id: 3,
    name: "Cheese Popcorn",
    price: 280,
    category: "Popcorn",
    img: "/caramelpopcorn.png",
  },
  { id: 4, name: "Coca Cola", price: 150, category: "Drinks", img: "/pepsi.png" },
  { id: 5, name: "Iced Tea", price: 180, category: "Drinks", img: "/icetea.png" },
  { id: 6, name: "Nachos Combo", price: 450, category: "Combos", img: "/nachos.png" },
  { id: 7, name: "Burger Combo", price: 500, category: "Combos", img: "/burger.png" },
];

const CATEGORIES = ["All", "Popcorn", "Drinks", "Combos"];

const FoodOrdering = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const [cart, setCart] = useState(() => state?.foodOrder?.cart || {});
  const [activeCategory, setActiveCategory] = useState("All");
  const selectedSeats = state?.selectedSeats || [];
  const seatLabel = selectedSeats.length > 0 ? selectedSeats.join(", ") : "your selected seat";
  const movieName = state?.movie || "your movie";
  const hasActiveBooking = Boolean(state?.movie);

  const filteredItems =
    activeCategory === "All"
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => item.category === activeCategory);

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
    const item = MENU_ITEMS.find((i) => i.id === parseInt(id, 10));
    return sum + item.price * cart[id];
  }, 0);

  const handleAddToCart = () => {
    const items = Object.entries(cart)
      .map(([id, quantity]) => {
        const menuItem = MENU_ITEMS.find((item) => item.id === parseInt(id, 10));
        if (!menuItem) return null;
        return {
          id: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          total: menuItem.price * quantity,
        };
      })
      .filter(Boolean);

    const foodOrder = { cart, items, totalItems, totalAmount };
    localStorage.setItem("foodOrder", JSON.stringify(foodOrder));

    navigate("/seats", {
      state: {
        ...state,
        foodOrder,
      },
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 },
  };

  if (!hasActiveBooking) {
    return (
      <div className="no-booking">
        <h2>No Active Ticket</h2>
      </div>
    );
  }

  return (
    <div className="food-page">
      <nav className="food-topbar">
        <div className="food-topbar-brand" onClick={() => navigate("/")}>
          <span className="food-topbar-binge">Binge</span>
          <span className="food-topbar-here">Here</span>
        </div>
      </nav>

      <motion.div
        className="food-header"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <div className="header-text">
          <h1>
            Ordering for <span>{movieName}</span>
          </h1>
          <p>
            Delivering to Seat <span className="seat-badge">{seatLabel}</span> for{" "}
            <span>{movieName}</span>
          </p>
        </div>
      </motion.div>

      <div className="category-tabs">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            className={`tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <motion.div
        className="menu-grid"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        key={activeCategory}
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
                <img
                  src={item.img}
                  alt={item.name}
                  onError={(e) => {
                    e.target.src = "https://via.placeholder.com/150?text=Yummy";
                  }}
                />
              </div>

              <div className="food-info">
                <div className="info-top">
                  <h3>{item.name}</h3>
                  <span className="price">INR {item.price}</span>
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
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => removeFromCart(item)}
                      >
                        <FaMinus />
                      </motion.button>
                      <span>{quantity}</span>
                      <motion.button
                        whileTap={{ scale: 0.8 }}
                        onClick={() => addToCart(item)}
                      >
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

      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            className="cart-bar"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
          >
            <div className="cart-left">
              <div className="icon-circle">
                <FaShoppingBag />
              </div>
              <div className="cart-text">
                <span className="count">{totalItems} Items</span>
                <span className="total">Total: INR {totalAmount}</span>
              </div>
            </div>
            <motion.button
              className="pay-btn"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAddToCart}
            >
              Add to Cart
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FoodOrdering;
