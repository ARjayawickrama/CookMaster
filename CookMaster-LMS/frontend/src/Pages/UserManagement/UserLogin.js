import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "./user.css";
import GoogalLogo from "./img/glogo.png";
import videoFile from "../../../src/assets/login.mov";

function UserLogin() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const showAlert = (icon, title, text) => {
    Swal.fire({
      icon,
      title,
      text,
      confirmButtonText: "OK",
      buttonsStyling: false,
      showClass: {
        popup: "swal2-show",
        backdrop: "swal2-backdrop-show",
      },
      hideClass: {
        popup: "swal2-hide",
        backdrop: "swal2-backdrop-hide",
      },
      customClass: {
        container: "swal2-container",
      },
      confirmButtonAriaLabel: "OK button",
      denyButtonAriaLabel: "Cancel button",
      focusConfirm: false,
      // INLINE STYLES FOR BUTTON:
      confirmButtonColor: "transparent", // Must be transparent for gradient to work
      confirmButtonText: `<span style="
        background: linear-gradient(135deg, #4a6bff 0%, #6a11cb 100%);
        color: white;
        padding: 12px 24px;
        border-radius: 8px;
        font-weight: 600;
        letter-spacing: 0.5px;
        display: inline-block;
        box-shadow: 0 4px 15px rgba(74, 107, 255, 0.3);
        transition: all 0.3s ease;
      ">OK</span>`,
      // Popup container styles:
      backdrop: `
        rgba(0,0,0,0.4)
        left top
        no-repeat
      `,
      background: "#ffffff",
      width: "450px",
      padding: "2rem",
      borderRadius: "12px",
      boxShadow: "0 5px 30px rgba(0, 0, 0, 0.2)",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:8080/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("userID", data.id);
        localStorage.setItem("userToken", data.token); // Store token if available
        showAlert("success", "Welcome back!", "You've successfully logged in.");
        navigate("/learningSystem/allLearningPost");
      } else if (response.status === 401) {
        showAlert(
          "error",
          "Authentication Failed",
          "Invalid email or password. Please try again."
        );
      } else {
        showAlert(
          "error",
          "Login Error",
          "Something went wrong. Please try again later."
        );
      }
    } catch (error) {
      console.error("Login Error:", error);
      showAlert(
        "error",
        "Connection Error",
        "Unable to connect to the server. Please check your network."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="Auth_container">
      <div className="Auth_innerContainer">
        <div className="Auth_content">
          <div className="Auth_content_img">
            <video autoPlay loop muted playsInline>
              <source src={videoFile} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
        <div className="Auth_content new_content">
          <div className="Auth_logo"></div>
          <div className="login_content">
            <p className="Auth_heading">Let the journey begin!</p>
            <p className="Auth_subheading">
              Unlock a world of education with a single click! Please login to
              your account.
            </p>
          </div>
          <form onSubmit={handleSubmit} className="Auth_form">
            <div className="Auth_formGroup">
              <label className="Auth_label">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="Auth_input"
              />
            </div>
            <div className="Auth_formGroup">
              <label className="Auth_label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleInputChange}
                required
                className="Auth_input"
              />
            </div>
            <button type="submit" className="Auth_button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <p className="Auth_signupPrompt">
              Don't have an account?{" "}
              <span
                onClick={() => navigate("/register")}
                className="Auth_signupLink"
              >
                Sign up for free
              </span>
            </p>
          </form>
          <button
            onClick={() =>
              (window.location.href =
                "http://localhost:8080/oauth2/authorization/google")
            }
            className="Auth_googleButton"
          >
            <img src={GoogalLogo} alt="Google logo" className="glogo" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserLogin;
