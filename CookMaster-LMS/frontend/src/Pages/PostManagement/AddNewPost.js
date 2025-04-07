import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../Components/SideBar/SideBar";

function AddNewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const userID = localStorage.getItem("userID");

  // Styles
  const styles = {
    container: {
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
    },
    contentSection: {
      marginLeft: "230px",

      width: "calc(100% - 280px)",
      display: "flex",
      justifyContent: "center",
    },
    formContainer: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      marginTop: "150px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      width: "100%",
      maxWidth: "600px",
    },
    formHeading: {
      fontSize: "20px",
      fontWeight: "600",
      color: "#050505",
      marginBottom: "24px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "20px",
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
      boxSizing: "border-box",
      transition: "border-color 0.2s, background-color 0.2s",
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
      boxSizing: "border-box",
      transition: "border-color 0.2s, background-color 0.2s",
      ":focus": {
        outline: "none",
        borderColor: "#1877f2",
        backgroundColor: "#ffffff",
      },
    },
    mediaPreviewContainer: {
      display: "flex",
      flexWrap: "wrap",
      gap: "10px",
      marginBottom: "15px",
    },
    mediaPreview: {
      width: "120px",
      height: "120px",
      borderRadius: "8px",
      objectFit: "cover",
      border: "1px solid #dddfe2",
    },
    videoPreview: {
      width: "200px",
      height: "120px",
      borderRadius: "8px",
      backgroundColor: "#000",
    },
    submitButton: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "none",
      backgroundColor: "#1877f2",
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
    fileInput: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px dashed #dddfe2",
      backgroundColor: "#f0f2f5",
      textAlign: "center",
      cursor: "pointer",
      transition: "border-color 0.2s",
      ":hover": {
        borderColor: "#1877f2",
      },
    },
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB

    let imageCount = 0;
    let videoCount = 0;
    const previews = [];

    for (const file of files) {
      if (file.size > maxFileSize) {
        alert(`File ${file.name} exceeds the maximum size of 50MB.`);
        continue;
      }

      if (file.type.startsWith("image/")) {
        imageCount++;
      } else if (file.type === "video/mp4") {
        videoCount++;

        const video = document.createElement("video");
        video.preload = "metadata";
        video.src = URL.createObjectURL(file);

        video.onloadedmetadata = () => {
          URL.revokeObjectURL(video.src);
          if (video.duration > 30) {
            alert(
              `Video ${file.name} exceeds the maximum duration of 30 seconds.`
            );
            return;
          }
        };
      } else {
        alert(`Unsupported file type: ${file.type}`);
        continue;
      }

      previews.push({ type: file.type, url: URL.createObjectURL(file) });
    }

    if (imageCount > 3) {
      alert("You can upload a maximum of 3 images.");
      return;
    }

    if (videoCount > 1) {
      alert("You can upload only 1 video.");
      return;
    }

    setMedia(files);
    setMediaPreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("title", title);
    formData.append("description", description);
    media.forEach((file) => formData.append("mediaFiles", file));

    try {
      await axios.post("http://localhost:8080/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      setTitle("");
      setDescription("");
      setMedia([]);
      setMediaPreviews([]);
    } catch (error) {
      console.error(error);
      alert("Failed to create post.");
    }
  };

  return (
    <div style={styles.container}>
      <SideBar />
      <div style={styles.contentSection}>
        <div style={styles.formContainer}>
          <h2 style={styles.formHeading}>Create New Post</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter post title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Describe your post..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Media</label>
              <div style={styles.mediaPreviewContainer}>
                {mediaPreviews.map((preview, index) => (
                  <div key={index}>
                    {preview.type.startsWith("video/") ? (
                      <video controls style={styles.videoPreview}>
                        <source src={preview.url} type={preview.type} />
                      </video>
                    ) : (
                      <img
                        src={preview.url}
                        alt={`Preview ${index}`}
                        style={styles.mediaPreview}
                      />
                    )}
                  </div>
                ))}
              </div>
              <input
                style={styles.fileInput}
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleMediaChange}
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
