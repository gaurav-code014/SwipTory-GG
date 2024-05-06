import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../css/StoryHome.css"; 
import Navbar from "./Navbar";


const YourStory = () => {
    const { user } = useAuth(); 
    const [userStories, setUserStories] = useState([]);
   
    useEffect(() => {
       const fetchUserStories = async () => {
         if (user && user._id) { 
           try {
             const response = await axios.get(`http://localhost:3000/api/stories/user/${user._id}`, {
               headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
             });
             setUserStories(response.data.stories);
           } catch (error) {
             console.error("Failed to fetch user stories:", error);
           }
         }
       };
   
       fetchUserStories();
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
         {userStories.length > 0 ? (
           <div className="stories-container">
             <h2 className="category-heading">Your Stories</h2>
             {userStories.map((story, index) => (
               <Link key={index} to={`/story/${story._id}`} className="story-card story-link">
                 <div className="story-card-text">
                   <h3>{story.slides[0].heading}</h3>
                   <p>{truncateDescription(story.slides[0].description)}</p>
                 </div>
                 <img src={story.slides[0].Image} alt={story.slides[0].heading} />
               </Link>
             ))}
           </div>
         ) : (
           <div className="no-stories-available">No stories available</div>
         )}
       </div>
       </div>
    );
   };
   
   export default YourStory;
   