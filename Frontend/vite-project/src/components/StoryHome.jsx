import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import editButtonImage from "../images/EditButton.png"; 
import { useNavigate, useLocation } from "react-router-dom";
import Login from "./Login";
import Register from "./Register";
import Navbar from "./Navbar";
import "../css/StoryHome.css"; 
import { API_BASE_URL } from "../config";
import allImage from "/all.jpg";
import foodImage from "/food.jpg";
import fitnessImg from "/fitness.jpg";
import travelImg from "/travel.jpg";
import movieImg from "/movies.jpg";
import educationImg from "/education.jpg";

const StoryHome = () => {
  const { user } = useAuth(); 
  const [userStories, setUserStories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [storiesByCategory, setStoriesByCategory] = useState({});
  const [showAll, setShowAll] = useState({}); 
  const [isLoading, setIsLoading] = useState({});
  const [isLoadingAll, setIsLoadingAll] = useState(false);
  const location = useLocation(); 
  const filterByUser = location.state?.filterByUser; 
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showRegisterPopup, setShowRegisterPopup] = useState(false);

  const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
  };

  const toggleRegisterPopup = () => {
    setShowRegisterPopup(!showRegisterPopup);
  };

  const navigate = useNavigate();

  const filters = [
    { name: "All", image: allImage },
    { name: "Food", image: foodImage },
    { name: "Health and Fitness", image: fitnessImg },
    { name: "Travel", image: travelImg },
    { name: "Movies", image: movieImg },
    { name: "Education", image: educationImg },
  ];

  useEffect(() => {
    const fetchUserStories = async () => {
      if (user && user._id) {
        
        try {
          const response = await axios.get(
            `${API_BASE_URL}/stories/user/${user._id}`
          );
          setUserStories(response.data.stories);
          console.log(response.data);
        } catch (error) {
          console.error("Failed to fetch user stories:", error);
        }
      }
    };

    fetchUserStories();
  }, [user]); 

  useEffect(() => {
    const fetchStoriesByCategory = async () => {
      setIsLoadingAll(true); 
      const categories = [
        "food",
        "health%20and%20fitness",
        "travel",
        "movies",
        "education",
      ];
      let stories = {};

      for (const category of categories) {
        setIsLoading((prevState) => ({ ...prevState, [category]: true })); 

        try {
          const response = await axios.get(
            `${API_BASE_URL}/stories/filter?category=${category}`
          );
          stories[category] = response.data.stories || [];
        } catch (error) {
          console.error(
            `Failed to fetch stories for category ${category}:`,
            error
          );
          stories[category] = []; 
        }
        setIsLoading((prevState) => ({ ...prevState, [category]: false })); 
      }

      setStoriesByCategory(stories);
      setIsLoadingAll(false); 
    };

    if (selectedCategory === "all") {
      fetchStoriesByCategory();
    } else {
      
      const fetchStories = async () => {
        setIsLoading((prevState) => ({
          ...prevState,
          [selectedCategory]: true,
        })); 
        try {
          const response = await axios.get(
            `${API_BASE_URL}/stories/filter?category=${selectedCategory}`
          );

          setStoriesByCategory({
            [selectedCategory]: response.data.stories || [],
          });
        } catch (error) {
          console.error("Failed to fetch stories:", error);
          setStoriesByCategory({ [selectedCategory]: [] }); 
        }
        setIsLoading((prevState) => ({
          ...prevState,
          [selectedCategory]: false,
        })); 
      };

      fetchStories();
    }
  }, [selectedCategory]);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setShowAll({ ...showAll, [category]: false }); 
  };

  const showAllStories = (category) => {
    setShowAll({ ...showAll, [category]: true }); 
  };

  const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 25) {
      return words.slice(0, 25).join(" ") + "...";
    }
    return description;
  };

  return (
    <div>
      <Navbar
        toggleLoginPopup={toggleLoginPopup}
        toggleRegisterPopup={toggleRegisterPopup}
      />
      <div>
      {(selectedCategory === "all"
        ? isLoadingAll
        : isLoading[selectedCategory]) ? (
        <div className="loader-container visible">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      )}
        <div className="story-filters-container">
          {filters.map((filter, index) => (
            <div
              key={index}
              className={`story-filter-box ${
                selectedCategory === filter.name.toLowerCase() ? "selected" : ""
              }`}
              onClick={() => handleCategorySelect(filter.name.toLowerCase())}
            >
              <img
                src={filter.image}
                alt={filter.name}
                className="story-filter-image"
              />
              <div className="story-filter-text">{filter.name}</div>
            </div>
          ))}
        </div>
        {/* Render stories based on the selected category */}
        <div className="stories-container">
          {selectedCategory === "all" && user && (
            <div>
              <h2 className="category-heading">Your Stories</h2>
              <div className="category-stories">
                {userStories.length > 0 ? (
                  userStories
                    .slice(0, showAll["userStories"] ? userStories.length : 4)
                    .map((story, index) => (
                      <div
                        key={index}
                        className="story-card"
                        onClick={() => navigate(`/story/${story._id}`)}
                        style={{ cursor: "pointer", position: "relative" }}
                      >
                        <div className="story-card-text">
                          <h3>{story.slides[0].heading}</h3>
                          <p>
                            {truncateDescription(story.slides[0].description)}
                          </p>
                        </div>
                        <img
                          src={story.slides[0].Image}
                          alt={story.slides[0].heading}
                        />
                        {user && user._id === story.createdBy._id && (
                          <div
                            onClick={(e) => {
                              e.stopPropagation(); 
                              navigate(`/edit-story/${story._id}`);
                            }}
                            className="edit-button-link"
                          >
                            <div className="EditbuttonImgDiv">
                              <img
                                src={editButtonImage}
                                alt="Edit"
                                className="edit-button-image"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ))
                ) : (
                  <div className="no-stories-available">
                    No stories available
                  </div>
                )}
                {userStories.length > 4 && !showAll["userStories"] && (
                  <div className="see-more-div">
                    <button
                      className="see-more-button"
                      onClick={() => showAllStories("userStories")}
                    >
                      <span className="see-more-text">See More</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
          {Object.entries(storiesByCategory).map(([category, stories]) => (
            <div key={category}>
              <h2 className="category-heading">
                Top Stories About {category.replace("%20and%20", " and ")}
              </h2>
              <div className="category-stories">
                {stories
                  .slice(0, showAll[category] ? stories.length : 4)
                  .map((story, index) => (
                    <div
                      key={index}
                      className="story-card"
                      onClick={() => navigate(`/story/${story._id}`)}
                      style={{ cursor: "pointer", position: "relative" }}
                    >
                      <div className="story-card-text">
                        <h3>{story.slides[0].heading}</h3>
                        <p>
                          {truncateDescription(story.slides[0].description)}
                        </p>
                      </div>
                      <img
                        src={story.slides[0].Image}
                        alt={story.slides[0].heading}
                      />
                      {user && user._id === story.createdBy._id && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation(); 
                            navigate(`/edit-story/${story._id}`);
                          }}
                          className="edit-button-link"
                        >
                          <div className="EditbuttonImgDiv">
                            <img
                              src={editButtonImage}
                              alt="Edit"
                              className="edit-button-image"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                {stories.length > 4 && !showAll[category] && (
                  <div className="see-more-div">
                    <button
                      className="see-more-button"
                      onClick={() => showAllStories(category)}
                    >
                      <span className="see-more-text">See More</span>
                    </button>
                  </div>
                )}
                {stories.length === 0 && (
                  <div className="no-stories-available">
                    No stories available
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {showLoginPopup && (
          <div className="login-popup">
            <Login togglePopup={toggleLoginPopup} />
          </div>
        )}

        {showRegisterPopup && (
          <div className="register-popup">
            <Register togglePopup={toggleRegisterPopup} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StoryHome;
