import React from "react";
import { Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

const Sidebar = ({ activeTab, setActiveTab, Balance, user, matches }) => {
  const menuItems = [
    {
      id: "overview",
      label: "Overview",
      icon: "📊",
      description: "Dashboard summary"
    },
    {
      id: "matches",
      label: "Browse Matches",
      icon: "👥",
      description: "Find potential matches",
      count: matches?.length || 0
    },
    {
      id: "unlocks",
      label: "Unlocked Profiles",
      icon: "🔓",
      description: "Profiles you've opened"
    },
    {
      id: "Balance",
      label: "Purchase Store",
      icon: "💰",
      description: "Buy more profile"
    },
    {
      id: "history",
      label: "Purchase History",
      icon: "📋",
      description: "Transaction history"
    }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-fit sticky top-6">
      {/* Back Button */}
      <Link
        to="/PlanHomePage" // Change this to your desired back route
        className="flex items-center gap-2 text-amber-800 px-0 mb-2  "
      >
        <FaArrowLeft className="text-amber-700 " />
        Back 
      </Link>

      {/* User Profile Summary - Compact */}
      <div className="text-center mb-6">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="w-16 h-16 bg-gradient-to-r from-amber-500 to-amber-700 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-xl text-white font-bold">
              {user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <div className="text-left">
            <h3 className="font-bold text-gray-800 text-sm">{user?.name || "User"}</h3>
            <p className="text-xs text-gray-500 mt-1 truncate max-w-[120px]">
              {user?.email || "user@example.com"}
            </p>
          </div>
        </div>
        
        {/* Balance Display - More Prominent */}
        <div className={`px-4 py-3 rounded-xl border-2 ${
          Balance === 0 
            ? 'bg-red-50 border-red-200 text-red-700' 
            : 'bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 text-amber-700'
        } shadow-sm`}>
          <div className="flex items-center justify-center space-x-2">
            <span className="text-lg">💰</span>
            <span className="font-bold text-lg">{Balance}</span>
            <span className="text-sm font-medium">Profile</span>
          </div>
          {Balance === 0 && (
            <p className="text-xs text-red-600 mt-1 font-medium">
              Buy Pact to start 
            </p>
          )}
        </div>
      </div>

      {/* Navigation Menu - More Compact */}
      <nav className="space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
              activeTab === item.id
                ? "bg-amber-100 border border-amber-300 text-amber-800 shadow-md transform scale-[1.02]"
                : "bg-gray-50 hover:bg-amber-50 text-gray-700 hover:text-amber-700 hover:shadow-md border border-transparent"
            }`}
          >
            <div className="flex items-center space-x-3">
              <span className={`text-xl transition-transform duration-200 ${
                activeTab === item.id ? "scale-110" : "group-hover:scale-110"
              }`}>
                {item.icon}
              </span>
              <div className="text-left">
                <h3 className={`font-semibold text-sm ${
                  activeTab === item.id ? "text-amber-800" : "text-gray-800"
                }`}>
                  {item.label}
                </h3>
                <p className={`text-xs ${
                  activeTab === item.id ? "text-amber-600" : "text-gray-500"
                }`}>
                  {item.description}
                </p>
              </div>
            </div>
            
            {/* Count Badge */}
            {item.count !== undefined && item.count > 0 && (
              <span className={`px-2 py-1 rounded-full text-xs font-bold min-w-[20px] text-center ${
                activeTab === item.id 
                  ? "bg-amber-500 text-white" 
                  : "bg-amber-100 text-amber-700"
              }`}>
                {item.count}
              </span>
            )}
            
            {/* Active Indicator */}
            {activeTab === item.id && (
              <div className="w-1.5 h-1.5 bg-amber-500 rounded-full ml-1"></div>
            )}
          </button>
        ))}
      </nav>

      {/* Support Link */}
      <div className="mt-4 text-center">
        <button className="text-xs text-gray-500 hover:text-amber-600 transition-colors flex items-center justify-center space-x-1 w-full">
          <span>🛟</span>
          <span>Need Help? Contact Support</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;