import "./App.css";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// component folder
import Navbar from "./components/Navbar";
import SignUp from "./components/Pages/SignUp"
import HomePage from "./components/Home";
import Footer from "./components/Footer";

// pages folder
import AboutPage from "./components/Pages/AboutPage"; 
import ContactPage from "./components/Pages/ContactPage"; 
import BlogsPage from "./components/Pages/BlogsPage"; 
import BlogDetails from './components/Otherpages/BlogDetails';
import FaqPage from "./components/Pages/FaqPage"; 
import TestimonialPage from './components/Pages/TestimonialPage';
import RegistrationPage from './components/Pages/RegistrationPage';
import PartnersPage from './components/Pages/PartnersPage';
import ProfileViewPage from './components/Pages/ProfileViewPage';
import UpdateProfilePage from './components/Pages/UpdateProfilePage';
import PlansHomePage from './components/Pages/PlansHomePage';
import PrivacyPolicy from "./components/OtherPages/PrivacyPolicy";

import WeddingForm from "./components/planPages/WeddingPlan/WeddingForm"

// shop folder
import ShopPage from "./components/shop/ShopPage";

//Matchmaking  folder
import PayAsDashboard from './components/planPages/MatchMaking/PayAsDashboard';

// wedding Folder
import SubscriptionPlans from './components/planPages/WeddingPlan/SubscriptionPlans'; 

//PreMaritalInvestigation folder
import PreMaritalInvestigationPage from "./components/planPages/PreMaritalInvestigation/PreMaritalInvestigationPage";


//Payment folder
import PaymentCancelled from './components/Payment/PaymentCancelled';
import PaymentSuccess from './components/Payment/PaymentSuccess';
import Payment from './components/Payment/PaymentPage';



function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/blog/:id/" element={<BlogDetails />} />
        <Route path="/testimonials" element={<TestimonialPage />} />
        <Route path="/profile" element={<ProfileViewPage />} />
        <Route path="/update-profile" element={<UpdateProfilePage />} />
        <Route path="/subscription-plans" element={<SubscriptionPlans />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/partners" element={<PartnersPage />} />
        <Route path="/payas" element={<PayAsDashboard />} />
        {/* Credit store ke liye simple route, jo PayAsDashboard (credits store) kholta hai */}
        <Route path="/credit-store" element={<PayAsDashboard />} />
        <Route path="/plans-home" element={<PlansHomePage />} />
        <Route path="/shops" element={<ShopPage />} />
        <Route path="/PlanHomePage" element={<PlansHomePage />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-cancelled" element={<PaymentCancelled />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/PreMarital-Investigation-page" element={< PreMaritalInvestigationPage/>} />
        <Route path ="/Wedding-Service-Form" element ={<WeddingForm/>} />
        <Route path ="/Privacy-Policy-Page" element ={<PrivacyPolicy/>} />
     </Routes>
      <Footer />
    </Router>
  );
}

export default App;