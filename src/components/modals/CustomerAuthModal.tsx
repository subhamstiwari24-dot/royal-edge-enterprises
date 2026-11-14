import React, { useState } from 'react';
import { X, User, Package, Search, CheckCircle2, Truck } from 'lucide-react';
import { INITIAL_ORDERS } from '../../data/initialData';
import type { CustomerOrder } from '../../types';

interface CustomerAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CustomerAuthModal: React.FC<CustomerAuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'track' | 'profile'>('track');
  const [searchQuery, setSearchQuery] = useState('');
  const [foundOrders, setFoundOrders] = useState<CustomerOrder[] | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  // Profile registration / login state
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientGst, setClientGst] = useState('');
  const [profileSaved, setProfileSaved] = useState(false);

  if (!isOpen) return null;

  const handleTrackOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return;

    // Search existing initial orders & stored orders
    const matches = INITIAL_ORDERS.filter(
      (o) =>
        o.orderNumber.toLowerCase().includes(query) ||
        o.customerPhone.replace(/\D/g, '').includes(query.replace(/\D/g, '')) ||
        (o.customerEmail && o.customerEmail.toLowerCase().includes(query)) ||
        (o.trackingNumber && o.trackingNumber.toLowerCase().includes(query))
    );

    setFoundOrders(matches);
    setHasSearched(true);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientPhone) return;

    try {
      const profile = {
        name: clientName,
        phone: clientPhone,
        companyName: clientCompany,
        gstNumber: clientGst,
        updatedAt: new Date().toISOString(),
      };
      localStorage.setItem('royal_edge_client_profile', JSON.stringify(profile));
      setProfileSaved(true);
      setTimeout(() => setProfileSaved(false), 3000);
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div className="account-modal-overlay" onClick={onClose}>
      <div className="account-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="account-modal-header">
          <div className="account-brand-tag">
            <span className="eyebrow-badge">B2B PORTAL</span>
            <h3>Customer & Order Management</h3>
          </div>
          <button type="button" className="account-close-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* TABS */}
        <div className="account-tabs-row">
          <button
            type="button"
            className={`account-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
            onClick={() => setActiveTab('track')}
          >
            <Package size={16} />
            <span>Track Order & Dispatch</span>
          </button>
          <button
            type="button"
            className={`account-tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <User size={16} />
            <span>Client Registration / Profile</span>
          </button>
        </div>

        {/* TAB 1: ORDER TRACKING */}
        {activeTab === 'track' && (
          <div className="account-tab-content">
            <form onSubmit={handleTrackOrder} className="track-search-box">
              <label>Enter Order Number (e.g. ORD-2026-0012) or Registered Phone:</label>
              <div className="track-input-group">
                <input
                  type="text"
                  placeholder="Order # or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit" className="btn-primary">
                  <Search size={16} />
                  <span>Lookup</span>
                </button>
              </div>
            </form>

            {hasSearched && (
              <div className="track-results-area">
                {foundOrders && foundOrders.length > 0 ? (
                  foundOrders.map((ord) => (
                    <div key={ord.id} className="order-status-card">
                      <div className="order-card-header">
                        <div>
                          <span className="order-number-title">{ord.orderNumber}</span>
                          <span className="order-date">
                            Placed on {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                          </span>
                        </div>
                        <span className={`status-pill status-${ord.orderStatus.toLowerCase()}`}>
                          {ord.orderStatus.replace('_', ' ')}
                        </span>
                      </div>

                      <div className="order-meta-grid">
                        <div>
                          <strong>Client:</strong> {ord.customerName}
                          {ord.companyName && ` (${ord.companyName})`}
                        </div>
                        <div>
                          <strong>Quotation Status:</strong> Official Proforma Invoiced
                        </div>
                        <div>
                          <strong>Payment:</strong> {ord.paymentMethod} ({ord.paymentStatus})
                        </div>
                        {ord.trackingNumber && (
                          <div>
                            <strong>Consignment / Waybill:</strong>{' '}
                            <span className="tracking-code">{ord.trackingNumber}</span>
                          </div>
                        )}
                      </div>

                      <div className="order-items-summary">
                        <h5>Ordered Roll Specifications:</h5>
                        <ul>
                          {ord.items.map((it) => (
                            <li key={it.id}>
                              {it.quantity} {it.unit} – {it.productName}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {ord.notes && (
                        <div className="order-notes-box">
                          <Truck size={15} />
                          <span>Dispatch Note: {ord.notes}</span>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="no-order-found">
                    <p>No active orders found matching "{searchQuery}".</p>
                    <p className="subtext">
                      Please check the number or contact Chembur factory dispatch via WhatsApp.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: CLIENT PROFILE */}
        {activeTab === 'profile' && (
          <div className="account-tab-content">
            <form onSubmit={handleSaveProfile} className="client-profile-form">
              <p className="profile-intro-note">
                Save your business profile for fast 1-click wholesale quotations, GST invoices, and preferential manufacturing terms.
              </p>

              {profileSaved && (
                <div className="profile-saved-banner">
                  <CheckCircle2 size={16} />
                  <span>Profile updated successfully!</span>
                </div>
              )}

              <div className="form-group">
                <label>Contact Person / Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Mobile / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98200 00000"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Garment Manufacturing Unit / Company Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Garments Manufacturing"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>GSTIN (For 5% Textile Invoicing)</label>
                <input
                  type="text"
                  placeholder="e.g. 27AABCU9603R1ZM"
                  value={clientGst}
                  onChange={(e) => setClientGst(e.target.value)}
                />
              </div>

              <div className="profile-btn-row">
                <button type="submit" className="btn-primary">
                  Save Business Details
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
