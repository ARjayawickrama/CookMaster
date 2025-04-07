import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { RiDeleteBin6Line } from "react-icons/ri";
import SideBar from "../../Components/SideBar/SideBar";

function UpdatePost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    existingMedia: [],
    newMedia: [],
  });
  const [loading, setLoading] = useState(true);
  const [mediaPreviews, setMediaPreviews] = useState([]);

  // Styles
  const styles = {
    container: {
    
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      fontFamily: "Segoe UI, Roboto, sans-serif",
    },
    contentSection: {
      marginLeft: "240px",
      padding: "20px",
      width: "calc(100% - 280px)",
      display: "flex",
      justifyContent: "center",
    },
    formContainer: {
      marginTop:"90px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
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
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
      gap: "10px",
      marginBottom: "15px",
    },
    mediaPreviewWrapper: {
      position: "relative",
      borderRadius: "8px",
      overflow: "hidden",
    },
    mediaPreview: {
      width: "100%",
      height: "120px",
      objectFit: "cover",
      borderRadius: "8px",
      border: "1px solid #dddfe2",
    },
    deleteButton: {
      position: "absolute",
      top: "5px",
      right: "5px",
      backgroundColor: "rgba(255, 0, 0, 0.7)",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "24px",
      height: "24px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      cursor: "pointer",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "rgba(255, 0, 0, 0.9)",
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
    loading: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100vh",
      fontSize: "18px",
      color: "#65676b",
    },
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/posts/${id}`);
        const post = response.data;
        setFormData({
          title: post.title || "",
          description: post.description || "",
          existingMedia: post.media || [],
          newMedia: [],
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching post:", error);
        alert("Failed to fetch post details.");
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  useEffect(() => {
    // Create previews for new media files
    const newPreviews = formData.newMedia.map((file) => ({
      type: file.type,
      url: URL.createObjectURL(file),
    }));
    setMediaPreviews(newPreviews);

    // Clean up preview URLs when component unmounts
    return () => {
      newPreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [formData.newMedia]);

  const handleDeleteMedia = async (mediaUrl) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this media file?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/posts/${id}/media`, {
        data: { mediaUrl },
      });
      setFormData((prev) => ({
        ...prev,
        existingMedia: prev.existingMedia.filter((url) => url !== mediaUrl),
      }));
      alert("Media file deleted successfully!");
    } catch (error) {
      console.error("Error deleting media file:", error);
      alert("Failed to delete media file.");
    }
  };

  const validateVideoDuration = async (file) => {
    return new Promise((resolve, reject) => {
      const video = document.createElement("video");
      video.preload = "metadata";
      video.src = URL.createObjectURL(file);

      video.onloadedmetadata = () => {
        URL.revokeObjectURL(video.src);
        if (video.duration > 30) {
          reject(`Video exceeds maximum duration of 30 seconds.`);
        } else {
          resolve();
        }
      };

      video.onerror = () => {
        reject("Failed to load video metadata.");
      };
    });
  };

  const handleNewMediaChange = async (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024; // 50MB
    const maxImageCount = 3;

    let imageCount = formData.existingMedia.filter(
      (url) => !url.endsWith(".mp4")
    ).length;
    let videoCount = formData.existingMedia.filter((url) =>
      url.endsWith(".mp4")
    ).length;

    const validFiles = [];

    for (const file of files) {
      try {
        // Validate file size
        if (file.size > maxFileSize) {
          throw new Error(`File exceeds maximum size of 50MB.`);
        }

        // Validate file type
        if (file.type.startsWith("image/")) {
          imageCount++;
          if (imageCount > maxImageCount) {
            throw new Error("Maximum of 3 images allowed.");
          }
        } else if (file.type === "video/mp4") {
          videoCount++;
          if (videoCount > 1) {
            throw new Error("Only 1 video allowed.");
          }
          await validateVideoDuration(file);
        } else {
          throw new Error("Unsupported file type.");
        }

        validFiles.push(file);
      } catch (error) {
        alert(`${file.name}: ${error.message}`);
      }
    }

    setFormData((prev) => ({
      ...prev,
      newMedia: [...prev.newMedia, ...validFiles],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formData.newMedia.forEach((file) =>
      formDataToSend.append("newMediaFiles", file)
    );

    try {
      await axios.put(`http://localhost:8080/posts/${id}`, formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post updated successfully!");
      navigate("/allPost");
    } catch (error) {
      console.error("Error updating post:", error);
      alert("Failed to update post.");
    }
  };

  if (loading) {
    return <div style={styles.loading}>Loading post data...</div>;
  }

  return (
    <div style={styles.container}>
      <SideBar />
      <div style={styles.contentSection}>
        <div style={styles.formContainer}>
          <h2 style={styles.formHeading}>Update Post</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Title</label>
              <input
                style={styles.input}
                type="text"
                placeholder="Enter post title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                style={styles.textarea}
                placeholder="Describe your post..."
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Media</label>

              {/* Existing Media */}
              <div style={styles.mediaPreviewContainer}>
                {formData.existingMedia.map((mediaUrl, index) => (
                  <div
                    key={`existing-${index}`}
                    style={styles.mediaPreviewWrapper}
                  >
                    {mediaUrl.endsWith(".mp4") ? (
                      <video controls style={styles.mediaPreview}>
                        <source
                          src={`http://localhost:8080${mediaUrl}`}
                          type="video/mp4"
                        />
                      </video>
                    ) : (
                      <img
                        src={`http://localhost:8080${mediaUrl}`}
                        alt={`Media ${index}`}
                        style={styles.mediaPreview}
                      />
                    )}
                    <button
                      style={styles.deleteButton}
                      onClick={() => handleDeleteMedia(mediaUrl)}
                      title="Delete media"
                    >
                      <RiDeleteBin6Line size={14} />
                    </button>
                  </div>
                ))}

                {/* New Media Previews */}
                {mediaPreviews.map((preview, index) => (
                  <div key={`new-${index}`} style={styles.mediaPreviewWrapper}>
                    {preview.type.startsWith("video/") ? (
                      <video controls style={styles.mediaPreview}>
                        <source src={preview.url} type={preview.type} />
                      </video>
                    ) : (
                      <img
                        src={preview.url}
                        alt={`New media ${index}`}
                        style={styles.mediaPreview}
                      />
                    )}
                    <button
                      style={styles.deleteButton}
                      onClick={() =>
                        setFormData({
                          ...formData,
                          newMedia: formData.newMedia.filter(
                            (_, i) => i !== index
                          ),
                        })
                      }
                      title="Remove media"
                    >
                      <RiDeleteBin6Line size={14} />
                    </button>
                  </div>
                ))}
              </div>

              <input
                style={styles.fileInput}
                type="file"
                accept="image/jpeg,image/png,image/jpg,video/mp4"
                multiple
                onChange={handleNewMediaChange}
              />
            </div>

            <button type="submit" style={styles.submitButton}>
              Update Post
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdatePost;
