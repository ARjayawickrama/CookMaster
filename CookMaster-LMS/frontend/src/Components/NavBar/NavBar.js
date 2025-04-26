import React, { useEffect, useState } from "react";
import { FaUserGraduate } from "react-icons/fa";
import { MdNotifications } from "react-icons/md";
import { MdNotificationsActive } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import axios from "axios";
import "./NavBar.css";
import "./UserCard.css";

function NavBar() {
  const [allRead, setAllRead] = useState(true);
  const [showCard, setShowCard] = useState(false);
  const [userData, setUserData] = useState(null);
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/notifications/${userId}`
        );
        const unreadNotifications = response.data.some(
          (notification) => !notification.read
        );
        setAllRead(!unreadNotifications);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/user/${userId}`
        );
        setUserData(response.data);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchNotifications();
      fetchUserData();
    }
  }, [userId]);

  const currentPath = window.location.pathname;

  return (
    <div className="nav_con">
      <div className="navbar">
        <div className="nav_item_set">
          <div className="side_logoo"></div>
          <div className="nav_bar_item">
            {allRead ? (
              <MdNotifications
                className={`nav_item_icon ${
                  currentPath === "/notifications" ? "nav_item_icon_noty" : ""
                }`}
                onClick={() => (window.location.href = "/notifications")}
              />
            ) : (
              <MdNotificationsActive
                className="nav_item_icon_noty"
                onClick={() => (window.location.href = "/notifications")}
              />
            )}
            <IoLogOut
              className="nav_item_icon"
              onClick={() => {
                localStorage.removeItem("userID");
                localStorage.removeItem("userType");
                window.location.href = "/";
              }}
            />
            <FaUserGraduate
              className="nav_item_icon"
              style={{
                display:
                  localStorage.getItem("userType") === "googale"
                    ? "none"
                    : "block",
              }}
              onClick={() => setShowCard(!showCard)}
            />
          </div>
        </div>
        {showCard && userData && (
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "70px",
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
              padding: "20px",
              width: "300px",
              zIndex: "1000",
              border: "1px solid #e0e0e0",
              animation: "fadeIn 0.3s ease-out",
              color: "#333",
              fontFamily: '"Segoe UI", Roboto, sans-serif',
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                marginBottom: "15px",
                paddingBottom: "15px",
                borderBottom: "1px solid #f0f0f0",
              }}
            >
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "50%",
                  backgroundColor: "#4a6fa5",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "white",
                  fontSize: "20px",
                  fontWeight: "bold",
                  marginRight: "15px",
                }}
              >
                {userData.fullname.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3
                  style={{
                    margin: "0",
                    fontSize: "18px",
                    fontWeight: "600",
                    color: "#2c3e50",
                  }}
                >
                  {userData.fullname}
                </h3>
                <p
                  style={{
                    margin: "3px 0 0",
                    fontSize: "14px",
                    color: "#7f8c8d",
                  }}
                >
                  {userData.email}
                </p>
              </div>
            </div>

            <div style={{ marginBottom: "15px" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "8px",
                }}
              >
                <span
                  style={{
                    flex: "0 0 80px",
                    fontWeight: "500",
                    color: "#7f8c8d",
                    fontSize: "14px",
                  }}
                >
                  Phone:
                </span>
                <span style={{ fontSize: "14px" }}>
                  {userData.phone || "Not provided"}
                </span>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                }}
              >
                <span
                  style={{
                    flex: "0 0 80px",
                    fontWeight: "500",
                    color: "#7f8c8d",
                    fontSize: "14px",
                  }}
                >
                  Skills:
                </span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                  {userData.skills.map((skill, index) => (
                    <span
                      key={index}
                      style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "3px 8px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "500",
                      }}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "20px",
              }}
            >
              <button
                onClick={() =>
                  (window.location.href = `/updateUserProfile/${userId}`)
                }
                style={{
                  backgroundColor: "#4a6fa5",
                  color: "white",
                  border: "none",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                  flex: "1",
                  marginRight: "10px",
                  ":hover": {
                    backgroundColor: "#3a5a80",
                  },
                }}
              >
                Update Profile
              </button>
              <button
                onClick={() => {
                  if (
                    window.confirm(
                      "Are you sure you want to delete your profile?"
                    )
                  ) {
                    axios
                      .delete(`http://localhost:8080/user/${userId}`)
                      .then(() => {
                        alert("Profile deleted successfully!");
                        localStorage.removeItem("userID");
                        window.location.href = "/";
                      })
                      .catch((error) =>
                        console.error("Error deleting profile:", error)
                      );
                  }
                }}
                style={{
                  backgroundColor: "#fff",
                  color: "#e74c3c",
                  border: "1px solid #e74c3c",
                  padding: "8px 15px",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  transition: "all 0.2s",
                  flex: "1",
                  ":hover": {
                    backgroundColor: "#fde8e6",
                  },
                }}
              >
                Delete Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NavBar;
