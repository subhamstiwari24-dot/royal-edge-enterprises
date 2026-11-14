import React, { useState } from 'react';
import { ArrowRight, ShoppingBag, Check, Star } from 'lucide-react';
import type { PublicProduct } from '../../types';
import { useCart } from '../../context/useCart';

interface FeaturedProductsSectionProps {
  products: PublicProduct[];
  onSelectProduct: (product: PublicProduct) => void;
  onEnquireProduct: (product: PublicProduct) => void;
}

export type SupplyViewMode = 'quotations' | 'slitting' | 'samples';

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  products,
  onSelectProduct,
  onEnquireProduct,
}) => {
  const { addToCart, getProductPricing } = useCart();
  const [supplyMode, setSupplyMode] = useState<SupplyViewMode>('quotations');
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [recentlyAdded, setRecentlyAdded] = useState<number | null>(null);

  // Take featured products or top 4
  const featured = products.filter((p) => p.featured || [1, 4, 6, 3].includes(p.id)).slice(0, 4);

  const getQty = (id: number) => quantities[id] || 1;
  const setQty = (id: number, val: number) => {
    setQuantities((prev) => ({ ...prev, [id]: Math.max(1, val) }));
  };

  const handleAddWithQty = (product: PublicProduct) => {
    const qty = getQty(product.id);
    addToCart(product, qty);
    setRecentlyAdded(product.id);
    setTimeout(() => setRecentlyAdded(null), 1800);
  };

  return (
    <section id="featured" className="featured-section">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="featured-header-row">
          <div className="featured-header-text">
            <span className="eyebrow-badge">FLAGSHIP PRODUCTION BATCHES</span>
            <h2 className="section-title">Featured Textile & Interlining Materials</h2>
            <p className="section-subtitle">
              Our highest-demand waistband belt rolls, executive shirt collar fusibles, and embroidery backings, trusted by leading garment manufacturing houses across India.
            </p>
          </div>

          {/* COMMERCIAL QUOTATION SELECTOR TABS */}
          <div className="pricing-tier-toggle-wrap" id="pricing-tiers" role="tablist" aria-label="Commercial Supply Mode">
            <span className="tier-toggle-label">Commercial Supply:</span>
            <div className="tier-toggle-pills">
              <button
                type="button"
                role="tab"
                aria-selected={supplyMode === 'quotations'}
                className={`tier-pill ${supplyMode === 'quotations' ? 'active' : ''}`}
                onClick={() => setSupplyMode('quotations')}
              >
                Private Quotations
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={supplyMode === 'slitting'}
                className={`tier-pill ${supplyMode === 'slitting' ? 'active' : ''}`}
                onClick={() => setSupplyMode('slitting')}
              >
                Custom Slit Widths
              </button>
              <button
                type="button"
                role="tab"
                aria-selected={supplyMode === 'samples'}
                className={`tier-pill ${supplyMode === 'samples' ? 'active' : ''}`}
                onClick={() => setSupplyMode('samples')}
              >
                Factory Sample Spools
              </button>
            </div>
          </div>
        </div>

        {/* FEATURED CARDS GRID */}
        <div className="featured-grid">
          {featured.map((product) => {
            const pricing = getProductPricing(product);
            const currentQty = getQty(product.id);
            const isAdded = recentlyAdded === product.id;

            return (
              <div
                key={product.id}
                className="featured-card"
                onClick={() => onSelectProduct(product)}
              >
                {/* IMAGE BOX */}
                <div className="featured-card-img-wrap">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="featured-pill-ribbon">
                    <span className="featured-star-pill">
                      <Star size={12} fill="#B18A45" color="#B18A45" />
                      <span>Factory Certified</span>
                    </span>
                  </div>
                </div>

                {/* CONTENT */}
                <div className="featured-card-content">
                  <div className="featured-top-info">
                    <span className="featured-category">{product.category}</span>
                    <span className="featured-sku">{product.sku}</span>
                  </div>

                  <h3 className="featured-title">{product.name}</h3>

                  <p className="featured-desc">{product.description}</p>

                  {/* SPECS SNIPPET (Guaranteed 3 rows for uniform height across all cards) */}
                  <div className="featured-specs-grid">
                    <div className="spec-item">
                      <span className="label">Widths:</span>
                      <span className="val">{product.specifications?.width || 'Standard Widths'}</span>
                    </div>
                    <div className="spec-item">
                      <span className="label">
                        {product.specifications?.fusingTemperature
                          ? 'Fusing:'
                          : product.specifications?.weightGsm
                          ? 'Weight:'
                          : 'Grade:'}
                      </span>
                      <span className="val">
                        {product.specifications?.fusingTemperature ||
                          product.specifications?.weightGsm ||
                          'Apparel Stiffener'}
                      </span>
                    </div>
                    <div className="spec-item">
                      <span className="label">Base:</span>
                      <span className="val" title={product.specifications?.composition || ''}>
                        {product.specifications?.composition
                          ? product.specifications.composition.split('+')[0].trim()
                          : 'Engineered Substrate'}
                      </span>
                    </div>
                  </div>

                  {/* QUOTATION & MOQ BOX (Responds to Commercial Supply Mode) */}
                  <div className="featured-price-tier-box">
                    {supplyMode === 'quotations' && (
                      <div className="tier-line quote-active">
                        <div className="tier-row-top">
                          <span className="tier-label-primary">Wholesale Supply Rate</span>
                          <span className="tier-value-primary">Price on Request</span>
                        </div>
                        <div className="tier-row-bottom">
                          <span className="tier-detail-text">
                            <span className="detail-tag">Min. Order (MOQ):</span> {pricing.moq} {product.unit}
                          </span>
                          <span className="tier-badge-pill">B2B Quotation</span>
                        </div>
                      </div>
                    )}

                    {supplyMode === 'slitting' && (
                      <div className="tier-line quote-active">
                        <div className="tier-row-top">
                          <span className="tier-label-primary">Custom Slit Converting</span>
                          <span className="tier-value-primary">±0.5mm Calibrated</span>
                        </div>
                        <div className="tier-row-bottom">
                          <span className="tier-detail-text" title={product.specifications?.width || '10mm – 150cm'}>
                            <span className="detail-tag">Widths:</span> {product.specifications?.width || '10mm – 150cm'}
                          </span>
                          <span className="tier-badge-pill">Custom Reels</span>
                        </div>
                      </div>
                    )}

                    {supplyMode === 'samples' && (
                      <div className="tier-line quote-active">
                        <div className="tier-row-top">
                          <span className="tier-label-primary">Factory Sample Testing</span>
                          <span className="tier-value-primary">Trial Spools</span>
                        </div>
                        <div className="tier-row-bottom">
                          <span className="tier-detail-text">Sample Rolls for Machine Run</span>
                          <span className="tier-badge-pill">Fast Dispatch</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* QUANTITY & ACTIONS */}
                  <div className="featured-actions-row" onClick={(e) => e.stopPropagation()}>
                    <div className="qty-selector-wrap">
                      <span className="qty-label">Qty ({product.unit}):</span>
                      <div className="qty-selector">
                        <button
                          type="button"
                          onClick={() => setQty(product.id, currentQty - (product.unit === 'Rolls' ? 5 : 25))}
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          min="1"
                          value={currentQty}
                          onChange={(e) => setQty(product.id, parseInt(e.target.value) || 1)}
                        />
                        <button
                          type="button"
                          onClick={() => setQty(product.id, currentQty + (product.unit === 'Rolls' ? 5 : 25))}
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <div className="featured-btn-group">
                      <button
                        type="button"
                        className="btn-primary quote-btn"
                        onClick={() => onEnquireProduct(product)}
                      >
                        <span>
                          {supplyMode === 'quotations'
                            ? 'Request Quote'
                            : supplyMode === 'slitting'
                            ? 'Enquire Slit'
                            : 'Sample Spool'}
                        </span>
                        <ArrowRight size={14} />
                      </button>

                      <button
                        type="button"
                        className={`btn-secondary add-cart-btn ${isAdded ? 'added' : ''}`}
                        onClick={() => handleAddWithQty(product)}
                      >
                        {isAdded ? (
                          <>
                            <Check size={15} />
                            <span>Added</span>
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} />
                            <span>
                              Add {currentQty} {currentQty === 1 ? (product.unit === 'Rolls' ? 'Roll' : product.unit === 'Meters' ? 'Meter' : product.unit === 'Kilograms' ? 'Kg' : product.unit) : product.unit}
                            </span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
