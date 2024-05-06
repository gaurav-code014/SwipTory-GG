import React, { useState,useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import "../css/Navbar.css"; 
import hamburgerIcon from "../images/hamberger.png"; 
import cancelIcon from "../images/cancel.png"; 
import BookmarkImg from "../images/Bookmark.jpg";
import profilePic from "../images/profilePic.png";
import { toast } from 'react-hot-toast'; 

const Navbar = ({ toggleLoginPopup,toggleRegisterPopup }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktopPopupOpen, setIsDesktopPopupOpen] = useState(false); 
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const mobileMenuRef = useRef(null); 
 const desktopPopupRef = useRef(null); 

 const handleClickOutside = (event) => {
  if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
    setIsMenuOpen(false);
  }
  if (desktopPopupRef.current && !desktopPopupRef.current.contains(event.target)) {
    setIsDesktopPopupOpen(false);
  }
};

useEffect(() => {
  
  document.addEventListener("mousedown", handleClickOutside);
  
  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []); 


  const toggleMenu = (event) => {
    event.stopPropagation(); 
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDesktopPopup = () => {
    setIsDesktopPopupOpen(!isDesktopPopupOpen);
  };
  const handleLogout = () => {
    logout();
    toast.success("Logout Sucessfully")
    navigate("/");
    setIsMenuOpen(false);
    setIsDesktopPopupOpen(false); 
  };

  const handleTitleClick = () => {
    navigate("/");
  };

  const handleRegisterClick = () => {
    toggleRegisterPopup(); 
    setIsMenuOpen(false);
};

  const handleLoginClick = () => {
    toggleLoginPopup(); // Toggle the login popup visibility
    setIsMenuOpen(false);
};

  const handleAddStoryClick = () => {
    navigate("/add");
    setIsMenuOpen(false);
  };

  const handleYourStoryClick = () => {
    navigate('/your-story')
    setIsMenuOpen(false);

  };

  const handleBookmarkClick = () => {
    navigate("/bookmark");
    setIsMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-header" onClick={handleTitleClick}>
        <h1 className="navbar-title">SwipTory</h1>
        <img
          src={hamburgerIcon}
          alt="Menu"
          className="hamburger-icon"
          onClick={(event) => toggleMenu(event)}
        />
      </div>
      {isMenuOpen && (
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`} ref={mobileMenuRef}>
          <img
            src={cancelIcon}
            alt="Close"
            className="close-icon"
            onClick={(event) => toggleMenu(event)}
          />
          {!user && (
          <>
            <button
              className="signin-button"
              onClick={handleRegisterClick}
            >
              Register now
            </button>
            <button className="signin-button" onClick={handleLoginClick}>
              Log In
            </button>
          </>
        )}
          {user && (
            <>
              <div className="mobile-menu-user-info">
              <img src={profilePic} alt="Profile" className="profile-icon" />
                <span>{user.username}</span> {/* Display the user's username */}
              </div>

              <button className="button-class" onClick={handleYourStoryClick}>
                Your Story
              </button>

              <button className="button-class" onClick={handleAddStoryClick}>
                Add Story
              </button>
              <button className="button-class" onClick={handleBookmarkClick}>
                <img
                  src={BookmarkImg}
                  alt="Bookmark"
                  style={{ width: "10px", height: "15px", marginRight: "10px" }}
                />
                Bookmarks
              </button>
              <button className="button-class" onClick={handleLogout}>
                Log Out
              </button>
            </>
          )}
        </div>
      )}
      <div className="navbar-buttons">
        {!user && (
          <>
            <button
              className="button-class register-button"
              onClick={handleRegisterClick}
            >
              Register now
            </button>
            <button className="signin-button" onClick={handleLoginClick}>
              Log In
            </button>
          </>
        )}
        {user && (
          <div className="navbar-buttons" ref={desktopPopupRef}>
            <button className="button-class" onClick={handleAddStoryClick}>
              Add Story
            </button>
            <button className="button-class" onClick={handleBookmarkClick}>
              <img
                src={BookmarkImg}
                alt="Bookmark"
                style={{ width: "10px", height: "15px", marginRight: "10px" }}
              />
              Bookmarks
            </button>
            <img src={profilePic} alt="Profile" className="profile-icon" />
            <div className="desktop-popup-container">
              <img
                src={hamburgerIcon}
                alt="Menu"
                className="desktop-hamburger-icon"
                onClick={toggleDesktopPopup}
              />
              {isDesktopPopupOpen && (
                <div className="desktop-popup open">
                  <button
                    className="button-class logout-btn"
                    onClick={handleLogout}
                  >
                    Log Out
                  </button>
                  <span className="desktop-username">{user.username}</span>{" "}
                  {/* Display the user's username */}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
