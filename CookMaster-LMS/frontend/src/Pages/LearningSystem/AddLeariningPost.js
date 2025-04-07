import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { IoMdAdd } from "react-icons/io";
import { FaGlobeAmericas, FaEllipsisH } from "react-icons/fa";
import SideBar from "../../Components/SideBar/SideBar";

function AddLearningPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [contentURL, setContentURL] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const navigate = useNavigate();

  const handleAddTag = () => {
    if (tagInput.trim() !== "") {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postOwnerID = localStorage.getItem("userID");
    const postOwnerName = localStorage.getItem("userFullName");
    if (!postOwnerID) {
      alert("Please log in to add a post.");
      navigate("/");
      return;
    }
    const isValid = tags.length >= 2;
    if (!isValid) {
      alert("Please add at least two tags.");
      return;
    }
    const newPost = {
      title,
      description,
      contentURL,
      tags,
      postOwnerID,
      postOwnerName,
    };
    try {
      await axios.post("http://localhost:8080/learningSystem", newPost);
      alert("Post added successfully!");
      navigate("/learningSystem/allLearningPost");
    } catch (error) {
      console.error("Error adding post:", error);
      alert("Failed to add post.");
    }
  };

  // Inline styles
  const styles = {
    container: {
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
    },
    contentSection: {
      marginTop: "70px",
      marginLeft: "240px",
      padding: "20px",
      width: "calc(100% - 280px)",
      display: "flex",
      justifyContent: "center",
    },
    postCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      width: "100%",
      maxWidth: "680px",
      padding: "16px",
    },
    postHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "12px",
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      marginRight: "8px",
      backgroundColor: "#e4e6eb",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "#1877f2",
      fontWeight: "bold",
    },
    userInfo: {
      flex: 1,
    },
    username: {
      fontWeight: "600",
      fontSize: "15px",
      color: "#050505",
      margin: 0,
    },
    timestamp: {
      display: "flex",
      alignItems: "center",
      fontSize: "13px",
      color: "#65676b",
      margin: "2px 0 0 0",
      gap: "4px",
    },
    postMenu: {
      color: "#65676b",
      cursor: "pointer",
      padding: "8px",
      borderRadius: "50%",
      ":hover": {
        backgroundColor: "#f0f2f5",
      },
    },
    formContainer: {
      marginTop: "16px",
    },
    formHeading: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#050505",
      marginBottom: "20px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "16px",
    },
    label: {
      display: "block",
      fontSize: "15px",
      fontWeight: "600",
      color: "#050505",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      fontSize: "15px",
      backgroundColor: "#f0f2f5",
      ":focus": {
        outline: "none",
        borderColor: "#1877f2",
        backgroundColor: "#ffffff",
      },
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      fontSize: "15px",
      minHeight: "100px",
      resize: "vertical",
      backgroundColor: "#f0f2f5",
      ":focus": {
        outline: "none",
        borderColor: "#1877f2",
        backgroundColor: "#ffffff",
      },
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "8px",
      margin: "8px 0",
    },
    tag: {
      backgroundColor: "#e7f3ff",
      color: "#1877f2",
      padding: "4px 10px",
      borderRadius: "10px",
      fontSize: "13px",
      fontWeight: "500",
    },
    tagInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    addTagButton: {
      backgroundColor: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "32px",
      height: "32px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
    submitButton: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#1877f2",
      color: "white",
      fontSize: "15px",
      fontWeight: "600",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
  };

  return (
    <div style={styles.container}>
      <SideBar />
      <div style={styles.contentSection}>
        <div style={styles.postCard}>
          {/* Post Header Preview */}
          <div style={styles.postHeader}>
            <div style={styles.avatar}>
              {localStorage.getItem("userFullName")?.charAt(0) || "Y"}
            </div>
            <div style={styles.userInfo}>
              <p style={styles.username}>
                {localStorage.getItem("userFullName") || "You"}
              </p>
              <p style={styles.timestamp}>
                Now · <FaGlobeAmericas size={12} />
              </p>
            </div>
            <div style={styles.postMenu}>
              <FaEllipsisH />
            </div>
          </div>

          {/* Form Container */}
          <div style={styles.formContainer}>
            <p style={styles.formHeading}>Create Learning Post</p>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGroup}>
                <label style={styles.label}>Title</label>
                <input
                  style={styles.input}
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  placeholder="What's the title of your learning post?"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Content URL</label>
                <input
                  style={styles.input}
                  type="url"
                  value={contentURL}
                  onChange={(e) => setContentURL(e.target.value)}
                  required
                  placeholder="Paste a link to your learning resource"
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Tags</label>
                <div style={styles.tagsContainer}>
                  {tags.map((tag, index) => (
                    <span key={index} style={styles.tag}>
                      #{tag}
                    </span>
                  ))}
                </div>
                <div style={styles.tagInputContainer}>
                  <input
                    style={styles.input}
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add tags (min 2 required)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    style={styles.addTagButton}
                  >
                    <IoMdAdd />
                  </button>
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Description</label>
                <textarea
                  style={styles.textarea}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  placeholder="Describe what you're sharing and why it's valuable..."
                />
              </div>

              <button type="submit" style={styles.submitButton}>
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddLearningPost;
