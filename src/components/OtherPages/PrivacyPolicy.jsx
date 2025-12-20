// components/PrivacyPolicy.jsx
import React, { useState, useEffect } from 'react';
import { 
  Shield,
  Lock,
  Eye,
  Database,
  User,
  Cookie,
  Mail,
  Users,
  Bell,
  Settings,
  Download,
  Clock,
  Globe,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  MessageSquare,
  Smartphone,
  Share2,
  CreditCard,
  Search,
  Menu,
  X,
  Home,
  Phone,
  HelpCircle,
  FileText,
  ShieldAlert
} from 'lucide-react';

const PrivacyPolicy = () => {
  const [activeSection, setActiveSection] = useState('introduction');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Detect screen size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const sections = [
    { id: 'introduction', title: 'Introduction', icon: <Shield size={20} /> },
    { id: 'data-collection', title: 'Data Collection', icon: <Database size={20} /> },
    { id: 'data-usage', title: 'How We Use Data', icon: <Eye size={20} /> },
    { id: 'data-sharing', title: 'Data Sharing', icon: <Users size={20} /> },
    { id: 'data-control', title: 'Your Control', icon: <Settings size={20} /> },
    { id: 'security', title: 'Security', icon: <Lock size={20} /> },
    { id: 'cookies', title: 'Cookies', icon: <Cookie size={20} /> },
    { id: 'international', title: 'International Transfer', icon: <Globe size={20} /> },
    { id: 'contact', title: 'Contact Us', icon: <Mail size={20} /> },
  ];

  const renderMobileMenu = () => (
    <div className="lg:hidden">
      <div className="fixed top-0 left-0 right-0 bg-white shadow-lg z-50">
        <div className="px-4 py-3 flex items-center justify-between border-b">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-red-600 rounded-full flex items-center justify-center">
              <Shield size={20} className="text-white" />
            </div>
            <span className="font-semibold text-gray-900">Privacy Policy</span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-gray-100"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        
        {isMobileMenuOpen && (
          <div className="bg-white border-b shadow-inner max-h-[70vh] overflow-y-auto">
            <nav className="py-2">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => {
                    setActiveSection(section.id);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 p-4 text-left ${
                    activeSection === section.id
                      ? 'bg-rose-50 text-rose-600 border-r-4 border-rose-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {section.icon}
                  <span className="font-medium">{section.title}</span>
                </button>
              ))}
            </nav>
            
            <div className="px-4 py-3 border-t">
              <h4 className="font-bold text-gray-900 mb-2 text-sm">Quick Links</h4>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Home', icon: <Home size={14} />, href: '#' },
                  { label: 'Support', icon: <HelpCircle size={14} />, href: '#' },
                  { label: 'Terms', icon: <FileText size={14} />, href: '#' },
                  { label: 'Contact', icon: <Phone size={14} />, href: '#' },
                ].map((link, index) => (
                  <a
                    key={index}
                    href={link.href}
                    className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm text-gray-600 hover:bg-gray-100"
                  >
                    {link.icon}
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-gray-900 mt-21">
      {/* Mobile Header Navigation */}
      {renderMobileMenu()}

      {/* Desktop Top Navigation Banner */}
      <div className="hidden lg:block bg-white">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-rose-600 to-red-600 rounded-full flex items-center justify-center">
                <Shield size={20} className="text-white" />
              </div>
              <span className="font-semibold text-gray-900">Privacy & Security Center</span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                <CheckCircle size={16} className="inline mr-1" />
                Verified Profiles
              </a>
              <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                <Lock size={16} className="inline mr-1" />
                100% Privacy
              </a>
              <a href="#" className="text-rose-600 hover:text-rose-700 font-medium">
                <Users size={16} className="inline mr-1" />
                Trusted by Millions
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Padding for Fixed Header */}
      <div className={`${isMobile ? 'pt-20' : 'pt-8'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8 lg:mb-12 border-b border-gray-200 pb-6 sm:pb-8">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-4xl mx-auto px-2">
              Your privacy is important to us, and so is being transparent about how we collect, use, and share information about you.
            </p>
            <div className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-gray-50 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-sm">
              <Clock size={14} className="text-gray-500" />
              <span className="text-gray-600">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </span>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
            {/* Sidebar Navigation - Desktop */}
            <div className="hidden lg:block lg:w-1/4">
              <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200 sticky top-8">
                <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center gap-2">
                  <Shield size={20} className="text-rose-600" />
                  Navigation
                </h3>
                <nav className="space-y-1 sm:space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full flex items-center justify-between p-3 sm:p-4 rounded-lg transition-all duration-200 ${
                        activeSection === section.id
                          ? 'bg-white border border-rose-200 shadow-sm'
                          : 'hover:bg-white hover:border hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className={`p-1 sm:p-1.5 rounded ${activeSection === section.id ? 'bg-rose-100 text-rose-600' : 'bg-gray-100 text-gray-600'}`}>
                          {section.icon}
                        </div>
                        <span className="font-medium text-sm sm:text-base">{section.title}</span>
                      </div>
                      <ChevronRight size={16} className="text-gray-400 hidden sm:block" />
                    </button>
                  ))}
                </nav>
                
                {/* Quick Links */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                  <h4 className="font-bold text-gray-900 mb-3 text-sm sm:text-base">Quick Links</h4>
                  <div className="space-y-1 sm:space-y-2">
                    {[
                      { label: 'Terms of Use', href: '#', icon: <FileText size={14} /> },
                      { label: 'Be Safe Online', href: '#', icon: <ShieldAlert size={14} /> },
                      { label: 'Report Misuse', href: '#', icon: <AlertCircle size={14} /> },
                      { label: 'Customer Support', href: '#', icon: <HelpCircle size={14} /> },
                    ].map((link, index) => (
                      <a 
                        key={index}
                        href={link.href}
                        className="flex items-center gap-2 p-2 sm:p-3 text-gray-600 hover:text-rose-600 hover:bg-white rounded-lg transition-colors text-sm"
                      >
                        {link.icon}
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:w-3/4">
              <div className="bg-white rounded-xl p-4 sm:p-6 lg:p-8 border border-gray-200 shadow-sm">
                
                {/* Introduction Section */}
                {activeSection === 'introduction' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-rose-50 rounded-lg">
                        <Shield size={20} className="text-rose-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
                        Our Commitment to Your Privacy
                      </h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-gray-700 mb-3 sm:mb-4 text-sm sm:text-base">
                          This policy is intended to help you understand:
                        </p>
                        <ul className="space-y-2 sm:space-y-3 text-gray-700 text-sm sm:text-base">
                          <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                              1
                            </div>
                            <span>What information does Vivahanam.com collect from you?</span>
                          </li>
                          <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                              2
                            </div>
                            <span>How we use information we collect?</span>
                          </li>
                          <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                              3
                            </div>
                            <span>With whom does we share your information?</span>
                          </li>
                          <li className="flex items-start sm:items-center gap-2 sm:gap-3">
                            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center text-xs sm:text-sm flex-shrink-0">
                              4
                            </div>
                            <span>How to access and/or control your information?</span>
                          </li>
                        </ul>
                      </div>

                      <div className="p-4 sm:p-6 bg-rose-50/30 rounded-xl border border-rose-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">About Our Service</h3>
                        <p className="text-gray-700 text-sm sm:text-base">
                          Vivahanam.com is an advertising platform providing targeted advertising services for the purpose of matchmaking ("Service"). In order to provide the services, you (User/Member) are required to submit certain personal information which is displayed on the Site on behalf of you to find the perfect life partner. You hereby provide your consent to collect, process, and share your personal information with other user/members in order to provide the service.
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Data Collection Section */}
                {activeSection === 'data-collection' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <Database size={20} className="text-blue-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Data We Collect</h2>
                    </div>
                    
                    <div className="space-y-6 sm:space-y-8">
                      <div>
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
                          Vivahanam.com gathers three types of information:
                        </h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
                          {[
                            {
                              title: 'Information You Submit',
                              icon: <User className="text-rose-600" size={20} />,
                              color: 'rose'
                            },
                            {
                              title: 'Information Not Directly Submitted',
                              icon: <Eye className="text-blue-600" size={20} />,
                              color: 'blue'
                            },
                            {
                              title: 'From Others',
                              icon: <Users className="text-green-600" size={20} />,
                              color: 'green'
                            }
                          ].map((item, index) => (
                            <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 text-center hover:shadow-md transition-shadow">
                              <div className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-${item.color}-50 flex items-center justify-center mx-auto mb-3 sm:mb-4`}>
                                {item.icon}
                              </div>
                              <h4 className="font-bold text-gray-900 text-sm sm:text-base md:text-lg">{item.title}</h4>
                            </div>
                          ))}
                        </div>

                        {/* Information You Submit */}
                        <div className="mb-6 sm:mb-8">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2 bg-rose-100 rounded">
                              <User size={16} className="text-rose-600" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900">Information Submitted by You</h4>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                            <ul className="space-y-3 sm:space-y-4 text-sm sm:text-base">
                              {[
                                { 
                                  icon: <User size={14} />,
                                  text: 'Personal data: name, gender, date of birth, contact details, educational qualification, employment details, photos, marital status, interests'
                                },
                                { 
                                  icon: <CreditCard size={14} />,
                                  text: 'Sensitive personal data: identity proofs, bank account, debit/credit card number or UPI (for paid services)'
                                },
                                { 
                                  icon: <MessageSquare size={14} />,
                                  text: 'Testimonials including success stories and photos'
                                },
                                { 
                                  icon: <Bell size={14} />,
                                  text: 'Information submitted during surveys, contests, promotions or events'
                                },
                                { 
                                  icon: <Users size={14} />,
                                  text: 'Details shared with customer care team'
                                },
                                { 
                                  icon: <Share2 size={14} />,
                                  text: 'Option to send profiles to contacts via WhatsApp'
                                }
                              ].map((item, idx) => (
                                <li key={idx} className="flex items-start gap-2 sm:gap-3">
                                  <div className="mt-0.5 text-rose-600 flex-shrink-0">{item.icon}</div>
                                  <span className="text-gray-700">{item.text}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* Information Not Directly Submitted */}
                        <div className="mb-6 sm:mb-8">
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2 bg-blue-100 rounded">
                              <Eye size={16} className="text-blue-600" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900">Information Not Directly Submitted</h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                              <h5 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <Search size={16} className="text-blue-600" />
                                User Activity
                              </h5>
                              <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm">
                                <li>• Date and time you logged in</li>
                                <li>• Features you've been using</li>
                                <li>• Searches, clicks and pages visited</li>
                                <li>• Interaction with other users including messages</li>
                              </ul>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                              <h5 className="font-bold text-gray-900 mb-2 sm:mb-3 flex items-center gap-2 text-sm sm:text-base">
                                <Smartphone size={16} className="text-blue-600" />
                                Device Information
                              </h5>
                              <ul className="space-y-1 sm:space-y-2 text-gray-700 text-sm">
                                <li>• IP address, device ID and type</li>
                                <li>• Device specifications and app settings</li>
                                <li>• App error reports</li>
                                <li>• Browser type and version</li>
                                <li>• Operating system</li>
                                <li>• Cookies and tracking identifiers</li>
                              </ul>
                            </div>
                          </div>
                        </div>

                        {/* Information From Others */}
                        <div>
                          <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                            <div className="p-1.5 sm:p-2 bg-green-100 rounded">
                              <Users size={16} className="text-green-600" />
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-gray-900">Information We Receive From Others</h4>
                          </div>
                          <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                              <div className="p-2 sm:p-3 bg-green-50 rounded-lg flex-shrink-0">
                                <Users size={20} className="text-green-600" />
                              </div>
                              <div>
                                <h5 className="font-bold text-gray-900 mb-1 sm:mb-2 text-sm sm:text-base">Social Media Integration</h5>
                                <p className="text-gray-700 text-sm sm:text-base">
                                  You have the option to use your social media login (such as Google SSO/Apple ID) to create and log into your Vivahanam.com account. This saves you from remembering one more login credential and allows you to share some information from your social media account with us.
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Data Usage Section */}
                {activeSection === 'data-usage' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-purple-50 rounded-lg">
                        <Eye size={20} className="text-purple-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">How We Use Your Information</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        {[
                          {
                            title: 'Service Delivery',
                            description: 'Providing and maintaining our matchmaking services',
                            icon: '🤝',
                            color: 'bg-rose-50 text-rose-600'
                          },
                          {
                            title: 'Profile Matching',
                            description: 'Finding compatible matches based on your preferences',
                            icon: '💞',
                            color: 'bg-pink-50 text-pink-600'
                          },
                          {
                            title: 'Communication',
                            description: 'Sending important updates, notifications, and matches',
                            icon: '📧',
                            color: 'bg-blue-50 text-blue-600'
                          },
                          {
                            title: 'Improvements',
                            description: 'Enhancing user experience and developing new features',
                            icon: '🚀',
                            color: 'bg-purple-50 text-purple-600'
                          },
                          {
                            title: 'Security',
                            description: 'Protecting accounts and preventing fraud',
                            icon: '🛡️',
                            color: 'bg-green-50 text-green-600'
                          },
                          {
                            title: 'Legal Compliance',
                            description: 'Meeting regulatory requirements and obligations',
                            icon: '⚖️',
                            color: 'bg-gray-100 text-gray-600'
                          }
                        ].map((item, index) => (
                          <div key={index} className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-sm transition-shadow">
                            <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-lg ${item.color} flex items-center justify-center text-xl sm:text-2xl mb-3 sm:mb-4`}>
                              {item.icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                            <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Our Commitment</h3>
                        <p className="text-gray-700 text-sm sm:text-base">
                          We only use your information for purposes directly related to providing you with the best possible matchmaking experience. We never sell your personal information to third parties for marketing purposes.
                        </p>
                      </div>
                    </div>
                  </section>
                )}

                {/* Data Sharing Section */}
                {activeSection === 'data-sharing' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-indigo-50 rounded-lg">
                        <Users size={20} className="text-indigo-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Data Sharing</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">With Whom Do We Share Your Information?</h3>
                        
                        <div className="space-y-3 sm:space-y-4">
                          {[
                            {
                              title: 'Other Members',
                              description: 'Your profile information (excluding sensitive data) is visible to other registered members for matchmaking purposes',
                              icon: '👥'
                            },
                            {
                              title: 'Service Providers',
                              description: 'Trusted partners who help us operate our platform (payment processors, cloud hosting, analytics)',
                              icon: '🤝'
                            },
                            {
                              title: 'Legal Authorities',
                              description: 'When required by law or to protect our rights and the safety of our members',
                              icon: '⚖️'
                            },
                            {
                              title: 'Business Transfers',
                              description: 'In case of merger, acquisition, or sale of assets, your information may be transferred',
                              icon: '🔄'
                            }
                          ].map((item, index) => (
                            <div key={index} className="flex items-start gap-3 p-3 sm:p-4 bg-white rounded-lg border border-gray-100">
                              <div className="text-xl sm:text-2xl mt-0.5 flex-shrink-0">{item.icon}</div>
                              <div>
                                <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">{item.title}</h4>
                                <p className="text-gray-700 text-sm sm:text-base">{item.description}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 bg-rose-50/30 rounded-xl border border-rose-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Important Notes</h3>
                        <ul className="space-y-2 text-gray-700 text-sm sm:text-base">
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                            <span>We never share your contact information directly with other members</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                            <span>All third-party service providers are bound by strict confidentiality agreements</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle size={16} className="text-rose-600 mt-0.5 flex-shrink-0" />
                            <span>You control what information is visible on your public profile</span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </section>
                )}

                {/* Data Control Section */}
                {activeSection === 'data-control' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                        <Settings size={20} className="text-amber-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Your Control Over Data</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
                        {[
                          {
                            title: 'Access Your Data',
                            description: 'View and download your personal information',
                            icon: <Eye className="text-blue-600" size={16} />
                          },
                          {
                            title: 'Update Information',
                            description: 'Edit your profile and preferences anytime',
                            icon: <Settings className="text-green-600" size={16} />
                          },
                          {
                            title: 'Delete Account',
                            description: 'Request complete deletion of your data',
                            icon: <User className="text-rose-600" size={16} />
                          },
                          {
                            title: 'Export Data',
                            description: 'Download your data in machine-readable format',
                            icon: <Download className="text-purple-600" size={16} />
                          }
                        ].map((item, index) => (
                          <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-white flex items-center justify-center mb-3 sm:mb-4 border border-gray-200">
                              {item.icon}
                            </div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">{item.title}</h3>
                            <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">{item.description}</p>
                            <button className="px-3 sm:px-4 py-1.5 sm:py-2 bg-white border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm">
                              Manage
                            </button>
                          </div>
                        ))}
                      </div>
                      
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Privacy Settings</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {[
                            'Control who can see your profile',
                            'Manage photo privacy settings',
                            'Adjust notification preferences',
                            'Set contact visibility options'
                          ].map((setting, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-100 gap-2">
                              <span className="text-gray-700 text-sm sm:text-base">{setting}</span>
                              <button className="px-3 py-1.5 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-xs sm:text-sm">
                                Configure
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Security Section */}
                {activeSection === 'security' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-green-50 rounded-lg">
                        <Lock size={20} className="text-green-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">How We Secure Your Information</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-green-700">Protection Measures</h3>
                          <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base">
                            {[
                              'End-to-end encryption for sensitive data',
                              'Regular security audits and penetration testing',
                              'Secure data centers with 24/7 monitoring',
                              'Access controls and authentication protocols',
                              'Employee privacy and security training',
                              'Incident response and breach notification plan'
                            ].map((item, index) => (
                              <li key={index} className="flex items-start gap-2 sm:gap-3">
                                <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5 flex-shrink-0"></div>
                                <span className="text-gray-700">{item}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4 text-blue-700">Data Retention</h3>
                          <div className="space-y-2 sm:space-y-3">
                            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Active Accounts</h4>
                              <p className="text-gray-700 text-sm">Data retained while your account is active</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Inactive Accounts</h4>
                              <p className="text-gray-700 text-sm">Automatically deleted after 2 years of inactivity</p>
                            </div>
                            <div className="p-3 sm:p-4 bg-white rounded-lg border border-gray-100">
                              <h4 className="font-bold text-gray-900 mb-1 text-sm sm:text-base">Deleted Accounts</h4>
                              <p className="text-gray-700 text-sm">Permanently deleted within 90 days of request</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Cookies Section */}
                {activeSection === 'cookies' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-amber-50 rounded-lg">
                        <Cookie size={20} className="text-amber-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Cookies & Tracking Technologies</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3 sm:mb-4">Types of Cookies We Use</h3>
                        <div className="space-y-2 sm:space-y-3">
                          {[
                            { 
                              type: 'Essential', 
                              desc: 'Required for basic site functionality (login, security)', 
                              required: true 
                            },
                            { 
                              type: 'Performance', 
                              desc: 'Help us understand how visitors interact with our site', 
                              required: false 
                            },
                            { 
                              type: 'Functionality', 
                              desc: 'Remember your settings and preferences', 
                              required: false 
                            },
                            { 
                              type: 'Advertising', 
                              desc: 'Used for personalized match suggestions', 
                              required: false 
                            },
                          ].map((cookie, index) => (
                            <div key={index} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-white rounded-lg border border-gray-100 gap-2">
                              <div>
                                <h4 className="font-bold text-gray-900 text-sm sm:text-base">{cookie.type}</h4>
                                <p className="text-gray-600 text-xs sm:text-sm mt-0.5">{cookie.desc}</p>
                              </div>
                              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${cookie.required ? 'bg-rose-100 text-rose-700' : 'bg-blue-100 text-blue-700'}`}>
                                {cookie.required ? 'Required' : 'Optional'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Cookie Management</h3>
                          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                            You can control cookie preferences through your browser settings. Note that disabling essential cookies may affect site functionality.
                          </p>
                          <button className="px-4 sm:px-6 py-2 sm:py-3 bg-rose-600 text-white rounded-lg font-bold hover:bg-rose-700 transition-colors text-sm sm:text-base">
                            Manage Cookie Preferences
                          </button>
                        </div>
                        <div className="p-4 sm:p-6 bg-rose-50/30 rounded-xl border border-rose-100">
                          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Do Not Track</h3>
                          <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                            We respect Do Not Track signals and do not track, plant cookies, or use advertising when a Do Not Track browser mechanism is in place.
                          </p>
                          <div className="flex items-center gap-2 text-rose-600">
                            <Shield size={14} />
                            <span className="text-xs sm:text-sm">Your privacy preferences are respected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* International Transfer Section */}
                {activeSection === 'international' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                        <Globe size={20} className="text-blue-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">International Data Transfer</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                          <Globe size={24} className="text-blue-600 mt-1 flex-shrink-0" />
                          <div>
                            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Global Operations</h3>
                            <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                              Vivahanam.com operates globally with services available in multiple countries including:
                            </p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                              {['India', 'USA', 'Canada', 'UK', 'Singapore', 'Australia', 'UAE', 'NRI'].map((country) => (
                                <div key={country} className="px-3 py-2 bg-white border border-gray-200 rounded-lg text-center">
                                  <span className="font-medium text-gray-900 text-sm">{country}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                        <div className="p-4 sm:p-6 bg-white rounded-xl border border-gray-200">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Data Protection Standards</h3>
                          <p className="text-gray-700 text-sm sm:text-base">
                            Regardless of where your data is processed, we maintain the same high standards of data protection and implement appropriate safeguards including Standard Contractual Clauses.
                          </p>
                        </div>
                        <div className="p-4 sm:p-6 bg-white rounded-xl border border-gray-200">
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2 sm:mb-3">Your Rights by Region</h3>
                          <p className="text-gray-700 text-sm sm:text-base">
                            Depending on your location, you may have additional rights under regulations like GDPR (EU), CCPA (California), or PDPA (Singapore).
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Contact Section */}
                {activeSection === 'contact' && (
                  <section>
                    <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6 lg:mb-8">
                      <div className="p-2 sm:p-3 bg-rose-50 rounded-lg">
                        <Mail size={20} className="text-rose-600" />
                      </div>
                      <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Contact Us</h2>
                    </div>
                    
                    <div className="space-y-4 sm:space-y-6">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-rose-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <Mail size={20} className="text-rose-600" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">General Inquiries</h3>
                          <p className="text-gray-600 text-sm mb-2 sm:mb-4">privacy@vivahanam.com</p>
                          <p className="text-xs sm:text-sm text-gray-500">Response time: 24-48 hours</p>
                        </div>
                        
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <User size={20} className="text-blue-600" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Data Protection Officer</h3>
                          <p className="text-gray-600 text-sm">dpo@vivahanam.com</p>
                        </div>
                        
                        <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-red-100 rounded-lg flex items-center justify-center mb-3 sm:mb-4">
                            <AlertCircle size={20} className="text-red-600" />
                          </div>
                          <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 sm:mb-2">Emergency</h3>
                          <p className="text-gray-600 text-sm">emergency@vivahanam.com</p>
                          <p className="text-xs sm:text-sm text-gray-500">For urgent privacy concerns</p>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 bg-rose-50/30 rounded-xl border border-rose-100">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Policy Updates</h3>
                        <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                          We regularly review and update our privacy policy. We will notify you of any material changes via email or through a prominent notice on our website.
                        </p>
                        <div className="flex items-center gap-2 text-rose-600">
                          <Bell size={14} />
                          <span className="text-xs sm:text-sm">You will be notified of significant changes</span>
                        </div>
                      </div>
                      
                      <div className="p-4 sm:p-6 bg-gray-50 rounded-xl border border-gray-200">
                        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Mailing Address</h3>
                        <div className="text-gray-700 text-sm sm:text-base">
                          <p className="font-medium">Vivahanam.com</p>
                          <p>Matrimony Services Ltd.</p>
                          <p>11583 Independence Parkway, Suite 430,</p>
                          <p>Frisco, TX 75035, USA</p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </div>

              {/* Footer */}
              <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 text-sm">
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4">Need Help?</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-gray-600">
                      <a href="#" className="block hover:text-rose-600">Member Login</a>
                      <a href="#" className="block hover:text-rose-600">Sign Up</a>
                      <a href="#" className="block hover:text-rose-600">Partner Search</a>
                      <a href="#" className="block hover:text-rose-600">Customer Support</a>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4">Company</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-gray-600">
                      <a href="#" className="block hover:text-rose-600">About Us</a>
                      <a href="#" className="block hover:text-rose-600">Careers</a>
                      <a href="#" className="block hover:text-rose-600">Awards & Recognition</a>
                      <a href="#" className="block hover:text-rose-600">Contact Us</a>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4">Privacy & You</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-gray-600">
                      <a href="#" className="block hover:text-rose-600">Terms of Use</a>
                      <a href="#" className="block hover:text-rose-600 font-semibold text-rose-600">Privacy Policy</a>
                      <a href="#" className="block hover:text-rose-600">Be Safe Online</a>
                      <a href="#" className="block hover:text-rose-600">Report Misuse</a>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 mb-3 sm:mb-4">More</h4>
                    <div className="space-y-1.5 sm:space-y-2 text-gray-600">
                      <a href="#" className="block hover:text-rose-600">VIP Vivahanam</a>
                      <a href="#" className="block hover:text-rose-600">Select Vivahanam</a>
                      <a href="#" className="block hover:text-rose-600">Success Stories</a>
                      <a href="#" className="block hover:text-rose-600">Vivahanam Live</a>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 text-center text-gray-500 text-xs sm:text-sm">
                  <p className="mb-2">© {new Date().getFullYear()} Vivahanam.com, Matrimony Services Ltd. All rights reserved.</p>
                  <p>
                    This privacy policy is part of our Terms of Service. By using our services, you agree to this policy.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;