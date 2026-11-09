import React from 'react';
import { ArrowRight, FileText, MessageCircle, ShieldCheck, Cpu, Sliders, Layers } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

interface HeroSectionProps {
  onOpenEnquiry?: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenEnquiry }) => {
  const getWhatsAppLink = (text: string) =>
    `https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(text)}`;

  return (
    <section className="hero-section" id="home">
      <div className="section-container">
        {/* EDITORIAL TOP METADATA BAR */}
        <div className="hero-metadata-strip">
          <div className="meta-strip-item">
            <span className="meta-dot"></span>
            <span>MUMBAI DIRECT CONVERTING FACILITY</span>
          </div>
          <div className="meta-strip-divider">//</div>
          <div className="meta-strip-item">
            <span>B2B COMMERCIAL ENQUIRY &amp; SUPPLY</span>
          </div>
          <div className="meta-strip-divider">//</div>
          <div className="meta-strip-item">
            <span>GST: {COMPANY_INFO.gstNumber}</span>
          </div>
        </div>

        {/* ASYMMETRICAL ARCHITECTURAL HERO COMPOSITION */}
        <div className="hero-grid-architectural">
          {/* LEFT: EDITORIAL COPY & CALL TO ACTION */}
          <div className="hero-narrative-col">
            <div className="hero-eyebrow">
              <span className="eyebrow-line"></span>
              <span className="eyebrow-text">THE INTERLINING COMPANY</span>
            </div>

            <h1 className="hero-headline">
              Precision Backing.<br />
              <span className="headline-accent">Flawless Embroidery.</span>
            </h1>

            <p className="hero-lead-text">
              Royal Edge Enterprises manufactures certified embroidery backing rolls, fusible tapes, and structured interlinings calibrated for computerized multi-head machines and industrial thermal fusing presses.
            </p>

            <p className="hero-subtext">
              Supplying apparel export houses, uniform manufacturers, and boutique fashion ateliers across India with materials engineered for zero resin strike-through, stable tension, and crisp seam retention.
            </p>

            {/* CALL TO ACTION BUTTONS */}
            <div className="hero-cta-group">
              <a href="#products" className="btn-primary hero-btn-primary">
                <span>Explore 8 Approved Lines</span>
                <ArrowRight size={15} />
              </a>

              <a
                href="#enquiry"
                onClick={onOpenEnquiry}
                className="btn-secondary hero-btn-secondary"
              >
                <FileText size={15} />
                <span>Request Private Quote</span>
              </a>

              <a
                href={getWhatsAppLink("Hello Royal Edge Enterprises, I am contacting you regarding bulk embroidery backing and interlining requirements.")}
                target="_blank"
                rel="noopener noreferrer"
                className="hero-whatsapp-link"
                title="Direct WhatsApp Sales Desk"
              >
                <MessageCircle size={16} />
                <span>Instant Sales Desk</span>
              </a>
            </div>

            {/* EDITORIAL COMPLIANCE TICKERS */}
            <div className="hero-credentials-row">
              <div className="cred-badge">
                <ShieldCheck size={14} className="cred-badge-icon" />
                <span>Direct Mumbai Manufacturer</span>
              </div>
              <div className="cred-badge">
                <Layers size={14} className="cred-badge-icon" />
                <span>Retail Sampling &amp; Bulk Dispatch</span>
              </div>
              <div className="cred-badge">
                <Sliders size={14} className="cred-badge-icon" />
                <span>Custom Millimeter Slitting</span>
              </div>
            </div>
          </div>

          {/* RIGHT: BESPOKE INDUSTRIAL VISUAL SHOWCASE */}
          <div className="hero-visual-col">
            <div className="hero-image-architectural-frame">
              <img
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&auto=format&fit=crop&q=85"
                alt="Precision textile rolls and embroidery backing conversion in Mumbai factory"
                className="hero-image-main"
                loading="eager"
              />
              <div className="hero-image-vignette"></div>

              {/* INTEGRATED TECHNICAL DOSSIER CAPTION (NO FLOATING STICKERS) */}
              <div className="hero-image-ledger-overlay">
                <div className="overlay-header">
                  <Cpu size={14} className="overlay-icon" />
                  <span className="overlay-title">SPECIFICATION DOSSIER: CORE ROLL SERIES</span>
                </div>
                <div className="overlay-grid">
                  <div className="overlay-item">
                    <span className="item-label">COATING</span>
                    <strong className="item-val">180-Mesh Polyamide Microdot</strong>
                  </div>
                  <div className="overlay-item">
                    <span className="item-label">CONVERTING</span>
                    <strong className="item-val">10mm – 2,100mm Slitting</strong>
                  </div>
                  <div className="overlay-item">
                    <span className="item-label">FACILITY</span>
                    <strong className="item-val">Chembur, Mumbai - 89</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM TECHNICAL SPECIFICATION LEDGER STRIP (FULL WIDTH) */}
        <div className="hero-specs-ledger-strip">
          <div className="ledger-col">
            <div className="ledger-num">01</div>
            <div className="ledger-body">
              <span className="ledger-tag">SUBSTRATE CLASS</span>
              <strong className="ledger-title">30 GSM to 220 GSM</strong>
              <p className="ledger-desc">Spunbond non-woven, tear-away patti, and woven collar buckrams.</p>
            </div>
          </div>

          <div className="ledger-col">
            <div className="ledger-num">02</div>
            <div className="ledger-body">
              <span className="ledger-tag">CONVERTING TOLERANCE</span>
              <strong className="ledger-title">10mm to 2,100mm</strong>
              <p className="ledger-desc">Custom slit rolls with sealed, razor-clean selvages to eliminate fraying.</p>
            </div>
          </div>

          <div className="ledger-col">
            <div className="ledger-num">03</div>
            <div className="ledger-body">
              <span className="ledger-tag">BONDING INTEGRITY</span>
              <strong className="ledger-title">Zero Strike-Through</strong>
              <p className="ledger-desc">Computerized microdot thermal distribution for bubble-free adhesion.</p>
            </div>
          </div>

          <div className="ledger-col">
            <div className="ledger-num">04</div>
            <div className="ledger-body">
              <span className="ledger-tag">ORDER FLEXIBILITY</span>
              <strong className="ledger-title">Trial Spool to Container</strong>
              <p className="ledger-desc">Tailored supply agreements for sampling trials and continuous factory lots.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
