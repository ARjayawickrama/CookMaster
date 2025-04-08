import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { IoSend } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { RiDeleteBin6Fill } from "react-icons/ri";
import { FaPen } from "react-icons/fa"; // Importing a pencil icon
import { BiSolidLike } from "react-icons/bi";
import SideBar from "../../Components/SideBar/SideBar";
import Modal from "react-modal"; // Import Modal library
// We'll create this CSS file
Modal.setAppElement("#root"); // Bind modal to the root element

function AllPost() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]); // For filtering posts
  const [postOwners, setPostOwners] = useState({}); // Map of userID to fullName
  const [showMyPosts, setShowMyPosts] = useState(false); // Toggle for "My Posts"
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [followedUsers, setFollowedUsers] = useState([]); // State to track followed users
  const [newComment, setNewComment] = useState({}); // State for new comments
  const [editingComment, setEditingComment] = useState({}); // State for editing comments
  const navigate = useNavigate();
  const loggedInUserID = localStorage.getItem("userID"); // Get the logged-in user's ID
  const styles = {
    container: {
      display: "flex",
      backgroundColor: "#f0f2f5",
      minHeight: "100vh",
      fontFamily: "Segoe UI, Roboto, Helvetica, Arial, sans-serif",
    },
    contentSection: {
      marginLeft: "280px",
      padding: "20px",
      width: "calc(100% - 280px)",
      position: "relative",
    },
    floatingButton: {
      position: "fixed",
      bottom: "30px",
      right: "30px",
      backgroundColor: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "60px",
      height: "60px",
      fontSize: "16px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
      transition: "all 0.3s ease",
      ":hover": {
        backgroundColor: "#166fe5",
        transform: "scale(1.05)",
      },
    },
    filterButton: {
      position: "fixed",
      top: "70px",
      right: "30px",
      backgroundColor: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "8px",
      padding: "10px 15px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
      zIndex: 100,
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
    postsContainer: {
      display: "flex",
      flexDirection: "column",
      gap: "20px",
      maxWidth: "680px",
      margin: "0 auto",
    },
    postCard: {
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      padding: "16px",
      transition: "transform 0.2s ease, box-shadow 0.2s ease",
      ":hover": {
        transform: "translateY(-2px)",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      },
    },
    userHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "12px",
    },
    userInfo: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    userName: {
      fontSize: "15px",
      fontWeight: "600",
      color: "#050505",
    },
    followButton: {
      marginLeft: "10px",
      backgroundColor: "transparent",
      border: "1px solid #1877f2",
      color: "#1877f2",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: "#e7f3ff",
      },
    },
    unfollowButton: {
      marginLeft: "10px",
      backgroundColor: "transparent",
      border: "1px solid #65676b",
      color: "#65676b",
      borderRadius: "6px",
      padding: "4px 8px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "all 0.2s ease",
      ":hover": {
        backgroundColor: "#f0f2f5",
      },
    },
    actionButtons: {
      display: "flex",
      gap: "12px",
    },
    actionIcon: {
      fontSize: "18px",
      color: "#65676b",
      cursor: "pointer",
      transition: "color 0.2s ease",
      ":hover": {
        color: "#1877f2",
      },
    },
    postTitle: {
      fontSize: "17px",
      fontWeight: "600",
      color: "#050505",
      marginBottom: "8px",
    },
    postDescription: {
      fontSize: "15px",
      color: "#050505",
      lineHeight: "1.5",
      whiteSpace: "pre-line",
      marginBottom: "12px",
    },
    mediaGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, 1fr)",
      gap: "8px",
      marginBottom: "12px",
    },
    mediaItem: {
      position: "relative",
      borderRadius: "8px",
      overflow: "hidden",
      cursor: "pointer",
      aspectRatio: "1/1",
    },
    mediaImage: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
      transition: "transform 0.3s ease",
      ":hover": {
        transform: "scale(1.03)",
      },
    },
    mediaVideo: {
      width: "100%",
      height: "100%",
      objectFit: "cover",
    },
    mediaOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      fontWeight: "bold",
    },
    interactions: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "8px 0",
      borderTop: "1px solid #dddfe2",
      borderBottom: "1px solid #dddfe2",
      marginBottom: "12px",
    },
    likeContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
    },
    likeButton: {
      fontSize: "24px",
      cursor: "pointer",
      color: "#65676b",
      transition: "color 0.2s ease",
      ":hover": {
        color: "#1877f2",
      },
    },
    likedButton: {
      color: "#1877f2",
    },
    likeCount: {
      fontSize: "15px",
      color: "#65676b",
      fontWeight: "600",
    },
    commentInputContainer: {
      display: "flex",
      alignItems: "center",
      gap: "8px",
      width: "100%",
    },
    commentInput: {
      flex: 1,
      padding: "8px 12px",
      borderRadius: "18px",
      border: "1px solid #dddfe2",
      backgroundColor: "#f0f2f5",
      fontSize: "14px",
      transition: "border-color 0.2s ease",
      ":focus": {
        outline: "none",
        borderColor: "#1877f2",
        backgroundColor: "#ffffff",
      },
    },
    sendButton: {
      fontSize: "20px",
      color: "#1877f2",
      cursor: "pointer",
      transition: "transform 0.2s ease",
      ":hover": {
        transform: "scale(1.1)",
      },
    },
    commentsSection: {
      marginTop: "12px",
    },
    commentCard: {
      backgroundColor: "#f0f2f5",
      borderRadius: "18px",
      padding: "8px 12px",
      marginBottom: "8px",
    },
    commentHeader: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: "4px",
    },
    commentUser: {
      fontSize: "13px",
      fontWeight: "600",
      color: "#050505",
    },
    commentContent: {
      fontSize: "14px",
      color: "#050505",
      lineHeight: "1.4",
    },
    commentActions: {
      display: "flex",
      gap: "12px",
      marginTop: "4px",
    },
    commentAction: {
      fontSize: "12px",
      color: "#65676b",
      fontWeight: "600",
      cursor: "pointer",
      transition: "color 0.2s ease",
      ":hover": {
        color: "#1877f2",
      },
    },
    editInput: {
      width: "100%",
      padding: "8px 12px",
      borderRadius: "18px",
      border: "1px solid #dddfe2",
      fontSize: "14px",
      marginBottom: "8px",
    },
    notFoundContainer: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "20px",
      padding: "40px",
      backgroundColor: "#ffffff",
      borderRadius: "8px",
      boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
      textAlign: "center",
    },
    notFoundImage: {
      width: "200px",
      height: "200px",
      backgroundColor: "#f0f2f5",
      borderRadius: "8px",
    },
    notFoundMessage: {
      fontSize: "16px",
      color: "#65676b",
    },
    notFoundButton: {
      backgroundColor: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "6px",
      padding: "10px 20px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
      transition: "background-color 0.2s ease",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
    modalContent: {
      position: "relative",
      backgroundColor: "#ffffff",
      borderRadius: "12px",
      padding: "20px",
      maxWidth: "90vw",
      maxHeight: "90vh",
      outline: "none",
    },
    modalMedia: {
      maxWidth: "100%",
      maxHeight: "80vh",
      display: "block",
      margin: "0 auto",
    },
    closeButton: {
      position: "absolute",
      top: "10px",
      right: "10px",
      backgroundColor: "#1877f2",
      color: "white",
      border: "none",
      borderRadius: "50%",
      width: "30px",
      height: "30px",
      fontSize: "14px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      transition: "background-color 0.2s ease",
      ":hover": {
        backgroundColor: "#166fe5",
      },
    },
    modalOverlay: {
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: "rgba(0, 0, 0, 0.75)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 1000,
    },
  };
  useEffect(() => {
    // Fetch all posts from the backend
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/posts");
        setPosts(response.data);
        setFilteredPosts(response.data); // Initially show all posts

        // Fetch post owners' names
        const userIDs = [...new Set(response.data.map((post) => post.userID))]; // Get unique userIDs
        const ownerPromises = userIDs.map((userID) =>
          axios
            .get(`http://localhost:8080/user/${userID}`)
            .then((res) => ({
              userID,
              fullName: res.data.fullname,
            }))
            .catch((error) => {
              console.error(
                `Error fetching user details for userID ${userID}:`,
                error
              );
              return { userID, fullName: "Anonymous" };
            })
        );
        const owners = await Promise.all(ownerPromises);
        const ownerMap = owners.reduce((acc, owner) => {
          acc[owner.userID] = owner.fullName;
          return acc;
        }, {});
        console.log("Post Owners Map:", ownerMap); // Debug log to verify postOwners map
        setPostOwners(ownerMap);
      } catch (error) {
        console.error("Error fetching posts:", error); // Log error for fetching posts
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    const fetchFollowedUsers = async () => {
      const userID = localStorage.getItem("userID");
      if (userID) {
        try {
          const response = await axios.get(
            `http://localhost:8080/user/${userID}/followedUsers`
          );
          setFollowedUsers(response.data);
        } catch (error) {
          console.error("Error fetching followed users:", error);
        }
      }
    };

    fetchFollowedUsers();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?"
    );
    if (!confirmDelete) {
      return; // Exit if the user cancels the confirmation
    }

    try {
      await axios.delete(`http://localhost:8080/posts/${postId}`);
      alert("Post deleted successfully!");
      setPosts(posts.filter((post) => post.id !== postId)); // Remove the deleted post from the UI
      setFilteredPosts(filteredPosts.filter((post) => post.id !== postId)); // Update filtered posts
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleUpdate = (postId) => {
    navigate(`/updatePost/${postId}`); // Navigate to the UpdatePost page with the post ID
  };

  const handleMyPostsToggle = () => {
    if (showMyPosts) {
      // Show all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts by logged-in user ID
      setFilteredPosts(posts.filter((post) => post.userID === loggedInUserID));
    }
    setShowMyPosts(!showMyPosts); // Toggle the state
  };

  const handleLike = async (postId) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("Please log in to like a post.");
      return;
    }
    try {
      const response = await axios.put(
        `http://localhost:8080/posts/${postId}/like`,
        null,
        {
          params: { userID },
        }
      );

      // Update the specific post's likes in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId ? { ...post, likes: response.data.likes } : post
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleFollowToggle = async (postOwnerID) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("Please log in to follow/unfollow users.");
      return;
    }
    try {
      if (followedUsers.includes(postOwnerID)) {
        // Unfollow logic
        await axios.put(`http://localhost:8080/user/${userID}/unfollow`, {
          unfollowUserID: postOwnerID,
        });
        setFollowedUsers(followedUsers.filter((id) => id !== postOwnerID));
      } else {
        // Follow logic
        await axios.put(`http://localhost:8080/user/${userID}/follow`, {
          followUserID: postOwnerID,
        });
        setFollowedUsers([...followedUsers, postOwnerID]);
      }
    } catch (error) {
      console.error("Error toggling follow state:", error);
    }
  };

  const handleAddComment = async (postId) => {
    const userID = localStorage.getItem("userID");
    if (!userID) {
      alert("Please log in to comment.");
      return;
    }
    const content = newComment[postId] || ""; // Get the comment content for the specific post
    if (!content.trim()) {
      alert("Comment cannot be empty.");
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:8080/posts/${postId}/comment`,
        {
          userID,
          content,
        }
      );

      // Update the specific post's comments in the state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: response.data.comments }
            : post
        )
      );

      setNewComment({ ...newComment, [postId]: "" });
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    const userID = localStorage.getItem("userID");
    try {
      await axios.delete(
        `http://localhost:8080/posts/${postId}/comment/${commentId}`,
        {
          params: { userID },
        }
      );

      // Update state to remove the deleted comment
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.filter(
                  (comment) => comment.id !== commentId
                ),
              }
            : post
        )
      );
    } catch (error) {
      console.error("Error deleting comment:", error);
    }
  };

  const handleSaveComment = async (postId, commentId, content) => {
    try {
      const userID = localStorage.getItem("userID");
      await axios.put(
        `http://localhost:8080/posts/${postId}/comment/${commentId}`,
        {
          userID,
          content,
        }
      );

      // Update the comment in state
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId ? { ...comment, content } : comment
                ),
              }
            : post
        )
      );

      setFilteredPosts((prevFilteredPosts) =>
        prevFilteredPosts.map((post) =>
          post.id === postId
            ? {
                ...post,
                comments: post.comments.map((comment) =>
                  comment.id === commentId ? { ...comment, content } : comment
                ),
              }
            : post
        )
      );

      setEditingComment({}); // Clear editing state
    } catch (error) {
      console.error("Error saving comment:", error);
    }
  };

  const openModal = (mediaUrl) => {
    setSelectedMedia(mediaUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMedia(null);
    setIsModalOpen(false);
  };

  return (
    <div>
      <div className="continer">
        <div>
          <SideBar />
        </div>
        <div className="continSection">
          <button
            className="actionButton_add"
            onClick={() => (window.location.href = "/addNewPost")}
          >
            <FaPen className="mr-2" />{" "}
          </button>
          <button className="action_btn_my" onClick={handleMyPostsToggle}>
            {showMyPosts ? "All Posts" : "My Posts"}
          </button>
          <div className="post_card_continer">
            {filteredPosts.length === 0 ? (
              <div className="not_found_box">
                <div className="not_found_img"></div>
                <p className="not_found_msg">
                  No posts found. Please create a new post.
                </p>
                <button
                  className="not_found_btn"
                  onClick={() => (window.location.href = "/addNewPost")}
                >
                  Create New Post
                </button>
              </div>
            ) : (
              filteredPosts.map((post) => (
                <div key={post.id} className="post_card">
                  <div className="user_details_card">
                    <div className="name_section_post">
                      <p className="name_section_post_owner_name">
                        {postOwners[post.userID] || "Anonymous"}
                      </p>
                      {post.userID !== loggedInUserID && (
                        <button
                          className={
                            followedUsers.includes(post.userID)
                              ? "flow_btn_unfalow"
                              : "flow_btn"
                          }
                          onClick={() => handleFollowToggle(post.userID)}
                        >
                          {followedUsers.includes(post.userID)
                            ? "Unfollow"
                            : "Follow"}
                        </button>
                      )}
                    </div>
                    {post.userID === loggedInUserID && (
                      <div>
                        <div className="action_btn_icon_post">
                          <FaEdit
                            onClick={() => handleUpdate(post.id)}
                            className="action_btn_icon"
                          />
                          <RiDeleteBin6Fill
                            onClick={() => handleDelete(post.id)}
                            className="action_btn_icon"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="user_details_card_di">
                    <p className="card_post_title">{post.title}</p>
                    <p
                      className="card_post_description"
                      style={{ whiteSpace: "pre-line" }}
                    >
                      {post.description}
                    </p>
                  </div>
                  <div className="media-collage">
                    {post.media.slice(0, 4).map((mediaUrl, index) => (
                      <div
                        key={index}
                        className={`media-item ${
                          post.media.length > 4 && index === 3
                            ? "media-overlay"
                            : ""
                        }`}
                        onClick={() => openModal(mediaUrl)}
                      >
                        {mediaUrl.endsWith(".mp4") ? (
                          <video controls>
                            <source
                              src={`http://localhost:8080${mediaUrl}`}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        ) : (
                          <img
                            src={`http://localhost:8080${mediaUrl}`}
                            alt="Post Media"
                          />
                        )}
                        {post.media.length > 4 && index === 3 && (
                          <div className="overlay-text">
                            +{post.media.length - 4}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="like_coment_lne">
                    <div className="like_btn_con">
                      <BiSolidLike
                        className={
                          post.likes?.[localStorage.getItem("userID")]
                            ? "unlikebtn"
                            : "likebtn"
                        }
                        onClick={() => handleLike(post.id)}
                      >
                        {post.likes?.[localStorage.getItem("userID")]
                          ? "Unlike"
                          : "Like"}
                      </BiSolidLike>
                      <p className="like_num">
                        {
                          Object.values(post.likes || {}).filter(
                            (liked) => liked
                          ).length
                        }
                      </p>
                    </div>
                    <div className="add_comennt_con">
                      <input
                        type="text"
                        className="add_coment_input"
                        placeholder="Add a comment"
                        value={newComment[post.id] || ""}
                        onChange={(e) =>
                          setNewComment({
                            ...newComment,
                            [post.id]: e.target.value,
                          })
                        }
                      />
                      <IoSend
                        onClick={() => handleAddComment(post.id)}
                        className="add_coment_btn"
                      />
                    </div>
                  </div>
                  <div>
                    {post.comments?.map((comment) => (
                      <div key={comment.id} className="coment_full_card">
                        <div className="comnt_card">
                          <p className="comnt_card_username">
                            {comment.userFullName}
                          </p>
                          {editingComment.id === comment.id ? (
                            <input
                              type="text"
                              className="edit_comment_input"
                              value={editingComment.content}
                              onChange={(e) =>
                                setEditingComment({
                                  ...editingComment,
                                  content: e.target.value,
                                })
                              }
                              autoFocus
                            />
                          ) : (
                            <p className="comnt_card_coment">
                              {comment.content}
                            </p>
                          )}
                        </div>

                        <div className="coment_action_btn">
                          {comment.userID === loggedInUserID && (
                            <>
                              {editingComment.id === comment.id ? (
                                <>
                                  <button
                                    className="coment_btn"
                                    onClick={() =>
                                      handleSaveComment(
                                        post.id,
                                        comment.id,
                                        editingComment.content
                                      )
                                    }
                                  >
                                    Save
                                  </button>
                                  <button
                                    className="coment_btn"
                                    onClick={() => setEditingComment({})}
                                  >
                                    Cancel
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    className="coment_btn"
                                    onClick={() =>
                                      setEditingComment({
                                        id: comment.id,
                                        content: comment.content,
                                      })
                                    }
                                  >
                                    Update
                                  </button>
                                  <button
                                    className="coment_btn"
                                    onClick={() =>
                                      handleDeleteComment(post.id, comment.id)
                                    }
                                  >
                                    Delete
                                  </button>
                                </>
                              )}
                            </>
                          )}
                          {post.userID === loggedInUserID &&
                            comment.userID !== loggedInUserID && (
                              <button
                                className="coment_btn"
                                onClick={() =>
                                  handleDeleteComment(post.id, comment.id)
                                }
                              >
                                Delete
                              </button>
                            )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Modal for displaying full media */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Media Modal"
        className="media-modal"
        overlayClassName="media-modal-overlay"
      >
        <button className="close-modal-btn" onClick={closeModal}>
          x
        </button>
        {selectedMedia && selectedMedia.endsWith(".mp4") ? (
          <video controls className="modal-media">
            <source
              src={`http://localhost:8080${selectedMedia}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        ) : (
          <img
            src={`http://localhost:8080${selectedMedia}`}
            alt="Full Media"
            className="modal-media"
          />
        )}
      </Modal>
    </div>
  );
}

export default AllPost;
