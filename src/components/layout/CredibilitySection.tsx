import React from 'react';
import { ShieldCheck, Cpu, Sliders, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

export const CredibilitySection: React.FC = () => {
  const standards = [
    {
      step: '01',
      title: 'High-Density Microdot Adhesive Coating',
      summary:
        'Computerized 180-mesh dot deposition ensures uniform polymer melt without resin strike-through onto delicate shirting or silk fabrics during high-pressure thermal fusing.',
      spec: 'Polyamide & High-Density Polyethylene Resins (125°C – 165°C fusing range)',
      icon: <Sparkles size={20} />,
    },
    {
      step: '02',
      title: 'High-Speed Embroidery Needle Heat Dissipation',
      summary:
        'Substrates engineered with long-staple cellulose and synthetic binders that withstand high stitch densities on 1,000+ RPM multi-needle machines without needle gumming or thread shearing.',
      spec: 'Zero gummy residue, clean tear-away and cut-away perforation lines',
      icon: <Cpu size={20} />,
    },
    {
      step: '03',
      title: 'Custom Millimeter Slitting & Converting',
      summary:
        'In-house slitting and precision winding machinery allows us to convert master rolls into exact customer-specified widths, from 10mm placket strips to 2.1m wide rolls with razor-clean selvages.',
      spec: 'Tolerance within ±0.5mm, tightly wound cores ready for automated feed',
      icon: <Sliders size={20} />,
    },
    {
      step: '04',
      title: 'Batch-to-Batch Uniformity & Tension Balance',
      summary:
        'Every master lot is tested for calibrated GSM weight, bonding peel strength, and dimensional shrinkage under steam, ensuring your factory lines run continuously without setup adjustments.',
      spec: '100% inspected lots verified against Indian textile manufacturing standards',
      icon: <ShieldCheck size={20} />,
    },
  ];

  return (
    <section className="credibility-section" id="manufacturing">
      <div className="section-container">
        {/* ASYMMETRIC EDITORIAL HEADER */}
        <div className="section-header-editorial">
          <div className="editorial-eyebrow-wrap">
            <span className="eyebrow-badge">THE MATERIAL STANDARD</span>
            <span className="eyebrow-facility-tag">CHEMBUR, MUMBAI FACILITY</span>
          </div>
          <div className="editorial-header-grid">
            <h2 className="section-title-editorial">
              Engineered To Withstand The Rigors Of Modern Garment Manufacturing
            </h2>
            <p className="section-lead-editorial">
              In garment engineering, the interlining and backing material remains hidden, but defines whether a collar keeps its crisp edge, a waistband holds its contour, or an embroidery design remains razor-sharp without puckering.
            </p>
          </div>
        </div>

        {/* SPLIT EDITORIAL SHOWCASE */}
        <div className="standards-split-layout">
          {/* LEFT: AUTHENTIC TEXTILE PHOTOGRAPHY & TECHNICAL DOSSIER */}
          <div className="standards-visual-col">
            <div className="standards-image-card">
              <img
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=1000&auto=format&fit=crop&q=85"
                alt="Textile converting and elastic webbing inspection at Royal Edge Enterprises"
                className="standards-img"
                loading="lazy"
              />
              <div className="standards-image-caption">
                <div className="caption-badge">MANUFACTURING INTEGRITY</div>
                <h4 className="caption-title">Zero Tolerance For Fabric Distortion</h4>
                <p className="caption-text">
                  Our backing formulations are calibrated for modern computerized tajima, barudan, and brother multi-needle setups.
                </p>
                <div className="caption-specs">
                  <div className="c-spec-item">
                    <span className="c-spec-label">GSM ACCURACY</span>
                    <strong className="c-spec-val">±3% Calibrated</strong>
                  </div>
                  <div className="c-spec-item">
                    <span className="c-spec-label">THERMAL LIMIT</span>
                    <strong className="c-spec-val">Up to 210°C</strong>
                  </div>
                  <div className="c-spec-item">
                    <span className="c-spec-label">GOVT COMPLIANCE</span>
                    <strong className="c-spec-val">GST &amp; MSME</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* FACTORY VERIFICATION DOSSIER */}
            <div className="factory-compliance-banner">
              <div className="compliance-header">
                <CheckCircle2 size={16} className="comp-check-icon" />
                <span>OFFICIALLY REGISTERED INDIAN TEXTILE UNIT</span>
              </div>
              <p className="compliance-meta">
                Operating under GSTIN <strong>{COMPANY_INFO.gstNumber}</strong> and Udyam Registration <strong>{COMPANY_INFO.msmeNumber}</strong>. Direct factory dispatch from Chembur, Mumbai.
              </p>
            </div>
          </div>

          {/* RIGHT: ARCHITECTURAL 4-STEP SPECIFICATION LEDGER */}
          <div className="standards-ledger-col">
            <div className="standards-ledger-list">
              {standards.map((std) => (
                <article className="standard-ledger-item" key={std.step}>
                  <div className="std-step-header">
                    <span className="std-step-number">{std.step}</span>
                    <div className="std-step-icon">{std.icon}</div>
                  </div>
                  <div className="std-step-content">
                    <h3 className="std-step-title">{std.title}</h3>
                    <p className="std-step-summary">{std.summary}</p>
                    <div className="std-step-spec-tag">
                      <Layers size={13} />
                      <span>{std.spec}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
