import React, { useState } from 'react';
import { ArrowRight, Eye, Check, ShoppingBag } from 'lucide-react';
import type { PublicProduct } from '../../types';
import { useCart } from '../../context/useCart';

interface ProductCategoriesSectionProps {
  products: PublicProduct[];
  onSelectProduct: (product: PublicProduct) => void;
  onEnquireProduct: (product: PublicProduct) => void;
}

export type MainCategory = 'All' | 'Collar' | 'Cuff' | 'Belt Roll' | 'Patti' | 'Embroidery Backing';

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  products,
  onSelectProduct,
  onEnquireProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MainCategory>('All');
  const [addedProductId, setAddedProductId] = useState<number | null>(null);
  const { addToCart, getProductPricing } = useCart();

  const categories: { key: MainCategory; label: string; desc: string }[] = [
    { key: 'All', label: 'All Interlinings', desc: 'Complete Factory Range' },
    { key: 'Collar', label: 'Collar', desc: 'Thermosetting Fusing' },
    { key: 'Cuff', label: 'Cuff', desc: 'Shape Retention Stays' },
    { key: 'Belt Roll', label: 'Belt Roll', desc: 'Waistband Buckram' },
    { key: 'Patti', label: 'Patti', desc: 'Slit Embroidery Patti' },
    { key: 'Embroidery Backing', label: 'Embroidery Backing', desc: 'Spunbond & Tear-Away' },
  ];

  const matchesCategory = (product: PublicProduct, cat: MainCategory): boolean => {
    if (cat === 'All') return true;
    const catLower = cat.toLowerCase();
    const pCatLower = product.category.toLowerCase();
    const pNameLower = product.name.toLowerCase();

    if (cat === 'Collar') {
      return pCatLower.includes('collar') || pNameLower.includes('collar') || pCatLower.includes('microdot');
    }
    if (cat === 'Cuff') {
      return pCatLower.includes('cuff') || pNameLower.includes('cuff') || pCatLower.includes('strip');
    }
    if (cat === 'Belt Roll') {
      return pCatLower.includes('belt') || pNameLower.includes('belt') || pCatLower.includes('elastic');
    }
    if (cat === 'Patti') {
      return pCatLower.includes('patti') || pNameLower.includes('patti') || pCatLower.includes('strip');
    }
    if (cat === 'Embroidery Backing') {
      return (
        pCatLower.includes('spunbond') ||
        pNameLower.includes('embroidery') ||
        pNameLower.includes('backing') ||
        pCatLower.includes('patti')
      );
    }
    return pCatLower.includes(catLower);
  };

  const filteredProducts = products.filter((p) => matchesCategory(p, selectedCategory));

  const handleAddToCartQuick = (e: React.MouseEvent, product: PublicProduct) => {
    e.stopPropagation();
    addToCart(product, 1);
    setAddedProductId(product.id);
    setTimeout(() => setAddedProductId(null), 1800);
  };

  return (
    <section id="categories" className="categories-section">
      <div className="section-container">
        {/* SECTION HEADER */}
        <div className="section-header-center">
          <span className="eyebrow-badge">MANUFACTURING CATALOGUE</span>
          <h2 className="section-title">Shop by Textile Category</h2>
          <p className="section-subtitle">
            Engineered thermal fusing adhesives, structured buckrams, and embroidery backings produced to ISO industrial standards. Available for immediate wholesale roll dispatch and retail orders.
          </p>
        </div>

        {/* CATEGORY FILTER TABS */}
        <div className="category-tabs-wrapper">
          <div className="category-tabs-row" role="tablist">
            {categories.map((cat) => (
              <button
                key={cat.key}
                type="button"
                role="tab"
                aria-selected={selectedCategory === cat.key}
                className={`category-tab-btn ${selectedCategory === cat.key ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat.key)}
              >
                <span className="tab-label">{cat.label}</span>
                <span className="tab-desc">{cat.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="products-grid">
          {filteredProducts.map((product) => {
            const pricing = getProductPricing(product);
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                className="product-card"
                onClick={() => onSelectProduct(product)}
              >
                {/* CARD IMAGE & BADGES */}
                <div className="product-card-image-box">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-card-img"
                    loading="lazy"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="product-badge-overlay">
                    <span className="card-category-badge">{product.category}</span>
                    {product.featured && <span className="card-featured-badge">Featured Batch</span>}
                  </div>
                  <div className="product-quick-overlay">
                    <button
                      type="button"
                      className="quick-view-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectProduct(product);
                      }}
                    >
                      <Eye size={15} />
                      <span>View Specifications</span>
                    </button>
                  </div>
                </div>

                {/* CARD CONTENT */}
                <div className="product-card-body">
                  <div className="product-card-meta">
                    <span className="product-sku">SKU: {product.sku || `RE-${product.id}`}</span>
                    <span className="product-unit-tag">Per {product.unit}</span>
                  </div>

                  <h3 className="product-card-title">{product.name}</h3>

                  <p className="product-card-desc">{product.description}</p>

                  {/* KEY SPECS SUMMARY */}
                  <div className="product-card-specs-row">
                    {product.specifications?.width && (
                      <div className="spec-pill">
                        <strong>Width:</strong> {product.specifications.width}
                      </div>
                    )}
                    {product.specifications?.fusingTemperature && (
                      <div className="spec-pill">
                        <strong>Fusing:</strong> {product.specifications.fusingTemperature}
                      </div>
                    )}
                  </div>

                  {/* QUOTATION & MOQ DISPLAY (Replaces Public Prices) */}
                  <div className="product-pricing-box">
                    <div className="pricing-wholesale-line">
                      <span className="price-val">Price on Request</span>
                      <span className="tier-tag wholesale">MOQ: {pricing.moq} {product.unit}</span>
                    </div>
                    <div className="pricing-retail-line">
                      <span>Contact for Private Commercial Rates</span>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}
                  <div className="product-card-actions" onClick={(e) => e.stopPropagation()}>
                    <button
                      type="button"
                      className="btn-primary product-quote-btn"
                      onClick={() => onEnquireProduct(product)}
                      title="Request a customized wholesale quotation"
                    >
                      <span>Request a Quote</span>
                      <ArrowRight size={13} />
                    </button>

                    <button
                      type="button"
                      className={`btn-secondary product-add-cart-btn ${isAdded ? 'is-added' : ''}`}
                      onClick={(e) => handleAddToCartQuick(e, product)}
                      title="Add 1 unit to cart draft"
                    >
                      {isAdded ? (
                        <>
                          <Check size={16} />
                          <span>Added to Draft</span>
                        </>
                      ) : (
                        <>
                          <ShoppingBag size={15} />
                          <span>Add to Cart</span>
                        </>
                      )}
                    </button>
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
