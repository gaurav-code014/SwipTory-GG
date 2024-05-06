import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from 'react-hot-toast';
import StoryHome from './components/StoryHome.jsx';
import StoryDetails from './components/StoryDetails.jsx';
import AddStory from './components/AddStory.jsx';
import Bookmark from './components/Bookmark.jsx';
import EditStory from './components/EditStory.jsx';
import YourStory from './components/YourStory.jsx';
import { LoginPopupProvider } from './contexts/LoginPopupContext'; 
import Login from './components/Login.jsx';

const App = () => {
 const [showLoginPopup, setShowLoginPopup] = useState(false);

 const toggleLoginPopup = () => {
    setShowLoginPopup(!showLoginPopup);
 };

 return (
    <AuthProvider>
      <LoginPopupProvider value={{ toggleLoginPopup }}>
        <Router>
          <Toaster />
          <Routes>
            <Route path="/" element={<StoryHome />} />
            <Route path="/story/:id" element={<StoryDetails />} />
            <Route path="/edit-story/:id" element={<EditStory />} />
            <Route path="/add" element={<AddStory />} />
            <Route path="/bookmark" element={<Bookmark />} />
            <Route path="/your-story" element={<YourStory />} />
          </Routes>
          {showLoginPopup && (
            <div className="login-popup">
              <Login togglePopup={toggleLoginPopup} />
            </div>
          )}
        </Router>
      </LoginPopupProvider>
    </AuthProvider>
 );
};

export default App;
