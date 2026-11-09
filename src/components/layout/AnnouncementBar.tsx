import React from 'react';
import { Sparkles, PhoneCall } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

export const AnnouncementBar: React.FC = () => {
  return (
    <aside className="announcement-bar" aria-label="Announcement">
      <div className="announcement-container">
        <div className="announcement-item announcement-item--primary">
          <Sparkles size={13} className="announcement-icon" />
          <span>PREMIUM EMBROIDERY BACKING &amp; INTERLINING MATERIALS</span>
          <span className="announcement-divider">•</span>
          <span className="announcement-highlight">RETAIL &amp; BULK ENQUIRIES WELCOME</span>
        </div>
        <div className="announcement-contact">
          <PhoneCall size={12} />
          <span>Direct Orders: </span>
          <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}>
            {COMPANY_INFO.phone}
          </a>
        </div>
      </div>
    </aside>
  );
};
