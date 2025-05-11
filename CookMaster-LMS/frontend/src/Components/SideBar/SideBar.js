import React from "react";
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";
import {
  FaHome,
  FaRocket,
  FaGraduationCap,
  FaLightbulb,
  FaUserFriends,
  FaFlag,
  FaCalendarAlt,
  FaBookmark,
  FaChevronDown,
  FaUsers,
  FaStore,
  FaVideo,
  FaGamepad,
  FaHistory,
} from "react-icons/fa";

function SideBar() {
  const currentPath = window.location.pathname;

  return (
    <div className="side_bar">
      <div className="side_logoo" />

      <div className="side_bar_nav_item_con">
        <NavBar />
        <div
          className={`side_bar_nav_item ${
            currentPath === "/" ? "side_bar_nav_item--active" : ""
          }`}
          onClick={() => (window.location.href = "/")}
        >
          <i>
            <FaHome />
          </i>
          <span>Home</span>
        </div>

        <div
          className={`side_bar_nav_item ${
            currentPath === "/allPost" ? "side_bar_nav_item--active" : ""
          }`}
          onClick={() => (window.location.href = "/allPost")}
        >
          <i>
            <FaRocket />
          </i>
          <span>BoostPost</span>
        </div>

        <div
          className={`side_bar_nav_item ${
            currentPath === "/allLearningProgress"
              ? "side_bar_nav_item--active"
              : ""
          }`}
          onClick={() => (window.location.href = "/allLearningProgress")}
        >
          <i>
            <FaGraduationCap />
          </i>
          <span>LearnTrack</span>
        </div>

        {localStorage.getItem("userType") !== "googale" && (
          <div
            className={`side_bar_nav_item ${
              currentPath === "/learningSystem/recommendPost"
                ? "side_bar_nav_item--active"
                : ""
            }`}
            onClick={() =>
              (window.location.href = "/learningSystem/recommendPost")
            }
          >
            <i>
              <FaLightbulb />
            </i>
            <span>Course Creator</span>
          </div>
        )}
      </div>

      <div className="sidebar_divider"></div>

      <div className="sidebar_section_header">Your Shortcuts</div>

      <div className="side_bar_nav_item_con">
        <div className="side_bar_nav_item">
          <i>
            <FaUsers />
          </i>
          <span>Groups</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaStore />
          </i>
          <span>Marketplace</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaVideo />
          </i>
          <span>Watch</span>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
