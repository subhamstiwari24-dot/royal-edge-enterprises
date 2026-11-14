import React, { useState, useEffect } from 'react';
import { Menu, X, Search, ShoppingBag, User, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';
import { useCart } from '../../context/useCart';

interface NavbarProps {
  onOpenEnquiry?: () => void;
  onOpenSearch?: () => void;
  onOpenAccount?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenEnquiry,
  onOpenSearch,
  onOpenAccount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { totalItems, openCart } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
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
          <a href="#categories" className="nav-link">Categories</a>
          <a href="#featured" className="nav-link">Featured</a>
          <a href="#wholesale-benefits" className="nav-link">Wholesale Benefits</a>
          <a href="#about" className="nav-link">About Us</a>
          <a href="#contact" className="nav-link">Contact</a>
        </nav>

        {/* DESKTOP ACTIONS */}
        <div className="navbar-actions">
          {/* 1. SEARCH TRIGGER */}
          <button
            type="button"
            className="navbar-action-icon"
            onClick={onOpenSearch}
            title="Search products, widths, SKUs"
            aria-label="Search products"
          >
            <Search size={19} />
          </button>

          {/* 2. CUSTOMER ACCOUNT & ORDER TRACKING */}
          <button
            type="button"
            className="navbar-action-icon"
            onClick={onOpenAccount}
            title="Account & Order Tracking"
            aria-label="Account and Order Tracking"
          >
            <User size={19} />
          </button>

          {/* 3. SHOPPING CART WITH BADGE */}
          <button
            type="button"
            className="navbar-action-icon cart-trigger-btn"
            onClick={openCart}
            title="Shopping Cart & Quote Draft"
            aria-label="Shopping Cart"
          >
            <ShoppingBag size={19} />
            {totalItems > 0 && <span className="cart-badge-count">{totalItems}</span>}
          </button>

          {/* 4. WHATSAPP QUICK CHAT */}
          <a
            href={getWhatsAppLink("Hello Royal Edge Enterprises, I would like to enquire about wholesale interlining pricing.")}
            target="_blank"
            rel="noopener noreferrer"
            className="navbar-action-icon whatsapp-icon-btn"
            title="Chat on WhatsApp"
            aria-label="Chat on WhatsApp"
          >
            <MessageCircle size={19} />
          </a>

          {/* 5. REQUEST QUOTE CTA */}
          <a
            href="#enquiry"
            onClick={onOpenEnquiry}
            className="btn-primary navbar-quote-btn"
          >
            <span>Request Quote</span>
            <ArrowRight size={14} />
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
                aria-label="Close menu"
              >
                <X size={22} />
              </button>
            </div>

            <div className="mobile-quick-actions">
              <button
                type="button"
                className="mobile-action-pill"
                onClick={() => {
                  closeMobileMenu();
                  if (onOpenSearch) onOpenSearch();
                }}
              >
                <Search size={16} />
                <span>Search Products</span>
              </button>
              <button
                type="button"
                className="mobile-action-pill"
                onClick={() => {
                  closeMobileMenu();
                  if (onOpenAccount) onOpenAccount();
                }}
              >
                <User size={16} />
                <span>Track Orders</span>
              </button>
            </div>

            <nav className="mobile-nav-links">
              <a href="#home" onClick={closeMobileMenu}>Home</a>
              <a href="#categories" onClick={closeMobileMenu}>Product Categories</a>
              <a href="#featured" onClick={closeMobileMenu}>Featured Products</a>
              <a href="#wholesale-benefits" onClick={closeMobileMenu}>Wholesale Advantages</a>
              <a href="#about" onClick={closeMobileMenu}>About Royal Edge</a>
              <a href="#contact" onClick={closeMobileMenu}>Contact & Factory</a>
            </nav>

            <div className="mobile-drawer-footer">
              <button
                type="button"
                className="btn-secondary mobile-cart-btn"
                onClick={() => {
                  closeMobileMenu();
                  openCart();
                }}
              >
                <ShoppingBag size={17} />
                <span>View Cart Draft ({totalItems})</span>
              </button>

              <a
                href="#enquiry"
                className="btn-primary mobile-quote-btn"
                onClick={() => {
                  closeMobileMenu();
                  if (onOpenEnquiry) onOpenEnquiry();
                }}
              >
                <span>Request Quotation</span>
                <ArrowRight size={15} />
              </a>

              <a
                href={getWhatsAppLink("Hello Royal Edge Enterprises, I want to discuss a bulk purchase.")}
                target="_blank"
                rel="noopener noreferrer"
                className="mobile-whatsapp-btn"
              >
                <MessageCircle size={18} />
                <span>Instant WhatsApp Desk</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
