import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import leftArrow from "../images/left.png";
import rightArrow from "../images/right.png";
import cancelIcon from "../images/cancel1.svg";
import shareIcon from "../images/share.png";
import bookmarkIcon from "../images/BookmarkNo.png";
import BookmarkYesIcon from "../images/BookmarkYes.png";
import likeIcon from "../images/LikeNo.png";
import likeYesIcon from "../images/LikeYes.png"; 
import { useAuth } from "../contexts/AuthContext"; 
import { useLoginPopup } from '../contexts/LoginPopupContext'; 
import { toast } from 'react-hot-toast'; 
import axios from "axios";

import "../css/StoryCarousel.css"; 

const StoryCarousel = ({ initialStory  }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [story, setStory] = useState(initialStory); 
  const [likeCount, setLikeCount] = useState(story.likes.length);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const progressRef = useRef(null);
  const navigate = useNavigate();
  const { token, user } = useAuth(); 
  const { id } = useParams(); 
  const { toggleLoginPopup } = useLoginPopup();


  useEffect(() => {
    
    if (user) {
      setIsLiked(story.likes.includes(user._id));
    }
  }, [story, user]);

  useEffect(() => {
    if (user) {
      const checkIfStoryIsBookmarked = async () => {
        try {
          const response = await axios.get(
            "http://localhost:3000/api/stories/bookmarked",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const bookmarkedStories = response.data.stories;
          const storyIsBookmarked = bookmarkedStories.some(
            (story) => story._id === id
          );
          setIsBookmarked(storyIsBookmarked);
        } catch (error) {
          console.error("Failed to fetch bookmarked stories:", error);
        }
      };

      checkIfStoryIsBookmarked();
    }
  }, [user, token, id]); 

  useEffect(() => {
    const progress = progressRef.current.querySelectorAll(".progress");
    
    progress.forEach((p) => {
      p.classList.remove("active");
      p.classList.remove("passed");
    });
    
    for (let i = 0; i < currentSlide; i++) {
      progress[i].classList.add("passed");
    }
   
    if (currentSlide < progress.length) {
      const currentProgress = progress[currentSlide];
      currentProgress.classList.add("active");
    }

    const progressTimer = setTimeout(() => {
      if (currentSlide < progress.length) {
        const currentProgress = progress[currentSlide];
        currentProgress.classList.remove("active");
        currentProgress.classList.add("passed");
        setCurrentSlide((currentSlide + 1) % story.slides.length);
      }
    }, 5000); 

    return () => {
      clearTimeout(progressTimer);
    };
  }, [currentSlide, story.slides.length]);

  const handleShareClick = async () => {
    try {
      toast.dismiss();
      
      const url = window.location.href;
      
      await navigator.clipboard.writeText(url);
      
      toast.success("Link copied to clipboard");
    } catch (error) {
      console.error("Failed to copy URL:", error);
      toast.error("Failed to copy URL");

    }
  };

  const handleBookmarkClick = async (event) => {
    event.stopPropagation();
    if (!token || !user) {
       toggleLoginPopup(); 
       return;
    }
   
    try {
       const response = await axios.post(
         `http://localhost:3000/api/stories/bookmark/${story._id}`,
         {},
         {
           headers: { Authorization: `Bearer ${token}` },
         }
       );
       toast.dismiss(); 

       if (response.data.message === "Story bookmarked successfully.") {
         setIsBookmarked(true);
         toast.success("Story added to your bookmarks!");
       } else if (response.data.message === "Story unbookmarked successfully.") {
         setIsBookmarked(false);
         toast.success("Story removed from your bookmarks");
       }
    } catch (error) {
       console.error("Failed to update bookmark status:", error);
       toast.error("Failed to update bookmark status."); 
    }
   };

  const handleLikeClick = async (event) => {
    event.stopPropagation(); 
    if (!token || !user) {
      toggleLoginPopup(); 
      return;
    }

    try {
      const response = await axios.post(
        `http://localhost:3000/api/stories/like/${story._id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      toast.dismiss(); 

      if (response.data.message === "Like status updated successfully.") {
        const updatedStory = { ...story, likes: response.data.likes };
        console.log("updatedstory: " + JSON.stringify(updatedStory));
        setStory(updatedStory);
        setLikeCount(updatedStory.likes.length);
       
        setIsLiked(updatedStory.likes.includes(user._id));
        if (updatedStory.likes.includes(user._id)) {
          toast.success("You liked this story!")
        } else {
          toast.success("You disliked this story.")
        }
      }
    } catch (error) {
      console.error("Failed to update like status:", error);
    }
  };

  const handleCloseCarousel = () => {
    navigate("/"); 
  };

 
  const safeCurrentSlide =
    currentSlide < story.slides.length ? currentSlide : 0;

  return (
    <div className="carousel-wrapper">
      <button
        className="carousel-arrow left"
        onClick={() =>
          setCurrentSlide(
            safeCurrentSlide === 0
              ? story.slides.length - 1
              : safeCurrentSlide - 1
          )
        }
        disabled={safeCurrentSlide === 0}
      >
        <img src={leftArrow} alt="Previous Slide" />
      </button>
      <button
        className="carousel-arrow right"
        onClick={() => setCurrentSlide(safeCurrentSlide + 1)}
        disabled={safeCurrentSlide === story.slides.length - 1}
      >
        <img src={rightArrow} alt="Next Slide" />
      </button>
      <div className="carousel-container">
        <div className="progress-container" ref={progressRef}>
          {story.slides.map((slide, index) => (
            <div
              key={index}
              className="progress"
              style={{ animationDuration: "5s" }}
            ></div>
          ))}
        </div>
        <div
          className="carousel-slide"
          onClick={(e) => {
            if (e.clientX > window.innerWidth / 2) {
              setCurrentSlide((currentSlide + 1) % story.slides.length);
            } else {
              setCurrentSlide(
                safeCurrentSlide === 0
                  ? story.slides.length - 1
                  : safeCurrentSlide - 1
              );
            }
          }}
        >
          <img
            src={story.slides[safeCurrentSlide].Image}
            alt={story.slides[safeCurrentSlide].heading}
          />
          <div className="carousel-slide-text">
            <h3>{story.slides[safeCurrentSlide].heading}</h3>
            <p>{story.slides[safeCurrentSlide].description}</p>
            <div className="like-container">
              <button
                className="carousel-button like"
                onClick={(event) => handleLikeClick(event)}
              >
                <img src={isLiked ? likeYesIcon : likeIcon} alt="Like" />
              </button>
              <span>{likeCount}</span>
            </div>
            <div className="bookmark-container">
              <button
                className="carousel-button bookmark"
                onClick={(event) => handleBookmarkClick(event)}
              >
                <img
                  src={isBookmarked ? BookmarkYesIcon : bookmarkIcon}
                  alt="Bookmark"
                />
              </button>
            </div>
          </div>
        </div>

        <button className="carousel-close" onClick={handleCloseCarousel}>
          <img src={cancelIcon} alt="Close" />
        </button>
        <button className="carousel-button share" onClick={handleShareClick}>
          <img src={shareIcon} alt="Share" />
        </button>
      </div>
    </div>
  );
};

export default StoryCarousel;
