import React, { useState, useMemo } from 'react';
import {
  Search,
  Eye,
  X,
  MessageCircle,
} from 'lucide-react';
import type { Customer, Enquiry, CustomerOrder } from '../../types';

interface CustomerManagementProps {
  customers: Customer[];
  enquiries: Enquiry[];
  orders: CustomerOrder[];
}

export const CustomerManagement: React.FC<CustomerManagementProps> = ({
  customers,
  enquiries,
  orders,
}) => {
  const [search, setSearch] = useState('');
  const [selectedCust, setSelectedCust] = useState<Customer | null>(null);

  const filtered = useMemo(() => {
    return customers.filter((c) => {
      const q = search.toLowerCase();
      return (
        q === '' ||
        c.name.toLowerCase().includes(q) ||
        (c.companyName && c.companyName.toLowerCase().includes(q)) ||
        c.phone.includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.city && c.city.toLowerCase().includes(q))
      );
    });
  }, [customers, search]);

  const customerEnquiries = useMemo(() => {
    if (!selectedCust) return [];
    return enquiries.filter(
      (e) =>
        e.phone.replace(/\D/g, '') === selectedCust.phone.replace(/\D/g, '') ||
        (e.email && e.email.toLowerCase() === selectedCust.email.toLowerCase())
    );
  }, [selectedCust, enquiries]);

  const customerOrders = useMemo(() => {
    if (!selectedCust) return [];
    return orders.filter(
      (o) =>
        o.customerId === selectedCust.id ||
        o.customerPhone.replace(/\D/g, '') === selectedCust.phone.replace(/\D/g, '')
    );
  }, [selectedCust, orders]);

  return (
    <div className="admin-page-container">
      {/* HEADER */}
      <div className="admin-page-header">
        <div>
          <h2 className="page-heading">Customer Registry &amp; CRM</h2>
          <p className="page-subheading">
            Centralized directory of garment manufacturing clients, wholesale traders, and recurring buyers.
          </p>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="admin-toolbar">
        <div className="search-input-wrap">
          <Search size={16} className="s-icon" />
          <input
            type="text"
            placeholder="Search by client name, firm, phone, city, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="admin-content-card">
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Company / Firm</th>
                <th>Contact</th>
                <th>Location</th>
                <th>GST Number</th>
                <th>Inquiries</th>
                <th>Orders</th>
                <th className="text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="empty-table-cell">
                    No customers found matching &ldquo;{search}&rdquo;.
                  </td>
                </tr>
              ) : (
                filtered.map((c) => (
                  <tr key={c.id}>
                    <td>
                      <strong className="cust-name">{c.name}</strong>
                    </td>
                    <td>
                      <span>{c.companyName || 'Individual Trader'}</span>
                    </td>
                    <td>
                      <div>
                        <span>{c.phone}</span>
                        {c.email && !c.email.includes('.internal') && (
                          <small className="block-type">{c.email}</small>
                        )}
                      </div>
                    </td>
                    <td>
                      <span>{c.city ? `${c.city}, ${c.state || ''}` : 'India'}</span>
                    </td>
                    <td>
                      <span className="mono-code">{c.gstNumber || 'Unregistered'}</span>
                    </td>
                    <td>
                      <span className="badge badge-info">{c.totalEnquiries || 0}</span>
                    </td>
                    <td>
                      <span className="badge badge-success">{c.totalOrders || 0}</span>
                    </td>
                    <td className="text-right">
                      <button
                        type="button"
                        className="btn-icon"
                        title="View Customer Dossier"
                        onClick={() => setSelectedCust(c)}
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

      {/* CUSTOMER DOSSIER MODAL */}
      {selectedCust && (
        <div className="modal-backdrop" onClick={() => setSelectedCust(null)}>
          <div className="admin-modal-card wide" onClick={(e) => e.stopPropagation()}>
            <div className="admin-modal-header">
              <div>
                <span className="modal-sub-label">CLIENT DOSSIER</span>
                <h3 className="modal-title">{selectedCust.name}</h3>
              </div>
              <button
                type="button"
                className="close-drawer-btn"
                onClick={() => setSelectedCust(null)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="admin-modal-body">
              {/* CONTACT DETAILS */}
              <div className="modal-info-grid">
                <div className="info-block">
                  <span className="info-label">Company Name</span>
                  <strong className="info-val">{selectedCust.companyName || 'Individual / Bespoke'}</strong>
                </div>

                <div className="info-block">
                  <span className="info-label">Phone / WhatsApp</span>
                  <div className="info-contact-row">
                    <span className="info-val">{selectedCust.phone}</span>
                    <a
                      href={`https://wa.me/${selectedCust.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
                        `Hello ${selectedCust.name}, this is Royal Edge Enterprises.`
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
                  <span className="info-val">{selectedCust.email}</span>
                </div>

                <div className="info-block">
                  <span className="info-label">GST Identification</span>
                  <span className="mono-code">{selectedCust.gstNumber || 'Not provided'}</span>
                </div>
              </div>

              {selectedCust.address && (
                <div className="modal-req-card">
                  <span className="info-label">Registered Commercial Address:</span>
                  <p className="customer-msg-text">
                    {selectedCust.address}, {selectedCust.city}, {selectedCust.state} - {selectedCust.pincode}
                  </p>
                </div>
              )}

              {/* INQUIRY HISTORY */}
              <div className="builder-header" style={{ marginTop: '20px' }}>
                <h4 className="builder-title">Inquiry History ({customerEnquiries.length})</h4>
              </div>

              {customerEnquiries.length === 0 ? (
                <p className="empty-subtext">No inquiries recorded yet for this client.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="builder-table">
                    <thead>
                      <tr>
                        <th>Enquiry #</th>
                        <th>Category</th>
                        <th>Volume</th>
                        <th>Date</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerEnquiries.map((enq) => (
                        <tr key={enq.id}>
                          <td><strong>{enq.enquiryNumber}</strong></td>
                          <td>{enq.category}</td>
                          <td>{enq.quantity} {enq.unit}</td>
                          <td>{enq.createdAt.split('T')[0]}</td>
                          <td>
                            <span className="badge badge-info">{enq.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CONFIRMED ORDERS */}
              <div className="builder-header" style={{ marginTop: '25px' }}>
                <h4 className="builder-title">Confirmed Orders ({customerOrders.length})</h4>
              </div>

              {customerOrders.length === 0 ? (
                <p className="empty-subtext">No confirmed orders converted yet.</p>
              ) : (
                <div className="admin-table-wrap">
                  <table className="builder-table">
                    <thead>
                      <tr>
                        <th>Order #</th>
                        <th>Quote Ref</th>
                        <th>Amount</th>
                        <th>Order Status</th>
                        <th>Payment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customerOrders.map((ord) => (
                        <tr key={ord.id}>
                          <td><strong>{ord.orderNumber}</strong></td>
                          <td>{ord.quotationNumber}</td>
                          <td>₹{ord.totalAmount.toFixed(2)}</td>
                          <td>
                            <span className="badge badge-success">{ord.orderStatus}</span>
                          </td>
                          <td>{ord.paymentStatus}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="admin-modal-footer">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setSelectedCust(null)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
