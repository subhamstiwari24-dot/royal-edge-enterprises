import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Eye,
  FileCheck2,
  MessageCircle,
  X,
  Check,
} from 'lucide-react';
import type { Enquiry, EnquiryStatus } from '../../types';
import { royalEdgeService } from '../../services/api';

interface EnquiryManagementProps {
  enquiries: Enquiry[];
  onRefresh: () => void;
  onOpenCreateQuotationForEnquiry: (enquiry: Enquiry) => void;
}

const STATUS_OPTIONS: EnquiryStatus[] = [
  'NEW',
  'IN_REVIEW',
  'CONTACTED',
  'QUOTATION_PREPARED',
  'CONVERTED',
  'REJECTED',
];

export const EnquiryManagement: React.FC<EnquiryManagementProps> = ({
  enquiries,
  onRefresh,
  onOpenCreateQuotationForEnquiry,
}) => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [typeFilter, setTypeFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);

  // Edit status in modal
  const [modalStatus, setModalStatus] = useState<EnquiryStatus>('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const filtered = useMemo(() => {
    return enquiries.filter((e) => {
      const matchStatus = statusFilter === 'All' || e.status === statusFilter;
      const matchType = typeFilter === 'All' || e.enquiryType === typeFilter;
      const q = search.toLowerCase();
      const matchSearch =
        q === '' ||
        e.enquiryNumber.toLowerCase().includes(q) ||
        e.customerName.toLowerCase().includes(q) ||
        (e.companyName && e.companyName.toLowerCase().includes(q)) ||
        e.phone.includes(q) ||
        e.category.toLowerCase().includes(q);
      return matchStatus && matchType && matchSearch;
    });
  }, [enquiries, statusFilter, typeFilter, search]);

  const openDetailModal = (enq: Enquiry) => {
    setSelectedEnquiry(enq);
    setModalStatus(enq.status);
    setAdminNotes(enq.adminNotes || '');
  };

  const closeDetailModal = () => {
    setSelectedEnquiry(null);
  };

  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    setIsUpdating(true);
    try {
      await royalEdgeService.updateEnquiryStatus(
        selectedEnquiry.id,
        modalStatus,
        adminNotes.trim()
      );
      closeDetailModal();
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('Failed to update enquiry status');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return new Date(iso).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return iso;
    }
  };

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Customer Inquiries &amp; RFQ Pipeline</h2>
          <p className="page-subheading">
            Review incoming product inquiries, communicate via WhatsApp/Phone, and convert into private quotations.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="s-icon" />
          <input
            type="text"
            placeholder="Search by enquiry #, customer, company, or phone..."
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
            <option value="All">All Statuses</option>
            {STATUS_OPTIONS.map((st) => (
              <option key={st} value={st}>
                {st.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-select-wrap">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="admin-select"
          >
            <option value="All">All Order Types</option>
            <option value="BULK">Bulk / Wholesale</option>
            <option value="RETAIL">Retail / Sampling</option>
          </select>
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-content-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enquiry #</th>
                <th>Date Received</th>
                <th>Customer / Firm</th>
                <th>Product Category</th>
                <th>Volume</th>
                <th>Contact Mode</th>
                <th>Status</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No inquiries found matching the active filter.
                  </td>
                </tr>
              ) : (
                filtered.map((enq) => (
                  <tr key={enq.id}>
                    <td>
                      <strong className="mono-code">{enq.enquiryNumber}</strong>
                    </td>
                    <td>
                      <small className="date-cell">{formatDate(enq.createdAt)}</small>
                    </td>
                    <td>
                      <div className="table-cust-cell">
                        <span className="cust-name">{enq.customerName}</span>
                        {enq.companyName && (
                          <small className="cust-company">{enq.companyName}</small>
                        )}
                        <small className="cust-phone">{enq.phone}</small>
                      </div>
                    </td>
                    <td>
                      <span className="table-cat-badge">{enq.category}</span>
                      {enq.productName && (
                        <small className="block-type">{enq.productName}</small>
                      )}
                    </td>
                    <td>
                      <span>{enq.quantity} {enq.unit}</span>
                      <small className="block-type">{enq.enquiryType}</small>
                    </td>
                    <td>
                      <span className="contact-pref-pill">{enq.preferredContact}</span>
                    </td>
                    <td>
                      <span className={`badge badge-${getStatusColor(enq.status)}`}>
                        {enq.status.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="text-right">
                      <div className="action-buttons-cell">
                        <button
                          type="button"
                          className="btn-icon"
                          title="View Details & Update Status"
                          onClick={() => openDetailModal(enq)}
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          type="button"
                          className="btn-icon gold-action"
                          title="Generate Private Quotation"
                          onClick={() => onOpenCreateQuotationForEnquiry(enq)}
                        >
                          <FileCheck2 size={16} />
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

      {/* DETAIL & STATUS UPDATE MODAL */}
      {selectedEnquiry && (
        <div className="modal-backdrop" onClick={closeDetailModal}>
          <div className="admin-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-sub-label">INQUIRY DOSSIER</span>
                <h3 className="modal-title">{selectedEnquiry.enquiryNumber}</h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeDetailModal}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* CUSTOMER SUMMARY GRID */}
              <div className="modal-info-grid">
                <div className="info-block">
                  <span className="info-label">Customer Name</span>
                  <strong className="info-val">{selectedEnquiry.customerName}</strong>
                </div>

                <div className="info-block">
                  <span className="info-label">Business / Firm</span>
                  <strong className="info-val">{selectedEnquiry.companyName || 'Not specified'}</strong>
                </div>

                <div className="info-block">
                  <span className="info-label">Phone / WhatsApp</span>
                  <div className="info-contact-row">
                    <span className="info-val">{selectedEnquiry.phone}</span>
                    <a
                      href={`https://wa.me/${selectedEnquiry.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedEnquiry.customerName}, this is Royal Edge Enterprises regarding your inquiry ${selectedEnquiry.enquiryNumber}.`
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-wa-link"
                    >
                      <MessageCircle size={14} />
                      <span>WhatsApp</span>
                    </a>
                  </div>
                </div>

                <div className="info-block">
                  <span className="info-label">Email</span>
                  <span className="info-val">{selectedEnquiry.email || 'None provided'}</span>
                </div>
              </div>

              {/* SPECIFICATION CARD */}
              <div className="modal-req-card">
                <h4 className="req-card-title">Requested Backing Specifications</h4>
                <div className="modal-info-grid">
                  <div className="info-block">
                    <span className="info-label">Category</span>
                    <span className="info-val">{selectedEnquiry.category}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Product Name / Grade</span>
                    <span className="info-val">{selectedEnquiry.productName || 'General Category Inquiry'}</span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Target Volume</span>
                    <span className="info-val">
                      {selectedEnquiry.quantity} {selectedEnquiry.unit} ({selectedEnquiry.enquiryType})
                    </span>
                  </div>
                  <div className="info-block">
                    <span className="info-label">Preferred Response</span>
                    <span className="info-val">{selectedEnquiry.preferredContact}</span>
                  </div>
                </div>

                {selectedEnquiry.message && (
                  <div className="enquiry-notes-box">
                    <span className="info-label">Customer Requirements / Custom Width:</span>
                    <p className="customer-msg-text">{selectedEnquiry.message}</p>
                  </div>
                )}
              </div>

              {/* STATUS & ADMIN NOTES FORM */}
              <div className="admin-status-update-box">
                <h4 className="req-card-title">Update Workflow Status</h4>
                <div className="form-row-2">
                  <div className="form-field">
                    <label className="field-label">Current Lifecycle Stage</label>
                    <select
                      value={modalStatus}
                      onChange={(e) => setModalStatus(e.target.value as EnquiryStatus)}
                      className="field-input select-input"
                    >
                      {STATUS_OPTIONS.map((st) => (
                        <option key={st} value={st}>
                          {st.replace(/_/g, ' ')}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-field">
                    <label className="field-label">Internal Follow-up Notes</label>
                    <input
                      type="text"
                      value={adminNotes}
                      onChange={(e) => setAdminNotes(e.target.value)}
                      placeholder="e.g. Swatches sent on 5th Nov, awaiting lab dip..."
                      className="field-input"
                    />
                  </div>
                </div>
              </div>

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={() => {
                    closeDetailModal();
                    onOpenCreateQuotationForEnquiry(selectedEnquiry);
                  }}
                >
                  <FileCheck2 size={16} />
                  <span>Prepare Quotation Now</span>
                </button>

                <div className="right-btn-group">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeDetailModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    disabled={isUpdating}
                    className="btn-primary"
                    onClick={handleUpdateStatus}
                  >
                    <Check size={16} />
                    <span>{isUpdating ? 'Saving...' : 'Update Status'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
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
      return 'success';
    case 'REJECTED':
      return 'danger';
    default:
      return 'neutral';
  }
}
