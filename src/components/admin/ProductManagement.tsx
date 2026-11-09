import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Edit,
  Eye,
  EyeOff,
  SlidersHorizontal,
  Check,
  X,
  IndianRupee,
  ShieldAlert,
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
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
    if (onCloseCreateModal) onCloseCreateModal();
  };

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
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <h3 className="modal-title">
                {editingProduct ? 'Edit Product Specifications & Pricing' : 'Add New Catalogue Product'}
              </h3>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSave} className="admin-modal-body">
              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="field-input"
                    placeholder="e.g. High-Density Microdot Interlining"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Category *</label>
                  <select
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
                <label className="field-label">Description *</label>
                <textarea
                  rows={2}
                  required
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="field-textarea"
                  placeholder="Manufacturing details and apparel application..."
                />
              </div>

              <div className="form-row-3">
                <div className="form-field">
                  <label className="field-label">Unit *</label>
                  <input
                    type="text"
                    value={formUnit}
                    onChange={(e) => setFormUnit(e.target.value)}
                    className="field-input"
                    placeholder="Meters, Rolls, etc."
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Min Order Qty (MOQ) *</label>
                  <input
                    type="number"
                    min="1"
                    value={formMoq}
                    onChange={(e) => setFormMoq(Number(e.target.value))}
                    className="field-input"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">SKU *</label>
                  <input
                    type="text"
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>

              {/* INTERNAL PRICING SECTION */}
              <div className="admin-form-subpanel">
                <div className="subpanel-title">
                  <IndianRupee size={15} />
                  <span>Confidential Internal Pricing (Admin Eyes Only)</span>
                </div>
                <div className="form-row-3">
                  <div className="form-field">
                    <label className="field-label">Internal Wholesale Rate (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formWholesalePrice}
                      onChange={(e) => setFormWholesalePrice(Number(e.target.value))}
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Internal Retail Rate (₹) *</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formRetailPrice}
                      onChange={(e) => setFormRetailPrice(Number(e.target.value))}
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Stock Quantity Available *</label>
                    <input
                      type="number"
                      min="0"
                      value={formStock}
                      onChange={(e) => setFormStock(Number(e.target.value))}
                      className="field-input"
                    />
                  </div>
                </div>
              </div>

              {/* TECHNICAL SPECIFICATIONS */}
              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Available Widths / Sizes</label>
                  <input
                    type="text"
                    value={formWidth}
                    onChange={(e) => setFormWidth(e.target.value)}
                    className="field-input"
                    placeholder="e.g. 25mm / 32mm / 38mm"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Material Composition</label>
                  <input
                    type="text"
                    value={formComp}
                    onChange={(e) => setFormComp(e.target.value)}
                    className="field-input"
                    placeholder="e.g. 100% Polyester with PA dot"
                  />
                </div>
              </div>

              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Weight / GSM</label>
                  <input
                    type="text"
                    value={formWeightGsm}
                    onChange={(e) => setFormWeightGsm(e.target.value)}
                    className="field-input"
                    placeholder="e.g. 45 – 65 GSM"
                  />
                </div>

                <div className="form-field">
                  <label className="field-label">Fusing Temperature</label>
                  <input
                    type="text"
                    value={formFusingTemp}
                    onChange={(e) => setFormFusingTemp(e.target.value)}
                    className="field-input"
                    placeholder="e.g. 130°C – 145°C"
                  />
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Product Image URL</label>
                <input
                  type="url"
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  className="field-input"
                  placeholder="https://..."
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-primary"
                >
                  <Check size={16} />
                  <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
