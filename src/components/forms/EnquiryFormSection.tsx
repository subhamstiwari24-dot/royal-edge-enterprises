import React, { useState, useEffect } from 'react';
import {
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileSpreadsheet,
  Building2,
  Phone,
  Mail,
  Layers,
  MessageCircle,
  Lock,
  Clock,
  MapPin,
} from 'lucide-react';
import type { ProductCategory, EnquiryType, PreferredContact, PublicProduct } from '../../types';
import { royalEdgeService } from '../../services/api';
import { COMPANY_INFO } from '../../data/initialData';

interface EnquiryFormSectionProps {
  preselectedProduct?: PublicProduct | null;
  onClearPreselected?: () => void;
}

const CATEGORIES: ProductCategory[] = [
  'Fusible Elastic',
  'Elastic',
  'Microdot',
  'Belt Roll',
  'Patti',
  'Collar & Cuff',
  'Strip',
  'Spunbond',
];

const COMMON_UNITS = ['Meters', 'Rolls', 'Kilograms', 'Yards', 'Pieces'];

export const EnquiryFormSection: React.FC<EnquiryFormSectionProps> = ({
  preselectedProduct,
  onClearPreselected,
}) => {
  const [customerName, setCustomerName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [category, setCategory] = useState<ProductCategory>('Fusible Elastic');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState<string>('100');
  const [unit, setUnit] = useState<string>('Meters');
  const [enquiryType, setEnquiryType] = useState<EnquiryType>('BULK');
  const [message, setMessage] = useState('');
  const [preferredContact, setPreferredContact] = useState<PreferredContact>('WHATSAPP');

  // Form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successData, setSuccessData] = useState<{
    enquiryNumber: string;
    productName?: string;
    quantity: number;
    unit: string;
  } | null>(null);

  // Sync state during render when preselected product changes (React 19 / Oxlint recommended pattern)
  const [prevProduct, setPrevProduct] = useState(preselectedProduct);
  if (preselectedProduct !== prevProduct) {
    setPrevProduct(preselectedProduct);
    if (preselectedProduct) {
      setCategory(preselectedProduct.category);
      setProductName(preselectedProduct.name);
      setUnit(preselectedProduct.unit);
      setQuantity(preselectedProduct.minimumOrderQuantity.toString());
    }
  }

  // Smooth scroll when preselected product is picked
  useEffect(() => {
    if (preselectedProduct) {
      const el = document.getElementById('enquiry');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [preselectedProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (!customerName.trim()) {
      setErrorMessage('Please provide your full contact name.');
      return;
    }

    const cleanPhone = phone.replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please provide a valid direct phone or WhatsApp number.');
      return;
    }

    const numQty = parseFloat(quantity);
    if (isNaN(numQty) || numQty <= 0) {
      setErrorMessage('Please enter a valid requested quantity greater than zero.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await royalEdgeService.submitEnquiry({
        customerName: customerName.trim(),
        companyName: companyName.trim() || undefined,
        phone: phone.trim(),
        email: email.trim() || undefined,
        category,
        productName: productName.trim() || undefined,
        productId: preselectedProduct ? preselectedProduct.id : undefined,
        quantity: numQty,
        unit,
        enquiryType,
        message: message.trim() || undefined,
        preferredContact,
      });

      if (result.success) {
        setSuccessData({
          enquiryNumber: result.enquiryNumber,
          productName: productName.trim() || category,
          quantity: numQty,
          unit,
        });

        // Reset inputs
        setCustomerName('');
        setCompanyName('');
        setPhone('');
        setEmail('');
        setMessage('');
        if (onClearPreselected) onClearPreselected();
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Unable to submit enquiry. Please try again.';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetSuccess = () => {
    setSuccessData(null);
  };

  return (
    <section className="enquiry-section" id="enquiry">
      <div className="section-container">
        {/* EDITORIAL HEADER */}
        <div className="rfq-section-header">
          <div className="rfq-eyebrow-line">
            <span className="eyebrow-badge">DIRECT COMMERCIAL DESK</span>
            <span className="rfq-unit-label">CHEMBUR WAREHOUSE DISPATCH</span>
          </div>
          <h2 className="rfq-section-title">
            Request A Private Commercial Quotation
          </h2>
          <p className="rfq-section-subtitle">
            Because we are a direct manufacturer catering to both tailored retail tailors and export-grade apparel factories, our unit prices are calculated precisely against required widths, GSM tolerances, order volume, and destination logistics.
          </p>
        </div>

        <div className="rfq-architecture-layout">
          {/* LEFT: PROCUREMENT GUIDANCE & OPERATIONAL CREDENTIALS */}
          <div className="rfq-guidance-col">
            <div className="rfq-steps-dossier">
              <h3 className="guidance-title">Procurement Workflow</h3>

              <div className="guidance-step">
                <div className="guidance-num">01</div>
                <div>
                  <strong className="guidance-step-title">Specify Target Substrates</strong>
                  <p className="guidance-step-desc">
                    Select from our 8 approved categories, target yardage/meters, and custom width or GSM parameters.
                  </p>
                </div>
              </div>

              <div className="guidance-step">
                <div className="guidance-num">02</div>
                <div>
                  <strong className="guidance-step-title">Factory Commercial Appraisal</strong>
                  <p className="guidance-step-desc">
                    Our sales desk reviews current raw polymer indices, slitting requirements, and applies maximum bulk discounts.
                  </p>
                </div>
              </div>

              <div className="guidance-step">
                <div className="guidance-num">03</div>
                <div>
                  <strong className="guidance-step-title">Official Itemized Quotation</strong>
                  <p className="guidance-step-desc">
                    Receive your quotation PDF via WhatsApp or email with clear validity, 5% GST tax calculation, and dispatch timeline.
                  </p>
                </div>
              </div>
            </div>

            {/* CONFIDENTIAL PRICING COMMITMENT */}
            <div className="confidentiality-card">
              <div className="conf-header">
                <Lock size={16} className="conf-icon" />
                <span>COMMERCIAL PRICE INTEGRITY</span>
              </div>
              <p className="conf-text">
                Wholesale prices are strictly confidential to protect our dealer network and clothing manufacturers. Prices are never published openly on the web.
              </p>
              <div className="conf-dispatch-meta">
                <div className="meta-pair">
                  <Clock size={13} />
                  <span>Response Time: Within 2 to 4 Business Hours</span>
                </div>
                <div className="meta-pair">
                  <MapPin size={13} />
                  <span>Dispatch Origin: Chembur, Mumbai - 89</span>
                </div>
              </div>
            </div>

            {/* DIRECT WHATSAPP DESK */}
            <div className="rfq-urgent-box">
              <div className="urgent-top">
                <MessageCircle size={18} className="urgent-icon" />
                <span className="urgent-label">Urgent Sampling or Roll Inquiries</span>
              </div>
              <p className="urgent-desc">
                Need immediate inventory confirmation or courier sample rolls for a machine run today?
              </p>
              <a
                href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                  'Hello Royal Edge Enterprises, I have an urgent embroidery backing enquiry and need immediate stock confirmation.'
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="urgent-whatsapp-cta"
              >
                <span>WhatsApp Sales Desk: {COMPANY_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* RIGHT: THE FORM */}
          <div className="rfq-form-col">
            <div className="rfq-card-frame">
              {successData ? (
                /* SUCCESS STATE */
                <div className="rfq-success-view">
                  <div className="success-icon-badge">
                    <CheckCircle size={46} className="success-icon" />
                  </div>
                  <h3 className="success-heading">Commercial Enquiry Registered</h3>
                  <p className="success-body">
                    Your request has been successfully recorded in our factory management queue. A sales representative will review your technical specifications and prepare a formal quotation.
                  </p>

                  <div className="rfq-confirmation-dossier">
                    <div className="conf-dossier-row">
                      <span className="row-label">Enquiry Reference:</span>
                      <strong className="row-code">{successData.enquiryNumber}</strong>
                    </div>
                    <div className="conf-dossier-row">
                      <span className="row-label">Product / Category:</span>
                      <span className="row-val">{successData.productName}</span>
                    </div>
                    <div className="conf-dossier-row">
                      <span className="row-label">Requested Quantity:</span>
                      <span className="row-val">{successData.quantity} {successData.unit}</span>
                    </div>
                    <div className="conf-dossier-row">
                      <span className="row-label">Fulfillment Status:</span>
                      <span className="row-val pending">Pending Factory Review</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleResetSuccess}
                    className="btn-primary reset-rfq-btn"
                  >
                    <span>Submit Another Enquiry</span>
                  </button>
                </div>
              ) : (
                /* THE RFQ FORM */
                <form onSubmit={handleSubmit} className="rfq-actual-form" noValidate>
                  <div className="rfq-form-top">
                    <div className="form-header-title-block">
                      <FileSpreadsheet size={20} className="rfq-header-icon" />
                      <div>
                        <h3 className="rfq-form-title">Commercial Quotation Form</h3>
                        <p className="rfq-form-sub">Direct factory quotation for wholesale and trial lots</p>
                      </div>
                    </div>
                  </div>

                  {preselectedProduct && (
                    <div className="preselected-item-tag">
                      <div className="preselected-detail">
                        <span className="pre-label">Preselected Item:</span>
                        <strong className="pre-title">{preselectedProduct.name}</strong>
                        <span className="pre-cat">({preselectedProduct.category})</span>
                      </div>
                      <button
                        type="button"
                        onClick={onClearPreselected}
                        className="pre-clear-button"
                        title="Clear preselection"
                      >
                        Change
                      </button>
                    </div>
                  )}

                  {errorMessage && (
                    <div className="rfq-alert-banner" role="alert">
                      <AlertCircle size={16} className="alert-icon" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  {/* SECTION 1: ORDER SCALE (BULK VS RETAIL) */}
                  <div className="rfq-fieldset">
                    <label className="fieldset-label">01 / Procurement Scale &amp; Tier</label>
                    <div className="tier-selector-grid">
                      <label className={`tier-card ${enquiryType === 'BULK' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="enquiryType"
                          value="BULK"
                          checked={enquiryType === 'BULK'}
                          onChange={() => setEnquiryType('BULK')}
                        />
                        <div className="tier-card-body">
                          <strong className="tier-name">Wholesale &amp; Bulk Container</strong>
                          <span className="tier-desc">Apparel export factories, garment units, and regional stockists</span>
                        </div>
                      </label>

                      <label className={`tier-card ${enquiryType === 'RETAIL' ? 'active' : ''}`}>
                        <input
                          type="radio"
                          name="enquiryType"
                          value="RETAIL"
                          checked={enquiryType === 'RETAIL'}
                          onChange={() => setEnquiryType('RETAIL')}
                        />
                        <div className="tier-card-body">
                          <strong className="tier-name">Boutique &amp; Trial Rolls</strong>
                          <span className="tier-desc">Bespoke tailors, sampling runs, and trial machine evaluation</span>
                        </div>
                      </label>
                    </div>
                  </div>

                  {/* SECTION 2: CONTACT & BUSINESS DETAILS */}
                  <div className="rfq-fieldset">
                    <label className="fieldset-label">02 / Commercial Contact Dossier</label>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="customerName" className="input-label">
                          Full Name <span className="req">*</span>
                        </label>
                        <input
                          id="customerName"
                          type="text"
                          placeholder="e.g. Rajesh Sharma"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                          className="text-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="companyName" className="input-label">
                          Company / Business Name
                        </label>
                        <div className="input-icon-wrapper">
                          <Building2 size={15} className="field-icon" />
                          <input
                            id="companyName"
                            type="text"
                            placeholder="e.g. Apex Apparel Exports"
                            value={companyName}
                            onChange={(e) => setCompanyName(e.target.value)}
                            className="text-input has-icon"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="phone" className="input-label">
                          Phone / WhatsApp Number <span className="req">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                          <Phone size={15} className="field-icon" />
                          <input
                            id="phone"
                            type="tel"
                            placeholder="e.g. +91 98200 12345"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="text-input has-icon"
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="email" className="input-label">
                          Email Address (Optional)
                        </label>
                        <div className="input-icon-wrapper">
                          <Mail size={15} className="field-icon" />
                          <input
                            id="email"
                            type="email"
                            placeholder="e.g. purchase@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="text-input has-icon"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 3: TECHNICAL SPECIFICATIONS */}
                  <div className="rfq-fieldset">
                    <label className="fieldset-label">03 / Target Substrate &amp; Quantity</label>
                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="category" className="input-label">
                          Product Category <span className="req">*</span>
                        </label>
                        <div className="input-icon-wrapper">
                          <Layers size={15} className="field-icon" />
                          <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as ProductCategory)}
                            className="text-input has-icon select-box"
                            required
                          >
                            {CATEGORIES.map((cat) => (
                              <option key={cat} value={cat}>
                                {cat}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label htmlFor="productName" className="input-label">
                          Specific Grade or Reference
                        </label>
                        <input
                          id="productName"
                          type="text"
                          placeholder="e.g. 32mm Black Fusible Elastic"
                          value={productName}
                          onChange={(e) => setProductName(e.target.value)}
                          className="text-input"
                        />
                      </div>
                    </div>

                    <div className="form-grid-2">
                      <div className="form-group">
                        <label htmlFor="quantity" className="input-label">
                          Required Volume <span className="req">*</span>
                        </label>
                        <input
                          id="quantity"
                          type="number"
                          min="1"
                          step="any"
                          placeholder="e.g. 500"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          className="text-input"
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label htmlFor="unit" className="input-label">
                          Unit of Measure <span className="req">*</span>
                        </label>
                        <select
                          id="unit"
                          value={unit}
                          onChange={(e) => setUnit(e.target.value)}
                          className="text-input select-box"
                        >
                          {COMMON_UNITS.map((u) => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* SECTION 4: PREFERRED CONTACT & CUSTOM SPECIFICATIONS */}
                  <div className="rfq-fieldset">
                    <label className="fieldset-label">04 / Dispatch &amp; Communication Preferences</label>
                    <div className="contact-channel-selector">
                      <label className="channel-pill">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="WHATSAPP"
                          checked={preferredContact === 'WHATSAPP'}
                          onChange={() => setPreferredContact('WHATSAPP')}
                        />
                        <span>WhatsApp (Fastest response)</span>
                      </label>
                      <label className="channel-pill">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="PHONE"
                          checked={preferredContact === 'PHONE'}
                          onChange={() => setPreferredContact('PHONE')}
                        />
                        <span>Direct Telephone Call</span>
                      </label>
                      <label className="channel-pill">
                        <input
                          type="radio"
                          name="preferredContact"
                          value="EMAIL"
                          checked={preferredContact === 'EMAIL'}
                          onChange={() => setPreferredContact('EMAIL')}
                        />
                        <span>Formal Email Proposal</span>
                      </label>
                    </div>

                    <div className="form-group" style={{ marginTop: '16px' }}>
                      <label htmlFor="message" className="input-label">
                        Custom Width, GSM Requirement, or Destination City
                      </label>
                      <textarea
                        id="message"
                        rows={3}
                        placeholder="Mention required roll widths in mm/inches, fusing machine type, delivery destination city, or special packaging requests..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        className="text-area"
                      />
                    </div>
                  </div>

                  {/* ACTION & PRIVACY GUARANTEE */}
                  <div className="rfq-form-footer">
                    <div className="rfq-privacy-tag">
                      <Lock size={13} className="privacy-icon" />
                      <span>Confidential quotation sent directly to your authorized contact.</span>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="btn-primary rfq-submit-button"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={16} className="spin-icon" />
                          <span>Preparing Quotation Request...</span>
                        </>
                      ) : (
                        <>
                          <span>Submit Commercial Enquiry</span>
                          <Send size={15} />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
