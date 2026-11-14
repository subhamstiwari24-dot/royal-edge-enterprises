import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, X, Layers, Tag } from 'lucide-react';
import type { PublicProduct } from '../../types';
import { useCart } from '../../context/useCart';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: PublicProduct[];
  onSelectProduct: (product: PublicProduct) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  products,
  onSelectProduct,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const { getProductPricing } = useCart();

  const handleClose = useCallback(() => {
    setSearchTerm('');
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 80);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const cleanTerm = searchTerm.toLowerCase().trim();
  const filteredProducts = cleanTerm
    ? products.filter((p) => {
        const inName = p.name.toLowerCase().includes(cleanTerm);
        const inCat = p.category.toLowerCase().includes(cleanTerm);
        const inDesc = p.description.toLowerCase().includes(cleanTerm);
        const inSku = p.sku ? p.sku.toLowerCase().includes(cleanTerm) : false;
        const inWidth = p.specifications?.width ? p.specifications.width.toLowerCase().includes(cleanTerm) : false;
        return inName || inCat || inDesc || inSku || inWidth;
      })
    : products.slice(0, 6);

  const quickCategories = ['Collar', 'Cuff', 'Belt Roll', 'Patti', 'Embroidery Backing'];

  return (
    <div className="search-modal-overlay" onClick={handleClose}>
      <div className="search-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* INPUT BAR */}
        <div className="search-bar-header">
          <Search size={22} className="search-icon-gold" />
          <input
            ref={inputRef}
            type="text"
            className="search-main-input"
            placeholder="Search by product name, category, roll width, or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchTerm('')}
              title="Clear search"
            >
              <X size={18} />
            </button>
          )}
          <button type="button" className="search-close-x" onClick={handleClose}>
            <X size={22} />
          </button>
        </div>

        {/* QUICK FILTERS */}
        <div className="search-quick-tags">
          <span className="tags-label">Popular Searches:</span>
          {quickCategories.map((cat) => (
            <button
              key={cat}
              type="button"
              className="quick-tag-pill"
              onClick={() => setSearchTerm(cat)}
            >
              <Tag size={12} />
              <span>{cat}</span>
            </button>
          ))}
        </div>

        {/* RESULTS */}
        <div className="search-results-container">
          <div className="results-header-info">
            <span>
              {searchTerm ? `Found ${filteredProducts.length} matching products` : 'Suggested Textile Products'}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="search-no-results">
              <Layers size={36} className="text-muted" />
              <h4>No manufacturing materials found for "{searchTerm}"</h4>
              <p>Try searching for "Collar", "Belt Roll", "Patti", or "Spunbond".</p>
            </div>
          ) : (
            <div className="search-results-list">
              {filteredProducts.map((product) => {
                const pricing = getProductPricing(product);
                return (
                  <div
                    key={product.id}
                    className="search-result-item"
                    onClick={() => {
                      onSelectProduct(product);
                      onClose();
                    }}
                  >
                    <div className="search-item-thumb">
                      <img src={product.imageUrl} alt={product.name} />
                    </div>
                    <div className="search-item-info">
                      <span className="search-item-cat">{product.category}</span>
                      <h4 className="search-item-title">{product.name}</h4>
                      <p className="search-item-desc">{product.description}</p>
                      {product.specifications?.width && (
                        <div className="search-item-meta">
                          <span>Widths: {product.specifications.width}</span>
                        </div>
                      )}
                    </div>

                    <div className="search-item-price-side" onClick={(e) => e.stopPropagation()}>
                      <div className="search-pricing">
                        <span className="search-wh-price">Price on Request</span>
                        <span className="search-wh-label">Wholesale MOQ: {pricing.moq} {product.unit}</span>
                      </div>
                      <button
                        type="button"
                        className="btn-primary btn-search-cart"
                        onClick={() => {
                          onSelectProduct(product);
                          onClose();
                        }}
                      >
                        Request Quote
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
