import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaShoppingBag } from "react-icons/fa";
import { getFoods } from "../services/food.service";
import "./css/FoodOrdering.css";

const getPrimaryImage = (food) => {
  const primary =
    food.images?.find((image) => image.isPrimary) || food.images?.[0];
  return primary?.url || "/popcorn.png";
};

const normalizeFood = (food) => ({
  id: food._id || food.id,
  food_id: food._id || food.id,
  name: food.name,
  price: Number(food.price) || 0,
  category: food.category || "Other",
  description: food.description || "",
  img: getPrimaryImage(food),
});

const FoodOrdering = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const theatreId = state?.theatreId;

  const [cart, setCart] = useState(() =>
    state?.foodOrder?.theatreId === theatreId ? state.foodOrder.cart : {},
  );
  const [menuItems, setMenuItems] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const selectedSeats = state?.selectedSeats || [];
  const seatLabel = selectedSeats.length > 0 ? selectedSeats.join(", ") : "your selected seat";
  const movieName = state?.movie || "your movie";
  const hasActiveBooking = Boolean(state?.movie);

  useEffect(() => {
    const loadTheatreFoods = async () => {
      if (!theatreId) {
        setMenuItems([]);
        setIsLoading(false);
        setLoadError("Theatre details were not found for this booking.");
        return;
      }

      try {
        setIsLoading(true);
        setLoadError("");
        const foods = await getFoods({ theatreId, available: true });
        setMenuItems(Array.isArray(foods) ? foods.map(normalizeFood) : []);
      } catch (error) {
        setLoadError(error.message || "Failed to load food menu.");
      } finally {
        setIsLoading(false);
      }
    };

    loadTheatreFoods();
  }, [theatreId]);

  const categories = useMemo(
    () => ["All", ...new Set(menuItems.map((item) => item.category).filter(Boolean))],
    [menuItems],
  );

  useEffect(() => {
    if (!categories.includes(activeCategory)) {
      setActiveCategory("All");
    }
  }, [activeCategory, categories]);

  useEffect(() => {
    if (isLoading || menuItems.length === 0) return;

    const validIds = new Set(menuItems.map((item) => item.id));
    setCart((current) =>
      Object.fromEntries(
        Object.entries(current).filter(([id]) => validIds.has(id)),
      ),
    );
  }, [isLoading, menuItems]);

  const filteredItems =
    activeCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === activeCategory);

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

  const cartEntries = Object.entries(cart)
    .map(([id, quantity]) => ({
      item: menuItems.find((menuItem) => menuItem.id === id),
      quantity,
    }))
    .filter(({ item }) => Boolean(item));
  const totalItems = cartEntries.reduce((sum, entry) => sum + entry.quantity, 0);
  const totalAmount = cartEntries.reduce(
    (sum, entry) => sum + entry.item.price * entry.quantity,
    0,
  );

  const handleAddToCart = () => {
    const items = cartEntries.map(({ item: menuItem, quantity }) => {
        return {
          id: menuItem.id,
          food_id: menuItem.food_id,
          name: menuItem.name,
          price: menuItem.price,
          quantity,
          total: menuItem.price * quantity,
        };
      });

    const foodOrder = { theatreId, cart, items, totalItems, totalAmount };
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
        {categories.map((cat) => (
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
        {isLoading && (
          <div className="food-empty-state">Loading food menu...</div>
        )}

        {!isLoading && (loadError || filteredItems.length === 0) && (
          <div className="food-empty-state">
            {loadError || "No food items are available for this theatre."}
          </div>
        )}

        {!isLoading && !loadError && filteredItems.map((item) => {
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
