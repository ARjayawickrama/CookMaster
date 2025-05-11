import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import SideBar from "../../Components/SideBar/SideBar";
import "./AddLearningProgress.css"; // We'll create this CSS file

function AddLearningProgress() {
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
    const userId = localStorage.getItem("userID");
    if (userId) {
      setFormData((prevData) => ({ ...prevData, postOwnerID: userId }));
      fetch(`http://localhost:8080/user/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          if (data && data.fullname) {
            setFormData((prevData) => ({
              ...prevData,
              postOwnerName: data.fullname,
            }));
          }
        })
        .catch((error) => console.error("Error fetching user data:", error));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:8080/learningProgress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Learning Progress added successfully!");
        window.location.href = "/allLearningProgress";
      } else {
        alert("Failed to add Learning Progress.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="add-learning-progress-container">
      <SideBar />
      <div className="add-learning-progress-content">
        <div className="add-learning-progress-card">
          <div className="add-learning-progress-header">
            <IoMdAdd
              className="header-icon"
              style={{
                color: "#1877F2",
                fontSize: "28px",
                cursor: "pointer",
                marginLeft: "8px",
                transition: "all 0.3s ease-in-out",
                padding: "8px",
                borderRadius: "50%",
                boxShadow: "0 4px 15px rgba(0, 0, 0, 0.15)",
                backgroundColor: "rgba(24, 119, 242, 0.1)",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "40px",
                height: "40px",
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "scale(1.15)";
                e.target.style.backgroundColor = "rgba(24, 119, 242, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.backgroundColor = "rgba(24, 119, 242, 0.1)";
              }}
            />

            <h2>Add Learning Progress</h2>
            <p>Track your skill development journey</p>
          </div>

          <form onSubmit={handleSubmit} className="add-learning-progress-form">
            <div className="form-row">
              <div className="form-group">
                <label
                  htmlFor="skillTitle"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#1877F2",
                  }}
                >
                  Skill Title*
                </label>
                <input
                  type="text"
                  id="skillTitle"
                  name="skillTitle"
                  placeholder="Enter dish name (e.g., Lasagna)"
                  value={formData.skillTitle}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="field"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#1877F2",
                  }}
                >
                  Field*
                </label>
                <select
                  id="field"
                  name="field"
                  value={formData.field}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>
                    Select cooking category
                  </option>
                  <option value="Baking">Baking</option>
                  <option value="Grilling">Grilling</option>
                  <option value="Stir-Fry">Stir-Fry</option>
                  <option value="Roasting">Roasting</option>
                  <option value="Steaming">Steaming</option>
                  <option value="Frying">Frying</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label
                htmlFor="description"
                style={{
                  display: "block",
                  marginBottom: "0.5rem",
                  fontWeight: "600",
                  color: "#1877F2",
                }}
              >
                Cooking Description*
              </label>
              <textarea
                id="description"
                name="description"
                placeholder="Describe your cooking process, ingredients, techniques..."
                value={formData.description}
                onChange={handleChange}
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label
                  htmlFor="startDate"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#1877F2",
                  }}
                >
                  Start Date*
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="endDate"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#1877F2",
                  }}
                >
                  End Date*
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={(e) => {
                    const { name, value } = e.target;
                    if (new Date(value) < new Date(formData.startDate)) {
                      alert("End date cannot be earlier than start date.");
                      return;
                    }
                    handleChange(e);
                  }}
                  required
                />
              </div>

              <div className="form-group">
                <label
                  htmlFor="level"
                  style={{
                    display: "block",
                    marginBottom: "0.5rem",
                    fontWeight: "600",
                    color: "#1877F2",
                  }}
                >
                  Progress Level (0-100)*
                </label>
                <div className="level-input-container">
                  <input
                    type="number"
                    id="level"
                    name="level"
                    min="0"
                    max="100"
                    placeholder="50"
                    value={formData.level}
                    onChange={(e) => {
                      const { name, value } = e.target;
                      if (value < 0 || value > 100) {
                        alert("Level must be between 0 and 100.");
                        return;
                      }
                      handleChange(e);
                    }}
                    required
                  />
                  <span>%</span>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="submit-button"
              style={{ backgroundColor: "#1877F2", color: "white" }}
            >
              Save Learning Progress
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddLearningProgress;
