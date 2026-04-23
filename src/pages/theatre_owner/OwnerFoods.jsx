import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  Image,
  IndianRupee,
  Leaf,
  Plus,
  Save,
  Tags,
  Utensils,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import Loader from "../../components/Common/Loader.jsx";
import { getTheatresByOwner } from "../../services/theatre.services";
import { createFood, getFoods } from "../../services/food.service";
import "./OwnerFoods.css";

const CATEGORIES = ["Popcorn", "Drinks", "Combos", "Snacks", "Desserts"];
const SPICE_LEVELS = ["mild", "medium", "hot"];

const initialForm = {
  name: "",
  description: "",
  category: "Popcorn",
  price: "",
  imageUrl: "",
  imagePreview: "",
  imageAlt: "",
  calories: "",
  serves: "",
  spiceLevel: "mild",
  isVeg: true,
  isFeatured: false,
  tags: "",
};

const getPrimaryImage = (food) => {
  const primary =
    food.images?.find((image) => image.isPrimary) || food.images?.[0];
  return primary?.url || "/popcorn.png";
};

const OwnerFoods = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [theatre, setTheatre] = useState(null);
  const [foods, setFoods] = useState([]);
  const [formData, setFormData] = useState(initialForm);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/auth");
      return;
    }

    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    loadOwnerFoodData(parsedUser._id);
  }, [navigate]);

  const loadOwnerFoodData = async (userId) => {
    try {
      setIsLoading(true);
      const theatreData = await getTheatresByOwner(userId);
      const ownerTheatre = Array.isArray(theatreData)
        ? theatreData[0]
        : theatreData;

      if (!ownerTheatre?._id) {
        setTheatre(null);
        setFoods([]);
        return;
      }

      setTheatre(ownerTheatre);
      const foodData = await getFoods({ theatreId: ownerTheatre._id });
      setFoods(Array.isArray(foodData) ? foodData : []);
    } catch (error) {
      toast.error(error.message || "Failed to load food data");
    } finally {
      setIsLoading(false);
    }
  };

  const featuredCount = useMemo(
    () => foods.filter((food) => food.isFeatured).length,
    [foods],
  );

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.type !== "image/png") {
        toast.error("Please select a PNG image file");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData((current) => ({
          ...current,
          imageUrl: e.target.result, // Store the data URL
          imagePreview: e.target.result, // Store for preview
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!theatre?._id) {
      toast.error("No theatre assigned to this owner account");
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.price ||
      !formData.imagePreview.trim()
    ) {
      toast.error("Name, price, and image are required");
      return;
    }

    const foodData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      price: Number(formData.price),
      theatre: theatre._id,
      images: [
        {
          url: formData.imageUrl.trim(),
          alt: formData.imageAlt.trim() || formData.name.trim(),
          isPrimary: true,
        },
      ],
      nutrition: {
        calories: formData.calories ? Number(formData.calories) : undefined,
        serves: formData.serves.trim(),
        spiceLevel: formData.spiceLevel,
        isVeg: formData.isVeg,
      },
      isAvailable: true,
      isFeatured: formData.isFeatured,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    };

    try {
      setIsSubmitting(true);
      const createdFood = await createFood({ foodData, userId: user._id });
      setFoods((currentFoods) => [createdFood, ...currentFoods]);
      setFormData(initialForm);
      toast.success("Food item added to your theatre menu");
    } catch (error) {
      toast.error(error.message || "Failed to add food item");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader isLoading={true} />;

  if (!theatre) {
    return (
      <div className="owner-foods-empty">
        <Building2 size={56} />
        <h2>No Theatre Assigned</h2>
        <p>You need an assigned theatre before adding food items.</p>
        <button onClick={() => navigate("/owner/dashboard")}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="owner-foods-page">
      <nav className="owner-foods-topbar">
        <button
          className="owner-foods-back"
          onClick={() => navigate("/owner/dashboard")}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
        <div className="owner-foods-brand">
          BingeHere <span>Foods</span>
        </div>
      </nav>

      <motion.header
        className="owner-foods-hero"
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div>
          <p className="eyebrow">Theatre Owner Menu</p>
          <h1>
            Add food items for <span>{theatre.name}</span>
          </h1>
          <p className="hero-copy">
            Create snacks, drinks, combos, and desserts that customers can
            attach to their booking.
          </p>
        </div>
        <div className="owner-foods-stats">
          <div>
            <strong>{foods.length}</strong>
            <span>Total items</span>
          </div>
          <div>
            <strong>{featuredCount}</strong>
            <span>Featured</span>
          </div>
        </div>
      </motion.header>

      <main className="owner-foods-layout">
        <motion.section
          className="owner-foods-form-card"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="section-title">
            <Plus size={22} />
            <div>
              <h2>New Food Item</h2>
              <p>Required fields are name, category, price, and image.</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="owner-food-form">
            <div className="form-group full-width">
              <label>
                <Utensils size={14} /> Item Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Masala Popcorn"
              />
            </div>

            <div className="form-group full-width">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Short menu description"
                rows="3"
              />
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label>
                  <Tags size={14} /> Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                >
                  {CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>
                  <IndianRupee size={14} /> Price
                </label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="form-group full-width">
              <label>
                <Image size={14} /> Food Image (PNG)
              </label>
              <input
                type="file"
                accept=".png"
                onChange={handleImageChange}
                className="file-input"
              />
              {formData.imagePreview && (
                <div className="image-preview">
                  <div className="image-container">
                    <img
                      src={formData.imagePreview}
                      alt="Food preview"
                      style={{
                        maxWidth: "100px",
                        maxHeight: "100px",
                        marginTop: "8px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFormData((current) => ({
                          ...current,
                          imageUrl: "",
                          imagePreview: "",
                        }))
                      }
                      className="remove-image-cross"
                      title="Remove image"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label>Serves</label>
                <input
                  name="serves"
                  value={formData.serves}
                  onChange={handleChange}
                  placeholder="1 tub / 500 ml"
                />
              </div>

              <div className="form-group">
                <label>Calories</label>
                <input
                  name="calories"
                  type="number"
                  min="0"
                  value={formData.calories}
                  onChange={handleChange}
                  placeholder="420"
                />
              </div>
            </div>

            <div className="form-grid-two">
              <div className="form-group">
                <label>Spice Level</label>
                <select
                  name="spiceLevel"
                  value={formData.spiceLevel}
                  onChange={handleChange}
                >
                  {SPICE_LEVELS.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tags</label>
                <input
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="combo, spicy, bestseller"
                />
              </div>
            </div>

            <div className="toggle-row">
              <label>
                <input
                  type="checkbox"
                  name="isVeg"
                  checked={formData.isVeg}
                  onChange={handleChange}
                />
                <Leaf size={16} /> Vegetarian
              </label>
              <label>
                <input
                  type="checkbox"
                  name="isFeatured"
                  checked={formData.isFeatured}
                  onChange={handleChange}
                />
                Featured item
              </label>
            </div>

            <button
              className="owner-food-submit"
              type="submit"
              disabled={isSubmitting}
            >
              <Save size={18} /> {isSubmitting ? "Adding..." : "Add Food Item"}
            </button>
          </form>
        </motion.section>

        <motion.section
          className="owner-foods-preview"
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="section-title compact">
            <Utensils size={22} />
            <div>
              <h2>Current Menu</h2>
              <p>Food already linked to this theatre.</p>
            </div>
          </div>

          <div className="owner-food-list">
            {foods.length === 0 ? (
              <div className="owner-food-empty-list">
                No food items added yet.
              </div>
            ) : (
              foods.map((food) => (
                <motion.article
                  className="owner-food-card"
                  key={food._id}
                  whileHover={{ y: -4 }}
                >
                  <img src={getPrimaryImage(food)} alt={food.name} />
                  <div>
                    <div className="food-card-topline">
                      <h3>{food.name}</h3>
                      <span>INR {food.price}</span>
                    </div>
                    <p>{food.description || "No description added."}</p>
                    <div className="food-chip-row">
                      <span>{food.category}</span>
                      {food.nutrition?.isVeg && <span>Veg</span>}
                      {food.isFeatured && <span>Featured</span>}
                    </div>
                  </div>
                </motion.article>
              ))
            )}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default OwnerFoods;
