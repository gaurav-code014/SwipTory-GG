import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from '../contexts/AuthContext'; 
import { useNavigate } from "react-router-dom"; 
import editButtonImage from "../images/EditButton.png"; 
import { API_BASE_URL } from "../config";

import "../css/StoryHome.css"; 
import Navbar from "./Navbar";

const Bookmark = () => {
 const { user } = useAuth(); 
 const [bookmarkedStories, setBookmarkedStories] = useState([]);
 const navigate = useNavigate(); 

 useEffect(() => {
    const fetchBookmarkedStories = async () => {
      if (user && user._id) { 
        try {
          const response = await axios.get(`${API_BASE_URL}/stories/bookmarked`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });
          setBookmarkedStories(response.data.stories);
        } catch (error) {
          console.error('Failed to fetch bookmarked stories:', error);
        }
      }
    };

    fetchBookmarkedStories();
 }, [user]); 

 const truncateDescription = (description) => {
    const words = description.split(" ");
    if (words.length > 25) {
      return words.slice(0, 25).join(" ") + "...";
    }
    return description;
 };

 return (
    <div>
      <Navbar/>
      <div className="BookmarkContainer">
        {bookmarkedStories.length > 0 ? (
          <div className="stories-container">
            <h2 className="category-heading">Your Bookmarked Stories</h2>
            {bookmarkedStories.map((story, index) => (
              <div
                key={index}
                className="story-card"
                onClick={() => navigate(`/story/${story._id}`)}
                style={{ cursor: "pointer", position: "relative" }}
              >
                <div className="story-card-text">
                 <h3>{story.slides[0].heading}</h3>
                 <p>{truncateDescription(story.slides[0].description)}</p>
                </div>
                <img src={story.slides[0].Image} alt={story.slides[0].heading} />
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
          </div>
        ) : (
          <div className="no-stories-available">No bookmarked stories available</div>
        )}
      </div>
    </div>
 );
};

export default Bookmark;
