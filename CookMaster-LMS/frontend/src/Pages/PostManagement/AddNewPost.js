import React, { useState } from "react";
import axios from "axios";
import {
  Upload,
  X,
  Plus,
  Send,
  Type,
  FileText,
  Loader,
  Tag,
} from "lucide-react";
import SideBar from "../../Components/SideBar/SideBar";
import "./AddNewPost.css";

function AddNewPost() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: "",
    includePoll: false,
  });
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const userID = localStorage.getItem("userID");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files);
    const maxFileSize = 50 * 1024 * 1024;
    const errors = {};

    if (files.length > 3) {
      errors.media = "Maximum 3 files allowed";
      setErrors(errors);
      return;
    }

    const validFiles = files.filter((file) => {
      if (file.size > maxFileSize) {
        errors.media = `File ${file.name} exceeds 50MB limit`;
        return false;
      }
      if (!file.type.match(/image\/(jpeg|png|jpg)|video\/mp4/)) {
        errors.media = `Unsupported file type: ${file.type}`;
        return false;
      }
      return true;
    });

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      return;
    }

    setErrors({});
    setMedia(validFiles);
    setMediaPreviews(
      validFiles.map((file) => ({
        type: file.type,
        url: URL.createObjectURL(file),
      }))
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors({});

    // Validate tags format
    if (formData.tags && !/^[a-zA-Z0-9,\s]*$/.test(formData.tags)) {
      setErrors({ tags: "Tags can only contain letters, numbers, and commas" });
      setIsLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append("userID", userID);
    formDataToSend.append("title", formData.title);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("tags", formData.tags);

    media.forEach((file) => formDataToSend.append("mediaFiles", file));

    try {
      const response = await axios.post(
        "http://localhost:8080/posts",
        formDataToSend,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      alert("Post created successfully!");
      window.location.href = "/allPost";
    } catch (error) {
      console.error("Error creating post:", error);
      setErrors({
        submit: error.response?.data?.message || "Failed to create post",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-post-container">
      <SideBar />
      <div className="add-post-content">
        <div className="add-post-card">
          <div className="add-post-header">
            <Plus size={24} />
            <h1 className="CreateNewPost">Create New Post</h1>
          </div>

          <form onSubmit={handleSubmit} className="add-post-form">
            {/* Title */}
            <div
              style={{
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  color: "#2d3436",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "0.5rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                }}
              >
                <Type size={25} style={{ color: "#4a90e2" }} />
                Post Title
              </label>
              <input
                style={{
                  width: "100%",
                  padding: "0.875rem 1.25rem",
                  border: "2px solid #e3e8f2",
                  borderRadius: "8px",
                  backgroundColor: "#ffffff",
                  fontSize: "1rem",
                  color: "#2d3436",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                  boxSizing: "border-box",
                  outline: "none",
                  ":focus": {
                    borderColor: "#4a90e2",
                    boxShadow: "0 0 0 3px rgba(74, 144, 226, 0.2)",
                  },
                  "::placeholder": {
                    color: "#94a3b8",
                    opacity: "1",
                  },
                }}
                type="text"
                name="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>
            {/* Description */}
            <div
              style={{
                marginBottom: "1.5rem",
                position: "relative",
              }}
            >
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  color: "#2d3436",
                  fontSize: "0.875rem",
                  fontWeight: "600",
                  marginBottom: "1rem",
                  textTransform: "uppercase",
                  letterSpacing: "0.5px",
                  paddingLeft: "4px",
                }}
              >
                <FileText
                  size={25}
                  style={{
                    color: "#4a90e2",
                    strokeWidth: "1.5",
                    transform: "translateY(-1px)",
                  }}
                />
                Description
              </label>

              <textarea
                style={{
                  width: "100%",
                  padding: "1.25rem",
                  border: "2px solid #e3e8f2",
                  borderRadius: "12px",
                  backgroundColor: "#ffffff",
                  fontSize: "1rem",
                  lineHeight: "1.6",
                  color: "#2d3436",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.03)",
                  outline: "none",
                  minHeight: "180px",
                  resize: "vertical",
                  fontFamily: "inherit",
                  ":focus": {
                    borderColor: "#4a90e2",
                    boxShadow: "0 0 0 4px rgba(74, 144, 226, 0.15)",
                    backgroundColor: "#f8faff",
                  },
                  "::placeholder": {
                    color: "#94a3b8",
                    fontStyle: "italic",
                    letterSpacing: "0.3px",
                  },
                }}
                name="description"
                placeholder="Write your post content..."
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
              />
            </div>

            {/* Media Upload */}
            <div className="form-group">
              <label className="media-upload-label" htmlFor="media-upload">
                <Upload size={25} />
                <div className="media-upload-text">
                  <strong>Click to upload</strong> or drag and drop
                  <br />
                  Images or videos ( 50MB )
                </div>
              </label>
              <input
                id="media-upload"
                type="file"
                accept="image/*,video/mp4"
                multiple
                onChange={handleMediaChange}
                style={{ display: "none" }}
              />

              {errors.media && (
                <div className="error-message">{errors.media}</div>
              )}

              {mediaPreviews.length > 0 && (
                <div className="media-preview-grid">
                  {mediaPreviews.map((preview, index) => (
                    <div key={index} className="media-preview-item">
                      {preview.type.startsWith("image/") ? (
                        <img src={preview.url} alt={`Preview ${index}`} />
                      ) : (
                        <video src={preview.url} controls />
                      )}
                      <button
                        type="button"
                        className="media-remove-btn"
                        onClick={() => {
                          const newMedia = [...media];
                          const newPreviews = [...mediaPreviews];
                          newMedia.splice(index, 1);
                          newPreviews.splice(index, 1);
                          setMedia(newMedia);
                          setMediaPreviews(newPreviews);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {errors.submit && (
              <div className="error-message">{errors.submit}</div>
            )}

            <div className="form-actions">
              <button
                type="button"
                className="form-btn form-btn-secondary"
                onClick={() => (window.location.href = "/allPost")}
              >
                <X size={18} />
                Cancel
              </button>
              <button
                type="submit"
                className={`form-btn form-btn-primary ${
                  isLoading ? "loading" : ""
                }`}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Send size={18} />
                    Publish Post
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddNewPost;
