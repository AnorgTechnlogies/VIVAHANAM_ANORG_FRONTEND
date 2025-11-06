import React from "react";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
  Heart,
} from "lucide-react";

const Footer = () => {
  const quickLinks = [
    { name: "Blogs", href: "/blogs" },
    { name: "FAQ", href: "/faq" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const services = [
    { name: "Matchmaking", href: "#matchmaking" },
    { name: "Consultations", href: "#consultations" },
    { name: "Wedding Planning", href: "/plans" },
    { name: "Traditional Rituals", href: "#rituals" },
  ];

  const socialLinks = [
    { icon: <Facebook size={20} />, href: "#", label: "Facebook" },
    { icon: <Instagram size={20} />, href: "#", label: "Instagram" },
    { icon: <Twitter size={20} />, href: "#", label: "Twitter" },
    { icon: <Linkedin size={20} />, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900 text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center flex-shrink-0">
                <div className="w-10 h-10 border-2 border-amber-700 rounded" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-white">Vivahanam</h3>
                <p className="text-sm text-amber-100">! विवाहनम् !</p>
              </div>
            </div>
            <p className="text-amber-100 leading-relaxed text-sm">
              Preserving Vedic marriage traditions, uniting couples through
              sacred rituals and family values across North America.
            </p>
            <div className="flex gap-3 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 bg-white/10 hover:bg-white hover:text-amber-800 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-amber-600 pb-2 inline-block">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-amber-100 hover:text-white hover:pl-2 transition-all duration-200 inline-block"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-amber-600 pb-2 inline-block">
              Our Services
            </h4>
            <ul className="space-y-2">
              {services.map((service) => (
                <li key={service.name}>
                  <a
                    href={service.href}
                    className="text-amber-100 hover:text-white hover:pl-2 transition-all duration-200 inline-block"
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold text-white mb-4 border-b-2 border-amber-600 pb-2 inline-block">
              Contact Us
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin
                  size={20}
                  className="text-amber-300 flex-shrink-0 mt-1"
                />
                <span className="text-amber-100 text-sm">North America</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={20} className="text-amber-300 flex-shrink-0" />
                <a
                  href="tel:+1234567890"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  +1 888 768 8289
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={20} className="text-amber-300 flex-shrink-0" />
                <a
                  href="mailto:info@vivahanam.com"
                  className="text-amber-100 hover:text-white transition-colors"
                >
                  ourdivinethoughts@gmail.com
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-amber-700/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-amber-100">
            <p className="text-center md:text-left">
              © {new Date().getFullYear()} Vivahanam. All rights reserved.
            </p>
            <p className="flex items-center gap-2 text-center">
              Made with{" "}
              <Heart size={16} className="text-red-400 fill-red-400" /> for
              sacred unions
            </p>
            <div className="flex gap-4">
              <a href="#privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <span>|</span>
              <a href="#terms" className="hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
