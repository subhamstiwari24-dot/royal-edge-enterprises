import React from 'react';
import { Factory, Scissors, ShieldCheck, Truck, Receipt, FileText, ArrowRight, MessageCircle } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

interface WholesaleBenefitsSectionProps {
  onOpenEnquiry?: () => void;
}

export const WholesaleBenefitsSection: React.FC<WholesaleBenefitsSectionProps> = ({ onOpenEnquiry }) => {
  const benefits = [
    {
      icon: <Factory size={26} />,
      title: 'Direct Factory Quotations',
      description:
        'Eliminate trader commissions. Purchase your interlining and buckram rolls straight from our Chembur production unit with transparent tiered commercial terms.',
    },
    {
      icon: <Scissors size={26} />,
      title: 'Custom Roll Slitting Capabilities',
      description:
        'In-house high-speed slitting machinery delivers precise roll widths from 10mm to 150cm for trousers, shirt collars, plackets, and multi-head embroidery borders.',
    },
    {
      icon: <ShieldCheck size={26} />,
      title: 'Lab-Tested Thermal Bonding',
      description:
        'Every batch of microdot fusible and waistband tape undergoes rigorous temperature, pressure, and peel-strength testing to ensure bubble-free durability after laundering.',
    },
    {
      icon: <Truck size={26} />,
      title: 'Pan-India Freight Logistics',
      description:
        'Strategic Chembur dispatch hub with daily cargo connections to major apparel clusters including Tirupur, Surat, Ahmedabad, Delhi-NCR, Bengaluru, and Ludhiana.',
    },
    {
      icon: <Receipt size={26} />,
      title: 'Full GST & MSME Compliance',
      description:
        'Seamless 5% textile GST invoicing and MSME accreditation (UDYAM-MH-18-0485033), providing complete transparency for formal corporate accounting.',
    },
    {
      icon: <FileText size={26} />,
      title: 'Trial Swatches & Technical Support',
      description:
        'Test sample yardage dispatched directly to your fusing press operators to verify optimum dwell time, temperature, and machine tension before bulk delivery.',
    },
  ];

  return (
    <section id="wholesale-benefits" className="wholesale-benefits-section">
      <div className="section-container">
        {/* HEADER */}
        <div className="wholesale-header-center">
          <span className="eyebrow-badge-gold">B2B WHOLESALE ADVANTAGES</span>
          <h2 className="wholesale-title">
            Engineered for Apparel Exporters, Uniform Manufacturers & Garment Mills
          </h2>
          <p className="wholesale-subtitle">
            Reliable supply chain resilience, certified quality standards, and dedicated account management for industrial textile production across India.
          </p>
        </div>

        {/* BENEFIT TILES GRID */}
        <div className="wholesale-cards-grid">
          {benefits.map((b, idx) => (
            <div key={idx} className="wholesale-benefit-card">
              <div className="benefit-icon-box">{b.icon}</div>
              <h3 className="benefit-card-title">{b.title}</h3>
              <p className="benefit-card-desc">{b.description}</p>
            </div>
          ))}
        </div>

        {/* B2B CONVERSION BANNER */}
        <div className="wholesale-cta-banner">
          <div className="cta-banner-text">
            <span className="cta-banner-tag">ANNUAL SUPPLY CONTRACTS & ROLLING MOQS</span>
            <h3>Looking for recurring monthly yardage or custom fusing specs?</h3>
            <p>Our Chembur factory managers work directly with your procurement team on custom pricing and dispatch schedules.</p>
          </div>
          <div className="cta-banner-actions">
            <a
              href="#enquiry"
              onClick={onOpenEnquiry}
              className="btn-primary banner-quote-btn"
            >
              <span>Request Wholesale Quote</span>
              <ArrowRight size={15} />
            </a>
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                'Hello Royal Edge, we are interested in discussing an annual wholesale interlining supply contract.'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-ghost-dark banner-wa-btn"
            >
              <MessageCircle size={16} />
              <span>Direct WhatsApp Desk</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
