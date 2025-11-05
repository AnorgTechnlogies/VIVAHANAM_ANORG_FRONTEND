import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Blogs", href: "/blogs" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "Testimonials", href: "/testimonials" },
    // { name: "Portfolio", href: "/portfolio" },
    // { name: "Products", href: "/products" },
  ];

  return (
    <nav className="absolute top-0 left-0 right-0 z-20 bg-white/90 backdrop-blur-sm shadow-md">
      <div className="px-4 sm:px-6 lg:px-8 py-4 lg:py-6">
        <div className="flex justify-between items-center">
          {/* Logo Section */}
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-amber-600 to-amber-800 rounded flex items-center justify-center flex-shrink-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 border-2 border-white rounded" />
            </div>
            <div className="flex flex-col">
              <h1 className="m-0 text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">
                Vivahanam
              </h1>
              <p className="m-0 text-xs sm:text-sm lg:text-md text-gray-600">
                ! विवाहनम् !
              </p>
            </div>
          </div>

          {/* Desktop Tagline - Hidden on smaller screens */}
          <div className="hidden xl:block text-sm lg:text-base font-serif text-gray-800 max-w-2xl text-center leading-relaxed tracking-wide font-bold">
            <span className="font-extrabold text-red-800">V</span>edic{" "}
            <span className="font-extrabold text-red-800">I</span>ndian{" "}
            <span className="font-extrabold text-red-800">V</span>ivah{" "}
            <span className="text-black">–</span>{" "}
            <span className="font-extrabold text-red-800">A</span>uthentic{" "}
            <span className="font-extrabold text-red-800">H</span>oly{" "}
            <span className="font-extrabold text-red-800">A</span>lliances{" "}
            <span className="font-extrabold text-red-800">O</span>f{" "}
            <span className="font-extrabold text-red-800">N</span>orth{" "}
            <span className="font-extrabold text-red-800">A</span>merican{" "}
            <span className="font-extrabold text-red-800">M</span>atrimony
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-700 hover:text-amber-700 transition-colors duration-200 font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-700 hover:text-amber-700 transition-colors duration-200 p-2"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Tagline - Show below logo on medium screens */}
        <div className="xl:hidden mt-3 text-xs sm:text-sm md:text-base font-serif text-gray-800 text-center leading-relaxed tracking-wide font-bold">
          <span className="font-extrabold text-red-800">V</span>edic{" "}
          <span className="font-extrabold text-red-800">I</span>ndian{" "}
          <span className="font-extrabold text-red-800">V</span>ivah{" "}
          <span className="text-black">–</span>{" "}
          <span className="font-extrabold text-red-800">A</span>uthentic{" "}
          <span className="font-extrabold text-red-800">H</span>oly{" "}
          <span className="font-extrabold text-red-800">A</span>lliances{" "}
          <span className="font-extrabold text-red-800">O</span>f{" "}
          <span className="font-extrabold text-red-800">N</span>orth{" "}
          <span className="font-extrabold text-red-800">A</span>merican{" "}
          <span className="font-extrabold text-red-800">M</span>atrimony
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 bg-white/95 backdrop-blur-sm border-t border-gray-200">
          {navItems.map((item, index) => (
            <Link
              key={item.name}
              to={item.href}
              className="block py-3 px-4 text-gray-700 hover:text-amber-700 hover:bg-amber-50 rounded-lg transition-all duration-200 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
