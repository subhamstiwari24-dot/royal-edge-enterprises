import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Eye,
  FileCheck2,
  MessageCircle,
  Phone,
  Mail,
  X,
  Check,
  RotateCcw,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  AlertCircle,
  CheckCircle2,
  Inbox,
  Building2,
  Tag,
  RefreshCw,
} from 'lucide-react';
import type {
  Enquiry,
  EnquiryStatus,
  AdminProduct,
  PaginatedResponse,
} from '../../types';
import { VALID_ENQUIRY_TRANSITIONS } from '../../types';
import { royalEdgeService } from '../../services/api';

interface EnquiryManagementProps {
  enquiries: Enquiry[];
  products?: AdminProduct[];
  onRefresh: () => void;
  onOpenCreateQuotationForEnquiry: (enquiry: Enquiry) => void;
}

const ALL_STATUSES: EnquiryStatus[] = [
  'NEW',
  'UNDER_REVIEW',
  'QUOTATION_PREPARED',
  'QUOTATION_SENT',
  'ACCEPTED',
  'REJECTED',
  'CLOSED',
];

export const EnquiryManagement: React.FC<EnquiryManagementProps> = ({
  enquiries: initialEnquiries,
  products = [],
  onRefresh,
  onOpenCreateQuotationForEnquiry,
}) => {
  // Search & Filter State
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<EnquiryStatus | 'All'>('All');
  const [productIdFilter, setProductIdFilter] = useState<number | 'All'>('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [paginatedData, setPaginatedData] = useState<PaginatedResponse<Enquiry> | null>(null);

  // Loading & Error States
  const [isLoading, setIsLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Detail Modal / Dossier State
  const [selectedEnquiry, setSelectedEnquiry] = useState<Enquiry | null>(null);
  const [targetStatus, setTargetStatus] = useState<EnquiryStatus>('NEW');
  const [adminNotes, setAdminNotes] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [statusSuccess, setStatusSuccess] = useState<string | null>(null);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 0 on filter change
  const handleStatusChange = (st: EnquiryStatus | 'All') => {
    setStatusFilter(st);
    setCurrentPage(0);
  };

  const handleProductChange = (prodId: number | 'All') => {
    setProductIdFilter(prodId);
    setCurrentPage(0);
  };

  const handleStartDateChange = (val: string) => {
    setStartDate(val);
    setCurrentPage(0);
  };

  const handleEndDateChange = (val: string) => {
    setEndDate(val);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setSearch('');
    setDebouncedSearch('');
    setStatusFilter('All');
    setProductIdFilter('All');
    setStartDate('');
    setEndDate('');
    setCurrentPage(0);
  };

  // Fetch paginated inquiries from backend or fallback store
  const [reloadTrigger, setReloadTrigger] = useState(0);

  const triggerReload = () => {
    setReloadTrigger((v) => v + 1);
  };

  useEffect(() => {
    let active = true;
    royalEdgeService
      .getEnquiriesPage({
        search: debouncedSearch.trim() || undefined,
        status: statusFilter,
        productId: productIdFilter === 'All' ? undefined : productIdFilter,
        startDate: startDate || undefined,
        endDate: endDate || undefined,
        page: currentPage,
        size: pageSize,
      })
      .then((data) => {
        if (!active) return;
        setPaginatedData(data);
        setIsLoading(false);
      })
      .catch((err: any) => {
        if (!active) return;
        console.error('Failed to fetch enquiries:', err);
        setFetchError(err.message || 'Unable to load inquiries.');
        setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, [debouncedSearch, statusFilter, productIdFilter, startDate, endDate, currentPage, pageSize, reloadTrigger]);

  // Summary counts computed across total loaded dataset
  const pipelineStats = useMemo(() => {
    const dataset = paginatedData ? initialEnquiries : [];
    const total = dataset.length || initialEnquiries.length;
    const newCount = initialEnquiries.filter((e) => e.status === 'NEW').length;
    const reviewCount = initialEnquiries.filter((e) => e.status === 'UNDER_REVIEW').length;
    const prepCount = initialEnquiries.filter((e) => e.status === 'QUOTATION_PREPARED' || e.status === 'QUOTATION_SENT').length;
    const acceptedCount = initialEnquiries.filter((e) => e.status === 'ACCEPTED').length;

    return { total, newCount, reviewCount, prepCount, acceptedCount };
  }, [initialEnquiries, paginatedData]);

  // Open Enquiry Dossier Modal
  const openDetailModal = async (enquiry: Enquiry) => {
    setSelectedEnquiry(enquiry);
    setTargetStatus(enquiry.status);
    setAdminNotes(enquiry.adminNotes || '');
    setStatusError(null);
    setStatusSuccess(null);

    // Optionally re-fetch single enquiry from backend for freshest state
    try {
      const fresh = await royalEdgeService.getEnquiryById(enquiry.id);
      if (fresh) {
        setSelectedEnquiry(fresh);
        setTargetStatus(fresh.status);
        setAdminNotes(fresh.adminNotes || '');
      }
    } catch {
      // Keep existing enquiry if single get fails
    }
  };

  const closeDetailModal = () => {
    setSelectedEnquiry(null);
    setStatusError(null);
    setStatusSuccess(null);
  };

  // Handle Lifecycle Status Transition
  const handleUpdateStatus = async () => {
    if (!selectedEnquiry) return;
    setIsUpdatingStatus(true);
    setStatusError(null);
    setStatusSuccess(null);

    try {
      const updated = await royalEdgeService.updateEnquiryStatus(
        selectedEnquiry.id,
        targetStatus,
        adminNotes.trim()
      );

      setSelectedEnquiry(updated);
      setStatusSuccess(`Status successfully transitioned to ${formatStatusName(updated.status)}.`);
      onRefresh();
      triggerReload();
    } catch (err: any) {
      console.error('Status transition error:', err);
      setStatusError(err.message || 'Failed to update status. Please verify transition rules.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Helper date formatting
  const formatDate = (iso?: string): { date: string; time: string } => {
    if (!iso) return { date: '—', time: '' };
    try {
      const d = new Date(iso);
      return {
        date: d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
        time: d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      };
    } catch {
      return { date: iso, time: '' };
    }
  };

  // Helper to format enum string
  const formatStatusName = (st: string) => {
    return st.replace(/_/g, ' ');
  };

  // Safe phone cleaning
  const getCleanPhone = (phone?: string) => {
    return (phone || '').replace(/\D/g, '');
  };

  // Compute valid next transitions for selected enquiry
  const validTransitions = useMemo(() => {
    if (!selectedEnquiry) return [];
    return VALID_ENQUIRY_TRANSITIONS[selectedEnquiry.status] || [];
  }, [selectedEnquiry]);

  const isTerminalState = selectedEnquiry?.status === 'CLOSED';

  // Active items for table
  const displayedItems = paginatedData ? paginatedData.content : [];
  const totalElements = paginatedData ? paginatedData.totalElements : 0;
  const totalPages = paginatedData ? paginatedData.totalPages : 1;
  const startItem = totalElements === 0 ? 0 : currentPage * pageSize + 1;
  const endItem = Math.min((currentPage + 1) * pageSize, totalElements);

  return (
    <div className="admin-page-container">
      {/* SECTION HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Customer Inquiries &amp; RFQ Pipeline</h2>
          <p className="page-subheading">
            Review incoming industrial inquiries, filter specifications, initiate client outreach, and transition leads into private quotations.
          </p>
        </div>
      </div>

      {/* PIPELINE STATS STRIP */}
      <div className="enquiry-stats-strip">
        <div className="enquiry-stat-card">
          <span className="enquiry-stat-label">Total Inquiries</span>
          <span className="enquiry-stat-value">{pipelineStats.total}</span>
        </div>
        <div className="enquiry-stat-card">
          <span className="enquiry-stat-label">New Submissions</span>
          <span className="enquiry-stat-value" style={{ color: '#975A16' }}>{pipelineStats.newCount}</span>
        </div>
        <div className="enquiry-stat-card">
          <span className="enquiry-stat-label">Under Technical Review</span>
          <span className="enquiry-stat-value" style={{ color: '#2B6CB0' }}>{pipelineStats.reviewCount}</span>
        </div>
        <div className="enquiry-stat-card">
          <span className="enquiry-stat-label">Quotations Prepared/Sent</span>
          <span className="enquiry-stat-value" style={{ color: '#6B46C1' }}>{pipelineStats.prepCount}</span>
        </div>
        <div className="enquiry-stat-card">
          <span className="enquiry-stat-label">Accepted / Converted</span>
          <span className="enquiry-stat-value" style={{ color: '#2A724F' }}>{pipelineStats.acceptedCount}</span>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="enquiry-filters-bar">
        <div className="enquiry-filters-row">
          {/* Search Box: Enquiry #, Customer Name, Phone */}
          <div className="enquiry-search-box">
            <Search size={16} className="s-icon" />
            <input
              type="text"
              placeholder="Search by enquiry #, customer name, company, or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="enquiry-search-input"
            />
            {search && (
              <button
                type="button"
                className="enquiry-search-clear"
                onClick={() => setSearch('')}
                title="Clear search"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Status Filter */}
          <div className="enquiry-select-wrap">
            <select
              value={statusFilter}
              onChange={(e) => handleStatusChange(e.target.value as EnquiryStatus | 'All')}
              className="enquiry-select"
              aria-label="Filter by Status"
            >
              <option value="All">All Statuses ({ALL_STATUSES.length})</option>
              {ALL_STATUSES.map((st) => (
                <option key={st} value={st}>
                  {formatStatusName(st)}
                </option>
              ))}
            </select>
          </div>

          {/* Product Filter */}
          <div className="enquiry-select-wrap">
            <select
              value={productIdFilter}
              onChange={(e) =>
                handleProductChange(e.target.value === 'All' ? 'All' : Number(e.target.value))
              }
              className="enquiry-select"
              aria-label="Filter by Product"
            >
              <option value="All">All Products</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          {/* Date Range Filters */}
          <div className="enquiry-date-filters">
            <div className="enquiry-date-item">
              <span className="enquiry-date-label">From:</span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => handleStartDateChange(e.target.value)}
                className="enquiry-date-input"
                title="Filter inquiries from this date"
              />
            </div>
            <div className="enquiry-date-item">
              <span className="enquiry-date-label">To:</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => handleEndDateChange(e.target.value)}
                className="enquiry-date-input"
                title="Filter inquiries up to this date"
              />
            </div>
          </div>

          {/* Actions: Clear & Refresh */}
          <div className="enquiry-filter-actions">
            {(search || statusFilter !== 'All' || productIdFilter !== 'All' || startDate || endDate) && (
              <button
                type="button"
                onClick={handleClearFilters}
                className="btn-clear-filters"
                title="Reset all search filters"
              >
                <RotateCcw size={14} />
                <span>Clear Filters</span>
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                onRefresh();
                triggerReload();
              }}
              className="btn-refresh-enquiry"
              title="Refresh Pipeline"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>
      </div>

      {/* ERROR ALERT IF FETCH FAILED */}
      {fetchError && (
        <div className="dossier-alert-error" style={{ marginBottom: 16 }}>
          <AlertCircle size={18} />
          <div>
            <strong>Failed to load inquiries:</strong> {fetchError}
          </div>
        </div>
      )}

      {/* TABLE DATA LISTING */}
      <div className="admin-content-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Enquiry Number</th>
                <th>Customer Name</th>
                <th>Phone</th>
                <th>Product</th>
                <th>Category</th>
                <th>Enquiry Type</th>
                <th>Quantity</th>
                <th>Date</th>
                <th>Status</th>
                <th className="text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                      <RefreshCw size={18} className="animate-spin" style={{ color: 'var(--color-gold-deep)' }} />
                      <span>Loading inquiries from pipeline...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="empty-table-cell">
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, padding: '24px 0' }}>
                      <Inbox size={32} style={{ color: 'var(--color-text-muted)', strokeWidth: 1.5 }} />
                      <strong style={{ color: 'var(--color-charcoal)' }}>No customer inquiries found</strong>
                      <p style={{ margin: 0, fontSize: 13 }}>
                        No records match your active search terms or date filter criteria.
                      </p>
                      {(search || statusFilter !== 'All' || productIdFilter !== 'All' || startDate || endDate) && (
                        <button
                          type="button"
                          onClick={handleClearFilters}
                          className="btn-clear-filters"
                          style={{ marginTop: 8 }}
                        >
                          <RotateCcw size={14} />
                          <span>Clear Active Filters</span>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                displayedItems.map((enq) => {
                  const dateInfo = formatDate(enq.createdAt);
                  const cleanPhone = getCleanPhone(enq.phone || enq.customerPhone);
                  const waText = encodeURIComponent(
                    `Hello ${enq.customerName}, this is Royal Edge Enterprises regarding your inquiry ${enq.enquiryNumber}.`
                  );

                  return (
                    <tr key={enq.id} style={{ cursor: 'pointer' }} onClick={() => openDetailModal(enq)}>
                      {/* 1. Enquiry Number */}
                      <td>
                        <span className="enquiry-number-pill">{enq.enquiryNumber}</span>
                      </td>

                      {/* 2. Customer Name & Company */}
                      <td>
                        <div className="enquiry-cust-stack">
                          <span className="enquiry-cust-name">{enq.customerName}</span>
                          {enq.companyName && (
                            <span className="enquiry-cust-company">{enq.companyName}</span>
                          )}
                        </div>
                      </td>

                      {/* 3. Phone + WhatsApp Quick Actions */}
                      <td onClick={(e) => e.stopPropagation()}>
                        <div className="enquiry-phone-cell">
                          <a
                            href={`tel:${(enq.phone || enq.customerPhone || '').replace(/\s+/g, '')}`}
                            className="enquiry-phone-link"
                            title="Call customer"
                          >
                            {enq.phone || enq.customerPhone}
                          </a>
                          {cleanPhone && (
                            <a
                              href={`https://wa.me/${cleanPhone}?text=${waText}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="wa-quick-btn"
                              title="Chat on WhatsApp"
                            >
                              <MessageCircle size={13} />
                            </a>
                          )}
                        </div>
                      </td>

                      {/* 4. Product Name */}
                      <td>
                        <span className="font-semibold" style={{ fontSize: 12.5, color: 'var(--color-charcoal)' }}>
                          {enq.productName || 'General Category Inquiry'}
                        </span>
                      </td>

                      {/* 5. Category */}
                      <td>
                        <span className="table-cat-badge">{enq.productCategory || enq.category}</span>
                      </td>

                      {/* 6. Enquiry Type */}
                      <td>
                        <span className={`enquiry-type-tag ${enq.enquiryType === 'BULK' ? 'bulk' : 'retail'}`}>
                          {enq.enquiryType === 'BULK' ? 'Bulk' : 'Retail'}
                        </span>
                      </td>

                      {/* 7. Quantity */}
                      <td>
                        <strong style={{ color: 'var(--color-charcoal)', fontSize: 13 }}>
                          {enq.quantity.toLocaleString('en-IN')}
                        </strong>{' '}
                        <span style={{ fontSize: 11, color: 'var(--color-text-muted)' }}>{enq.unit}</span>
                      </td>

                      {/* 8. Date */}
                      <td>
                        <div className="enquiry-date-stack">
                          <span>{dateInfo.date}</span>
                          <span className="enquiry-date-time">{dateInfo.time}</span>
                        </div>
                      </td>

                      {/* 9. Status Badge (all 7 statuses) */}
                      <td>
                        <span className={`badge badge-status-${enq.status.toLowerCase()}`}>
                          {formatStatusName(enq.status)}
                        </span>
                      </td>

                      {/* 10. Actions */}
                      <td className="text-right" onClick={(e) => e.stopPropagation()}>
                        <div className="action-buttons-cell">
                          <button
                            type="button"
                            className="btn-icon"
                            title="View Enquiry Dossier"
                            onClick={() => openDetailModal(enq)}
                          >
                            <Eye size={16} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon gold-action"
                            title="Draft Formal Quotation"
                            onClick={() => onOpenCreateQuotationForEnquiry(enq)}
                          >
                            <FileCheck2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION BAR */}
        <div className="enquiry-pagination-bar">
          <div className="pagination-summary">
            Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of{' '}
            <strong>{totalElements}</strong> inquiries
          </div>

          <div className="pagination-controls">
            <div className="pagination-page-size-wrap">
              <span>Rows per page:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(0);
                }}
                className="pagination-size-select"
                aria-label="Select rows per page"
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div className="pagination-nav-group">
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === 0 || isLoading}
                onClick={() => setCurrentPage(0)}
                title="First Page"
              >
                <ChevronsLeft size={16} />
              </button>
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage === 0 || isLoading}
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                title="Previous Page"
              >
                <ChevronLeft size={16} />
              </button>

              <span className="pagination-page-indicator">
                Page {currentPage + 1} of {Math.max(1, totalPages)}
              </span>

              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage >= totalPages - 1 || isLoading}
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                title="Next Page"
              >
                <ChevronRight size={16} />
              </button>
              <button
                type="button"
                className="pagination-btn"
                disabled={currentPage >= totalPages - 1 || isLoading}
                onClick={() => setCurrentPage(Math.max(0, totalPages - 1))}
                title="Last Page"
              >
                <ChevronsRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ENQUIRY DETAILS MODAL / DOSSIER */}
      {selectedEnquiry && (
        <div className="modal-backdrop" onClick={closeDetailModal}>
          <div
            className="admin-modal-card wide"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 760 }}
          >
            {/* MODAL HEADER */}
            <div className="admin-modal-header">
              <div className="modal-header-text">
                <span className="modal-eyebrow">COMMERCIAL INQUIRY DOSSIER</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 4 }}>
                  <h3 className="modal-title" style={{ margin: 0 }}>
                    {selectedEnquiry.enquiryNumber}
                  </h3>
                  <span className={`badge badge-status-${selectedEnquiry.status.toLowerCase()}`}>
                    {formatStatusName(selectedEnquiry.status)}
                  </span>
                </div>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={closeDetailModal}
                title="Close Dossier"
              >
                <X size={20} />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="admin-modal-body">
              {/* SECTION 1: CUSTOMER CONTACT INFORMATION */}
              <div className="admin-form-section">
                <div className="section-title-wrap">
                  <span className="section-step-num">01</span>
                  <div>
                    <h4 className="section-title">Customer &amp; Business Profile</h4>
                    <p className="section-desc">Client contact channels and firm details.</p>
                  </div>
                </div>

                <div className="modal-info-grid">
                  <div className="info-block">
                    <span className="info-label">Customer Name</span>
                    <strong className="info-val">{selectedEnquiry.customerName}</strong>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Business / Firm</span>
                    <span className="info-val" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Building2 size={14} style={{ color: 'var(--color-text-muted)' }} />
                      <strong>{selectedEnquiry.companyName || 'Not specified (Individual)'}</strong>
                    </span>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Contact Phone</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <strong className="info-val">
                        {selectedEnquiry.phone || selectedEnquiry.customerPhone}
                      </strong>
                    </div>
                    <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                      {getCleanPhone(selectedEnquiry.phone || selectedEnquiry.customerPhone) && (
                        <a
                          href={`https://wa.me/${getCleanPhone(selectedEnquiry.phone || selectedEnquiry.customerPhone)}?text=${encodeURIComponent(
                            `Hello ${selectedEnquiry.customerName}, this is Royal Edge Enterprises regarding your inquiry ${selectedEnquiry.enquiryNumber}.`
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="wa-direct-action-btn"
                          title="Open WhatsApp chat with prefilled inquiry message"
                        >
                          <MessageCircle size={13} />
                          <span>WhatsApp</span>
                        </a>
                      )}
                      <a
                        href={`tel:${(selectedEnquiry.phone || selectedEnquiry.customerPhone || '').replace(/\s+/g, '')}`}
                        className="tel-direct-action-btn"
                        title="Direct telephone call"
                      >
                        <Phone size={13} />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Email Address</span>
                    {selectedEnquiry.email || selectedEnquiry.customerEmail ? (
                      <a
                        href={`mailto:${selectedEnquiry.email || selectedEnquiry.customerEmail}?subject=${encodeURIComponent(
                          `Royal Edge Enterprises Inquiry ${selectedEnquiry.enquiryNumber}`
                        )}`}
                        className="info-val"
                        style={{ color: 'var(--color-gold-deep)', textDecoration: 'underline', display: 'flex', alignItems: 'center', gap: 5 }}
                      >
                        <Mail size={13} />
                        <span>{selectedEnquiry.email || selectedEnquiry.customerEmail}</span>
                      </a>
                    ) : (
                      <span className="info-val" style={{ color: 'var(--color-text-muted)' }}>
                        None provided
                      </span>
                    )}
                  </div>

                  <div className="info-block">
                    <span className="info-label">Preferred Outreach Mode</span>
                    <span className="contact-pref-pill">
                      {selectedEnquiry.preferredContactMethod || selectedEnquiry.preferredContact || 'PHONE'}
                    </span>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Submission Timestamp</span>
                    <span className="info-val" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                      <Calendar size={13} style={{ color: 'var(--color-text-muted)' }} />
                      <span>
                        {formatDate(selectedEnquiry.createdAt).date} at {formatDate(selectedEnquiry.createdAt).time}
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION 2: REQUESTED MATERIAL SPECIFICATIONS */}
              <div className="admin-form-section">
                <div className="section-title-wrap">
                  <span className="section-step-num">02</span>
                  <div>
                    <h4 className="section-title">Technical Specifications &amp; Volume</h4>
                    <p className="section-desc">Backing material grade and order volume requested by the client.</p>
                  </div>
                </div>

                <div className="modal-info-grid">
                  <div className="info-block">
                    <span className="info-label">Product Category</span>
                    <span className="table-cat-badge">
                      {selectedEnquiry.productCategory || selectedEnquiry.category}
                    </span>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Product Name / Grade</span>
                    <strong className="info-val">
                      {selectedEnquiry.productName || 'General Category Inquiry'}
                    </strong>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Requested Volume</span>
                    <strong className="info-val" style={{ fontSize: 15, color: 'var(--color-charcoal)' }}>
                      {selectedEnquiry.quantity.toLocaleString('en-IN')} {selectedEnquiry.unit}
                    </strong>
                  </div>

                  <div className="info-block">
                    <span className="info-label">Order Type</span>
                    <span className={`enquiry-type-tag ${selectedEnquiry.enquiryType === 'BULK' ? 'bulk' : 'retail'}`}>
                      {selectedEnquiry.enquiryType === 'BULK' ? 'Bulk / Wholesale' : 'Retail / Sampling'}
                    </span>
                  </div>
                </div>

                {/* Customer Message / Custom Width Requirements */}
                <div className="enquiry-notes-box" style={{ marginTop: 14 }}>
                  <span className="info-label" style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 6 }}>
                    <Tag size={13} />
                    <span>Customer Requirements &amp; Custom Sizing Notes:</span>
                  </span>
                  <p className="customer-msg-text" style={{ fontStyle: 'italic', margin: 0 }}>
                    "{selectedEnquiry.customerMessage || selectedEnquiry.message || 'No additional specifications provided.'}"
                  </p>
                </div>
              </div>

              {/* SECTION 3: WORKFLOW STATUS & TRANSITION CONTROL */}
              <div className="admin-form-section">
                <div className="section-title-wrap">
                  <span className="section-step-num">03</span>
                  <div>
                    <h4 className="section-title">Lifecycle Status &amp; State Transitions</h4>
                    <p className="section-desc">
                      Advance the inquiry stage through strictly validated business state transitions.
                    </p>
                  </div>
                </div>

                <div className="dossier-transition-card">
                  {/* Status update error banner */}
                  {statusError && (
                    <div className="dossier-alert-error">
                      <AlertCircle size={18} style={{ flexShrink: 0 }} />
                      <div>
                        <strong>Transition Error:</strong> {statusError}
                      </div>
                    </div>
                  )}

                  {/* Status update success banner */}
                  {statusSuccess && (
                    <div className="dossier-alert-success">
                      <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                      <div>{statusSuccess}</div>
                    </div>
                  )}

                  {isTerminalState ? (
                    <div className="dossier-terminal-notice">
                      <strong>Terminal Lifecycle Stage:</strong> This enquiry has been marked as{' '}
                      <strong>CLOSED</strong>. No further status transitions or modifications are permitted.
                    </div>
                  ) : (
                    <>
                      <div className="form-grid-2">
                        <div className="field-group">
                          <label className="field-label">Next Permitted Status</label>
                          <select
                            value={targetStatus}
                            onChange={(e) => setTargetStatus(e.target.value as EnquiryStatus)}
                            className="field-input select-input"
                            disabled={isUpdatingStatus}
                          >
                            <option value={selectedEnquiry.status}>
                              {formatStatusName(selectedEnquiry.status)} (Current)
                            </option>
                            {validTransitions.map((st) => (
                              <option key={st} value={st}>
                                {formatStatusName(st)}
                              </option>
                            ))}
                          </select>
                          <small className="field-hint">
                            Allowed transitions from {formatStatusName(selectedEnquiry.status)}:{' '}
                            {validTransitions.map((t) => formatStatusName(t)).join(', ') || 'None'}
                          </small>
                        </div>

                        <div className="field-group">
                          <label className="field-label">Internal Follow-up Remarks</label>
                          <textarea
                            value={adminNotes}
                            onChange={(e) => setAdminNotes(e.target.value)}
                            placeholder="e.g., Fabric sample dispatched via courier; awaiting client laboratory test confirmation..."
                            rows={3}
                            className="remarks-textarea"
                            disabled={isUpdatingStatus}
                          />
                        </div>
                      </div>

                      <div className="dossier-action-bar">
                        <button
                          type="button"
                          className="btn-primary"
                          onClick={handleUpdateStatus}
                          disabled={isUpdatingStatus || targetStatus === selectedEnquiry.status && adminNotes === (selectedEnquiry.adminNotes || '')}
                        >
                          <Check size={16} />
                          <span>{isUpdatingStatus ? 'Updating Status...' : 'Apply Status Transition'}</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* MODAL FOOTER */}
              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-outline-gold"
                  onClick={() => {
                    closeDetailModal();
                    onOpenCreateQuotationForEnquiry(selectedEnquiry);
                  }}
                  title="Prefill Quotation Generator with this client and product"
                >
                  <FileCheck2 size={16} />
                  <span>Draft Formal Quotation</span>
                </button>

                <div className="modal-actions-right">
                  <button
                    type="button"
                    className="btn-secondary"
                    onClick={closeDetailModal}
                  >
                    Close Dossier
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
