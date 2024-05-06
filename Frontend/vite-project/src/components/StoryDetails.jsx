
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import StoryCarousel from "./StoryCarousel"; 
import axios from "axios"; 
import "../css/StoryDetails.css";

const StoryDetails = () => {
  const { id } = useParams();
  const [story, setStory] = useState(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/stories/${id}`
        );
        setStory(response.data.story);
        setIsLoading(false); 
      } catch (error) {
        console.error("Failed to fetch story:", error);
        setIsLoading(false); 
      }
    };

    fetchStory();
  }, [id]);

  if (isLoading) {
    return (
      <div className="loader-container visible">
        <div className="loader"></div>
      </div>
    );
  }

  return <StoryCarousel initialStory={story} />;
};

export default StoryDetails;
