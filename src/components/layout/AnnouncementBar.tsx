import React from 'react';
import { Phone, ShieldCheck, Factory, Award } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="announcement-bar">
      <div className="announcement-container">
        {/* LEFT: FACTORY DIRECT CREDENTIALS */}
        <div className="announcement-item">
          <Factory size={13} className="announcement-icon" />
          <span>Direct Manufacturer Dispatch from Chembur, Mumbai</span>
          <span className="announcement-divider">•</span>
          <Award size={13} className="announcement-icon" />
          <span className="announcement-highlight">GST: {COMPANY_INFO.gstNumber}</span>
          <span className="announcement-divider">•</span>
          <ShieldCheck size={13} className="announcement-icon" />
          <span>MSME Certified</span>
        </div>

        {/* RIGHT: WHOLESALE HELPLINE */}
        <div className="announcement-contact">
          <span>Factory Wholesale Desk:</span>
          <a
            href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
            className="announcement-phone-link"
          >
            <Phone size={12} />
            <span>{COMPANY_INFO.phone}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
