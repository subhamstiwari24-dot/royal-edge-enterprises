import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileCheck2,
  Eye,
  Trash2,
  Check,
  X,
  Printer,
  ShoppingCart,
  MessageCircle,
} from 'lucide-react';
import type {
  Quotation,
  QuotationStatus,
  QuotationItem,
  AdminProduct,
  Customer,
  Enquiry,
  PaymentMethod,
  ProductCategory,
} from '../../types';
import { royalEdgeService } from '../../services/api';
import { COMPANY_INFO } from '../../data/initialData';

interface QuotationManagementProps {
  quotations: Quotation[];
  products: AdminProduct[];
  customers: Customer[];
  onRefresh: () => void;
  prefillEnquiry?: Enquiry | null;
  onClearPrefillEnquiry?: () => void;
  isCreateModalOpen?: boolean;
  onCloseCreateModal?: () => void;
  onNavigateToOrders?: () => void;
}

const QUOTATION_STATUSES: QuotationStatus[] = [
  'DRAFT',
  'SENT',
  'ACCEPTED',
  'REJECTED',
  'EXPIRED',
];

export const QuotationManagement: React.FC<QuotationManagementProps> = ({
  quotations,
  products,
  customers,
  onRefresh,
  prefillEnquiry,
  onClearPrefillEnquiry,
  isCreateModalOpen = false,
  onCloseCreateModal,
  onNavigateToOrders,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [showCreateModal, setShowCreateModal] = useState(isCreateModalOpen);
  const [previewQuote, setPreviewQuote] = useState<Quotation | null>(null);

  // Conversion to Order state
  const [convertingQuote, setConvertingQuote] = useState<Quotation | null>(null);
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('BANK_TRANSFER');
  const [isConverting, setIsConverting] = useState(false);

  // Builder form state
  const [selectedCustomerId, setSelectedCustomerId] = useState<number>(customers[0]?.id || 1);
  const [validUntil, setValidUntil] = useState<string>(
    () => new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0]
  );
  const [termsAndNotes, setTermsAndNotes] = useState(
    'Ex-factory Chembur Mumbai. 5% GST extra. Delivery within 3-4 working days upon order confirmation.'
  );

  // Line items
  const [lineItems, setLineItems] = useState<
    {
      productId: number;
      productName: string;
      category: string;
      quantity: number;
      unit: string;
      unitPrice: number;
    }[]
  >([]);

  // Adjust state during render when prefillEnquiry or modal prop changes
  const [prevEnquiry, setPrevEnquiry] = useState<Enquiry | null>(prefillEnquiry ?? null);
  const [prevModalOpen, setPrevModalOpen] = useState(isCreateModalOpen);

  if (prefillEnquiry !== prevEnquiry) {
    setPrevEnquiry(prefillEnquiry ?? null);
    if (prefillEnquiry) {
      const matchedCust = customers.find(
        (c) => c.phone.replace(/\D/g, '') === prefillEnquiry.phone.replace(/\D/g, '')
      );
      if (matchedCust) {
        setSelectedCustomerId(matchedCust.id);
      }

      const prod = products.find(
        (p) =>
          p.id === prefillEnquiry.productId ||
          p.category === prefillEnquiry.category
      );

      setLineItems([
        {
          productId: prod ? prod.id : 1,
          productName: prefillEnquiry.productName || prod?.name || 'Textile Material',
          category: prefillEnquiry.category,
          quantity: prefillEnquiry.quantity || 100,
          unit: prefillEnquiry.unit || 'Meters',
          unitPrice: prod ? prod.wholesalePrice : 15,
        },
      ]);
      setShowCreateModal(true);
    }
  }

  if (isCreateModalOpen !== prevModalOpen) {
    setPrevModalOpen(isCreateModalOpen);
    if (isCreateModalOpen) {
      setShowCreateModal(true);
      if (products.length > 0 && lineItems.length === 0) {
        setLineItems([
          {
            productId: products[0].id,
            productName: products[0].name,
            category: products[0].category,
            quantity: 100,
            unit: products[0].unit,
            unitPrice: products[0].wholesalePrice,
          },
        ]);
      }
    }
  }

  const filtered = useMemo(() => {
    return quotations.filter((q) => {
      const matchStatus = statusFilter === 'All' || q.status === statusFilter;
      const term = search.toLowerCase();
      const matchSearch =
        term === '' ||
        q.quotationNumber.toLowerCase().includes(term) ||
        q.customerName.toLowerCase().includes(term) ||
        (q.companyName && q.companyName.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [quotations, statusFilter, search]);

  const addLineItem = () => {
    if (products.length === 0) return;
    const defaultProd = products[0];
    setLineItems([
      ...lineItems,
      {
        productId: defaultProd.id,
        productName: defaultProd.name,
        category: defaultProd.category,
        quantity: 100,
        unit: defaultProd.unit,
        unitPrice: defaultProd.wholesalePrice,
      },
    ]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const updateLineItem = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...lineItems];
    if (field === 'productId') {
      const prod = products.find((p) => p.id === Number(value));
      if (prod) {
        updated[index] = {
          ...updated[index],
          productId: prod.id,
          productName: prod.name,
          category: prod.category,
          unit: prod.unit,
          unitPrice: prod.wholesalePrice,
        };
      }
    } else {
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
    }
    setLineItems(updated);
  };

  // Calculations
  const calculatedSubtotal = useMemo(() => {
    return lineItems.reduce((acc, it) => acc + (Number(it.quantity) || 0) * (Number(it.unitPrice) || 0), 0);
  }, [lineItems]);

  const taxAmount = calculatedSubtotal * 0.05; // 5% GST standard on textile materials
  const calculatedTotal = calculatedSubtotal + taxAmount;

  const handleCreateQuotation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lineItems.length === 0) {
      alert('Please add at least one product item to the quotation.');
      return;
    }

    const customer = customers.find((c) => c.id === Number(selectedCustomerId));
    if (!customer) {
      alert('Please select a valid customer.');
      return;
    }

    const items: QuotationItem[] = lineItems.map((it, idx) => ({
      id: `item-${Date.now()}-${idx}`,
      productId: it.productId,
      productName: it.productName,
      category: it.category as ProductCategory,
      quantity: Number(it.quantity),
      unit: it.unit,
      unitPrice: Number(it.unitPrice),
      subtotal: Number(it.quantity) * Number(it.unitPrice),
    }));

    try {
      const created = await royalEdgeService.createQuotation({
        enquiryId: prefillEnquiry ? prefillEnquiry.id : undefined,
        enquiryNumber: prefillEnquiry ? prefillEnquiry.enquiryNumber : undefined,
        customerId: customer.id,
        customerName: customer.name,
        companyName: customer.companyName,
        customerPhone: customer.phone,
        customerEmail: customer.email,
        items,
        subtotalAmount: calculatedSubtotal,
        taxRatePercent: 5,
        taxAmount,
        totalAmount: calculatedTotal,
        status: 'SENT',
        validUntil,
        termsAndNotes,
      });

      setShowCreateModal(false);
      if (onClearPrefillEnquiry) onClearPrefillEnquiry();
      if (onCloseCreateModal) onCloseCreateModal();
      onRefresh();
      setPreviewQuote(created);
    } catch (err) {
      console.error(err);
      alert('Failed to generate quotation.');
    }
  };

  const handleStatusChange = async (id: number, status: QuotationStatus) => {
    try {
      await royalEdgeService.updateQuotationStatus(id, status);
      onRefresh();
      if (previewQuote && previewQuote.id === id) {
        setPreviewQuote({ ...previewQuote, status });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startConvertToOrder = (quote: Quotation) => {
    setConvertingQuote(quote);
    setShippingAddress(
      `${quote.companyName || quote.customerName}, Chembur / Mumbai Destination`
    );
    setPaymentMethod('BANK_TRANSFER');
  };

  const handleConfirmOrder = async () => {
    if (!convertingQuote) return;
    setIsConverting(true);
    try {
      await royalEdgeService.convertQuotationToOrder(
        convertingQuote.id,
        shippingAddress,
        paymentMethod
      );
      setConvertingQuote(null);
      setPreviewQuote(null);
      onRefresh();
      if (onNavigateToOrders) {
        onNavigateToOrders();
      } else {
        alert('Order confirmed and generated successfully!');
      }
    } catch (err) {
      console.error(err);
      alert('Failed to convert quotation to order.');
    } finally {
      setIsConverting(false);
    }
  };

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Private Commercial Quotations</h2>
          <p className="page-subheading">
            Issue customer-specific price proposals with itemized taxes, volume pricing, and validity dates.
          </p>
        </div>

        <button
          type="button"
          className="btn-primary"
          onClick={() => {
            if (lineItems.length === 0 && products.length > 0) {
              setLineItems([
                {
                  productId: products[0].id,
                  productName: products[0].name,
                  category: products[0].category,
                  quantity: 100,
                  unit: products[0].unit,
                  unitPrice: products[0].wholesalePrice,
                },
              ]);
            }
            setShowCreateModal(true);
          }}
        >
          <Plus size={16} />
          <span>Create New Quotation</span>
        </button>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="s-icon" />
          <input
            type="text"
            placeholder="Search by quote #, client, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>

        <div className="filter-select-wrap">
          <Filter size={15} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-select"
          >
            <option value="All">All Quotation Statuses</option>
            {QUOTATION_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-content-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Quote #</th>
                <th>Client / Firm</th>
                <th>Items</th>
                <th>Net Amount</th>
                <th>Valid Until</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-table-cell">
                    No quotations found. Click &ldquo;Create New Quotation&rdquo; to prepare one.
                  </td>
                </tr>
              ) : (
                filtered.map((quote) => (
                  <tr key={quote.id}>
                    <td>
                      <strong className="mono-code">{quote.quotationNumber}</strong>
                      {quote.enquiryNumber && (
                        <small className="block-type">Ref: {quote.enquiryNumber}</small>
                      )}
                    </td>
                    <td>
                      <div className="table-cust-cell">
                        <span className="cust-name">{quote.customerName}</span>
                        {quote.companyName && (
                          <small className="cust-company">{quote.companyName}</small>
                        )}
                        <small className="cust-phone">{quote.customerPhone}</small>
                      </div>
                    </td>
                    <td>
                      <span>{quote.items.length} item(s)</span>
                      <small className="block-type">
                        {quote.items.map((i) => i.productName).join(', ').slice(0, 30)}...
                      </small>
                    </td>
                    <td>
                      <strong className="price-tag wholesale">
                        {formatCurrency(quote.totalAmount)}
                      </strong>
                      <small className="block-type">Incl 5% GST</small>
                    </td>
                    <td>
                      <small>{quote.validUntil}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusBadge(quote.status)}`}>
                        {quote.status}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="btn-icon"
                          title="Preview / Print Formal Quotation"
                          onClick={() => setPreviewQuote(quote)}
                        >
                          <Eye size={16} />
                        </button>
                        {quote.status === 'ACCEPTED' && (
                          <button
                            type="button"
                            className="btn-icon emerald-action"
                            title="Convert Accepted Quote to Confirmed Order"
                            onClick={() => startConvertToOrder(quote)}
                          >
                            <ShoppingCart size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE QUOTATION MODAL */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-sub-label">COMMERCIAL PROPOSAL</span>
                <h3 className="modal-title">Prepare Private Quotation</h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => {
                  setShowCreateModal(false);
                  if (onCloseCreateModal) onCloseCreateModal();
                }}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleCreateQuotation} className="admin-modal-body">
              {/* CUSTOMER & VALIDITY ROW */}
              <div className="form-row-2">
                <div className="form-field">
                  <label className="field-label">Select Customer / Client *</label>
                  <select
                    value={selectedCustomerId}
                    onChange={(e) => setSelectedCustomerId(Number(e.target.value))}
                    className="field-input select-input"
                    required
                  >
                    {customers.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} {c.companyName ? `(${c.companyName})` : ''} - {c.phone}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-field">
                  <label className="field-label">Quotation Validity Date *</label>
                  <input
                    type="date"
                    required
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="field-input"
                  />
                </div>
              </div>

              {/* LINE ITEMS TABLE BUILDER */}
              <div className="quote-items-builder">
                <div className="builder-header">
                  <h4 className="builder-title">Line Items &amp; Negotiated Pricing</h4>
                  <button
                    type="button"
                    className="btn-outline-gold btn-sm"
                    onClick={addLineItem}
                  >
                    <Plus size={14} />
                    <span>Add Item</span>
                  </button>
                </div>

                <div className="line-items-table-wrap">
                  <table className="builder-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th style={{ width: '110px' }}>Quantity</th>
                        <th style={{ width: '90px' }}>Unit</th>
                        <th style={{ width: '130px' }}>Unit Price (₹)</th>
                        <th style={{ width: '130px' }}>Subtotal</th>
                        <th style={{ width: '50px' }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {lineItems.map((it, idx) => (
                        <tr key={idx}>
                          <td>
                            <select
                              value={it.productId}
                              onChange={(e) => updateLineItem(idx, 'productId', e.target.value)}
                              className="table-field-select"
                            >
                              {products.map((p) => (
                                <option key={p.id} value={p.id}>
                                  {p.name} ({p.category})
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              value={it.quantity}
                              onChange={(e) => updateLineItem(idx, 'quantity', e.target.value)}
                              className="table-field-input"
                            />
                          </td>
                          <td>
                            <input
                              type="text"
                              value={it.unit}
                              onChange={(e) => updateLineItem(idx, 'unit', e.target.value)}
                              className="table-field-input"
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={it.unitPrice}
                              onChange={(e) => updateLineItem(idx, 'unitPrice', e.target.value)}
                              className="table-field-input"
                            />
                          </td>
                          <td>
                            <strong className="subtotal-cell">
                              {formatCurrency((it.quantity || 0) * (it.unitPrice || 0))}
                            </strong>
                          </td>
                          <td className="text-center">
                            {lineItems.length > 1 && (
                              <button
                                type="button"
                                className="delete-row-btn"
                                onClick={() => removeLineItem(idx)}
                              >
                                <Trash2 size={15} />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* CALCULATION SUMMARY CARD */}
                <div className="quote-calc-summary">
                  <div className="calc-row">
                    <span>Taxable Subtotal:</span>
                    <strong>{formatCurrency(calculatedSubtotal)}</strong>
                  </div>
                  <div className="calc-row">
                    <span>GST (5% SGST + CGST):</span>
                    <span>{formatCurrency(taxAmount)}</span>
                  </div>
                  <div className="calc-row total-row">
                    <span>Total Quotation Amount:</span>
                    <strong className="grand-total">{formatCurrency(calculatedTotal)}</strong>
                  </div>
                </div>
              </div>

              {/* TERMS & NOTES */}
              <div className="form-field">
                <label className="field-label">Commercial Terms, Freight &amp; Payment Notes</label>
                <textarea
                  rows={2}
                  value={termsAndNotes}
                  onChange={(e) => setTermsAndNotes(e.target.value)}
                  className="field-textarea"
                />
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <FileCheck2 size={16} />
                  <span>Generate &amp; Save Quotation</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FORMAL PREVIEW MODAL */}
      {previewQuote && (
        <div className="modal-backdrop" onClick={() => setPreviewQuote(null)}>
          <div className="admin-modal-card wide printable-quote" onClick={(e) => e.stopPropagation()}>
            <div className="quote-sheet">
              {/* SHEET HEADER */}
              <div className="sheet-header">
                <div className="sheet-brand">
                  <div className="sheet-logo-frame">
                    <img src="/royal-edge-logo.jpg" alt="Logo" className="sheet-logo" />
                  </div>
                  <div>
                    <h2 className="sheet-title">ROYAL EDGE ENTERPRISES</h2>
                    <span className="sheet-sub">THE INTERLINING COMPANY</span>
                    <p className="sheet-addr">{COMPANY_INFO.address}</p>
                    <p className="sheet-tax">
                      GST: <strong>{COMPANY_INFO.gstNumber}</strong> | MSME: {COMPANY_INFO.msmeNumber}
                    </p>
                  </div>
                </div>

                <div className="sheet-meta">
                  <span className="sheet-doc-name">COMMERCIAL QUOTATION</span>
                  <div className="meta-pair">
                    <span>Quotation No:</span>
                    <strong>{previewQuote.quotationNumber}</strong>
                  </div>
                  <div className="meta-pair">
                    <span>Date:</span>
                    <span>{previewQuote.createdAt.split('T')[0]}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Valid Until:</span>
                    <span>{previewQuote.validUntil}</span>
                  </div>
                  <div className="meta-pair">
                    <span>Status:</span>
                    <span className={`badge badge-${getStatusBadge(previewQuote.status)}`}>
                      {previewQuote.status}
                    </span>
                  </div>
                </div>
              </div>

              {/* CLIENT BILLING BOX */}
              <div className="sheet-client-box">
                <span className="client-box-label">QUOTATION ISSUED TO:</span>
                <h4 className="client-box-name">{previewQuote.customerName}</h4>
                {previewQuote.companyName && (
                  <p className="client-box-firm">{previewQuote.companyName}</p>
                )}
                <p className="client-box-contact">
                  Phone: {previewQuote.customerPhone} {previewQuote.customerEmail ? `| Email: ${previewQuote.customerEmail}` : ''}
                </p>
              </div>

              {/* ITEMS TABLE */}
              <table className="sheet-items-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product Description</th>
                    <th>Category</th>
                    <th className="text-right">Qty</th>
                    <th>Unit</th>
                    <th className="text-right">Unit Rate (₹)</th>
                    <th className="text-right">Amount (₹)</th>
                  </tr>
                </thead>
                <tbody>
                  {previewQuote.items.map((item, idx) => (
                    <tr key={item.id}>
                      <td>{idx + 1}</td>
                      <td>
                        <strong>{item.productName}</strong>
                      </td>
                      <td>{item.category}</td>
                      <td className="text-right">{item.quantity}</td>
                      <td>{item.unit}</td>
                      <td className="text-right">{item.unitPrice.toFixed(2)}</td>
                      <td className="text-right"><strong>{item.subtotal.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* TOTALS */}
              <div className="sheet-totals-block">
                <div className="total-line">
                  <span>Subtotal Amount:</span>
                  <span>{formatCurrency(previewQuote.subtotalAmount)}</span>
                </div>
                <div className="total-line">
                  <span>GST (5%):</span>
                  <span>{formatCurrency(previewQuote.taxAmount)}</span>
                </div>
                <div className="total-line grand">
                  <span>Net Total Payable:</span>
                  <strong>{formatCurrency(previewQuote.totalAmount)}</strong>
                </div>
              </div>

              {/* TERMS */}
              {previewQuote.termsAndNotes && (
                <div className="sheet-terms-box">
                  <strong>Commercial Terms:</strong>
                  <p>{previewQuote.termsAndNotes}</p>
                </div>
              )}

              {/* STATUS ACTIONS FOOTER */}
              <div className="sheet-actions-bar">
                <div className="status-button-group">
                  <span>Update Status: </span>
                  {QUOTATION_STATUSES.map((st) => (
                    <button
                      key={st}
                      type="button"
                      className={`btn-tag ${previewQuote.status === st ? 'active' : ''}`}
                      onClick={() => handleStatusChange(previewQuote.id, st)}
                    >
                      {st}
                    </button>
                  ))}
                </div>

                <div className="sheet-cta-group">
                  <a
                    href={`https://wa.me/${previewQuote.customerPhone.replace(/\D/g, '')}?text=${encodeURIComponent(
                      `Hello ${previewQuote.customerName}, here is your private quotation ${previewQuote.quotationNumber} from Royal Edge Enterprises for ${formatCurrency(previewQuote.totalAmount)}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-outline-gold"
                  >
                    <MessageCircle size={15} />
                    <span>Share on WhatsApp</span>
                  </a>

                  {previewQuote.status === 'ACCEPTED' && (
                    <button
                      type="button"
                      className="btn-primary"
                      onClick={() => startConvertToOrder(previewQuote)}
                    >
                      <ShoppingCart size={15} />
                      <span>Convert to Confirmed Order</span>
                    </button>
                  )}

                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={() => window.print()}
                  >
                    <Printer size={15} />
                    <span>Print PDF</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CONVERT TO ORDER MODAL */}
      {convertingQuote && (
        <div className="modal-backdrop" onClick={() => setConvertingQuote(null)}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-sub-label">ORDER CONVERSION</span>
                <h3 className="modal-title">Convert Accepted Quotation to Confirmed Order</h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setConvertingQuote(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              <div className="order-conversion-summary">
                <p>
                  You are generating a confirmed manufacturing/fulfillment order from accepted quotation{' '}
                  <strong>{convertingQuote.quotationNumber}</strong>.
                </p>
                <div className="summary-pill-row">
                  <span>Client: <strong>{convertingQuote.customerName}</strong></span>
                  <span>Total Value: <strong>{formatCurrency(convertingQuote.totalAmount)}</strong></span>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Delivery Destination &amp; Shipping Address *</label>
                <textarea
                  rows={2}
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="field-textarea"
                />
              </div>

              <div className="form-field">
                <label className="field-label">Payment Terms Agreement *</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                  className="field-input select-input"
                >
                  <option value="BANK_TRANSFER">Direct Bank NEFT/RTGS</option>
                  <option value="CREDIT_TERMS">Commercial Credit (30 Days)</option>
                  <option value="CHEQUE">Company Account Payee Cheque</option>
                  <option value="COD">Cash On Delivery / Transport Pay</option>
                  <option value="ONLINE">Online UPI Transfer</option>
                </select>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setConvertingQuote(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isConverting}
                  className="btn-primary"
                  onClick={handleConfirmOrder}
                >
                  <Check size={16} />
                  <span>{isConverting ? 'Confirming...' : 'Generate Confirmed Order'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getStatusBadge(status: string) {
  switch (status) {
    case 'ACCEPTED':
      return 'success';
    case 'SENT':
      return 'info';
    case 'DRAFT':
      return 'warning';
    case 'REJECTED':
    case 'EXPIRED':
      return 'danger';
    default:
      return 'neutral';
  }
}
