import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Layout,
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import {
  getTheatresByOwner,
  createScreen,
} from "../../services/theatre.services";
import Loader from "../../components/Common/Loader.jsx";
import toast from "react-hot-toast";
import "./ManageScreens.css";

const ManageScreens = () => {
  const navigate = useNavigate();
  const [theatre, setTheatre] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [user, setUser] = useState(null);

  const [screenName, setScreenName] = useState("");
  const [rows, setRows] = useState([{ row: "A", seats: 10 }]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      fetchTheatre(parsedUser._id);
    } else {
      navigate("/auth");
    }
  }, [navigate]);

  const fetchTheatre = async (userId) => {
    try {
      setIsLoading(true);
      const data = await getTheatresByOwner(userId);
      if (Array.isArray(data) && data.length > 0) {
        setTheatre(data[0]);
      } else if (data && !Array.isArray(data)) {
        setTheatre(data);
      }
    } catch (error) {
      toast.error("Failed to fetch theatre data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddRow = () => {
    const nextLabel = String.fromCharCode(65 + rows.length);
    setRows([...rows, { row: nextLabel, seats: 10 }]);
  };

  const handleRemoveRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleRowChange = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = field === "seats" ? parseInt(value) || 0 : value;
    setRows(newRows);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!screenName.trim()) {
      toast.error("Please enter a screen name");
      return;
    }

    const totalSeats = rows.reduce((acc, curr) => acc + curr.seats, 0);
    const screenData = {
      name: screenName,
      theatre: theatre._id,
      totalSeats,
      seatLayout: rows,
    };

    try {
      setIsSubmitting(true);
      console.log(screenData);
      await createScreen({ screenData, userId: user._id });
      toast.success("Screen created successfully!");
      setScreenName("");
      setRows([{ row: "A", seats: 10 }]);
      fetchTheatre(user._id); // Refresh data
    } catch (error) {
      toast.error(error.message || "Failed to create screen");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <Loader isLoading={true} />;

  return (
    <div className="manage-screens-page">
      <header className="page-header">
        <button
          className="back-btn"
          onClick={() => navigate("/owner/dashboard")}
        >
          <ArrowLeft size={18} /> Dashboard
        </button>
        <h1>Manage Screens</h1>
        <p>Define your theatre's seating architecture.</p>
      </header>

      <main className="screens-container">
        <div className="screens-grid">
          {/* Create Screen Form */}
          <section className="create-screen-section">
            <div className="card">
              <div className="card-header">
                <Plus size={20} className="text-amber" />
                <h2>Add New Screen</h2>
              </div>

              <form onSubmit={handleSubmit} className="screen-form">
                <div className="form-group">
                  <label>Screen Name</label>
                  <input
                    type="text"
                    value={screenName}
                    onChange={(e) => setScreenName(e.target.value)}
                    placeholder="e.g., Screen 1, Gold Class"
                    required
                  />
                </div>

                <div className="layout-builder">
                  <div className="builder-header">
                    <label>Seating Layout</label>
                    <button
                      type="button"
                      className="add-row-btn"
                      onClick={handleAddRow}
                    >
                      <Plus size={14} /> Add Row
                    </button>
                  </div>

                  <div className="rows-list">
                    {rows.map((row, idx) => (
                      <div key={idx} className="row-item">
                        <input
                          type="text"
                          value={row.row}
                          onChange={(e) =>
                            handleRowChange(
                              idx,
                              "row",
                              e.target.value.toUpperCase(),
                            )
                          }
                          placeholder="Row Label"
                          className="row-label-input"
                        />
                        <input
                          type="number"
                          value={row.seats}
                          onChange={(e) =>
                            handleRowChange(idx, "seats", e.target.value)
                          }
                          placeholder="Seats"
                        />
                        <button
                          type="button"
                          className="remove-row-btn"
                          onClick={() => handleRemoveRow(idx)}
                          disabled={rows.length === 1}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="layout-summary">
                    <span>
                      Total Seats:{" "}
                      <strong>
                        {rows.reduce(
                          (acc, curr) => acc + (parseInt(curr.seats) || 0),
                          0,
                        )}
                      </strong>
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isSubmitting}
                >
                  <Save size={18} />{" "}
                  {isSubmitting ? "Creating..." : "Save Screen"}
                </button>
              </form>
            </div>
          </section>

          {/* Existing Screens List */}
          <section className="existing-screens-section">
            <div className="card dark">
              <div className="card-header">
                <Layout size={20} className="text-rose" />
                <h2>Existing Screens</h2>
              </div>

              <div className="screens-list">
                {theatre?.screens?.length > 0 ? (
                  theatre.screens.map((screen, idx) => (
                    <div key={idx} className="screen-card">
                      <div className="screen-info">
                        <h3>{screen.name}</h3>
                        <p>{screen.totalSeats} Total Seats</p>
                      </div>
                      <div className="screen-badges">
                        <span className="badge active">ACTIVE</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-screens">
                    <AlertCircle size={40} />
                    <p>No screens configured yet.</p>
                  </div>
                )}
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ManageScreens;
