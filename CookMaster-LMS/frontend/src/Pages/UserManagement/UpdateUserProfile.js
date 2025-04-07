import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import SideBar from "../../Components/SideBar/SideBar";
import { IoMdAdd } from "react-icons/io";
import { IoClose } from "react-icons/io5";

function UpdateUserProfile() {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    phone: "",
    skills: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch(`http://localhost:8080/user/${id}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        return response.json();
      })
      .then((data) => setFormData(data))
      .catch((error) => console.error("Error:", error));
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddSkill = () => {
    if (skillInput.trim() && !formData.skills.includes(skillInput)) {
      setFormData({ ...formData, skills: [...formData.skills, skillInput] });
      setSkillInput("");
    }
  };

  const handleDeleteSkill = (index) => {
    const updatedSkills = formData.skills.filter((_, i) => i !== index);
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`http://localhost:8080/user/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert("Profile updated successfully!");
        window.location.reload();
      } else {
        alert("Failed to update profile.");
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#f5f7fa",
      }}
    >
      <SideBar />
      <div
        style={{
          flex: 1,
          padding: "2rem",
          marginTop:"90px",
          marginLeft: "220px",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            backgroundColor: "white",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
            padding: "2.5rem",
            position: "relative",
          }}
        >
          <h1
            style={{
              fontSize: "1.8rem",
              fontWeight: "600",
              color: "#2d3748",
              marginBottom: "2rem",
              textAlign: "center",
            }}
          >
            Update Your Profile
          </h1>

          <form onSubmit={handleSubmit}>
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
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Full Name
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                    ":focus": {
                      borderColor: "#4a6fa5",
                      boxShadow: "0 0 0 3px rgba(74, 111, 165, 0.1)",
                    },
                  }}
                  type="text"
                  name="fullname"
                  placeholder="John Doe"
                  value={formData.fullname}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email Address
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  type="email"
                  name="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
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
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  type="password"
                  name="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.875rem",
                    fontWeight: "500",
                    color: "#4a5568",
                    marginBottom: "0.5rem",
                  }}
                >
                  Phone Number
                </label>
                <input
                  style={{
                    width: "100%",
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  type="tel"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={(e) => {
                    const re = /^[0-9\b]{0,10}$/;
                    if (re.test(e.target.value)) {
                      handleInputChange(e);
                    }
                  }}
                  maxLength="10"
                  pattern="[0-9]{10}"
                  title="Please enter exactly 10 digits."
                  required
                />
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label
                style={{
                  display: "block",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  color: "#4a5568",
                  marginBottom: "0.5rem",
                }}
              >
                Skills
              </label>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.5rem",
                  marginBottom: "0.75rem",
                }}
              >
                {formData.skills.map((skill, index) => (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#e3f2fd",
                      color: "#1976d2",
                      padding: "0.375rem 0.75rem",
                      borderRadius: "20px",
                      fontSize: "0.75rem",
                      fontWeight: "500",
                    }}
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => handleDeleteSkill(index)}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#1976d2",
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <IoClose size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                }}
              >
                <input
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    borderRadius: "8px",
                    border: "1px solid #e2e8f0",
                    fontSize: "0.875rem",
                    transition: "border-color 0.2s",
                    outline: "none",
                  }}
                  type="text"
                  placeholder="Add a skill (e.g. JavaScript)"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: "#4a6fa5",
                    color: "white",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0 1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                    ":hover": {
                      backgroundColor: "#3a5a80",
                    },
                  }}
                >
                  <IoMdAdd size={20} />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: "100%",
                backgroundColor: isSubmitting ? "#a0aec0" : "#4a6fa5",
                color: "white",
                padding: "0.875rem",
                borderRadius: "8px",
                border: "none",
                fontSize: "0.875rem",
                fontWeight: "500",
                cursor: "pointer",
                transition: "background-color 0.2s",
                marginTop: "1rem",
                ":hover": {
                  backgroundColor: isSubmitting ? "#a0aec0" : "#3a5a80",
                },
              }}
            >
              {isSubmitting ? "Updating..." : "Update Profile"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateUserProfile;
