import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  X,
  Check,
} from 'lucide-react';
import type { CustomerOrder, OrderStatus, PaymentStatus } from '../../types';
import { royalEdgeService } from '../../services/api';

interface OrderManagementProps {
  orders: CustomerOrder[];
  onRefresh: () => void;
}

const ORDER_STATUSES: OrderStatus[] = [
  'PENDING',
  'IN_PRODUCTION',
  'DISPATCHED',
  'DELIVERED',
  'CANCELLED',
];

const PAYMENT_STATUSES: PaymentStatus[] = ['PENDING', 'PARTIAL', 'PAID'];

export const OrderManagement: React.FC<OrderManagementProps> = ({
  orders,
  onRefresh,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<CustomerOrder | null>(null);

  // Edit in modal
  const [modalOrderStatus, setModalOrderStatus] = useState<OrderStatus>('PENDING');
  const [modalPaymentStatus, setModalPaymentStatus] = useState<PaymentStatus>('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = useMemo(() => {
    return orders.filter((o) => {
      const matchStatus = statusFilter === 'All' || o.orderStatus === statusFilter;
      const term = search.toLowerCase();
      const matchSearch =
        term === '' ||
        o.orderNumber.toLowerCase().includes(term) ||
        o.customerName.toLowerCase().includes(term) ||
        (o.companyName && o.companyName.toLowerCase().includes(term)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(term));
      return matchStatus && matchSearch;
    });
  }, [orders, statusFilter, search]);

  const openModal = (ord: CustomerOrder) => {
    setSelectedOrder(ord);
    setModalOrderStatus(ord.orderStatus);
    setModalPaymentStatus(ord.paymentStatus);
    setTrackingNumber(ord.trackingNumber || '');
    setOrderNotes(ord.notes || '');
  };

  const closeModal = () => setSelectedOrder(null);

  const handleUpdate = async () => {
    if (!selectedOrder) return;
    setIsUpdating(true);
    try {
      await royalEdgeService.updateOrderStatus(
        selectedOrder.id,
        modalOrderStatus,
        modalPaymentStatus,
        trackingNumber.trim(),
        orderNotes.trim()
      );
      closeModal();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatCurrency = (n: number) => `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`;

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Confirmed Orders &amp; Fulfillment</h2>
          <p className="page-subheading">
            Track manufacturing progression, packaging, dispatch logistics, and payment clearing for accepted quotations.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="s-icon" />
          <input
            type="text"
            placeholder="Search by order #, customer, tracking #..."
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
            <option value="All">All Order Statuses</option>
            {ORDER_STATUSES.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
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
                <th>Order #</th>
                <th>Quote Ref</th>
                <th>Client / Firm</th>
                <th>Items Ordered</th>
                <th>Total Value</th>
                <th>Payment</th>
                <th>Fulfillment Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No confirmed orders found. Orders are generated when accepted quotations are converted.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord.id}>
                    <td>
                      <strong className="mono-code">{ord.orderNumber}</strong>
                      <small className="date-cell">{ord.createdAt.split('T')[0]}</small>
                    </td>
                    <td>
                      <span className="mono-code">{ord.quotationNumber || 'Direct Quote'}</span>
                    </td>
                    <td>
                      <div className="table-cust-cell">
                        <span className="cust-name">{ord.customerName}</span>
                        {ord.companyName && (
                          <small className="cust-company">{ord.companyName}</small>
                        )}
                        <small className="cust-phone">{ord.customerPhone}</small>
                      </div>
                    </td>
                    <td>
                      <span>{ord.items.length} item(s)</span>
                      <small className="block-type">
                        {ord.items.map((i) => i.productName).join(', ').slice(0, 26)}...
                      </small>
                    </td>
                    <td>
                      <strong className="price-tag wholesale">
                        {formatCurrency(ord.totalAmount)}
                      </strong>
                    </td>
                    <td>
                      <span className={`badge badge-${ord.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                        {ord.paymentStatus}
                      </span>
                      <small className="block-type">{ord.paymentMethod.replace(/_/g, ' ')}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${getOrderBadge(ord.orderStatus)}`}>
                        {ord.orderStatus.replace(/_/g, ' ')}
                      </span>
                      {ord.trackingNumber && (
                        <small className="block-type">Trk: {ord.trackingNumber}</small>
                      )}
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn-icon"
                        title="View / Update Fulfillment"
                        onClick={() => openModal(ord)}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL */}
      {selectedOrder && (
        <div className="modal-backdrop" onClick={closeModal}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-sub-label">ORDER FULFILLMENT</span>
                <h3 className="modal-title">{selectedOrder.orderNumber}</h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* SUMMARY GRID */}
              <div className="modal-info-grid">
                <div className="info-block">
                  <span className="info-label">Customer</span>
                  <strong className="info-val">{selectedOrder.customerName}</strong>
                  {selectedOrder.companyName && (
                    <small className="block-type">{selectedOrder.companyName}</small>
                  )}
                </div>

                <div className="info-block">
                  <span className="info-label">Contact Details</span>
                  <span className="info-val">{selectedOrder.customerPhone}</span>
                </div>

                <div className="info-block">
                  <span className="info-label">Quotation Reference</span>
                  <strong className="info-val">{selectedOrder.quotationNumber || 'N/A'}</strong>
                </div>

                <div className="info-block">
                  <span className="info-label">Total Agreed Amount</span>
                  <strong className="info-val gold">{formatCurrency(selectedOrder.totalAmount)}</strong>
                </div>
              </div>

              {/* SHIPPING ADDRESS */}
              <div className="modal-req-card">
                <h4 className="req-card-title">Delivery &amp; Logistics</h4>
                <div className="info-block">
                  <span className="info-label">Shipping Destination:</span>
                  <p className="customer-msg-text">{selectedOrder.shippingAddress}</p>
                </div>
              </div>

              {/* ORDER ITEMS TABLE */}
              <div className="builder-header">
                <h4 className="builder-title">Order Line Items</h4>
              </div>
              <table className="builder-table">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Category</th>
                    <th className="text-right">Quantity</th>
                    <th>Unit</th>
                    <th className="text-right">Agreed Rate</th>
                    <th className="text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td><strong>{it.productName}</strong></td>
                      <td>{it.category}</td>
                      <td className="text-right">{it.quantity}</td>
                      <td>{it.unit}</td>
                      <td className="text-right">₹{it.unitPrice.toFixed(2)}</td>
                      <td className="text-right"><strong>₹{it.subtotal.toFixed(2)}</strong></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* STATUS UPDATE CONTROLS */}
              <div className="admin-status-update-box">
                <h4 className="req-card-title">Update Fulfillment &amp; Payment Progression</h4>
                <div className="form-row-2">
                  <div className="form-field">
                    <label className="field-label">Production &amp; Dispatch Status</label>
                    <select
                      value={modalOrderStatus}
                      onChange={(e) => setModalOrderStatus(e.target.value as OrderStatus)}
                      className="field-input select-input"
                    >
                      {ORDER_STATUSES.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Payment Clearing Status</label>
                    <select
                      value={modalPaymentStatus}
                      onChange={(e) => setModalPaymentStatus(e.target.value as PaymentStatus)}
                      className="field-input select-input"
                    >
                      {PAYMENT_STATUSES.map((pst) => (
                        <option key={pst} value={pst}>
                          {pst}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row-2">
                  <div className="form-field">
                    <label className="field-label">Courier / Logistics Tracking Reference</label>
                    <input
                      type="text"
                      value={trackingNumber}
                      onChange={(e) => setTrackingNumber(e.target.value)}
                      placeholder="e.g. VRL-MUM-8921"
                      className="field-input"
                    />
                  </div>

                  <div className="form-field">
                    <label className="field-label">Warehouse &amp; Dispatch Remarks</label>
                    <input
                      type="text"
                      value={orderNotes}
                      onChange={(e) => setOrderNotes(e.target.value)}
                      placeholder="e.g. Slit to exact width, dispatched via transport"
                      className="field-input"
                    />
                  </div>
                </div>
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
                  type="button"
                  disabled={isUpdating}
                  className="btn-primary"
                  onClick={handleUpdate}
                >
                  <Check size={16} />
                  <span>{isUpdating ? 'Saving...' : 'Update Order State'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

function getOrderBadge(status: string) {
  switch (status) {
    case 'DELIVERED':
      return 'success';
    case 'DISPATCHED':
    case 'IN_PRODUCTION':
      return 'info';
    case 'PENDING':
      return 'warning';
    case 'CANCELLED':
      return 'danger';
    default:
      return 'neutral';
  }
}
