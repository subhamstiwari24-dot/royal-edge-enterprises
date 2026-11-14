import React, { useState, useMemo, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Check,
  X,
  ShieldAlert,
  Image as ImageIcon,
} from 'lucide-react';
import type { AdminProduct, ProductCategory } from '../../types';
import { royalEdgeService } from '../../services/api';

interface ProductManagementProps {
  products: AdminProduct[];
  onRefresh: () => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
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

export const ProductManagement: React.FC<ProductManagementProps> = ({
  products,
  onRefresh,
  isCreateModalOpen = false,
  onCloseCreateModal,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState<string>('All');
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [showModal, setShowModal] = useState(isCreateModalOpen);

  // Form State
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<ProductCategory>('Fusible Elastic');
  const [formDesc, setFormDesc] = useState('');
  const [formUnit, setFormUnit] = useState('Meters');
  const [formMoq, setFormMoq] = useState(100);
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formSku, setFormSku] = useState('');
  const [formRetailPrice, setFormRetailPrice] = useState(15);
  const [formWholesalePrice, setFormWholesalePrice] = useState(10);
  const [formCostPrice, setFormCostPrice] = useState(7);
  const [formStock, setFormStock] = useState(1000);
  const [formWidth, setFormWidth] = useState('');
  const [formComp, setFormComp] = useState('');
  const [formWeightGsm, setFormWeightGsm] = useState('');
  const [formFusingTemp, setFormFusingTemp] = useState('');
  const [imageHasError, setImageHasError] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedCat === 'All' || p.category === selectedCat;
      const matchSearch =
        search.trim() === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [products, selectedCat, search]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormName('');
    setFormCategory('Fusible Elastic');
    setFormDesc('');
    setFormUnit('Meters');
    setFormMoq(100);
    setFormImageUrl('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800');
    setFormSku('RE-PR-NEW');
    setFormRetailPrice(20);
    setFormWholesalePrice(14);
    setFormCostPrice(10);
    setFormStock(500);
    setFormWidth('');
    setFormComp('');
    setFormWeightGsm('');
    setFormFusingTemp('');
    setImageHasError(false);
    setShowModal(true);
  };

  // Adjust modal open state when prop changes
  const [prevModalOpen, setPrevModalOpen] = useState(isCreateModalOpen);
  if (isCreateModalOpen !== prevModalOpen) {
    setPrevModalOpen(isCreateModalOpen);
    if (isCreateModalOpen) {
      openAddModal();
    }
  }

  const openEditModal = (p: AdminProduct) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormDesc(p.description);
    setFormUnit(p.unit);
    setFormMoq(p.minimumOrderQuantity);
    setFormImageUrl(p.imageUrl);
    setFormSku(p.sku);
    setFormRetailPrice(p.retailPrice);
    setFormWholesalePrice(p.wholesalePrice);
    setFormCostPrice(p.costPrice || 0);
    setFormStock(p.stockQuantity);
    setFormWidth(p.specifications.width || '');
    setFormComp(p.specifications.composition || '');
    setFormWeightGsm(p.specifications.weightGsm || '');
    setFormFusingTemp(p.specifications.fusingTemperature || '');
    setImageHasError(false);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    setImageHasError(false);
    if (onCloseCreateModal) onCloseCreateModal();
  };

  // Close modal on Escape key
  useEffect(() => {
    if (!showModal) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowModal(false);
        setEditingProduct(null);
        setImageHasError(false);
        if (onCloseCreateModal) onCloseCreateModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showModal, onCloseCreateModal]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setIsSaving(true);
    try {
      await royalEdgeService.saveAdminProduct({
        id: editingProduct ? editingProduct.id : undefined,
        name: formName.trim(),
        category: formCategory,
        description: formDesc.trim(),
        unit: formUnit,
        minimumOrderQuantity: Number(formMoq),
        imageUrl: formImageUrl.trim(),
        sku: formSku.trim(),
        retailPrice: Number(formRetailPrice),
        wholesalePrice: Number(formWholesalePrice),
        costPrice: Number(formCostPrice),
        stockQuantity: Number(formStock),
        specifications: {
          width: formWidth.trim() || undefined,
          composition: formComp.trim() || undefined,
          weightGsm: formWeightGsm.trim() || undefined,
          fusingTemperature: formFusingTemp.trim() || undefined,
        },
      });

      closeModal();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (id: number) => {
    try {
      await royalEdgeService.toggleProductActive(id);
      onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  const formatCurrency = (n: number) => `₹${n.toFixed(2)}`;

  return (
    <div className="admin-page-container">
      {/* PAGE HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Product Catalogue Management</h2>
          <p className="page-subheading">
            Manage catalogue items, technical specifications, and internal wholesale costing.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={openAddModal}
        >
          <Plus size={16} />
          <span>Add New Product</span>
        </button>
      </div>

      {/* CONFIDENTIAL PRICING ALERT BANNER */}
      <div className="admin-notice-banner">
        <ShieldAlert size={18} className="notice-icon" />
        <div className="notice-content">
          <strong>PRD Commercial Enforcement:</strong> Retail and wholesale prices shown in this table are internal admin fields. They are stripped automatically from public API endpoints and never appear on the customer-facing website.
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="s-icon" />
          <input
            type="text"
            placeholder="Search by name, category, or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="filter-select-wrap">
          <SlidersHorizontal size={15} />
          <select
            value={selectedCat}
            onChange={(e) => setSelectedCat(e.target.value)}
            className="admin-select"
          >
            <option value="All">All 8 Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* PRODUCTS TABLE */}
      <div className="admin-content-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Product / SKU</th>
                <th>Category</th>
                <th>Unit / MOQ</th>
                <th>Internal Wholesale</th>
                <th>Internal Retail</th>
                <th>Stock</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No products found matching filters.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className={!p.active ? 'row-inactive' : ''}>
                    <td>
                      <div className="product-table-cell">
                        <img
                          src={p.imageUrl}
                          alt={p.name}
                          className="table-thumbnail"
                        />
                        <div>
                          <strong className="product-title-text">{p.name}</strong>
                          <span className="product-sku-text">{p.sku}</span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{p.category}</span>
                    </td>
                    <td>
                      <span>{p.unit}</span>
                      <small className="block-type">MOQ: {p.minimumOrderQuantity}</small>
                    </td>
                    <td>
                      <strong className="price-tag wholesale">
                        {formatCurrency(p.wholesalePrice)}
                      </strong>
                    </td>
                    <td>
                      <span className="price-tag retail">
                        {formatCurrency(p.retailPrice)}
                      </span>
                    </td>
                    <td>
                      <span>{p.stockQuantity.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className={`badge ${p.active ? 'badge-success' : 'badge-neutral'}`}>
                        {p.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="btn-icon"
                          title={p.active ? 'Deactivate Product' : 'Activate Product'}
                          onClick={() => handleToggleActive(p.id)}
                        >
                          {p.active ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          type="button"
                          className="btn-icon"
                          title="Edit Product & Pricing"
                          onClick={() => openEditModal(p)}
                        >
                          <Edit size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD/EDIT MODAL */}
      {showModal && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div
            className="admin-modal-card admin-product-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-product-title"
          >
            {/* MODAL HEADER */}
            <div className="admin-modal-header">
              <div className="modal-header-text">
                <span className="modal-eyebrow">Catalogue Master Specification</span>
                <h3 id="modal-product-title" className="modal-title">
                  {editingProduct ? 'Edit Product Specifications & Pricing' : 'Add New Catalogue Product'}
                </h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeModal}
                title="Close modal (Esc)"
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            {/* FORM WRAPPER */}
            <form onSubmit={handleSave} className="admin-product-form">
              <div className="admin-product-modal-scroll">

                {/* SECTION A: BASIC PRODUCT INFORMATION */}
                <div className="modal-section">
                  <div className="modal-section-header">
                    <span className="section-pill">A</span>
                    <div>
                      <h4 className="section-heading">Basic Product Information</h4>
                      <p className="section-subheading">Core catalogue attributes, classification, and ordering units</p>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-name">
                        Product Name <span className="req-star">*</span>
                      </label>
                      <input
                        id="prod-name"
                        type="text"
                        required
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="field-input"
                        placeholder="e.g. Fusible Collar Interlining - Heavy White"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-category">
                        Category <span className="req-star">*</span>
                      </label>
                      <select
                        id="prod-category"
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value as ProductCategory)}
                        className="field-input select-input"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-field">
                    <label className="field-label" htmlFor="prod-desc">
                      Description <span className="req-star">*</span>
                    </label>
                    <textarea
                      id="prod-desc"
                      rows={3}
                      required
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      className="field-textarea"
                      placeholder="Manufacturing specifications, apparel backing applications (e.g., shirts, suit collars, cuffs), hand feel, and interlining properties..."
                    />
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-unit">
                        Unit of Measure <span className="req-star">*</span>
                      </label>
                      <input
                        id="prod-unit"
                        type="text"
                        required
                        value={formUnit}
                        onChange={(e) => setFormUnit(e.target.value)}
                        className="field-input"
                        placeholder="e.g. Meters, Rolls, Kg"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-moq">
                        Min Order Qty (MOQ) <span className="req-star">*</span>
                      </label>
                      <input
                        id="prod-moq"
                        type="number"
                        min="1"
                        required
                        value={formMoq}
                        onChange={(e) => setFormMoq(Number(e.target.value))}
                        className="field-input"
                        placeholder="100"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-sku">
                        SKU Identifier <span className="req-star">*</span>
                      </label>
                      <input
                        id="prod-sku"
                        type="text"
                        required
                        value={formSku}
                        onChange={(e) => setFormSku(e.target.value)}
                        className="field-input"
                        placeholder="e.g. RE-FE-80"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION B: CONFIDENTIAL INTERNAL PRICING */}
                <div className="admin-form-subpanel pricing-subpanel">
                  <div className="pricing-banner-header">
                    <ShieldAlert size={18} className="pricing-shield-icon" />
                    <div className="pricing-header-content">
                      <div className="pricing-title-row">
                        <span className="section-pill pill-gold">B</span>
                        <h4 className="pricing-subpanel-title">Confidential Internal Pricing</h4>
                        <span className="pricing-confidential-tag">Admin Eyes Only</span>
                      </div>
                      <p className="pricing-banner-desc">
                        Internal wholesale and retail rates are strictly restricted to admin management for quoting and margin control. They are stripped automatically from public catalogue APIs and never appear on the customer-facing website.
                      </p>
                    </div>
                  </div>

                  <div className="form-row-3">
                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-wholesale">
                        Internal Wholesale Rate <span className="req-star">*</span>
                      </label>
                      <div className="input-affix-wrap">
                        <span className="affix-prefix">₹</span>
                        <input
                          id="prod-wholesale"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formWholesalePrice}
                          onChange={(e) => setFormWholesalePrice(Number(e.target.value))}
                          className="field-input input-with-prefix"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-retail">
                        Internal Retail Rate <span className="req-star">*</span>
                      </label>
                      <div className="input-affix-wrap">
                        <span className="affix-prefix">₹</span>
                        <input
                          id="prod-retail"
                          type="number"
                          step="0.01"
                          min="0"
                          required
                          value={formRetailPrice}
                          onChange={(e) => setFormRetailPrice(Number(e.target.value))}
                          className="field-input input-with-prefix"
                          placeholder="0.00"
                        />
                      </div>
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-stock">
                        Available Stock Quantity <span className="req-star">*</span>
                      </label>
                      <div className="input-affix-wrap">
                        <input
                          id="prod-stock"
                          type="number"
                          min="0"
                          required
                          value={formStock}
                          onChange={(e) => setFormStock(Number(e.target.value))}
                          className="field-input input-with-suffix"
                          placeholder="1000"
                        />
                        <span className="affix-suffix">{formUnit || 'Units'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* SECTION C: TECHNICAL SPECIFICATIONS */}
                <div className="modal-section">
                  <div className="modal-section-header">
                    <span className="section-pill">C</span>
                    <div>
                      <h4 className="section-heading">Technical Specifications</h4>
                      <p className="section-subheading">Textile engineering parameters, substrate dimensions, and fusing guide</p>
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-width">
                        Available Widths / Sizes
                      </label>
                      <input
                        id="prod-width"
                        type="text"
                        value={formWidth}
                        onChange={(e) => setFormWidth(e.target.value)}
                        className="field-input"
                        placeholder="e.g. 25mm / 32mm / 38mm / 100cm"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-comp">
                        Material Composition
                      </label>
                      <input
                        id="prod-comp"
                        type="text"
                        value={formComp}
                        onChange={(e) => setFormComp(e.target.value)}
                        className="field-input"
                        placeholder="e.g. 100% Polyester Nonwoven with PA Hot-Melt Coating"
                      />
                    </div>
                  </div>

                  <div className="form-row-2">
                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-gsm">
                        Weight / GSM
                      </label>
                      <input
                        id="prod-gsm"
                        type="text"
                        value={formWeightGsm}
                        onChange={(e) => setFormWeightGsm(e.target.value)}
                        className="field-input"
                        placeholder="e.g. 45 – 65 GSM"
                      />
                    </div>

                    <div className="form-field">
                      <label className="field-label" htmlFor="prod-temp">
                        Fusing Temperature
                      </label>
                      <input
                        id="prod-temp"
                        type="text"
                        value={formFusingTemp}
                        onChange={(e) => setFormFusingTemp(e.target.value)}
                        className="field-input"
                        placeholder="e.g. 130°C – 145°C @ 2.5 bar, 12-15s"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION D: PRODUCT IMAGE */}
                <div className="modal-section">
                  <div className="modal-section-header">
                    <span className="section-pill">D</span>
                    <div>
                      <h4 className="section-heading">Product Imagery</h4>
                      <p className="section-subheading">Catalogue display photo with real-time visual preview</p>
                    </div>
                  </div>

                  <div className="image-section-grid">
                    <div className="form-field image-url-field">
                      <label className="field-label" htmlFor="prod-img">
                        Product Image URL
                      </label>
                      <input
                        id="prod-img"
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => {
                          setFormImageUrl(e.target.value);
                          setImageHasError(false);
                        }}
                        className="field-input"
                        placeholder="https://images.unsplash.com/photo-... or CDN link"
                      />
                      <span className="field-hint">
                        Provide a direct HTTPS URL to a high-quality product image. A live visual preview is displayed on the right.
                      </span>
                    </div>

                    <div className="image-preview-wrapper">
                      <label className="field-label">Visual Preview</label>
                      <div className="image-preview-box">
                        {formImageUrl.trim() && !imageHasError ? (
                          <div className="image-preview-container">
                            <img
                              src={formImageUrl.trim()}
                              alt="Product Preview"
                              className="preview-img"
                              onError={() => setImageHasError(true)}
                            />
                            <span className="preview-status-pill">Active Preview</span>
                          </div>
                        ) : (
                          <div className="image-preview-placeholder">
                            <ImageIcon size={26} className="placeholder-icon" />
                            <span className="placeholder-text">
                              {imageHasError ? 'Preview Failed' : 'No Image'}
                            </span>
                            <span className="placeholder-subtext">
                              {imageHasError ? 'URL invalid or blocked' : 'Enter URL to preview'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* MODAL FOOTER */}
              <div className="admin-modal-footer">
                <div className="footer-status-hint">
                  <span className="req-indicator">*</span> Indicates required fields
                </div>
                <div className="modal-footer-actions">
                  <button
                    type="button"
                    className="btn-secondary modal-btn"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSaving}
                    className="btn-primary modal-btn"
                  >
                    <Check size={16} />
                    <span>{isSaving ? 'Saving...' : editingProduct ? 'Update Product' : 'Save Product'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
