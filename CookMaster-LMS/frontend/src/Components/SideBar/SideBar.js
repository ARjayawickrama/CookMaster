import React from "react";
import "./SideBar.css";
import NavBar from "../NavBar/NavBar";

function SideBar() {
  const currentPath = window.location.pathname; // Get the current path

  return (
    <div>
      <div className="nav_con">
        <NavBar />
      </div>
      <div className="side_bar">
        <div className="side_bar_nav_item_con">
          <p
            className={`side_bar_nav_item ${
              currentPath === "/learningSystem/allLearningPost"
                ? "side_bar_nav_item--active"
                : ""
            }`}
            onClick={() =>
              (window.location.href = "/learningSystem/allLearningPost")
            }
          >
            ADD Post
          </p>
          <p
            className={`side_bar_nav_item ${
              currentPath === "/allPost" ? "side_bar_nav_item--active" : ""
            }`}
            onClick={() => (window.location.href = "/allPost")}
          >
            BoostPost
          </p>
          <p
            className={`side_bar_nav_item ${
              currentPath === "/allLearningProgress"
                ? "side_bar_nav_item--active"
                : ""
            }`}
            onClick={() => (window.location.href = "/allLearningProgress")}
          >
            LearnTrack
          </p>
          <p
            className={`side_bar_nav_item ${
              currentPath === "/learningSystem/recommendPost"
                ? "side_bar_nav_item--active"
                : ""
            }`}
            style={{
              display:
                localStorage.getItem("userType") === "googale"
                  ? "none"
                  : "block",
            }}
            onClick={() =>
              (window.location.href = "/learningSystem/recommendPost")
            }
          >
            SkillPulse
          </p>
        </div>
      </div>
    </div>
  );
}

export default SideBar;
