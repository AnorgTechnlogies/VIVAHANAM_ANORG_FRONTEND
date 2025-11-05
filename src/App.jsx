// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import HomePage from "./components/HomePage";
import About from "./components/About"; // Assuming you have this component
import Contact from "./components/Contact"; // Assuming you have this component
import Blogs from "./components/Blogs"; // Assuming you have this component
import Services from "./components/Services"; // Assuming you have this component (renamed from 'service' for convention)
import Products from "./components/Products"; // Assuming you have this component
import FAQ from "./components/FAQ"; // Assuming you have this component
import Portfolio from "./components/Portfolio"; // Assuming you have this component (corrected spelling)
import Plans from "./components/planPages/plans";
import "./App.css";
import Footer from "./components/Footer";
import BlogDetails from './components/otherpages/BlogDetails';
import TestimonialPage from './components/TestimonialPage';
import RegistrationPage from './components/RegistrationPage';
import PartnersPage from './components/PartnersPage';


function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/products" element={<Products />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/plans" element={<Plans />} />
        <Route path="/blog/:id/" element={<BlogDetails />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
           <Route path="/register" element={<RegistrationPage />} />
           <Route path="/partners" element={<PartnersPage />} />
      
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;