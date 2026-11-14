import React, { useState } from 'react';
import { X, Check, ArrowRight, ShieldCheck, FileSpreadsheet, Package, ShoppingBag } from 'lucide-react';
import type { PublicProduct } from '../../types';
import { useCart } from '../../context/useCart';

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
  const { addToCart, getProductPricing } = useCart();
  const [selectedWidth, setSelectedWidth] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [added, setAdded] = useState(false);

  if (!product) return null;

  const specs = product.specifications || {};
  const pricing = getProductPricing(product);

  const availableWidths = specs.width ? specs.width.split('/').map((w) => w.trim()) : [];

  const handleAddToCartModal = () => {
    addToCart(product, quantity, selectedWidth || availableWidths[0] || undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 900);
  };

  return (
    <div
      className="modal-backdrop"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
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
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80';
                }}
              />
              <span className="modal-category-badge">{product.category}</span>
            </div>

            <div className="modal-trust-box">
              <div className="trust-row">
                <ShieldCheck size={16} className="trust-icon" />
                <span>Certified Industrial Textile Quality (ISO Grade)</span>
              </div>
              <div className="trust-row">
                <Package size={16} className="trust-icon" />
                <span>Sample Swatches Dispatched for Dwell Testing</span>
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

            {/* COMMERCIAL SUPPLY & MOQ MATRIX (Replaces Public Prices) */}
            <div className="modal-pricing-matrix">
              <div className="price-tier-card highlight">
                <div className="tier-head">
                  <span className="tier-name">Wholesale Production Batch</span>
                  <span className="tier-condition">MOQ: {pricing.moq} {product.unit}</span>
                </div>
                <div className="tier-amount quote-only">
                  <span className="quote-badge">Price on Request</span>
                </div>
                <span className="tier-savings-badge">
                  Confidential Factory B2B Quotations
                </span>
              </div>

              <div className="price-tier-card">
                <div className="tier-head">
                  <span className="tier-name">Sample Roll Testing</span>
                  <span className="tier-condition">Trial Spool Testing Available</span>
                </div>
                <div className="tier-amount quote-only">
                  <span className="quote-badge-sub">Contact for Pricing</span>
                </div>
                <span className="tier-retail-note">Fast Dispatch from Chembur</span>
              </div>
            </div>

            {/* WIDTH SELECTOR (IF MULTIPLE SIZES AVAILABLE) */}
            {availableWidths.length > 0 && (
              <div className="modal-width-selector">
                <label className="selector-label">Available Widths / Slit Sizes:</label>
                <div className="width-pills">
                  {availableWidths.map((w) => (
                    <button
                      key={w}
                      type="button"
                      className={`width-pill-btn ${(selectedWidth || availableWidths[0]) === w ? 'active' : ''}`}
                      onClick={() => setSelectedWidth(w)}
                    >
                      {w}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* QUANTITY CONTROL & LIVE CALCULATOR */}
            <div className="modal-quantity-row">
              <div className="qty-picker">
                <label className="qty-label">Quantity ({product.unit}):</label>
                <div className="qty-buttons">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - (product.unit === 'Rolls' ? 5 : 25)))}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                  <button
                    type="button"
                    onClick={() => setQuantity(quantity + (product.unit === 'Rolls' ? 5 : 25))}
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="live-subtotal-box">
                <span className="subtotal-label">Requested Quantity:</span>
                <span className="subtotal-val">{quantity} {product.unit}</span>
                <span className="subtotal-tax-note">Official Proforma Generated Upon Inquiry</span>
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

            {/* ACTION BUTTONS (Prefer "Request a Quote" as Primary CTA) */}
            <div className="modal-actions-footer">
              <button
                type="button"
                className="btn-primary modal-enquire-btn"
                onClick={() => {
                  onClose();
                  onEnquire(product);
                }}
              >
                <span>Request a Quote</span>
                <ArrowRight size={15} />
              </button>

              <button
                type="button"
                className={`btn-secondary modal-cart-btn ${added ? 'added' : ''}`}
                onClick={handleAddToCartModal}
              >
                {added ? (
                  <>
                    <Check size={16} />
                    <span>Added to Order Draft</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag size={16} />
                    <span>Add {quantity} {product.unit} to Cart</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
