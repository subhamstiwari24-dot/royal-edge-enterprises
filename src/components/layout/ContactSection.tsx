import React from 'react';
import { Phone, MessageCircle, MapPin, Clock, Building2, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

export const ContactSection: React.FC = () => {
  const getWhatsAppLink = (text: string) =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <section className="contact-section" id="contact">
      <div className="section-container">
        <div className="section-header-center">
          <span className="eyebrow-badge">DIRECT FACTORY ACCESS</span>
          <h2 className="section-title">Connect With Royal Edge</h2>
          <p className="section-subtitle">
            Visit our Chembur production unit or reach our sales dispatch desk via phone or WhatsApp for instant material consultations and sample dispatch.
          </p>
        </div>

        <div className="contact-cards-grid">
          {/* CARD 1: WHATSAPP & PHONE */}
          <div className="contact-card hover-lift">
            <div className="card-top-icon">
              <Phone size={24} />
            </div>
            <h3 className="card-title">Call &amp; WhatsApp Desk</h3>
            <p className="card-desc">
              Immediate order assistance, bulk pricing queries, and order tracking.
            </p>
            <div className="contact-value-block">
              <span className="value-label">Direct Line:</span>
              <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} className="phone-link">
                {COMPANY_INFO.phone}
              </a>
            </div>
            <a
              href={getWhatsAppLink("Hello Royal Edge Enterprises, I would like to enquire about your products.")}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary wa-cta-btn"
            >
              <MessageCircle size={16} />
              <span>Chat on WhatsApp</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* CARD 2: PRODUCTION UNIT LOCATION */}
          <div className="contact-card hover-lift">
            <div className="card-top-icon">
              <MapPin size={24} />
            </div>
            <h3 className="card-title">Production &amp; Warehouse</h3>
            <p className="card-desc">
              Factory dispatch facility and sample collection center in Mumbai.
            </p>
            <div className="contact-value-block">
              <span className="value-label">Registered Address:</span>
              <address className="address-text">
                {COMPANY_INFO.address}
              </address>
            </div>
            <div className="working-hours-pill">
              <Clock size={14} />
              <span>{COMPANY_INFO.operatingHours}</span>
            </div>
          </div>

          {/* CARD 3: COMMERCIAL & COMPLIANCE */}
          <div className="contact-card hover-lift">
            <div className="card-top-icon">
              <Building2 size={24} />
            </div>
            <h3 className="card-title">Commercial Identifiers</h3>
            <p className="card-desc">
              Fully compliant enterprise registered under Indian commerce laws.
            </p>
            <div className="compliance-list">
              <div className="compliance-row">
                <ShieldCheck size={16} className="comp-icon" />
                <div>
                  <span className="comp-label">GST Identification Number</span>
                  <span className="comp-val">{COMPANY_INFO.gstNumber}</span>
                </div>
              </div>
              <div className="compliance-row">
                <ShieldCheck size={16} className="comp-icon" />
                <div>
                  <span className="comp-label">MSME Udyam Registration</span>
                  <span className="comp-val">{COMPANY_INFO.msmeNumber}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
