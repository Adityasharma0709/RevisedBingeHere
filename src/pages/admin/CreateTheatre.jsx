import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Clapperboard,
  KeyRound,
  LogOut,
  Mail,
  MapPin,
  Phone,
  Plus,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";
import Loader from "../../components/Common/Loader.jsx";
import { registerUser } from "../../services/auth.services";
import { createTheatre } from "../../services/theatre.services";
import "./AdminShell.css";

const parseStoredUser = () => {
  try {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  } catch {
    return null;
  }
};

const buildInitialForm = () => ({
  name: "",
  city: "",
  state: "",
  address: "",
  ownerName: "",
  ownerEmail: "",
  ownerPhone: "",
  ownerPassword: "",
});

const CreateTheatre = () => {
  const navigate = useNavigate();
  const [currentUser] = useState(() => parseStoredUser());
  const [formData, setFormData] = useState(() => buildInitialForm());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState({ type: "idle", message: "" });

  useEffect(() => {
    document.title = "BingeHere | Create Theatre";
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!currentUser?._id) {
      setStatus({
        type: "error",
        message: "Your user session is missing. Please log in again.",
      });
      return;
    }

    if (
      !formData.name.trim() ||
      !formData.city.trim() ||
      !formData.state.trim() ||
      !formData.address.trim() ||
      !formData.ownerName.trim() ||
      !formData.ownerEmail.trim() ||
      !formData.ownerPhone.trim() ||
      !formData.ownerPassword.trim()
    ) {
      setStatus({
        type: "error",
        message: "Please complete both the theatre and owner details.",
      });
      return;
    }

    let createdOwnerEmail = "";
    let createdTheatreName = "";

    try {
      setIsSubmitting(true);

      const ownerPayload = {
        name: formData.ownerName.trim(),
        email: formData.ownerEmail.trim(),
        phone: formData.ownerPhone.trim(),
        password: formData.ownerPassword,
        role: "owner",
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
        },
      };

      createdOwnerEmail = ownerPayload.email;

      const ownerResponse = await registerUser(ownerPayload);
      const ownerId =
        ownerResponse?.user?._id ??
        ownerResponse?.user?.id ??
        ownerResponse?.userId;

      if (!ownerId) {
        throw new Error("Owner was created but no owner id was returned.");
      }

      const theatrePayload = {
        name: formData.name.trim(),
        owner: ownerId,
        location: {
          city: formData.city.trim(),
          state: formData.state.trim(),
          address: formData.address.trim(),
        },
      };

      const createdTheatre = await createTheatre({
        theatreData: theatrePayload,
        userId: currentUser._id,
      });

      createdTheatreName = createdTheatre.name;

      setFormData(buildInitialForm());
      setStatus({
        type: "success",
        message: `"${createdTheatre.name}" was created and assigned to owner ${createdOwnerEmail}.`,
      });
    } catch (error) {
      const errorMessage = error.message || "Theatre creation failed.";

      setStatus({
        type: "error",
        message: createdTheatreName
          ? `${errorMessage} The theatre "${createdTheatreName}" was created.`
          : errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/auth");
  };

  return (
    <div className="admin-shell">
      <Loader isLoading={isSubmitting} />

      <nav className="admin-nav">
        <div className="nav-left">
          <Link to="/" className="logo" aria-label="Go to landing page">
            BingeHere <span>Admin</span>
          </Link>
        </div>
        <div className="admin-nav-right">
          <div className="admin-user-info">
            <Users size={18} /> {currentUser?.name || "Admin"}
          </div>
          <button
            type="button"
            className="admin-logout-icon-btn"
            onClick={handleLogout}
            aria-label="Logout"
          >
            <LogOut size={18} />
          </button>
        </div>
      </nav>

      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-brand">
            <Building2 className="admin-brand-icon" size={40} />
            <div>
              <h1>Create Theatre</h1>
              <div className="admin-meta">
                <Plus size={14} /> Add a new venue and create its owner
              </div>
            </div>
          </div>

          <div className="admin-actions">
            <Link to="/admin" className="action-btn secondary">
              <ShieldCheck size={18} /> Dashboard
            </Link>
            <Link to="/admin/add-movie" className="action-btn secondary">
              <Clapperboard size={18} /> Add Movie
            </Link>
          </div>
        </header>

        {status.message ? (
          <div
            className={`admin-banner ${
              status.type === "success" ? "success" : "error"
            }`}
          >
            {status.message}
          </div>
        ) : null}

        <section className="content-card">
          <div className="card-header">
            <h2>Theatre Setup</h2>
            <span className="text-btn" aria-hidden="true">
              Admin
            </span>
          </div>

          <form onSubmit={handleSubmit} className="admin-form">
            <div className="form-grid">
              <div className="form-section">
                <p className="title">Theatre Details</p>
                <p className="subtitle">
                  This information creates the theatre location and venue
                  profile.
                </p>
              </div>

              <div className="form-group full-width">
                <label>
                  <Building2 size={14} /> Theatre Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="BingeHere Grand Arena"
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={14} /> City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="Pune"
                />
              </div>

              <div className="form-group">
                <label>
                  <MapPin size={14} /> State
                </label>
                <input
                  type="text"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="Maharashtra"
                />
              </div>

              <div className="form-group full-width">
                <label>
                  <MapPin size={14} /> Full Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Plot 9, MG Road, Near Riverside Plaza"
                  rows={5}
                />
              </div>

              <div className="form-section">
                <p className="title">Owner Account</p>
                <p className="subtitle">
                  These details will create a new user with role `owner`.
                </p>
              </div>

              <div className="form-group full-width">
                <label>
                  <UserRound size={14} /> Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  placeholder="Owner full name"
                />
              </div>

              <div className="form-group">
                <label>
                  <Mail size={14} /> Owner Email
                </label>
                <input
                  type="email"
                  name="ownerEmail"
                  value={formData.ownerEmail}
                  onChange={handleChange}
                  placeholder="owner@theatre.com"
                />
              </div>

              <div className="form-group">
                <label>
                  <Phone size={14} /> Owner Phone
                </label>
                <input
                  type="text"
                  name="ownerPhone"
                  value={formData.ownerPhone}
                  onChange={handleChange}
                  placeholder="Owner phone number"
                />
              </div>

              <div className="form-group full-width">
                <label>
                  <KeyRound size={14} /> Temporary Password
                </label>
                <input
                  type="password"
                  name="ownerPassword"
                  value={formData.ownerPassword}
                  onChange={handleChange}
                  placeholder="Temporary owner password"
                />
              </div>
            </div>

            <div className="form-footer">
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
              >
                <Plus size={18} />
                {isSubmitting
                  ? "Creating owner and theatre..."
                  : "Create Owner + Theatre"}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
};

export default CreateTheatre;
