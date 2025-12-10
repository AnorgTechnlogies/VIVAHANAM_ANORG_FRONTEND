import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check, Shield, Award, Briefcase, Globe, Users, GraduationCap, Scale, DollarSign, AlertTriangle, Heart } from 'lucide-react';

const PreMaritalInvestigationPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [customServices, setCustomServices] = useState([]);

  // Service price per selection
  const SERVICE_PRICE = 10;

  // Professional features with price
  const investigationFeatures = [
    {
      id: 1,
      icon: <Briefcase className="w-5 h-5" />,
      title: "Job / Business / Income Verification",
      description: "Comprehensive verification of employment status, business legitimacy, and accurate income assessment",
      price: SERVICE_PRICE
    },
    {
      id: 2,
      icon: <Globe className="w-5 h-5" />,
      title: "Social Media & Online Activity Check",
      description: "Deep analysis of social media presence, online behavior, and digital footprint",
      price: SERVICE_PRICE
    },
    {
      id: 3,
      icon: <Users className="w-5 h-5" />,
      title: "Relationship & Friend Circle Investigation",
      description: "Analysis of personal relationships, friend circles, and social connections",
      price: SERVICE_PRICE
    },
    {
      id: 4,
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Education & Qualification Verification",
      description: "Authentication of educational degrees, certificates, and professional qualifications",
      price: SERVICE_PRICE
    },
    {
      id: 5,
      icon: <Users className="w-5 h-5" />, // Changed from UserCheck to Users
      title: "Family Background & Reputation Check",
      description: "Detailed investigation of family history, social standing, and community reputation",
      price: SERVICE_PRICE
    },
    {
      id: 6,
      icon: <Scale className="w-5 h-5" />,
      title: "Criminal / Legal Case Record Search",
      description: "Comprehensive search of criminal records, legal cases, and court proceedings",
      price: SERVICE_PRICE
    },
    {
      id: 7,
      icon: <DollarSign className="w-5 h-5" />,
      title: "Financial Stability Check",
      description: "Assessment of financial health, assets, liabilities, and credit history",
      price: SERVICE_PRICE
    },
    {
      id: 8,
      icon: <AlertTriangle className="w-5 h-5" />,
      title: "Addiction & Behavioural Habits Check",
      description: "Investigation into substance abuse, behavioral patterns, and lifestyle habits",
      price: SERVICE_PRICE
    },
    {
      id: 9,
      icon: <Heart className="w-5 h-5" />,
      title: "Previous Marriage / Affairs / Divorce Status Check",
      description: "Verification of marital history, divorce records, and relationship patterns",
      price: SERVICE_PRICE
    }
  ];

  // Custom additional services
  const additionalServices = [
    { id: 10, title: "Document Authentication", price: SERVICE_PRICE },
    { id: 11, title: "Identity Confirmation", price: SERVICE_PRICE },
    { id: 12, title: "Character Assessment", price: SERVICE_PRICE },
    { id: 13, title: "Personal Consultation Session", price: SERVICE_PRICE },
    { id: 14, title: "Extended Support (60 days)", price: SERVICE_PRICE }
  ];

  const handleServiceToggle = (serviceId, title) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const handleCustomServiceToggle = (serviceId, title) => {
    if (customServices.includes(serviceId)) {
      setCustomServices(customServices.filter(id => id !== serviceId));
    } else {
      setCustomServices([...customServices, serviceId]);
    }
  };

  const handleSelectPlan = () => {
    setIsLoading(true);
    // Prepare selected services data
    const selectedServiceData = investigationFeatures
      .filter(service => selectedServices.includes(service.id))
      .map(service => ({
        id: service.id,
        title: service.title,
        price: service.price
      }));
    
    const selectedCustomData = additionalServices
      .filter(service => customServices.includes(service.id))
      .map(service => ({
        id: service.id,
        title: service.title,
        price: service.price
      }));

    const allSelectedServices = [...selectedServiceData, ...selectedCustomData];
    const totalPrice = allSelectedServices.length * SERVICE_PRICE;

    // Simulate API call with selected data
    setTimeout(() => {
      setIsLoading(false);
      // Navigate to payment with selected services
      navigate('', { 
        state: { 
          services: allSelectedServices,
          totalPrice: totalPrice
        } 
      });
    }, 1000);
  };

  // Calculate totals
  const totalSelectedServices = selectedServices.length + customServices.length;
  const totalPrice = totalSelectedServices * SERVICE_PRICE;

  return (
    <div className="min-h-screen bg-amber-50 py-10 px-4 sm:px-6 lg:px-8 mt-17">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-6">
        <button
          onClick={() => navigate('/PlanHomePage')}
          className="inline-flex items-center gap-2 text-amber-700 hover:text-amber-900 font-medium transition-colors group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>Back to Plans</span>
        </button>
      </div>

      {/* Header */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-red-100 rounded-full">
              <Shield className="w-10 h-10 text-red-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Additional Service
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Select the services you need. Each service costs $10. Build your custom investigation package.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Services Selection */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-amber-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <Award className="w-6 h-6 text-red-600 mr-2" />
                Custom Investigation Package Builder
              </h2>
              
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Select Your Required Services</h3>
                <p className="text-gray-600 mb-4">
                  Choose from our professional investigation services. Each selected service costs <span className="font-bold text-red-600">$10</span>.
                </p>
                
                {/* Selection Summary */}
                <div className="bg-red-50 rounded-lg p-4 mb-6 border border-red-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-800">Selected Services:</span>
                      <span className="ml-2 text-red-600 font-bold">{totalSelectedServices} services</span>
                    </div>
                    <div className="text-lg font-bold text-red-600">
                      Total: ${totalPrice}
                    </div>
                  </div>
                </div>
              </div>

              {/* Core Investigation Services */}
              <div className="mb-10">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Core Investigation Services ($10 each)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {investigationFeatures.map((service) => (
                    <div key={service.id} className={`flex items-start space-x-3 p-4 rounded-lg border-2 transition-all ${selectedServices.includes(service.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-red-300'}`}>
                      <div className="flex-shrink-0 mt-1">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onChange={() => handleServiceToggle(service.id, service.title)}
                          className="w-5 h-5 text-red-600 rounded focus:ring-red-500"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between">
                          <div>
                            <label htmlFor={`service-${service.id}`} className="font-medium text-gray-900 cursor-pointer">
                              {service.title}
                            </label>
                            <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                          </div>
                          <div className="text-red-600 font-bold ml-2">
                            ${service.price}
                          </div>
                        </div>
                        <div className="flex items-center mt-2">
                          <div className="p-1 bg-white rounded shadow-sm">
                            <div className="text-red-600">{service.icon}</div>
                          </div>
                          <span className="text-xs text-gray-500 ml-2">Core Service</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Additional Services */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Additional Services ($10 each)</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {additionalServices.map((service) => (
                    <div key={service.id} className={`flex items-center justify-between p-3 rounded-lg border-2 transition-all ${customServices.includes(service.id) ? 'border-red-500 bg-red-50' : 'border-gray-200 bg-gray-50 hover:border-red-300'}`}>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id={`custom-${service.id}`}
                          checked={customServices.includes(service.id)}
                          onChange={() => handleCustomServiceToggle(service.id, service.title)}
                          className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                        />
                        <label htmlFor={`custom-${service.id}`} className="ml-3 font-medium text-gray-900 cursor-pointer">
                          {service.title}
                        </label>
                      </div>
                      <div className="text-red-600 font-bold">
                        ${service.price}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Benefits Section */}
              <div className="bg-amber-50 rounded-lg p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Why Choose Our Investigation Service?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    "Licensed Professional Investigators",
                    "100% Confidential & Discreet",
                    "Legally Compliant Methods",
                    "Detailed Verifiable Reports",
                    "Fast Turnaround Time",
                    "24/7 Customer Support",
                    "Cross-Verification from Multiple Sources",
                    "Personalized Consultation"
                  ].map((benefit, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="w-5 h-5 text-red-500 mr-2 flex-shrink-0" />
                      <span className="text-gray-700">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Plan Summary & Checkout */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Order Summary Card */}
              <div className="bg-gradient-to-b from-red-800 to-red-900 rounded-2xl shadow-2xl overflow-hidden mb-6 border border-red-700">
                <div className="p-6 text-center bg-gradient-to-r from-red-600 to-red-700">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
                    <Shield className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Custom Investigation</h2>
                  <p className="text-red-100">Build Your Package</p>
                </div>

                <div className="p-6">
                  {/* Order Summary */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Order Summary</h3>
                    
                    {/* Selected Services List */}
                    <div className="space-y-3 mb-4 max-h-[200px] overflow-y-auto pr-2">
                      {totalSelectedServices === 0 ? (
                        <p className="text-red-200 text-sm italic">No services selected yet</p>
                      ) : (
                        <>
                          {/* Core Services */}
                          {selectedServices.map(serviceId => {
                            const service = investigationFeatures.find(s => s.id === serviceId);
                            return service ? (
                              <div key={service.id} className="flex items-center justify-between">
                                <span className="text-red-100 text-sm truncate">{service.title}</span>
                                <span className="text-amber-300 font-bold">${service.price}</span>
                              </div>
                            ) : null;
                          })}
                          
                          {/* Additional Services */}
                          {customServices.map(serviceId => {
                            const service = additionalServices.find(s => s.id === serviceId);
                            return service ? (
                              <div key={service.id} className="flex items-center justify-between">
                                <span className="text-red-100 text-sm truncate">{service.title}</span>
                                <span className="text-amber-300 font-bold">${service.price}</span>
                              </div>
                            ) : null;
                          })}
                        </>
                      )}
                    </div>

                    {/* Price Breakdown */}
                    <div className="border-t border-red-700 pt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-red-200">Services ({totalSelectedServices})</span>
                        <span className="text-white">${totalPrice}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-red-200">Price per service</span>
                        <span className="text-red-200">$10</span>
                      </div>
                    </div>

                    {/* Total */}
                    <div className="border-t border-red-700 pt-4 mt-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-white">Total Amount</span>
                        <span className="text-2xl font-bold text-amber-300">${totalPrice}</span>
                      </div>
                    </div>
                  </div>

                  {/* Guarantee Badges */}
                  <div className="space-y-3 mb-6">
                    <div className="bg-red-700/50 rounded-lg p-4 border border-red-600">
                      <div className="flex items-center">
                        <Shield className="w-6 h-6 text-amber-300 mr-2" />
                        <div>
                          <p className="font-semibold text-white">100% Confidential</p>
                          <p className="text-xs text-red-200">All investigations conducted discreetly</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={handleSelectPlan}
                    disabled={isLoading || totalSelectedServices === 0}
                    className={`w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 ${totalSelectedServices === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <span>{totalSelectedServices === 0 ? 'Select Services First' : `Pay $${totalPrice}`}</span>
                        {totalSelectedServices > 0 && (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                          </svg>
                        )}
                      </>
                    )}
                  </button>

                  {/* Additional Info */}
                  <div className="mt-6 text-center">
                    <div className="text-red-200 text-sm mb-2">
                      <span className="font-semibold">7-10 Days</span> for complete investigation
                    </div>
                    <p className="text-red-200 text-xs">
                      *Minimum 1 service required
                    </p>
                  </div>
                </div>
              </div>

              {/* Process Info */}
              <div className="bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">How It Works</h3>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Select Services</p>
                      <p className="text-sm text-gray-600">Choose investigation services you need</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      2
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Make Payment</p>
                      <p className="text-sm text-gray-600">Pay for selected services</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                      3
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Get Investigation Started</p>
                      <p className="text-sm text-gray-600">Our team begins the verification process</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-6 bg-white rounded-xl shadow-lg p-6 border border-amber-200">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Need Assistance?</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-red-100 rounded-lg">
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Call us at</p>
                      <p className="font-semibold text-gray-900">+91 1800-XXX-XXXX</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-amber-100 rounded-lg">
                      <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Chat with us</p>
                      <p className="font-semibold text-gray-900">24/7 Support Available</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreMaritalInvestigationPage;