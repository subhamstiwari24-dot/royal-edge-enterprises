import React, { useState, useMemo } from 'react';
import {
  Search,
  ArrowRight,
  Eye,
  MessageSquareQuote,
  SlidersHorizontal,
  LayoutGrid,
  TableProperties,
  Layers,
  Sparkles,
} from 'lucide-react';
import type { PublicProduct, ProductCategory } from '../../types';

interface ProductCategoriesSectionProps {
  products: PublicProduct[];
  onSelectProduct: (product: PublicProduct) => void;
  onEnquireProduct: (product: PublicProduct) => void;
}

const CATEGORIES: ('All' | ProductCategory)[] = [
  'All',
  'Fusible Elastic',
  'Elastic',
  'Microdot',
  'Belt Roll',
  'Patti',
  'Collar & Cuff',
  'Strip',
  'Spunbond',
];

export const ProductCategoriesSection: React.FC<ProductCategoriesSectionProps> = ({
  products,
  onSelectProduct,
  onEnquireProduct,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<'All' | ProductCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'gallery' | 'table'>('gallery');

  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      const matchCategory = selectedCategory === 'All' || prod.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === '' ||
        prod.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        prod.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  // Compute product count per category for tabs
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });
    return counts;
  }, [products]);

  return (
    <section className="products-section" id="products">
      <div className="section-container">
        {/* EDITORIAL SECTION HEADER */}
        <div className="products-header-editorial">
          <div className="header-meta-row">
            <span className="eyebrow-badge">THE COMMERCIAL PORTFOLIO</span>
            <span className="catalog-status-badge">8 VERIFIED PRODUCT CATEGORIES</span>
          </div>

          <div className="header-flex-row">
            <div>
              <h2 className="catalog-main-title">Approved Backing &amp; Interlining Catalogue</h2>
              <p className="catalog-main-desc">
                Manufactured for garment exporters, boutique apparel ateliers, and high-speed computerized embroidery centers. All substrates are calibrated for dimensional stability, clean tear lines, and zero resin strike-through.
              </p>
            </div>

            {/* VIEW MODE TOGGLE (GALLERY VS TECHNICAL SPEC LEDGER) */}
            <div className="view-mode-toggle" role="group" aria-label="Catalogue view options">
              <button
                type="button"
                className={`view-btn ${viewMode === 'gallery' ? 'active' : ''}`}
                onClick={() => setViewMode('gallery')}
                title="Editorial Gallery View"
              >
                <LayoutGrid size={15} />
                <span>Gallery</span>
              </button>
              <button
                type="button"
                className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Technical Specification Ledger"
              >
                <TableProperties size={15} />
                <span>Spec Ledger</span>
              </button>
            </div>
          </div>
        </div>

        {/* SEARCH AND CATEGORY FILTER BAR */}
        <div className="catalog-toolbar-editorial">
          <div className="search-bar-wrap">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              placeholder="Search by category, width, GSM, or product name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="catalog-search-input"
              aria-label="Search catalogue products"
            />
            {searchQuery && (
              <button
                type="button"
                className="clear-search-btn"
                onClick={() => setSearchQuery('')}
              >
                Clear
              </button>
            )}
          </div>

          {/* CATEGORY TABS WITH COUNT INDICATORS */}
          <div className="category-tabs-editorial" role="tablist" aria-label="Product Categories">
            {CATEGORIES.map((cat) => {
              const count = categoryCounts[cat] || 0;
              return (
                <button
                  key={cat}
                  type="button"
                  role="tab"
                  aria-selected={selectedCategory === cat}
                  className={`category-pill-editorial ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' && <SlidersHorizontal size={12} />}
                  <span>{cat}</span>
                  <span className="pill-count">{count}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* RESULTS SUMMARY BAR */}
        <div className="results-count-bar">
          <span className="results-count-text">
            Showing <strong>{filteredProducts.length}</strong> of <strong>{products.length}</strong> approved textile lines
            {selectedCategory !== 'All' && <span> in category &ldquo;{selectedCategory}&rdquo;</span>}
          </span>
          {selectedCategory !== 'All' && (
            <button
              type="button"
              className="reset-filter-link"
              onClick={() => setSelectedCategory('All')}
            >
              Show all categories
            </button>
          )}
        </div>

        {/* EMPTY STATE */}
        {filteredProducts.length === 0 ? (
          <div className="no-products-state">
            <p className="no-products-title">No matching textile products found</p>
            <p className="no-products-desc">
              We couldn&apos;t find any products matching &ldquo;{searchQuery}&rdquo;. Try another search term or reset the category filter.
            </p>
            <button
              type="button"
              className="btn-outline-gold"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Reset All Filters
            </button>
          </div>
        ) : viewMode === 'gallery' ? (
          /* =========================================================
             VIEW 1: EDITORIAL GALLERY GRID
             ========================================================= */
          <div className="products-editorial-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="editorial-product-card">
                {/* IMAGE CONTAINER WITH DISCRETE BADGES */}
                <div className="product-visual-wrapper">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="product-visual-img"
                    loading="lazy"
                  />
                  <div className="product-visual-meta">
                    <span className="category-meta-badge">{product.category}</span>
                    {product.featured && (
                      <span className="core-line-badge">
                        <Sparkles size={11} />
                        Core Line
                      </span>
                    )}
                  </div>
                  <div className="product-quick-trigger">
                    <button
                      type="button"
                      className="quick-spec-btn"
                      onClick={() => onSelectProduct(product)}
                      aria-label={`View technical specifications for ${product.name}`}
                    >
                      <Eye size={14} />
                      <span>Technical Specs</span>
                    </button>
                  </div>
                </div>

                {/* PRODUCT DATA BODY */}
                <div className="product-editorial-body">
                  <div className="product-sku-row">
                    <span className="product-sku-code">SKU: {product.sku || `RE-0${product.id}`}</span>
                    <span className="product-moq-badge">MOQ: {product.minimumOrderQuantity} {product.unit}</span>
                  </div>

                  <h3 className="product-editorial-title" title={product.name}>
                    {product.name}
                  </h3>

                  <p className="product-editorial-desc">
                    {product.description}
                  </p>

                  {/* TECHNICAL ATTRIBUTES CHIPS */}
                  <div className="product-spec-chips">
                    {product.specifications.width && (
                      <div className="spec-chip">
                        <span className="chip-label">Width:</span>
                        <span className="chip-value">{product.specifications.width.split('/')[0].trim()}</span>
                      </div>
                    )}
                    {product.specifications.weightGsm && (
                      <div className="spec-chip">
                        <span className="chip-label">GSM:</span>
                        <span className="chip-value">{product.specifications.weightGsm}</span>
                      </div>
                    )}
                    {product.specifications.fusingTemperature && (
                      <div className="spec-chip">
                        <span className="chip-label">Temp:</span>
                        <span className="chip-value">{product.specifications.fusingTemperature}</span>
                      </div>
                    )}
                  </div>

                  {/* BOTTOM ACTION BUTTONS */}
                  <div className="product-editorial-actions">
                    <button
                      type="button"
                      className="action-details-btn"
                      onClick={() => onSelectProduct(product)}
                    >
                      <span>Specifications</span>
                      <ArrowRight size={13} />
                    </button>

                    <button
                      type="button"
                      className="action-enquire-btn"
                      onClick={() => onEnquireProduct(product)}
                    >
                      <MessageSquareQuote size={13} />
                      <span>Request Quote</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          /* =========================================================
             VIEW 2: TECHNICAL SPECIFICATION LEDGER TABLE
             ========================================================= */
          <div className="spec-ledger-table-wrap">
            <table className="spec-ledger-table">
              <thead>
                <tr>
                  <th className="th-product">Material &amp; Category</th>
                  <th className="th-widths">Available Widths</th>
                  <th className="th-gsm">Weight / GSM</th>
                  <th className="th-composition">Composition &amp; Bonding</th>
                  <th className="th-moq">Packaging &amp; MOQ</th>
                  <th className="th-action">Commercial Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="td-product">
                      <div className="table-product-cell">
                        <img
                          src={product.imageUrl}
                          alt={product.name}
                          className="table-product-thumb"
                          loading="lazy"
                        />
                        <div>
                          <span className="table-cat-badge">{product.category}</span>
                          <strong className="table-prod-name">{product.name}</strong>
                          <span className="table-sku">SKU: {product.sku || `RE-0${product.id}`}</span>
                        </div>
                      </div>
                    </td>
                    <td className="td-widths">
                      <span className="table-spec-text">
                        {product.specifications.width || 'Custom slit per order'}
                      </span>
                    </td>
                    <td className="td-gsm">
                      <span className="table-gsm-pill">
                        {product.specifications.weightGsm || 'Standard Grade'}
                      </span>
                    </td>
                    <td className="td-composition">
                      <span className="table-comp-text">
                        {product.specifications.composition || product.specifications.coatingType || 'Synthetic / Natural blend'}
                      </span>
                    </td>
                    <td className="td-moq">
                      <div className="table-moq-block">
                        <strong>{product.minimumOrderQuantity} {product.unit}</strong>
                        <small>{product.specifications.packaging || 'Factory standard rolls'}</small>
                      </div>
                    </td>
                    <td className="td-action">
                      <div className="table-actions">
                        <button
                          type="button"
                          className="table-btn-spec"
                          onClick={() => onSelectProduct(product)}
                          title="View complete specifications"
                        >
                          <Eye size={13} />
                          <span>Specs</span>
                        </button>
                        <button
                          type="button"
                          className="table-btn-rfq"
                          onClick={() => onEnquireProduct(product)}
                          title="Request commercial quotation"
                        >
                          <MessageSquareQuote size={13} />
                          <span>Quote</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* COMMERCIAL QUOTATION POLICY DOSSIER BANNER */}
        <div className="catalogue-policy-ledger">
          <div className="policy-ledger-icon">
            <Layers size={22} />
          </div>
          <div className="policy-ledger-content">
            <h4 className="policy-ledger-title">B2B Private Commercial Quotation Policy</h4>
            <p className="policy-ledger-desc">
              In strict adherence to textile industry wholesale norms and to protect our retail dealers and garment manufacturing clients, itemized per-meter or per-roll pricing is issued exclusively through formal quotations based on ordered volume, required widths, and dispatch logistics.
            </p>
          </div>
          <div className="policy-ledger-action">
            <a href="#enquiry" className="btn-primary policy-rfq-btn">
              <span>Request Custom Price List</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
