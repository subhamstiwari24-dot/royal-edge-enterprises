import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, ShieldCheck, CheckCircle2, ChevronRight } from 'lucide-react';
import { useCart } from '../../context/useCart';
import { COMPANY_INFO } from '../../data/initialData';

interface CartDrawerProps {
  onProceedToCheckout?: () => void;
  onRequestQuote?: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onRequestQuote }) => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    totalItems,
  } = useCart();

  const [checkoutStep, setCheckoutStep] = useState<'cart' | 'checkout' | 'success'>('cart');
  const [buyerName, setBuyerName] = useState('');
  const [buyerPhone, setBuyerPhone] = useState('');
  const [buyerCompany, setBuyerCompany] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'BANK_TRANSFER' | 'CHEQUE' | 'COD'>('BANK_TRANSFER');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderRef, setOrderRef] = useState('');

  if (!isCartOpen) return null;

  const handleCreateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerName || !buyerPhone) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const generatedNum = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
      setOrderRef(generatedNum);
      setIsSubmitting(false);
      setCheckoutStep('success');
    }, 600);
  };

  return (
    <div className="cart-drawer-overlay" onClick={closeCart}>
      <div className="cart-drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* HEADER */}
        <div className="cart-drawer-header">
          <div className="cart-header-title-box">
            <span className="cart-tag">FACTORY DIRECT</span>
            <h3 className="cart-heading">Your Order & Quote Draft</h3>
          </div>
          <button
            type="button"
            className="cart-close-btn"
            onClick={closeCart}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* CONTENT */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <ShoppingBag size={48} strokeWidth={1.5} />
              </div>
              <h4 className="cart-empty-title">Your Order Draft is Empty</h4>
              <p className="cart-empty-desc">
                Browse our manufacturing catalogue of collar interlinings, belt rolls, and embroidery backing rolls.
              </p>
              <button
                type="button"
                className="btn-primary"
                onClick={() => {
                  closeCart();
                  const el = document.getElementById('products');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Browse Product Catalogue
              </button>
            </div>
          ) : checkoutStep === 'cart' ? (
            <>
              {/* ORDER & QUOTATION BANNER (Replaces Price Savings) */}
              <div className="cart-savings-banner">
                <CheckCircle2 size={16} className="text-teal" />
                <span>
                  Official factory quotation draft. Direct B2B rates and dispatch timeline provided on submission.
                </span>
              </div>

              {/* ITEM LIST */}
              <div className="cart-items-list">
                {items.map((item) => {
                  const pricing = item.wholesalePrice
                    ? { retailPrice: item.retailPrice, wholesalePrice: item.wholesalePrice, moq: item.product.minimumOrderQuantity || 100 }
                    : { retailPrice: item.unitPrice, wholesalePrice: item.unitPrice, moq: 100 };
                  const needsMoreForMoq = item.quantity < pricing.moq;

                  return (
                    <div key={`${item.product.id}-${item.selectedWidth || 'std'}`} className="cart-item-card">
                      <div className="cart-item-img-wrapper">
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                      <div className="cart-item-details">
                        <div className="cart-item-head">
                          <span className="cart-item-category">{item.product.category}</span>
                          <button
                            type="button"
                            className="cart-item-remove-btn"
                            onClick={() => removeFromCart(item.product.id)}
                            title="Remove product"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                        <h4 className="cart-item-name">{item.product.name}</h4>
                        {item.selectedWidth && (
                          <div className="cart-item-spec">Width: {item.selectedWidth}</div>
                        )}

                        <div className="cart-item-price-row">
                          <div className="cart-price-info">
                            <span className="cart-unit-price text-gold">Price on Request</span>
                            <span className="cart-tier-badge wholesale">MOQ: {pricing.moq} {item.product.unit}</span>
                          </div>

                          {/* QUANTITY CONTROLS */}
                          <div className="cart-qty-control">
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuantity(item.product.id, parseInt(e.target.value) || 1)
                              }
                            />
                            <button
                              type="button"
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {needsMoreForMoq && (
                          <div className="cart-moq-hint">
                            Wholesale batch benchmark: {pricing.moq} {item.product.unit} (Current: {item.quantity} {item.product.unit})
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          ) : checkoutStep === 'checkout' ? (
            /* EXPRESS CHECKOUT / ORDER SUBMISSION FORM */
            <form onSubmit={handleCreateOrder} className="cart-checkout-form">
              <div className="checkout-step-intro">
                <h4>Dispatch & Billing Details</h4>
                <p>Submit your delivery details for GST invoicing and transport allocation.</p>
              </div>

              <div className="form-group">
                <label>Contact Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Patel"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. +91 98200 12345"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Company / Firm Name (Optional for GST)</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Apparels Pvt Ltd"
                  value={buyerCompany}
                  onChange={(e) => setBuyerCompany(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Shipping / Factory Address *</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Full delivery address, City, Pincode"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label>Payment Preference</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value as any)}
                >
                  <option value="BANK_TRANSFER">Direct RTGS / NEFT (Standard)</option>
                  <option value="CHEQUE">Corporate Cheque (Existing Clients)</option>
                  <option value="COD">Cash on Delivery / Transporter Pay</option>
                </select>
              </div>

              <div className="checkout-btn-row">
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => setCheckoutStep('cart')}
                >
                  Back to Draft
                </button>
                <button type="submit" className="btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? 'Confirming...' : 'Place Official Order'}
                </button>
              </div>
            </form>
          ) : (
            /* ORDER SUCCESS */
            <div className="cart-success-view">
              <div className="success-icon-wrap">
                <CheckCircle2 size={54} color="#B18A45" />
              </div>
              <h3>Order Draft Registered</h3>
              <p className="order-num-tag">{orderRef}</p>
              <p className="success-msg">
                Thank you, <strong>{buyerName}</strong>. Our Chembur dispatch team will verify batch stock and send the proforma GST invoice to <strong>{buyerPhone}</strong>.
              </p>
              <div className="success-actions">
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsappNumber}?text=${encodeURIComponent(
                    `Hello Royal Edge, I just registered order ${orderRef} for ${buyerName}. Please confirm dispatch timeline.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-primary"
                >
                  Verify via WhatsApp
                </a>
                <button
                  type="button"
                  className="btn-secondary"
                  onClick={() => {
                    setCheckoutStep('cart');
                    closeCart();
                  }}
                >
                  Continue Browsing
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER TOTALS & CTA */}
        {items.length > 0 && checkoutStep === 'cart' && (
          <div className="cart-drawer-footer">
            <div className="cart-summary-line">
              <span>Total Quantity:</span>
              <strong>{totalItems} units</strong>
            </div>
            <div className="cart-summary-line">
              <span>Commercial Terms:</span>
              <strong className="cart-total-price">Price on Request</strong>
            </div>
            <div className="cart-tax-notice">
              *Proforma invoice with custom factory rates, 5% textile GST, and freight generated upon submission.
            </div>

            <div className="cart-action-buttons">
              <button
                type="button"
                className="btn-primary cart-checkout-action"
                onClick={() => setCheckoutStep('checkout')}
              >
                <span>Request Quotation & Dispatch</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                className="btn-secondary cart-quote-action"
                onClick={() => {
                  closeCart();
                  if (onRequestQuote) {
                    onRequestQuote();
                  } else {
                    const el = document.getElementById('enquiry');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>Request Custom Bulk Quote</span>
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="cart-footer-trust">
              <ShieldCheck size={14} />
              <span>Direct Manufacturer Guarantee • Chembur, Mumbai</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
