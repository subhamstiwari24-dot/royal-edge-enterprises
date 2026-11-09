import React from 'react';
import { ArrowRight, ShieldCheck, Check, X, PhoneCall, SlidersHorizontal, Scale, Layers } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

export const WhyChooseUsSection: React.FC = () => {
  const comparisonMatrix = [
    {
      parameter: 'Adhesive Coating Distribution',
      royalEdge: 'Computerized 180-mesh high-density microdot; zero strike-through',
      conventional: 'Irregular scatter powder or coarse paste dot; high risk of bleed-through',
    },
    {
      parameter: 'Embroidery Needle Heat Tolerance',
      royalEdge: 'Formulated with heat-dissipating cellulose; no needle gumming at 1,000+ SPM',
      conventional: 'Synthetic resin melts on hot needles, causing frequent thread breaks',
    },
    {
      parameter: 'Slitting & Converting Precision',
      royalEdge: 'Automated razor slitting from 10mm to 2,100mm; sealed selvages, ±0.5mm',
      conventional: 'Manual or uncalibrated slit rolls with frayed edges and uneven widths',
    },
    {
      parameter: 'Post-Laundering Dimensional Retention',
      royalEdge: 'Pre-shrunk, wash-proof bond tested across repeated 40°C–60°C wash cycles',
      conventional: 'Significant shrinkage causing collar curling and fabric wrinkling',
    },
    {
      parameter: 'Wholesale Commercial Framework',
      royalEdge: 'Confidential private quotation system protecting garment makers & dealer margins',
      conventional: 'Arbitrary fluctuating spot pricing with hidden conversion surcharges',
    },
  ];

  return (
    <section className="why-choose-section" id="why-choose-us">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="dark-section-header">
          <div className="dark-eyebrow">
            <span className="eyebrow-line-gold"></span>
            <span className="dark-eyebrow-text">ENGINEERING DIFFERENCE</span>
          </div>
          <h2 className="dark-section-title">
            Why India&apos;s Leading Garment Makers Build On Royal Edge
          </h2>
          <p className="dark-section-sub">
            The difference between a luxury tailored garment and a rejected batch lies in the structural backing. Here is how our engineered interlinings outperform generic commercial alternatives on the factory floor.
          </p>
        </div>

        {/* 3-PILLAR OPERATIONAL CAPABILITY LEDGER */}
        <div className="engineering-pillars-grid">
          <div className="pillar-block">
            <div className="pillar-top-meta">
              <span className="pillar-index">PILLAR 01</span>
              <Layers size={18} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">Garment Structural Memory</h3>
            <p className="pillar-body">
              Every millimeter of our fusible elastic and collar interlining provides dimensional stability. Trousers retain their waistline contour, and shirt collars maintain their executive stance without bubbling or peeling.
            </p>
            <div className="pillar-footer-spec">
              <span>FUSING TOLERANCE: 125°C – 165°C</span>
            </div>
          </div>

          <div className="pillar-block">
            <div className="pillar-top-meta">
              <span className="pillar-index">PILLAR 02</span>
              <SlidersHorizontal size={18} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">High-Speed Machine Uptime</h3>
            <p className="pillar-body">
              Engineered specifically for computerized multi-head embroidery machines. Our tearaway and spunbond substrates dissipate needle friction, virtually eliminating thread snaps and needle gumming during long production runs.
            </p>
            <div className="pillar-footer-spec">
              <span>OPERATIONAL SPEED: 1,000+ SPM STABLE</span>
            </div>
          </div>

          <div className="pillar-block">
            <div className="pillar-top-meta">
              <span className="pillar-index">PILLAR 03</span>
              <Scale size={18} className="pillar-icon" />
            </div>
            <h3 className="pillar-title">Reliable B2B Supply Scalability</h3>
            <p className="pillar-body">
              Whether you need single trial spools to calibrate a sample garment or scheduled container consignments for seasonal production, our Mumbai warehouse maintains consistent stock for rapid dispatch nationwide.
            </p>
            <div className="pillar-footer-spec">
              <span>DISPATCH: MUMBAI DISPATCH HUB</span>
            </div>
          </div>
        </div>

        {/* TECHNICAL MATRIX COMPARISON TABLE */}
        <div className="matrix-wrapper">
          <div className="matrix-header">
            <div className="matrix-title-group">
              <ShieldCheck size={18} className="matrix-badge-icon" />
              <h3 className="matrix-title">Direct Comparison: Royal Edge vs. Generic Market Backing</h3>
            </div>
            <span className="matrix-note">Tested against standard Indian export apparel specs</span>
          </div>

          <div className="matrix-table-container">
            <table className="matrix-table">
              <thead>
                <tr>
                  <th className="col-param">Material Specification Parameter</th>
                  <th className="col-royal">Royal Edge Enterprises Standard</th>
                  <th className="col-conventional">Conventional Market Backing</th>
                </tr>
              </thead>
              <tbody>
                {comparisonMatrix.map((row, idx) => (
                  <tr key={idx}>
                    <td className="cell-param">
                      <strong>{row.parameter}</strong>
                    </td>
                    <td className="cell-royal">
                      <div className="cell-content">
                        <Check size={16} className="check-icon" />
                        <span>{row.royalEdge}</span>
                      </div>
                    </td>
                    <td className="cell-conventional">
                      <div className="cell-content">
                        <X size={16} className="cross-icon" />
                        <span>{row.conventional}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FACTORY ACTION BANNER */}
        <div className="factory-cta-ribbon">
          <div className="ribbon-text">
            <strong>Require custom width slitting or sample rolls for machine testing?</strong>
            <span>Connect directly with our Chembur technical team for test spools and private bulk rate quotation.</span>
          </div>
          <div className="ribbon-actions">
            <a href="#enquiry" className="btn-primary ribbon-btn">
              <span>Request Material Consultation</span>
              <ArrowRight size={15} />
            </a>
            <a href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`} className="ribbon-phone-link">
              <PhoneCall size={15} />
              <span>{COMPANY_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
