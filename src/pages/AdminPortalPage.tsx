import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { AdminLayout } from '../components/admin/AdminLayout';
import type { AdminTab } from '../components/admin/AdminLayout';
import { AdminOverview } from '../components/admin/AdminOverview';
import { ProductManagement } from '../components/admin/ProductManagement';
import { EnquiryManagement } from '../components/admin/EnquiryManagement';
import { QuotationManagement } from '../components/admin/QuotationManagement';
import { OrderManagement } from '../components/admin/OrderManagement';
import { CustomerManagement } from '../components/admin/CustomerManagement';
import type {
  AdminProduct,
  Customer,
  Enquiry,
  Quotation,
  CustomerOrder,
} from '../types';
import { royalEdgeService } from '../services/api';

export const AdminPortalPage: React.FC = () => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() =>
    royalEdgeService.isAdminAuthenticated()
  );

  const [currentTab, setCurrentTab] = useState<AdminTab>('overview');

  // Domain data
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [orders, setOrders] = useState<CustomerOrder[]>([]);

  // Cross-component triggers
  const [prefillEnquiry, setPrefillEnquiry] = useState<Enquiry | null>(null);
  const [isProductCreateOpen, setIsProductCreateOpen] = useState(false);
  const [isQuoteCreateOpen, setIsQuoteCreateOpen] = useState(false);

  const loadData = useCallback(() => {
    Promise.all([
      royalEdgeService.getAdminProducts(),
      royalEdgeService.getCustomers(),
      royalEdgeService.getEnquiries(),
      royalEdgeService.getQuotations(),
      royalEdgeService.getOrders(),
    ])
      .then(([prods, custs, enqs, quotes, ords]) => {
        setProducts(prods);
        setCustomers(custs);
        setEnquiries(enqs);
        setQuotations(quotes);
        setOrders(ords);
      })
      .catch((err) => {
        console.error('Failed to load admin data:', err);
      });
  }, []);

  useEffect(() => {
    let active = true;

    if (isAuthenticated) {
      Promise.all([
        royalEdgeService.getAdminProducts(),
        royalEdgeService.getCustomers(),
        royalEdgeService.getEnquiries(),
        royalEdgeService.getQuotations(),
        royalEdgeService.getOrders(),
      ])
        .then(([prods, custs, enqs, quotes, ords]) => {
          if (!active) return;

          setProducts(prods);
          setCustomers(custs);
          setEnquiries(enqs);
          setQuotations(quotes);
          setOrders(ords);
        })
        .catch((err) => {
          console.error('Failed to load admin data:', err);
        });
    }

    return () => {
      active = false;
    };
  }, [isAuthenticated]);

  const handleLogout = () => {
    royalEdgeService.adminLogout();
    setIsAuthenticated(false);
    navigate('/admin/login', { replace: true });
  };

  // Workflow Handlers
  const handleOpenCreateQuotationForEnquiry = (enquiry: Enquiry) => {
    setPrefillEnquiry(enquiry);
    setCurrentTab('quotations');
  };

  const handleNavigateToOrders = () => {
    setCurrentTab('orders');
    loadData();
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const pendingEnquiries = enquiries.filter(
    (e) => e.status === 'NEW' || e.status === 'UNDER_REVIEW'
  );

  const activeQuotes = quotations.filter(
    (q) => q.status === 'SENT' || q.status === 'DRAFT'
  );

  return (
    <AdminLayout
      currentTab={currentTab}
      onSelectTab={setCurrentTab}
      onLogout={handleLogout}
      pendingEnquiryCount={pendingEnquiries.length}
      activeQuoteCount={activeQuotes.length}
    >
      {currentTab === 'overview' && (
        <AdminOverview
          products={products}
          customers={customers}
          enquiries={enquiries}
          quotations={quotations}
          orders={orders}
          onNavigateTab={setCurrentTab}
          onOpenNewProductModal={() => {
            setCurrentTab('products');
            setIsProductCreateOpen(true);
          }}
          onOpenNewQuoteModal={() => {
            setCurrentTab('quotations');
            setIsQuoteCreateOpen(true);
          }}
        />
      )}

      {currentTab === 'products' && (
        <ProductManagement
          products={products}
          onRefresh={loadData}
          isCreateModalOpen={isProductCreateOpen}
          onCloseCreateModal={() => setIsProductCreateOpen(false)}
        />
      )}

      {currentTab === 'enquiries' && (
        <EnquiryManagement
          enquiries={enquiries}
          products={products}
          onRefresh={loadData}
          onOpenCreateQuotationForEnquiry={
            handleOpenCreateQuotationForEnquiry
          }
        />
      )}

      {currentTab === 'quotations' && (
        <QuotationManagement
          quotations={quotations}
          products={products}
          customers={customers}
          onRefresh={loadData}
          prefillEnquiry={prefillEnquiry}
          onClearPrefillEnquiry={() => setPrefillEnquiry(null)}
          isCreateModalOpen={isQuoteCreateOpen}
          onCloseCreateModal={() => setIsQuoteCreateOpen(false)}
          onNavigateToOrders={handleNavigateToOrders}
        />
      )}

      {currentTab === 'orders' && (
        <OrderManagement
          orders={orders}
          onRefresh={loadData}
        />
      )}

      {currentTab === 'customers' && (
        <CustomerManagement
          customers={customers}
          enquiries={enquiries}
          orders={orders}
        />
      )}
    </AdminLayout>
  );
};