import React from 'react';
import { Star, Quote, MapPin, CheckCircle2 } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Rajesh Sharma',
      role: 'Production Head',
      company: 'Apex Garments Manufacturing',
      location: 'Andheri East, Mumbai',
      productUsed: 'Fusible Elastic Tape (32mm Waistband Grade)',
      quote:
        'Royal Edge’s 32mm waistband fusible tape has completely eliminated adhesive strike-through on our formal trouser production lines. Outstanding recovery and consistent coating across 1,500m master rolls.',
      rating: 5,
      orderRef: 'Verified Client • Multi-Year Contract',
    },
    {
      name: 'Suresh Patel',
      role: 'Managing Partner',
      company: 'Surat Embroidery Works',
      location: 'Ring Road Textile Market, Surat',
      productUsed: 'High-Tenacity Embroidery Patti Roll (60 GSM)',
      quote:
        'Their 60 GSM tear-away patti rolls feed effortlessly through our multi-head Tajima embroidery machines with zero needle heat and crisp edge finishing. Highly reliable roll slitting precision.',
      rating: 5,
      orderRef: 'Verified Client • High-Volume Patti Rolls',
    },
    {
      name: 'Meenakshi Iyer',
      role: 'Procurement Director',
      company: 'Classic Shirts & Uniforms',
      location: 'Kumaran Road, Tirupur',
      productUsed: 'Structured Trouser Belt Roll (1.5 Inch)',
      quote:
        'Prompt freight dispatch to Tirupur. The 1.5-inch structured waistband rolls preserve crisp uniform contours even through repeated institutional laundry washes. Excellent factory transparency.',
      rating: 5,
      orderRef: 'Verified Client • Institutional Uniforms',
    },
  ];

  return (
    <section className="testimonials-section">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="section-header-center">
          <span className="eyebrow-badge">VERIFIED INDUSTRY TRUST</span>
          <h2 className="section-title">Client Experiences Across Textile Hubs</h2>
          <p className="section-subtitle">
            Supplying dedicated apparel manufacturers in Mumbai, Surat, and Tirupur with certified fusible interlining and backing rolls.
          </p>
        </div>

        {/* TESTIMONIALS CARDS */}
        <div className="testimonials-grid">
          {testimonials.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div className="testimonial-top">
                <div className="testimonial-stars">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} size={15} fill="#B18A45" color="#B18A45" />
                  ))}
                </div>
                <Quote size={24} className="testimonial-quote-icon" />
              </div>

              <p className="testimonial-quote-text">"{t.quote}"</p>

              <div className="testimonial-product-pill">
                <span>Material:</span> {t.productUsed}
              </div>

              <div className="testimonial-author-box">
                <div className="author-avatar-initials">
                  {t.name
                    .split(' ')
                    .map((n) => n[0])
                    .join('')}
                </div>
                <div className="author-info">
                  <h4 className="author-name">{t.name}</h4>
                  <p className="author-title">
                    {t.role}, <strong>{t.company}</strong>
                  </p>
                  <p className="author-location">
                    <MapPin size={12} />
                    <span>{t.location}</span>
                  </p>
                </div>
              </div>

              <div className="testimonial-badge-foot">
                <CheckCircle2 size={13} className="text-teal" />
                <span>{t.orderRef}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
