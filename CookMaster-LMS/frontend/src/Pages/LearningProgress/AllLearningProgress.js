import React, { useEffect, useState } from "react";
import {
  FaEdit,
  FaPen,
  FaUserCircle,
  FaUtensils,
  FaImage,
  FaBookOpen,
  FaClock,
  FaPlus,
} from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { HiCalendarDateRange } from "react-icons/hi2";
import SideBar from "../../Components/SideBar/SideBar";

function AllLearningProgress() {
  const [progressData, setProgressData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [showMyPosts, setShowMyPosts] = useState(false);
  const userId = localStorage.getItem("userID");

  useEffect(() => {
    fetch("http://localhost:8080/learningProgress")
      .then((response) => response.json())
      .then((data) => {
        setProgressData(data);
        setFilteredData(data);
      })
      .catch((error) =>
        console.error("Error fetching learning progress data:", error)
      );
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this recipe?")) {
      try {
        const response = await fetch(
          `http://localhost:8080/learningProgress/${id}`,
          {
            method: "DELETE",
          }
        );
        if (response.ok) {
          alert("Recipe deleted successfully!");
          setFilteredData(
            filteredData.filter((progress) => progress.id !== id)
          );
        } else {
          alert("Failed to delete recipe.");
        }
      } catch (error) {
        console.error("Error deleting recipe:", error);
      }
    }
  };

  const toggleFilter = () => {
    if (showMyPosts) {
      setFilteredData(progressData);
    } else {
      const myPosts = progressData.filter(
        (progress) => progress.postOwnerID === userId
      );
      setFilteredData(myPosts);
    }
    setShowMyPosts(!showMyPosts);
  };

  return (
    <div style={{ backgroundColor: "#fff9f2", minHeight: "100vh", marginTop:"80px" }}>
      <div style={{ display: "flex", fontFamily: "'Poppins', sans-serif" }}>
        <div>
          <SideBar />
        </div>

        <div style={{ flex: 1, padding: "2rem", marginLeft: "280px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "2rem",
              alignItems: "center",
              borderBottom: "2px solid #1877F2",
              paddingBottom: "1rem",
            }}
          >
            <h1
              style={{
                color: "#1877F2",
                margin: 0,
                fontSize: "1.8rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
              }}
            >
              <FaUtensils style={{ color: "#1877F2" }} />
              My Cooking Progress
            </h1>

            <div style={{ display: "flex", gap: "1rem" }}>
              <button
                className="actionButton_add"
                style={{ backgroundColor: "#1877F2", color: "white" }}
                onClick={() => (window.location.href = "/addLearningProgress")}
              >
                <FaPen className="mr-2" />
              </button>

              <button
                style={{
                  backgroundColor: showMyPosts ? "#e74c3c" : "#1877F2",
                  color: "white",
                  border: "none",
                  padding: "0.6rem 1.2rem",
                  borderRadius: "30px",
                  cursor: "pointer",
                  fontSize: "0.95rem",
                  fontWeight: "600",
                  transition: "all 0.2s ease",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
                }}
                onClick={toggleFilter}
              >
                {showMyPosts ? "Show All Recipes" : "Show My Recipes"}
              </button>
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(380px, 1fr))",
              gap: "1.5rem",
            }}
          >
            {filteredData.length === 0 ? (
              <div
                style={{
                  textAlign: "center",
                  padding: "3rem",
                  gridColumn: "1 / -1",
                  background: "white",
                  borderRadius: "15px",
                  boxShadow: "0 3px 15px rgba(0,0,0,0.05)",
                  borderTop: "5px solid #1877F2",
                }}
              >
                <div
                  style={{
                    width: "150px",
                    height: "150px",
                    margin: "0 auto 1.5rem",
                    backgroundImage:
                      "url('https://cdn-icons-png.flaticon.com/512/3723/3723728.png')",
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    opacity: "0.7",
                  }}
                ></div>
                <p
                  style={{
                    fontSize: "1.2rem",
                    color: "#555",
                    marginBottom: "1.5rem",
                  }}
                >
                  No recipes found. Let's cook something new!
                </p>
                <button
                  style={{
                    backgroundColor: "#1877F2",
                    color: "white",
                    border: "none",
                    padding: "0.8rem 1.8rem",
                    borderRadius: "30px",
                    cursor: "pointer",
                    fontSize: "1rem",
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                    boxShadow: "0 3px 8px rgba(24, 119, 242, 0.4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto",
                  }}
                  onClick={() =>
                    (window.location.href = "/addLearningProgress")
                  }
                  onMouseOver={(e) =>
                    (e.currentTarget.style.backgroundColor = "#125dc2")
                  }
                  onMouseOut={(e) =>
                    (e.currentTarget.style.backgroundColor = "#1877F2")
                  }
                >
                  <FaPlus style={{ marginRight: "0.5rem" }} />
                  Add First Recipe
                </button>
              </div>
            ) : (
              filteredData.map((progress) => (
                <div
                  key={progress.id}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "15px",
                    padding: "1.5rem",
                    boxShadow: "0 5px 15px rgba(0,0,0,0.08)",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    borderTop: "5px solid #1877F2",
                    position: "relative",
                    overflow: "hidden",
                  }}
                >
                  {/* Difficulty Ribbon */}
                  {progress.level < 30 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "-30px",
                        backgroundColor: "#27ae60",
                        color: "white",
                        padding: "0.2rem 2rem",
                        transform: "rotate(45deg)",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 1,
                      }}
                    >
                      Beginner
                    </div>
                  )}
                  {progress.level >= 30 && progress.level < 70 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "-30px",
                        backgroundColor: "#f39c12",
                        color: "white",
                        padding: "0.2rem 2rem",
                        transform: "rotate(45deg)",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 1,
                      }}
                    >
                      Intermediate
                    </div>
                  )}
                  {progress.level >= 70 && (
                    <div
                      style={{
                        position: "absolute",
                        top: "10px",
                        right: "-30px",
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "0.2rem 2rem",
                        transform: "rotate(45deg)",
                        fontSize: "0.7rem",
                        fontWeight: "bold",
                        boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
                        zIndex: 1,
                      }}
                    >
                      Advanced
                    </div>
                  )}

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaUserCircle
                        style={{ fontSize: "1.8rem", color: "#1877F2" }}
                      />
                      <p
                        style={{
                          fontWeight: "600",
                          color: "#333",
                          margin: "0",
                          fontSize: "1rem",
                        }}
                      >
                        {progress.postOwnerName}
                      </p>
                    </div>

                    {progress.postOwnerID === userId && (
                      <div style={{ display: "flex", gap: "0.8rem" }}>
                        <FaEdit
                          style={{
                            fontSize: "1.2rem",
                            color: "#1877F2",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onClick={() =>
                            (window.location.href = `/updateLearningProgress/${progress.id}`)
                          }
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                        <RiDeleteBin6Fill
                          style={{
                            fontSize: "1.2rem",
                            color: "#e74c3c",
                            cursor: "pointer",
                            transition: "all 0.2s ease",
                          }}
                          onClick={() => handleDelete(progress.id)}
                          onMouseOver={(e) =>
                            (e.currentTarget.style.transform = "scale(1.2)")
                          }
                          onMouseOut={(e) =>
                            (e.currentTarget.style.transform = "scale(1)")
                          }
                        />
                      </div>
                    )}
                  </div>

                  {/* Progress Bar */}
<div
  style={{
    height: "10px",
    width: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: "10px",
    overflow: "hidden",
    margin: "0.5rem 0 1rem 0",
  }}
>
  <div
    style={{
      width: `${progress.level}%`,
      height: "100%",
      backgroundColor:
        progress.level < 30
          ? "#27ae60"
          : progress.level < 70
          ? "#f39c12"
          : "#e74c3c",
      transition: "width 0.4s ease-in-out",
    }}
  ></div>
</div>


                  

                  <h3
                    style={{
                      fontSize: "1.4rem",
                      color: "#1877F2",
                      margin: "0 0 0.5rem 0",
                      fontFamily: "'Playfair Display', serif",
                    }}
                  >
                    {progress.skillTitle}
                  </h3>

                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      marginBottom: "1rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span
                      style={{
                        backgroundColor: "#eaf1fb",
                        color: "#0e5dc1",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      {progress.field} Cuisine
                    </span>
                    <span
                      style={{
                        backgroundColor: "#e8f8f5",
                        color: "#27ae60",
                        padding: "0.3rem 0.8rem",
                        borderRadius: "20px",
                        fontSize: "0.8rem",
                        fontWeight: "500",
                      }}
                    >
                      {progress.level}% Mastered
                    </span>
                  </div>

                  <div style={{ marginBottom: "1.2rem" }}>
                    <p
                      style={{
                        fontWeight: "600",
                        color: "#1877F2",
                        marginBottom: "0.5rem",
                        fontSize: "0.95rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaBookOpen /> Notes
                    </p>
                    <p
                      style={{
                        color: "#555",
                        lineHeight: "1.6",
                        margin: "0",
                        whiteSpace: "pre-line",
                        fontSize: "0.95rem",
                      }}
                    >
                      {progress.description}
                    </p>
                  </div>

                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      color: "#666",
                      fontSize: "0.85rem",
                      borderTop: "1px dashed #ddd",
                      paddingTop: "0.8rem",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <HiCalendarDateRange style={{ color: "#1877F2" }} />
                      <span>Cooked on: {progress.startDate}</span>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <FaClock style={{ color: "#1877F2" }} />
                      <span>Prep: 30 mins</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AllLearningProgress;
