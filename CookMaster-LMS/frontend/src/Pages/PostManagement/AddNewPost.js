import React, { useState } from "react";
import axios from "axios";
import SideBar from "../../Components/SideBar/SideBar";
import image from "../../Components/SideBar/img/4.jpg";

function AddNewPost() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [media, setMedia] = useState([]);
  const [mediaPreviews, setMediaPreviews] = useState([]);
  const [includePoll, setIncludePoll] = useState(false);
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);
  const [pollDuration, setPollDuration] = useState(1); // in days
  const userID = localStorage.getItem("userID");

  const styles = {
    container: {
      
      backgroundImage: `url(${image})`,
      minHeight: "100vh",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
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
      marginTop: "100px", // Adjusted for better positioning
      boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
      padding: "24px",
      width: "100%",
      maxWidth: "800px", // Slightly narrower for a more LinkedIn-like feel
    },
    formHeading: {
      fontSize: "24px", // Slightly larger for prominence
      fontWeight: "700",
      color: "#333333", // Darker text for better readability
      marginBottom: "24px",
      textAlign: "center",
    },
    formGroup: {
      marginBottom: "20px",
    },
    label: {
      display: "block",
      fontSize: "16px",
      fontWeight: "500", // Softer weight for a modern touch
      color: "#333333",
      marginBottom: "8px",
    },
    input: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      fontSize: "16px", // Adjusted for consistency
      backgroundColor: "#f4f5f7", // Slightly lighter gray for a cleaner look
      boxSizing: "border-box",
      transition: "border-color 0.2s, background-color 0.2s",
      ":focus": {
        outline: "none",
        borderColor: "#0073b1", // LinkedIn's blue
        backgroundColor: "#ffffff",
      },
    },
    textarea: {
      width: "100%",
      padding: "12px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      fontSize: "16px",
      minHeight: "120px", // Increased height for better readability
      resize: "vertical",
      backgroundColor: "#f4f5f7",
      boxSizing: "border-box",
      transition: "border-color 0.2s, background-color 0.2s",
      ":focus": {
        outline: "none",
        borderColor: "#0073b1", // LinkedIn's blue
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
      backgroundColor: "#0073b1", // LinkedIn's primary blue
      color: "white",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s",
      ":hover": {
        backgroundColor: "#005c8c", // Slightly darker blue on hover
      },
    },
    fileInput: {
      width: "100%",
      padding: "10px",
      borderRadius: "6px",
      border: "1px dashed #dddfe2",
      backgroundColor: "#f4f5f7",
      textAlign: "center",
      cursor: "pointer",
      transition: "border-color 0.2s",
      ":hover": {
        borderColor: "#0073b1", // LinkedIn's blue on hover
      },
    },
    pollContainer: {
      marginTop: "20px",
      padding: "15px",
      backgroundColor: "#f7f8fa",
      borderRadius: "8px",
      border: "1px solid #dddfe2",
    },
    pollOption: {
      display: "flex",
      alignItems: "center",
      marginBottom: "10px",
    },
    pollInput: {
      flex: 1,
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      fontSize: "14px",
      marginRight: "10px",
    },
    addOptionButton: {
      padding: "6px 12px",
      backgroundColor: "#e4e6eb",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      marginTop: "5px",
      ":hover": {
        backgroundColor: "#d8dadf",
      },
    },
    removeOptionButton: {
      backgroundColor: "transparent",
      border: "none",
      color: "#ff4d4f",
      cursor: "pointer",
      fontSize: "16px",
      padding: "0 5px",
    },
    togglePollButton: {
      padding: "8px 12px",
      backgroundColor: "#e4e6eb",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      fontSize: "14px",
      marginBottom: "15px",
      ":hover": {
        backgroundColor: "#d8dadf",
      },
    },
    durationSelect: {
      padding: "8px",
      borderRadius: "6px",
      border: "1px solid #dddfe2",
      backgroundColor: "#f4f5f7", // Lighter background for consistency
      marginTop: "10px",
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

  const handleAddOption = () => {
    if (pollOptions.length < 4) {
      setPollOptions([...pollOptions, ""]);
    } else {
      alert("Maximum 4 options allowed for a poll.");
    }
  };

  const handleRemoveOption = (index) => {
    if (pollOptions.length > 2) {
      const newOptions = [...pollOptions];
      newOptions.splice(index, 1);
      setPollOptions(newOptions);
    } else {
      alert("A poll must have at least 2 options.");
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...pollOptions];
    newOptions[index] = value;
    setPollOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("userID", userID);
    formData.append("title", title);
    formData.append("description", description);
    media.forEach((file) => formData.append("mediaFiles", file));

    if (includePoll) {
      formData.append("pollQuestion", pollQuestion);
      formData.append(
        "pollOptions",
        JSON.stringify(pollOptions.filter((opt) => opt.trim() !== ""))
      );
      formData.append("pollDuration", pollDuration);
    }

    try {
      await axios.post("http://localhost:8080/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Post created successfully!");
      setTitle("");
      setDescription("");
      setMedia([]);
      setMediaPreviews([]);
      setIncludePoll(false);
      setPollQuestion("");
      setPollOptions(["", ""]);
      setPollDuration(1);
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

            <button
              type="button"
              style={styles.togglePollButton}
              onClick={() => setIncludePoll(!includePoll)}
            >
              {includePoll ? "Remove Poll" : "Add Cooking Poll"}
            </button>

            {includePoll && (
              <div style={styles.pollContainer}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Poll Question</label>
                  <input
                    style={styles.input}
                    type="text"
                    placeholder="What's your poll question?"
                    value={pollQuestion}
                    onChange={(e) => setPollQuestion(e.target.value)}
                    required={includePoll}
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Poll Options</label>
                  {pollOptions.map((option, index) => (
                    <div key={index} style={styles.pollOption}>
                      <input
                        style={styles.pollInput}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option}
                        onChange={(e) =>
                          handleOptionChange(index, e.target.value)
                        }
                        required={includePoll}
                      />
                      {pollOptions.length > 2 && (
                        <button
                          type="button"
                          style={styles.removeOptionButton}
                          onClick={() => handleRemoveOption(index)}
                        >
                          ×
                        </button>
                      )}
                    </div>
                  ))}
                  {pollOptions.length < 4 && (
                    <button
                      type="button"
                      style={styles.addOptionButton}
                      onClick={handleAddOption}
                    >
                      + Add Option
                    </button>
                  )}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Poll Duration</label>
                  <select
                    style={styles.durationSelect}
                    value={pollDuration}
                    onChange={(e) => setPollDuration(parseInt(e.target.value))}
                  >
                    <option value="1">1 day</option>
                    <option value="3">3 days</option>
                    <option value="7">7 days</option>
                  </select>
                </div>
              </div>
            )}

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
