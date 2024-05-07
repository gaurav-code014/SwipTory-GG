import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext"; 
import axios from "axios";
import "../css/AddEditStory.css"; 
import cancelIcon from "../images/cancel.png"; 
import { API_BASE_URL } from "../config";


const AddStory = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [slides, setSlides] = useState([
    { heading: "", description: "", Image: "", category: "" },
    { heading: "", description: "", Image: "", category: "" },
    { heading: "", description: "", Image: "", category: "" },
  ]);
  const [activeSlide, setActiveSlide] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const handleCancelClick = () => {
    navigate("/"); 
 };

  const categories = [
    "food",
    "health and fitness",
    "travel",
    "movies",
    "education",
  ];

  const handleInputChange = (index, field, value) => {
    const newSlides = [...slides];
    newSlides[index][field] = value;
    setSlides(newSlides);
  };

  const addSlide = () => {
    if (slides.length < 6) {
      setSlides([
        ...slides,
        { heading: "", description: "", Image: "", category: "" },
      ]);
    }
  };

  const removeSlide = (index) => {
    if (slides.length > 3) {
      const newSlides = [...slides];
      newSlides.splice(index, 1);
      setSlides(newSlides);
      // Set active slide to the first slide after deletion
      setActiveSlide(0);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
       navigate("/");
       return;
    }
   
    
    setValidationErrors({});
   
    
    const newValidationErrors = {};
   
    const allFieldsFilled = slides.every(slide => 
       slide.heading && slide.description && slide.Image && slide.category
    );
   
    if (!allFieldsFilled) {
       setValidationErrors({ general: "Please fill all the fields." });
       return;
    }
   
    const firstThreeSlidesFilled = slides.slice(0, 3).every(slide => 
       slide.heading && slide.description && slide.Image && slide.category
    );
   
    if (!firstThreeSlidesFilled) {
       setValidationErrors({ general: "First 3 slides are mandatory." });
       return;
    }
   
    const categories = slides.map(slide => slide.category);
    if (new Set(categories).size > 1) {
       setValidationErrors({ general: "All slides must have the same category." });
       return;
    }
   
    const urlRegex = /^(http|https):\/\/[^ "]+\.[^ "]+$/;
    const allImageUrlsValid = slides.every(slide => urlRegex.test(slide.Image));
    if (!allImageUrlsValid) {
       setValidationErrors({ general: "Image URL must be a valid link." });
       return;
    }
   
    try {
       const response = await axios.post(
         `${API_BASE_URL}/stories`,
         {
           slides,
           createdBy: user._id,
         },
         {
           headers: {
             Authorization: `Bearer ${localStorage.getItem("token")}`,
             "Content-Type": "application/json",
           },
         }
       );
       console.log(response.data);
       navigate("/");
    } catch (error) {
       console.error("Failed to add story:", error);
    }
   };
   
   
   

   return (
    <>
       <div className="wrapper">
         <div className="add-story-container">
         <div className="add-story-to-feed">Add story to feed</div>
         <button
            onClick={handleCancelClick}
            className="cancel-button"
            style={{
              position: "absolute",
              top: "10px",
              right: "20px",
              background: "none",
              border: "none",
              cursor: "pointer",
            }}
          >
            <img src={cancelIcon} alt="Cancel" />
          </button>
           <div className="slide-limit-text">Add up to 6 slides</div>
           <div className="slide-selector">
             {slides.map((slide, index) => (
               <div key={index} className="slide-button-container">
                 <button
                   onClick={() => setActiveSlide(index)}
                   className={`slide-button ${
                    index === activeSlide ? "active" : ""
                   } slide-number`}
                 >
                   Slide {index + 1}
                 </button>
                 {index > 2 && (
                   <button
                    onClick={() => removeSlide(index)}
                    className="cancel-button"
                   >
                    X
                   </button>
                 )}
               </div>
             ))}
             {slides.length < 6 && (
               <button
                 onClick={addSlide}
                 className="add-slide-button slide-number"
               >
                 Add +
               </button>
             )}
           </div>
           <div className="content-container">
           {slides.map((slide, index) => (
             <div key={index} style={{ display: index === activeSlide ? "block" : "none" }} className="content1">
               <div className="input-group">
                 <label className="label">Heading</label>
                 <input
                   type="text"
                   placeholder="Your heading"
                   value={slide.heading}
                   onChange={(e) => handleInputChange(index, "heading", e.target.value)}
                   className="input-field heading"
                 />
               </div>
               <div className="input-group">
                 <label className="label">Description</label>
                 <textarea
                   placeholder="Description"
                   value={slide.description}
                   onChange={(e) => handleInputChange(index, "description", e.target.value)}
                   className="textarea-field description"
                 />
               </div>
               <div className="input-group">
                 <label className="label">Image URL</label>
                 <input
                   type="text"
                   placeholder="Your image URL"
                   value={slide.Image}
                   onChange={(e) => handleInputChange(index, "Image", e.target.value)}
                   className="input-field image"
                 />
               </div>
               <div className="input-group">
                 <label className="label">Category</label>
                 <select
                   value={slide.category}
                   onChange={(e) => handleInputChange(index, "category", e.target.value)}
                   className="input-field"
                 >
                   <option value="">Select Category</option>
                   {categories.map((category) => (
                    <option key={category} value={category}>
                       {category}
                    </option>
                   ))}
                 </select>
               </div>
             </div>
           ))}
           {validationErrors.general && (
             <div
               style={{
                 color: "red",
                 fontFamily: "DM Sans",
                 fontSize: "14px",
                 fontWeight: "700",
                 marginBottom: "20px",
                 marginLeft:"5%"
               }}
             >
               {validationErrors.general}
             </div>
           )}
           </div>
           <div className="button-group">
             <button
               onClick={() => setActiveSlide(activeSlide - 1)}
               disabled={activeSlide === 0}
               className="previous-button"
             >
               Previous
             </button>
             <button
               onClick={() => setActiveSlide(activeSlide + 1)}
               disabled={activeSlide === slides.length - 1}
               className="next-button"
             >
               Next
             </button>
             <button onClick={handleSubmit} className="post-button">
               Post
             </button>
           </div>
         </div>
       </div>
    </>
   );
   
};

export default AddStory;
