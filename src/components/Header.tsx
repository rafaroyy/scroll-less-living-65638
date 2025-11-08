
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { PopupDownload } from "@/components/PopupDownload";

interface HeaderProps {
  activeSection?: string;
}

export const Header = ({ activeSection = "home" }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleFeaturesClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // If we're not on the home page, navigate there first
    if (window.location.pathname !== '/') {
      window.location.href = '/#features';
      return;
    }
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navLinks = [
    { name: "Início", href: "/", sectionId: "home" },
    { name: "Nossa História", href: "/our-story" },
    { name: "Como Funciona", href: "/#features", onClick: handleFeaturesClick, sectionId: "how-it-works" },
    { name: "Blog", href: "/blog" },
    { name: "Baixar App", href: "/download-app" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo - Fixed proportions */}
          <Link to="/" className="flex items-center space-x-3 animate-[fade-in_0.8s_ease-out]">
            <img 
              src="/lovable-uploads/f088cd0c-124c-4407-80c4-444f83204473.png" 
              alt="Viralize AI Logo" 
              className="w-10 h-10 object-contain hover:scale-110 transition-transform duration-200"
            />
            <span className={`text-xl font-bold font-poppins transition-colors duration-300 ${
              isScrolled ? "text-brand-dark" : "text-white drop-shadow-lg"
            }`}>
              Viralize AI
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link, index) => (
              link.href.startsWith('/') && !link.href.includes('#') ? (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`transition-all duration-300 font-medium font-poppins hover:scale-105 ${
                    activeSection === link.sectionId
                      ? isScrolled
                        ? "text-primary font-semibold"
                        : "text-primary drop-shadow-lg font-semibold"
                      : isScrolled 
                        ? "text-brand-dark hover:text-brand-primary" 
                        : "text-white hover:text-brand-secondary drop-shadow-md"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={link.onClick}
                  className={`transition-all duration-300 font-medium font-poppins hover:scale-105 ${
                    activeSection === link.sectionId
                      ? isScrolled
                        ? "text-primary font-semibold"
                        : "text-primary drop-shadow-lg font-semibold"
                      : isScrolled 
                        ? "text-brand-dark hover:text-brand-primary" 
                        : "text-white hover:text-brand-secondary drop-shadow-md"
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {link.name}
                </a>
              )
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block animate-[fade-in_1s_ease-out]">
            <Link to="/login">
              <Button 
                className="bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white px-6 py-2 rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 font-poppins"
              >
                Começar agora
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className={`md:hidden transition-colors duration-300 ${
              isScrolled ? "text-brand-dark" : "text-white"
            }`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-white rounded-lg shadow-lg border border-gray-200 animate-[fade-in_0.3s_ease-out]">
            <nav className="flex flex-col space-y-4 pt-4">
              {navLinks.map((link) => (
                link.href.startsWith('/') && !link.href.includes('#') ? (
                  <Link
                    key={link.name}
                    to={link.href}
                    className="px-4 py-2 text-gray-600 hover:text-brand-primary transition-colors duration-200 font-medium font-poppins"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ) : (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={(e) => {
                      if (link.onClick) link.onClick(e);
                      setIsMobileMenuOpen(false);
                    }}
                    className="px-4 py-2 text-gray-600 hover:text-brand-primary transition-colors duration-200 font-medium font-poppins"
                  >
                    {link.name}
                  </a>
                )
              ))}
              <div className="px-4">
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    className="bg-gradient-to-r from-brand-primary to-blue-600 hover:from-blue-600 hover:to-brand-primary text-white px-6 py-2 rounded-lg mt-4 w-full font-poppins"
                  >
                    Começar agora
                  </Button>
                </Link>
              </div>
            </nav>
          </div>
        )}
      </div>
      <PopupDownload isOpen={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </header>
  );
};
