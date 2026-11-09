import React, { useState, useEffect } from 'react';
import { Menu, X, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

interface NavbarProps {
  onOpenEnquiry?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenEnquiry }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const getWhatsAppLink = (message: string) =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(message)}`;

  return (
    <header className={`navbar-header ${isScrolled ? 'is-sticky' : ''}`}>
      <div className="navbar-container">
        {/* BRAND LOGO */}
        <a href="#home" className="navbar-brand" aria-label="Royal Edge Enterprises Home">
          <div className="logo-wrapper">
            <img
              src="/royal-edge-logo.jpg"
              alt="Royal Edge Enterprises - The Interlining Company"
              className="navbar-logo-img"
            />
          </div>
          <div className="brand-text">
            <span className="brand-title">ROYAL EDGE</span>
            <span className="brand-subtitle">THE INTERLINING COMPANY</span>
          </div>
        </a>

        {/* DESKTOP NAVIGATION */}
        <nav className="desktop-nav" aria-label="Main Navigation">
          <a href="#home" className="nav-link">Home</a>
          <a href="#products" className="nav-link">Products</a>
          <a href="#manufacturing" className="nav-link">Manufacturing</a>
          <a href="#why-choose-us" className="nav-link">Why Choose Us</a>
          <a href="#about" className="nav-link">About</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">
          <a
            href={getWhatsAppLink("Hello Royal Edge Enterprises, I would like to enquire about your wholesale backing materials.")}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-icon-btn whatsapp-action"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={19} />
          </a>

          <a
            href="#enquiry"
            onClick={onOpenEnquiry}
            className="navbar-quote-btn"
          >
            <span>Request Quote</span>
            <ArrowRight size={15} />
          </a>

          {/* MOBILE TOGGLE */}
          <button
            type="button"
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMobileMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-drawer-header">
              <div className="brand-text">
                <span className="brand-title">ROYAL EDGE</span>
                <span className="brand-subtitle">THE INTERLINING COMPANY</span>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeMobileMenu}
                aria-label="Close Menu"
              >
                <X size={22} />
              </button>
            </div>

            <nav className="mobile-drawer-nav">
              <a href="#home" onClick={closeMobileMenu} className="mobile-nav-link">
                Home
              </a>
              <a href="#products" onClick={closeMobileMenu} className="mobile-nav-link">
                Product Catalogue (8 Categories)
              </a>
              <a href="#manufacturing" onClick={closeMobileMenu} className="mobile-nav-link">
                Manufacturing &amp; Quality
              </a>
              <a href="#why-choose-us" onClick={closeMobileMenu} className="mobile-nav-link">
                Why Choose Royal Edge
              </a>
              <a href="#about" onClick={closeMobileMenu} className="mobile-nav-link">
                About Us
              </a>
              <a href="#contact" onClick={closeMobileMenu} className="mobile-nav-link">
                Contact &amp; Location
              </a>
            </nav>

            <div className="mobile-drawer-footer">
              <a
                href="#enquiry"
                onClick={() => {
                  closeMobileMenu();
                  if (onOpenEnquiry) onOpenEnquiry();
                }}
                className="btn-primary full-width"
              >
                Request a Quote
                <ArrowRight size={16} />
              </a>

              <a
                href={getWhatsAppLink("Hello Royal Edge Enterprises, I am contacting you from your mobile website.")}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline-gold full-width"
                style={{ marginTop: '10px' }}
              >
                <MessageCircle size={16} />
                WhatsApp Direct (+91 90049 04983)
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
