import { useState, useEffect } from "react";
import { Clock, Mail, Bell, Sparkles, Heart, Users, Star } from "lucide-react";

const ComingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Set launch date (30 days from now)
  const launchDate = new Date();
  launchDate.setDate(launchDate.getDate() + 30);

  useEffect(() => {
    setIsClient(true);
    
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = launchDate.getTime() - now;
      
      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        };
      }
      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    // Set initial time
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email && /\S+@\S+\.\S+/.test(email)) {
      setSubscribed(true);
      setTimeout(() => {
        setEmail("");
        setSubscribed(false);
      }, 3000);
    }
  };

  // Format numbers with leading zeros
  const formatNumber = (num) => String(num).padStart(2, '0');

  return (
    <div className="min-h-screen p-13 bg-amber-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      {/* Floating Hearts */}
      <div className="absolute inset-0 pointer-events-none">
        <Heart className="absolute top-1/4 left-1/4 text-pink-300 opacity-20 w-8 h-8 animate-float" />
        <Heart className="absolute top-1/3 right-1/4 text-red-300 opacity-20 w-6 h-6 animate-float animation-delay-2000" />
        <Star className="absolute bottom-1/4 left-1/3 text-amber-300 opacity-20 w-7 h-7 animate-float animation-delay-4000" />
        <Sparkles className="absolute top-1/2 right-1/3 text-orange-300 opacity-20 w-6 h-6 animate-float animation-delay-1000" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <div className="max-w-4xl w-full text-center">
          {/* Logo/Icon */}
          <div className="mb-8 flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-100 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative bg-white rounded-full p-6 shadow-2xl">
                <Heart className="w-16 h-16 text-pink-500" fill="currentColor" />
              </div>
            </div>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-amber-600 via-pink-600 to-orange-600 bg-clip-text text-transparent animate-gradient">
            Vivahanam
          </h1>
          
          
          <p className="text-xl md:text-2xl text-gray-700 mb-3 font-medium mt-8">
            Something Amazing is on the Way! 💫
          </p>
          
          <p className="text-base md:text-lg text-gray-600 mb-12 max-w-2xl mx-auto">
            We're working hard to bring you an incredible experience. Get ready for something special that will change the way you connect!
          </p>

          {/* Countdown Timer */}
          <div className="mb-12">
            <div className="flex items-center justify-center gap-2 mb-6">
              <Clock className="w-6 h-6 text-amber-600" />
              <h2 className="text-2xl font-semibold text-gray-800">Launching In</h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 max-w-2xl mx-auto">
              {[
                { label: "Days", value: timeLeft.days },
                { label: "Hours", value: timeLeft.hours },
                { label: "Minutes", value: timeLeft.minutes },
                { label: "Seconds", value: timeLeft.seconds }
              ].map((item, index) => (
                <div key={index} className="bg-white rounded-xl md:rounded-2xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-2xl md:text-4xl font-bold bg-gradient-to-br from-amber-500 to-pink-500 bg-clip-text text-transparent mb-2">
                    {isClient ? formatNumber(item.value) : "00"}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600 font-medium uppercase tracking-wide">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Email Subscription */}
          <div className="mb-12 max-w-xl mx-auto">
            <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Bell className="w-6 h-6 text-amber-600" />
                <h3 className="text-xl font-semibold text-gray-800">Get Notified</h3>
              </div>
              
              <p className="text-gray-600 mb-6">
                Be the first to know when we launch! Subscribe for exclusive updates.
              </p>

              {subscribed ? (
                <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 flex items-center justify-center gap-2 text-green-700 font-medium animate-scale-in">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Thanks for subscribing! We'll keep you updated.
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1 relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="px-6 md:px-8 py-3 bg-gradient-to-r from-amber-500 to-pink-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
                  >
                    Notify Me
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Features Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-4xl mx-auto mb-12">
            {[
              { icon: Heart, title: "Find Your Match", desc: "Advanced matching algorithm" },
              { icon: Users, title: "Connect Easily", desc: "Simple & secure platform" },
              { icon: Star, title: "Premium Features", desc: "Exclusive benefits await" }
            ].map((feature, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-4 md:p-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                <div className="bg-gradient-to-br from-amber-100 to-pink-100 rounded-full p-3 md:p-4 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 md:w-8 md:h-8 text-pink-600" />
                </div>
                <h4 className="text-base md:text-lg font-semibold text-gray-800 mb-2">{feature.title}</h4>
                <p className="text-gray-600 text-xs md:text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Social Links or Additional Info */}
          <div className="text-gray-500 text-sm">
            <p>Follow us for updates and sneak peeks!</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }

        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }

        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animation-delay-1000 {
          animation-delay: 1s;
        }
      `}</style>
    </div>
  );
};

export default ComingSoon;