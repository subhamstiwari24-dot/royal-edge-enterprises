import React from 'react';
import { X, Check, ArrowRight, ShieldCheck, Layers, FileSpreadsheet, Package } from 'lucide-react';
import type { PublicProduct } from '../../types';

interface ProductDetailModalProps {
  product: PublicProduct | null;
  onClose: () => void;
  onEnquire: (product: PublicProduct) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onEnquire,
}) => {
  if (!product) return null;

  const specs = product.specifications || {};

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal-close-btn"
          onClick={onClose}
          aria-label="Close modal"
        >
          <X size={20} />
        </button>

        <div className="modal-grid">
          {/* LEFT: IMAGE & BADGES */}
          <div className="modal-image-col">
            <div className="modal-image-wrapper">
              <img
                src={product.imageUrl}
                alt={product.name}
                className="modal-img"
              />
              <span className="modal-category-badge">{product.category}</span>
            </div>

            <div className="modal-trust-box">
              <div className="trust-row">
                <ShieldCheck size={16} className="trust-icon" />
                <span>Certified B2B Manufacturer Quality</span>
              </div>
              <div className="trust-row">
                <Package size={16} className="trust-icon" />
                <span>Sample Swatches Available on Request</span>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS & SPECIFICATIONS */}
          <div className="modal-details-col">
            <div className="modal-header">
              <span className="eyebrow-badge">ROYAL EDGE CATALOGUE</span>
              <h2 id="modal-title" className="modal-product-title">{product.name}</h2>
              <p className="modal-product-desc">{product.description}</p>
            </div>

            {/* ORDER PARAMETERS */}
            <div className="modal-order-specs">
              <div className="order-spec-item">
                <span className="spec-label">Standard Unit</span>
                <span className="spec-val">{product.unit}</span>
              </div>
              <div className="order-spec-item">
                <span className="spec-label">Minimum Order (MOQ)</span>
                <span className="spec-val">
                  {product.minimumOrderQuantity} {product.unit}
                </span>
              </div>
              <div className="order-spec-item">
                <span className="spec-label">Pricing Mode</span>
                <span className="spec-val highlight">Custom Private Quotation</span>
              </div>
            </div>

            {/* TECHNICAL SPECIFICATIONS TABLE */}
            <div className="modal-specs-section">
              <h3 className="specs-heading">
                <FileSpreadsheet size={16} />
                <span>Verified Technical Specifications</span>
              </h3>

              <div className="specs-table">
                {specs.width && (
                  <div className="specs-row">
                    <span className="spec-key">Available Widths / Sizes</span>
                    <span className="spec-value">{specs.width}</span>
                  </div>
                )}
                {specs.composition && (
                  <div className="specs-row">
                    <span className="spec-key">Material Composition</span>
                    <span className="spec-value">{specs.composition}</span>
                  </div>
                )}
                {specs.weightGsm && (
                  <div className="specs-row">
                    <span className="spec-key">Weight / Density</span>
                    <span className="spec-value">{specs.weightGsm}</span>
                  </div>
                )}
                {specs.coatingType && (
                  <div className="specs-row">
                    <span className="spec-key">Coating Formulation</span>
                    <span className="spec-value">{specs.coatingType}</span>
                  </div>
                )}
                {specs.fusingTemperature && (
                  <div className="specs-row">
                    <span className="spec-key">Fusing Temperature</span>
                    <span className="spec-value">{specs.fusingTemperature}</span>
                  </div>
                )}
                {specs.fusingPressure && (
                  <div className="specs-row">
                    <span className="spec-key">Recommended Pressure</span>
                    <span className="spec-value">{specs.fusingPressure}</span>
                  </div>
                )}
                {specs.packaging && (
                  <div className="specs-row">
                    <span className="spec-key">Standard Packaging</span>
                    <span className="spec-value">{specs.packaging}</span>
                  </div>
                )}
                {specs.colors && specs.colors.length > 0 && (
                  <div className="specs-row">
                    <span className="spec-key">Color Options</span>
                    <div className="spec-tags">
                      {specs.colors.map((c, i) => (
                        <span key={i} className="color-tag">{c}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* APPLICATIONS */}
            {specs.recommendedUses && specs.recommendedUses.length > 0 && (
              <div className="modal-applications">
                <h3 className="specs-heading">
                  <Layers size={16} />
                  <span>Recommended Industry Applications</span>
                </h3>
                <ul className="applications-list">
                  {specs.recommendedUses.map((use, i) => (
                    <li key={i}>
                      <Check size={14} className="bullet-check" />
                      <span>{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* ACTION FOOTER */}
            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-primary modal-enquire-btn"
                onClick={() => {
                  onClose();
                  onEnquire(product);
                }}
              >
                <span>Request Quotation for {product.name}</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
