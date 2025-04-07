import React from "react";
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";
import {
  FaHome,
  FaFire,
  FaBook,
  FaLightbulb,
  FaUserFriends,
  FaFlag,
  FaCalendarAlt,
  FaBookmark,
  FaChevronDown,
} from "react-icons/fa";

function SideBar() {
  const currentPath = window.location.pathname;

  return (
    <div className="side_bar">
    
      <div className="side_logoo"
      
      />

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
            <FaFire />
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
            <FaBook />
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
            <span>SkillPulse</span>
          </div>
        )}
      </div>

      <div className="sidebar_divider"></div>

      <div className="sidebar_section_header">Your Shortcuts</div>

      <div className="side_bar_nav_item_con">
        <div className="side_bar_nav_item">
          <i>
            <FaUserFriends />
          </i>
          <span>Friends</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaFlag />
          </i>
          <span>Pages</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaCalendarAlt />
          </i>
          <span>Events</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaBookmark />
          </i>
          <span>Saved</span>
        </div>
        <div className="side_bar_nav_item">
          <i>
            <FaChevronDown />
          </i>
          <span>See More</span>
        </div>
        
      </div>
    </div>
  );
}

export default SideBar;
