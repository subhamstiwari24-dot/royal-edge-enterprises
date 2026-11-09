import React from 'react';
import { Phone, MapPin, MessageCircle, ArrowUp } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';
import type { ProductCategory } from '../../types';

interface FooterProps {
  onSelectCategory?: (cat: ProductCategory) => void;
}

const CATEGORIES: ProductCategory[] = [
  'Fusible Elastic',
  'Elastic',
  'Microdot',
  'Belt Roll',
  'Patti',
  'Collar & Cuff',
  'Strip',
  'Spunbond',
];

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWhatsAppLink = () =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
      'Hello Royal Edge Enterprises, I am contacting you from your website.'
    )}`;

  return (
    <footer className="site-footer">
      <div className="footer-top-strip">
        <div className="section-container footer-top-flex">
          <div className="footer-motto">
            <span className="motto-gold">PRECISION IN EVERY STITCH.</span>
            <span className="motto-sub">EXCELLENCE IN EVERY DETAIL.</span>
          </div>
          <button
            type="button"
            className="back-to-top-btn"
            onClick={scrollToTop}
            aria-label="Scroll back to top"
          >
            <span>Back to Top</span>
            <ArrowUp size={14} />
          </button>
        </div>
      </div>

      <div className="section-container footer-main-content">
        <div className="footer-grid">
          {/* COL 1: BRAND & MISSION */}
          <div className="footer-brand-col">
            <a href="#home" className="footer-logo-link" aria-label="Royal Edge Home">
              <div className="footer-logo-frame">
                <img
                  src="/royal-edge-logo.jpg"
                  alt="Royal Edge Enterprises Logo"
                  className="footer-logo-img"
                />
              </div>
              <div className="footer-brand-info">
                <span className="brand-name">ROYAL EDGE</span>
                <span className="brand-tagline">THE INTERLINING COMPANY</span>
              </div>
            </a>

            <p className="footer-about-text">
              Specialized manufacturer and converter of fusible elastic, collar buckram, precision microdot interlinings, patti rolls, and spunbond embroidery backing materials.
            </p>

            <div className="footer-compliance-badges">
              <span className="comp-tag">GST: {COMPANY_INFO.gstNumber}</span>
              <span className="comp-tag">MSME: {COMPANY_INFO.msmeNumber}</span>
            </div>
          </div>

          {/* COL 2: QUICK NAVIGATION */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#products">Product Catalogue</a></li>
              <li><a href="#manufacturing">Manufacturing Assurance</a></li>
              <li><a href="#why-choose-us">Why Choose Us</a></li>
              <li><a href="#about">About Royal Edge</a></li>
              <li><a href="#enquiry">Request a Quote</a></li>
              <li><a href="#contact">Contact &amp; Location</a></li>
            </ul>
          </div>

          {/* COL 3: 8 PRODUCT CATEGORIES */}
          <div className="footer-col">
            <h4 className="footer-heading">Product Categories</h4>
            <ul className="footer-links-list">
              {CATEGORIES.map((cat) => (
                <li key={cat}>
                  <a
                    href="#products"
                    onClick={() => {
                      if (onSelectCategory) onSelectCategory(cat);
                    }}
                  >
                    {cat}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* COL 4: CONTACT & DISPATCH */}
          <div className="footer-col footer-contact-col">
            <h4 className="footer-heading">Factory &amp; Sales Desk</h4>

            <div className="footer-contact-item">
              <Phone size={16} className="f-icon" />
              <div>
                <small>Direct Order Helpline</small>
                <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}>
                  {COMPANY_INFO.phone}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={16} className="f-icon" />
              <div>
                <small>Factory Address</small>
                <p>
                  Puja Garage, Santosh Nagar, Pestom Sagar, P.L. Lokhande Marg, Chembur, Mumbai - 400089
                </p>
              </div>
            </div>

            <a
              href={getWhatsAppLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-outline-gold footer-wa-btn"
            >
              <MessageCircle size={15} />
              <span>Message on WhatsApp</span>
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="footer-bottom-bar">
        <div className="section-container footer-bottom-flex">
          <p className="copyright-text">
            &copy; 2026 Royal Edge Enterprises. All Rights Reserved. Client-approved catalogue baseline.
          </p>

          <div className="footer-bottom-links">
            <span className="privacy-note">Confidential B2B Wholesale Pricing Structure</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
