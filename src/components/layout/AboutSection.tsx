import React from 'react';
import { ArrowRight, Factory, MapPin, ShieldCheck, CheckCircle2, PhoneCall } from 'lucide-react';
import { COMPANY_INFO } from '../../data/initialData';

interface AboutSectionProps {
  onOpenEnquiry?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onOpenEnquiry }) => {
  return (
    <section className="about-section" id="about">
      <div className="section-container">
        <div className="about-architectural-grid">
          {/* LEFT: EDITORIAL BRAND NARRATIVE & PURPOSE */}
          <div className="about-narrative-col">
            <div className="about-eyebrow-row">
              <span className="eyebrow-badge">THE HIDDEN ARCHITECTURE</span>
              <span className="about-est-tag">CHEMBUR, MUMBAI</span>
            </div>

            <h2 className="about-headline">
              Crafting The Silent Backbone Of Exceptional Apparel
            </h2>

            <p className="about-intro-lead">
              At Royal Edge Enterprises, we understand that while interlining and embroidery backing are invisible in the finished garment, they determine everything the wearer experiences: collar sharpness, waistband resilience, and flawless embroidery finish.
            </p>

            <div className="about-paragraphs">
              <p>
                Founded and operating from Chembur, Mumbai, Royal Edge Enterprises manufactures, slits, and converts high-grade textile interlinings, thermal-adhesive tapes, and non-woven embroidery backings for the Indian apparel export and domestic market.
              </p>
              <p>
                Inferior backings cause thread shearing on multi-needle computerized machines, seam puckering after thermal fusing, and catastrophic collar collapse after industrial laundering. Our substrates are formulated with high-tenacity fibers and calibrated microdot resins to guarantee batch-to-batch reliability and zero production downtime.
              </p>
            </div>

            {/* THREE STRATEGIC COMMITMENTS */}
            <div className="about-commitments-ledger">
              <div className="commitment-entry">
                <div className="commitment-bullet">
                  <CheckCircle2 size={16} />
                </div>
                <div className="commitment-text">
                  <strong>Zero Strike-Through Assurance:</strong> Computerized 180-mesh dot deposition bonds firmly at 125°C–150°C without resin bleeding through delicate silks, linens, or shirting.
                </div>
              </div>

              <div className="commitment-entry">
                <div className="commitment-bullet">
                  <CheckCircle2 size={16} />
                </div>
                <div className="commitment-text">
                  <strong>Direct In-House Slitting:</strong> Custom widths slit from 10mm placket rolls to 2.1m master rolls with sealed, fray-resistant edges.
                </div>
              </div>

              <div className="commitment-entry">
                <div className="commitment-bullet">
                  <CheckCircle2 size={16} />
                </div>
                <div className="commitment-text">
                  <strong>Confidential Wholesale Pricing:</strong> Protected commercial rate cards for apparel factories, garment export houses, and distributor networks.
                </div>
              </div>
            </div>

            <div className="about-action-group">
              <a
                href="#enquiry"
                onClick={onOpenEnquiry}
                className="btn-primary"
              >
                <span>Request Commercial Terms</span>
                <ArrowRight size={15} />
              </a>

              <a
                href={`tel:${COMPANY_INFO.phone.replace(/\s+/g, '')}`}
                className="about-phone-cta"
              >
                <PhoneCall size={15} />
                <span>Call Factory: {COMPANY_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* RIGHT: FACTORY DOSSIER & COMPLIANCE ARCHITECTURE */}
          <div className="about-dossier-col">
            <div className="dossier-card">
              <div className="dossier-card-top">
                <div className="dossier-crest">
                  <Factory size={22} />
                </div>
                <div>
                  <span className="dossier-label">ENTERPRISE DOSSIER</span>
                  <h3 className="dossier-name">{COMPANY_INFO.name}</h3>
                  <span className="dossier-motto">{COMPANY_INFO.tagline}</span>
                </div>
              </div>

              <div className="dossier-details-list">
                <div className="dossier-item">
                  <div className="item-icon-wrap">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="dossier-item-label">FACILITY LOCATION</span>
                    <p className="dossier-item-value">{COMPANY_INFO.address}</p>
                  </div>
                </div>

                <div className="dossier-item">
                  <div className="item-icon-wrap">
                    <ShieldCheck size={16} />
                  </div>
                  <div>
                    <span className="dossier-item-label">LEGAL IDENTIFICATION</span>
                    <div className="dossier-compliance-badges">
                      <div className="compliance-tag">
                        <span>GSTIN:</span>
                        <strong>{COMPANY_INFO.gstNumber}</strong>
                      </div>
                      <div className="compliance-tag">
                        <span>MSME Udyam:</span>
                        <strong>{COMPANY_INFO.msmeNumber}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dossier-item">
                  <div className="item-icon-wrap">
                    <Factory size={16} />
                  </div>
                  <div>
                    <span className="dossier-item-label">CORE OPERATIONAL CAPABILITY</span>
                    <p className="dossier-item-value">
                      Thermal Fusible Elastic, Trouser Belt Rolls, Non-Woven Embroidery Patti, Microdot Interlining, Spunbond Stabilizers, and Shirt Collar/Cuff Buckrams.
                    </p>
                  </div>
                </div>
              </div>

              {/* FACTORY CAPACITY SPEC METRICS */}
              <div className="dossier-metrics-strip">
                <div className="metric-box">
                  <span className="metric-value">8</span>
                  <span className="metric-tag">Approved Categories</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-box">
                  <span className="metric-value">100%</span>
                  <span className="metric-tag">Lot Inspected</span>
                </div>
                <div className="metric-divider"></div>
                <div className="metric-box">
                  <span className="metric-value">B2B</span>
                  <span className="metric-tag">Direct Supply</span>
                </div>
              </div>

              <div className="dossier-footer">
                <span>Direct Mumbai Dispatch to Ahmedabad, Surat, Delhi NCR, Tirupur, Bengaluru, and Kolkata.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
