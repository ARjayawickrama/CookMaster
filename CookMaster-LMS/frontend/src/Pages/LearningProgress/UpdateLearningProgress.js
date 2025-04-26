import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../../Components/SideBar/SideBar";
import { FaUtensils, FaCalendarAlt, FaPercent } from "react-icons/fa";

function UpdateLearningProgress() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    skillTitle: "",
    description: "",
    field: "",
    startDate: "",
    endDate: "",
    level: "",
    postOwnerID: "",
    postOwnerName: "",
  });

  useEffect(() => {
    fetch(`http://localhost:8080/learningProgress/${id}`)
      .then((response) => response.json())
      .then((data) => setFormData(data))
      .catch((error) => console.error("Error fetching recipe data:", error));
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/learningProgress/${id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
      if (response.ok) {
        alert("Recipe updated successfully!");
        window.location.href = "/allLearningProgress";
      } else {
        alert("Failed to update recipe.");
      }
    } catch (error) {
      console.error("Error updating recipe:", error);
    }
  };

  return (
    <div style={{ backgroundColor: "#fff9f2", minHeight: "100vh" }}>
      <div style={{ display: "flex", fontFamily: "'Poppins', sans-serif" }}>
        <div>
          <SideBar />
        </div>

        <div
          style={{
            flex: 1,
            padding: "2rem",
            marginLeft: "290px",
            marginTop: "80px",
          }}
        >
          <div
            style={{
              maxWidth: "700px",
              margin: "0 auto",
              backgroundColor: "white",
              borderRadius: "15px",
              padding: "2rem",
              boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
              borderTop: "5px solid #ff9a3c",
            }}
          >
            <h1
              style={{
                color: "#e67e22",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaUtensils style={{ color: "#ff7733" }} />
              Update Recipe Progress
            </h1>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#e67e22",
                  }}
                >
                  Recipe Name
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    transition: "border 0.3s ease",
                    ":focus": {
                      outline: "none",
                      borderColor: "#ff9a3c",
                      boxShadow: "0 0 0 2px rgba(255, 154, 60, 0.2)",
                    },
                  }}
                  name="skillTitle"
                  placeholder="e.g. Spaghetti Carbonara"
                  value={formData.skillTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#e67e22",
                  }}
                >
                  Cooking Notes
                </label>
                <textarea
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    minHeight: "120px",
                    transition: "border 0.3s ease",
                    ":focus": {
                      outline: "none",
                      borderColor: "#ff9a3c",
                      boxShadow: "0 0 0 2px rgba(255, 154, 60, 0.2)",
                    },
                  }}
                  name="description"
                  placeholder="Describe your cooking process, ingredients, and tips..."
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div style={{ marginBottom: "1.5rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#e67e22",
                  }}
                >
                  Cuisine Type
                </label>
                <select
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    appearance: "none",
                    backgroundImage:
                      'url(\'data:image/svg+xml;charset=US-ASCII,<svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path d="M5 8l5 5 5-5z" fill="%23e67e22"/></svg>\')',
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.8rem center",
                    backgroundSize: "16px",
                    transition: "border 0.3s ease",
                  }}
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select Cuisine Type
                  </option>
                  <option value="Italian">Italian</option>
                  <option value="Chinese">Chinese</option>
                  <option value="Indian">Indian</option>
                  <option value="Mexican">Mexican</option>
                  <option value="Japanese">Japanese</option>
                  <option value="French">French</option>
                  <option value="Thai">Thai</option>
                  <option value="American">American</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  marginBottom: "1.5rem",
                }}
              >
                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#e67e22",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FaCalendarAlt /> First Attempt
                  </label>
                  <input
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                      transition: "border 0.3s ease",
                    }}
                    name="startDate"
                    type="date"
                    value={formData.startDate}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontWeight: "600",
                      color: "#e67e22",
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <FaCalendarAlt /> Last Attempt
                  </label>
                  <input
                    style={{
                      width: "100%",
                      padding: "0.8rem",
                      borderRadius: "8px",
                      border: "1px solid #ddd",
                      fontSize: "1rem",
                      transition: "border 0.3s ease",
                    }}
                    name="endDate"
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      if (new Date(value) < new Date(formData.startDate)) {
                        alert(
                          "Last attempt date cannot be earlier than first attempt date."
                        );
                        return;
                      }
                      handleChange(e);
                    }}
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: "2rem" }}>
                <label
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#e67e22",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <FaPercent /> Mastery Level
                </label>
                <input
                  type="number"
                  style={{
                    width: "100%",
                    padding: "0.8rem",
                    borderRadius: "8px",
                    border: "1px solid #ddd",
                    fontSize: "1rem",
                    transition: "border 0.3s ease",
                  }}
                  name="level"
                  placeholder="0-100"
                  value={formData.level}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (value < 0 || value > 100) {
                      alert("Mastery level must be between 0 and 100.");
                      return;
                    }
                    handleChange(e);
                  }}
                  required
                />
                <div
                  style={{
                    height: "8px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    marginTop: "0.5rem",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      height: "100%",
                      width: `${formData.level}%`,
                      background: "linear-gradient(90deg, #a1c4fd, #4a6fa5)",
                      borderRadius: "4px",
                    }}
                  ></div>
                </div>
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#ff7733",
                  color: "white",
                  border: "none",
                  padding: "0.8rem 1.8rem",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "1rem",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  boxShadow: "0 3px 8px rgba(230, 126, 34, 0.4)",
                  width: "100%",
                  ":hover": {
                    backgroundColor: "#e65c00",
                    transform: "translateY(-2px)",
                  },
                }}
              >
                Update Recipe
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UpdateLearningProgress;
