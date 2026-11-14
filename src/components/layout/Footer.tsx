import React from 'react';
import { Phone, MapPin, MessageCircle, ArrowUp, ShieldCheck, Award } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

interface FooterProps {
  onSelectCategory?: (cat: string) => void;
}

const PRIMARY_CATEGORIES = [
  'Collar Interlining',
  'Cuff Stays & Strips',
  'Trouser Belt Rolls',
  'Embroidery Patti',
  'Spunbond Backing',
  'Fusible Elastic',
  'Microdot Interlining',
];

export const Footer: React.FC<FooterProps> = ({ onSelectCategory }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getWhatsAppLink = () =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
      'Hello Royal Edge Enterprises, I am contacting you regarding your wholesale textile products.'
    )}`;

  return (
    <footer className="site-footer">
      {/* MOTTO BAR */}
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
          {/* COL 1: BRAND & CREDENTIALS */}
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
              Specialized textile converter and manufacturer of fusible interlinings, trouser waistband belt rolls, microdot adhesives, embroidery patti, and spunbond stabilizers.
            </p>

            <div className="footer-compliance-badges">
              <div className="comp-tag">
                <Award size={13} className="text-gold" />
                <span>GST: {COMPANY_INFO.gstNumber}</span>
              </div>
              <div className="comp-tag">
                <ShieldCheck size={13} className="text-gold" />
                <span>MSME: {COMPANY_INFO.msmeNumber}</span>
              </div>
            </div>
          </div>

          {/* COL 2: QUICK NAVIGATION */}
          <div className="footer-col">
            <h4 className="footer-heading">Navigation</h4>
            <ul className="footer-links-list">
              <li><a href="#home">Home</a></li>
              <li><a href="#categories">Product Categories</a></li>
              <li><a href="#featured">Featured Materials</a></li>
              <li><a href="#wholesale-benefits">Wholesale Advantages</a></li>
              <li><a href="#about">About Royal Edge</a></li>
              <li><a href="#enquiry">Request Quote</a></li>
              <li><a href="#contact">Contact &amp; Factory</a></li>
            </ul>
          </div>

          {/* COL 3: 5 PRIMARY TEXTILE CATEGORIES */}
          <div className="footer-col">
            <h4 className="footer-heading">Material Categories</h4>
            <ul className="footer-links-list">
              {PRIMARY_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <a
                    href="#categories"
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
            <h4 className="footer-heading">Factory Wholesale Desk</h4>

            <div className="footer-contact-item">
              <Phone size={15} className="f-icon" />
              <div>
                <small>Helpline &amp; WhatsApp</small>
                <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}>
                  {COMPANY_INFO.phone}
                </a>
              </div>
            </div>

            <div className="footer-contact-item">
              <MapPin size={15} className="f-icon" />
              <div>
                <small>Chembur Production Unit</small>
                <p>
                  {COMPANY_INFO.address}
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
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP */}
      <div className="footer-bottom-bar">
        <div className="section-container footer-bottom-flex">
          <p className="copyright-text">
            &copy; 2026 {COMPANY_INFO.name}. All Rights Reserved. Mumbai, Maharashtra.
          </p>

          <div className="footer-bottom-links">
            <span className="privacy-note">Official B2B &amp; B2C Manufacturing Portal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
