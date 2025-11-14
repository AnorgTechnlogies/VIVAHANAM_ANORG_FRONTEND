// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import "./App.css";
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import About from "./components/About"; 
import Contact from "./components/Contact"; 
import Blogs from "./components/Blogs"; 
import BlogDetails from './components/otherpages/BlogDetails';
import FAQ from "./components/FAQ"; 
import TestimonialPage from './components/TestimonialPage';
import RegistrationPage from './components/RegistrationPage';
import PartnersPage from './components/PartnersPage';
import ProfileView from './components/ProfileView';
import UpdateProfile from './components/UpdateProfile';
import Footer from "./components/Footer";
import SignUp from "./components/SignUp"
//"All the pages of our website are working up to this point."


// This place start the Second Phase pages start plan 
import SubscriptionPlans from './components/planPages/SubscriptionPlans'; // Main page to show 3 modes and 4 types of Plan

import PlanDashboard from './components/planPages/planDashboard';
import Diamond from './components/planPages/subscription/Diamond';
import Gold from './components/planPages/subscription/Gold';
import Platinum from './components/planPages/subscription/Platinum';
import Silver from './components/planPages/subscription/Silver';
import Payas from './components/planPages/subscription/PayAs';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/blog/:id/" element={<BlogDetails />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
        <Route path="/profile" element={<ProfileView />} />
        <Route path="/update-profile" element={<UpdateProfile />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/plan-dashboard" element={<PlanDashboard />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/diamond" element={<Diamond />} />
        <Route path="/gold" element={<Gold />} />
        <Route path="/platinum" element={<Platinum />} />
        <Route path="/silver" element={<Silver />} />
        <Route path="/payas" element={<Payas />} />
           
          
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;