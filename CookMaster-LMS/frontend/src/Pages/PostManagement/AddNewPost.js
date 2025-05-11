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
  AlertCircle,
  Check,
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
  const [showConfirmation, setShowConfirmation] = useState(false);

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
    setShowConfirmation(true);
  };

  const handleConfirmSubmit = async () => {
    setIsLoading(true);
    setErrors({});

    // Validate tags format
    if (formData.tags && !/^[a-zA-Z0-9,\s]*$/.test(formData.tags)) {
      setErrors({ tags: "Tags can only contain letters, numbers, and commas" });
      setIsLoading(false);
      setShowConfirmation(false);
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
      setShowConfirmation(false);
    }
  };

  return (
    <div className="add-post-container">
      <SideBar />
      <div className="add-post-content">
        <div className="add-post-card">
          <div className="add-post-header">
            <Plus size={24} />
            <h1>Create New Post</h1>
          </div>

          <form onSubmit={handleSubmit} className="add-post-form">
            {/* Title */}
            <div className="form-group">
              <label className="form-label">
                <Type size={18} />
                Post Title
              </label>
              <input
                className="form-input"
                type="text"
                name="title"
                placeholder="Enter post title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label">
                <FileText size={18} />
                Description
              </label>
              <textarea
                className="form-textarea"
                name="description"
                placeholder="Write your post content"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={6}
              />
            </div>

            {/* Media Upload */}
            <div className="form-group">
              <label className="media-upload-label" htmlFor="media-upload">
                <Upload size={24} />
                <div className="media-upload-text">
                  <strong>Click to upload</strong> or drag and drop
                  <br />
                  Images or videos (max 3 files, 50MB each)
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

      {showConfirmation && (
        <>
          <div className="confirmation-dialog-overlay" />
          <div className="confirmation-dialog">
            <div className="confirmation-dialog-title">
              <AlertCircle size={24} />
              Confirm Post Publication
            </div>
            <div className="confirmation-dialog-message">
              Are you sure you want to publish this post? This action cannot be undone.
            </div>
            <div className="confirmation-dialog-actions">
              <button
                className="confirmation-btn confirmation-btn-no"
                onClick={() => setShowConfirmation(false)}
                disabled={isLoading}
              >
                <X size={18} />
                No, Cancel
              </button>
              <button
                className="confirmation-btn confirmation-btn-yes"
                onClick={handleConfirmSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader size={18} />
                    Publishing...
                  </>
                ) : (
                  <>
                    <Check size={18} />
                    Yes, Publish
                  </>
                )}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default AddNewPost;
