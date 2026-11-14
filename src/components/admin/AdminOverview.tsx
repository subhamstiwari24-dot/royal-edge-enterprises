import React from 'react';
import {
  Package,
  MessageSquareQuote,
  FileCheck2,
  ShoppingCart,
  ArrowRight,
  Plus,
} from 'lucide-react';
import type { AdminProduct, Customer, Enquiry, Quotation, CustomerOrder } from '../../types';
import type { AdminTab } from './AdminLayout';

interface AdminOverviewProps {
  products: AdminProduct[];
  customers: Customer[];
  enquiries: Enquiry[];
  quotations: Quotation[];
  orders: CustomerOrder[];
  onNavigateTab: (tab: AdminTab) => void;
  onOpenNewProductModal: () => void;
  onOpenNewQuoteModal: () => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  products,
  customers,
  enquiries,
  quotations,
  orders,
  onNavigateTab,
  onOpenNewProductModal,
  onOpenNewQuoteModal,
}) => {
  const pendingEnquiries = enquiries.filter(
    (e) => e.status === 'NEW' || e.status === 'UNDER_REVIEW'
  );
  const activeQuotations = quotations.filter(
    (q) => q.status === 'SENT' || q.status === 'DRAFT'
  );
  const activeProducts = products.filter((p) => p.active);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <div className="overview-container">
      {/* WELCOME BANNER & QUICK ACTIONS */}
      <div className="overview-hero-card">
        <div className="overview-hero-text">
          <span className="eyebrow-badge">ROYAL EDGE ENTERPRISES</span>
          <h2 className="overview-title">Commercial Operations Dashboard</h2>
          <p className="overview-desc">
            Monitor client inquiries, prepare itemized private quotations, and fulfill confirmed orders across all eight backing categories.
          </p>
        </div>

        <div className="overview-hero-actions">
          <button
            type="button"
            className="btn-primary"
            onClick={onOpenNewQuoteModal}
          >
            <Plus size={16} />
            <span>Prepare Quotation</span>
          </button>

          <button
            type="button"
            className="btn-secondary"
            onClick={onOpenNewProductModal}
          >
            <Plus size={16} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* METRIC KPI CARDS */}
      <div className="kpi-grid">
        {/* KPI 1: ENQUIRIES */}
        <div
          className="kpi-card hover-lift cursor-pointer"
          onClick={() => onNavigateTab('enquiries')}
        >
          <div className="kpi-icon-wrap amber">
            <MessageSquareQuote size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Pending Inquiries</span>
            <div className="kpi-value-row">
              <span className="kpi-val">{pendingEnquiries.length}</span>
              <span className="kpi-subval">of {enquiries.length} total</span>
            </div>
            <div className="kpi-action-link">
              <span>View inquiry pipeline</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* KPI 2: ACTIVE QUOTATIONS */}
        <div
          className="kpi-card hover-lift cursor-pointer"
          onClick={() => onNavigateTab('quotations')}
        >
          <div className="kpi-icon-wrap blue">
            <FileCheck2 size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Open Quotations</span>
            <div className="kpi-value-row">
              <span className="kpi-val">{activeQuotations.length}</span>
              <span className="kpi-subval">of {quotations.length} generated</span>
            </div>
            <div className="kpi-action-link">
              <span>Manage quotation lifecycle</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* KPI 3: CONFIRMED ORDERS */}
        <div
          className="kpi-card hover-lift cursor-pointer"
          onClick={() => onNavigateTab('orders')}
        >
          <div className="kpi-icon-wrap emerald">
            <ShoppingCart size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Confirmed Orders</span>
            <div className="kpi-value-row">
              <span className="kpi-val">{orders.length}</span>
              <span className="kpi-subval">from accepted quotes</span>
            </div>
            <div className="kpi-action-link">
              <span>Track fulfillment &amp; dispatch</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>

        {/* KPI 4: PRODUCT CATALOGUE */}
        <div
          className="kpi-card hover-lift cursor-pointer"
          onClick={() => onNavigateTab('products')}
        >
          <div className="kpi-icon-wrap charcoal">
            <Package size={22} />
          </div>
          <div className="kpi-info">
            <span className="kpi-label">Catalogue Items</span>
            <div className="kpi-value-row">
              <span className="kpi-val">{activeProducts.length}</span>
              <span className="kpi-subval">across 8 categories ({customers.length} clients)</span>
            </div>
            <div className="kpi-action-link">
              <span>Inspect specs &amp; pricing</span>
              <ArrowRight size={13} />
            </div>
          </div>
        </div>
      </div>

      {/* TWO COLUMN RECENT TABLES */}
      <div className="overview-tables-row">
        {/* LEFT: RECENT INQUIRIES */}
        <div className="admin-content-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-heading">Recent Inquiries</h3>
              <p className="card-subheading">Latest requests received via website form</p>
            </div>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigateTab('enquiries')}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Enquiry #</th>
                  <th>Customer</th>
                  <th>Category</th>
                  <th>Volume</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {enquiries.slice(0, 5).map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <strong className="mono-code">{enq.enquiryNumber}</strong>
                    </td>
                    <td>
                      <div className="table-cust-cell">
                        <span className="cust-name">{enq.customerName}</span>
                        {enq.companyName && (
                          <small className="cust-company">{enq.companyName}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{enq.category}</span>
                    </td>
                    <td>
                      <span>{enq.quantity} {enq.unit}</span>
                      <small className="block-type">{enq.enquiryType}</small>
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusColor(enq.status)}`}>
                        {formatStatus(enq.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT: RECENT ORDERS & QUOTATIONS */}
        <div className="admin-content-card">
          <div className="card-header-flex">
            <div>
              <h3 className="card-heading">Recent Confirmed Orders</h3>
              <p className="card-subheading">Accepted quotations converted to production</p>
            </div>
            <button
              type="button"
              className="link-btn"
              onClick={() => onNavigateTab('orders')}
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="empty-table-cell">
                      No confirmed orders yet. Once an accepted quotation is converted, it appears here.
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((ord) => (
                    <tr key={ord.id}>
                      <td>
                        <strong className="mono-code">{ord.orderNumber}</strong>
                      </td>
                      <td>
                        <span className="cust-name">{ord.customerName}</span>
                      </td>
                      <td>
                        <strong>{formatCurrency(ord.totalAmount)}</strong>
                      </td>
                      <td>
                        <small>{formatDate(ord.createdAt)}</small>
                      </td>
                      <td>
                        <span className="badge badge-success">
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

function getStatusColor(status: string) {
  switch (status) {
    case 'NEW':
      return 'info';
    case 'IN_REVIEW':
    case 'CONTACTED':
      return 'warning';
    case 'QUOTATION_PREPARED':
    case 'CONVERTED':
    case 'ACCEPTED':
      return 'success';
    case 'REJECTED':
      return 'danger';
    default:
      return 'neutral';
  }
}

function formatStatus(status: string) {
  return status.replace(/_/g, ' ');
}
