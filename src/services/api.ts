import type {
  AdminProduct,
  PublicProduct,
  Enquiry,
  Customer,
  Quotation,
  CustomerOrder,
  EnquiryStatus,
  EnquiryFilterParams,
  PaginatedResponse,
  QuotationStatus,
  OrderStatus,
  PaymentStatus,
  PaymentMethod,
} from '../types';
import { canTransitionEnquiryStatus } from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CUSTOMERS,
  INITIAL_ENQUIRIES,
  INITIAL_QUOTATIONS,
  INITIAL_ORDERS,
} from '../data/initialData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

export interface AdminSession {
  authenticated: boolean;
  token: string;
  username: string;
  role: 'ROLE_ADMIN';
  expiresAt: number;
}

const STORAGE_KEYS = {
  PRODUCTS: 'royal_edge_products_v1',
  ENQUIRIES: 'royal_edge_enquiries_v1',
  CUSTOMERS: 'royal_edge_customers_v1',
  QUOTATIONS: 'royal_edge_quotations_v1',
  ORDERS: 'royal_edge_orders_v1',
  ADMIN_AUTH: 'royal_edge_admin_auth_v1',
  ADMIN_SESSION: 'royal_edge_admin_session_v2',
};

// Safe storage accessors
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw) as T;
  } catch {
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('LocalStorage save failed:', err);
  }
}

// Strip internal pricing for public consumption
function sanitizeToPublicProduct(p: AdminProduct): PublicProduct {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { retailPrice, wholesalePrice, costPrice, stockQuantity, ...publicFields } = p;
  return publicFields;
}

export const royalEdgeService = {
  // ==========================================
  // PRODUCTS (PUBLIC & ADMIN)
  // ==========================================

  assertAdminAccess(): void {
    if (!this.isAdminAuthenticated()) {
      throw new Error('403 Forbidden: Administrative authentication and ROLE_ADMIN authorization required.');
    }
  },

  async getPublicProducts(): Promise<PublicProduct[]> {
    // Try backend if reachable, otherwise use validated local store
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1200);
      const res = await fetch(`${API_BASE_URL}/products`, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (res.ok) {
        const backendProducts = await res.json();
        if (Array.isArray(backendProducts) && backendProducts.length > 0) {
          // Sanitize backend response to guarantee no pricing leak in public catalogue
          return backendProducts
            .filter((p: { active?: boolean }) => p.active !== false)
            .map((p: AdminProduct) => sanitizeToPublicProduct(p));
        }
      }
    } catch {
      // Backend unavailable; seamlessly use persisted local catalog
    }

    const all = loadFromStorage<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    return all.filter((p) => p.active).map(sanitizeToPublicProduct);
  },

  async getPublicProductById(id: number): Promise<PublicProduct | null> {
    const products = await this.getPublicProducts();
    return products.find((p) => p.id === id) || null;
  },

  async getAdminProducts(): Promise<AdminProduct[]> {
    this.assertAdminAccess();
    return loadFromStorage<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
  },

  async saveAdminProduct(productData: Partial<AdminProduct>): Promise<AdminProduct> {
    this.assertAdminAccess();
    const products = loadFromStorage<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);

    if (productData.id) {
      // Update existing
      const index = products.findIndex((p) => p.id === productData.id);
      if (index === -1) throw new Error(`Product with ID ${productData.id} not found.`);

      const updated: AdminProduct = {
        ...products[index],
        ...productData,
        updatedAt: new Date().toISOString(),
      } as AdminProduct;

      products[index] = updated;
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return updated;
    } else {
      // Create new
      const nextId = Math.max(0, ...products.map((p) => p.id)) + 1;
      const newProduct: AdminProduct = {
        id: nextId,
        name: productData.name || 'Untitled Product',
        category: productData.category || 'Fusible Elastic',
        description: productData.description || '',
        imageUrl: productData.imageUrl || 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
        unit: productData.unit || 'Meters',
        minimumOrderQuantity: Number(productData.minimumOrderQuantity) || 100,
        active: productData.active ?? true,
        featured: Boolean(productData.featured),
        sku: productData.sku || `RE-PR-${nextId.toString().padStart(2, '0')}`,
        retailPrice: Number(productData.retailPrice) || 0,
        wholesalePrice: Number(productData.wholesalePrice) || 0,
        costPrice: Number(productData.costPrice) || 0,
        stockQuantity: Number(productData.stockQuantity) || 0,
        specifications: productData.specifications || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      products.unshift(newProduct);
      saveToStorage(STORAGE_KEYS.PRODUCTS, products);
      return newProduct;
    }
  },

  async toggleProductActive(id: number): Promise<AdminProduct> {
    this.assertAdminAccess();
    const products = loadFromStorage<AdminProduct[]>(STORAGE_KEYS.PRODUCTS, INITIAL_PRODUCTS);
    const item = products.find((p) => p.id === id);
    if (!item) throw new Error(`Product ${id} not found.`);
    item.active = !item.active;
    item.updatedAt = new Date().toISOString();
    saveToStorage(STORAGE_KEYS.PRODUCTS, products);
    return item;
  },

  // ==========================================
  // ENQUIRIES
  // ==========================================

  async submitEnquiry(enquiryInput: Omit<Enquiry, 'id' | 'enquiryNumber' | 'status' | 'createdAt'>): Promise<{
    success: boolean;
    enquiryNumber: string;
    enquiry: Enquiry;
  }> {
    // Validate required fields
    if (!enquiryInput.customerName?.trim()) {
      throw new Error('Please enter your full name.');
    }
    if (!enquiryInput.phone?.trim()) {
      throw new Error('Please enter a valid contact phone number.');
    }
    const cleanPhone = enquiryInput.phone.replace(/[\s-]/g, '');
    if (cleanPhone.length < 8) {
      throw new Error('Phone number must contain at least 8 digits.');
    }
    if (!enquiryInput.category) {
      throw new Error('Please select a product category.');
    }
    if (!enquiryInput.quantity || enquiryInput.quantity <= 0) {
      throw new Error('Please enter a valid requested quantity.');
    }

    const enquiries = loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const nextSeq = 1000 + enquiries.length + 1;
    const enquiryNumber = `ENQ-2026-${nextSeq}`;

    const newEnquiry: Enquiry = {
      ...enquiryInput,
      id: Date.now(),
      enquiryNumber,
      status: 'NEW',
      createdAt: new Date().toISOString(),
    };

    enquiries.unshift(newEnquiry);
    saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);

    // Also auto-record or update customer record for CRM centralization
    try {
      await this.upsertCustomerFromEnquiry(newEnquiry);
    } catch {
      // non-fatal
    }

    return {
      success: true,
      enquiryNumber,
      enquiry: newEnquiry,
    };
  },

  mapBackendEnquiry(item: any): Enquiry {
    return {
      id: item.id,
      enquiryNumber: item.enquiryNumber,
      customerId: item.customerId,
      customerName: item.customerName,
      companyName: item.companyName || '',
      phone: item.customerPhone || item.phone || '',
      email: item.customerEmail || item.email || '',
      customerPhone: item.customerPhone || item.phone || '',
      customerEmail: item.customerEmail || item.email || '',
      category: item.productCategory || item.category || 'Fusible Elastic',
      productCategory: item.productCategory || item.category,
      productName: item.productName || 'Unspecified Product',
      productId: item.productId,
      quantity: item.quantity,
      unit: item.unit || 'Meters',
      enquiryType: item.enquiryType || 'BULK',
      message: item.customerMessage || item.message || '',
      customerMessage: item.customerMessage || item.message || '',
      preferredContact: (item.preferredContactMethod || item.preferredContact || 'PHONE') as any,
      preferredContactMethod: item.preferredContactMethod || item.preferredContact || 'PHONE',
      status: item.status,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      adminNotes: item.adminNotes || item.remarks || '',
    };
  },

  async getEnquiries(): Promise<Enquiry[]> {
    this.assertAdminAccess();
    const token = this.getAdminSession()?.token;

    // 1. Attempt backend fetch if authenticated and server is reachable
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries?size=100`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error('401_UNAUTHORIZED');
      }

      if (res.ok) {
        const pageData = await res.json();
        if (pageData && Array.isArray(pageData.content)) {
          return pageData.content.map((it: any) => this.mapBackendEnquiry(it));
        }
      }
    } catch (err: any) {
      if (err.message === '401_UNAUTHORIZED') throw err;
      // Backend unavailable; fallback to storage
    }

    return loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
  },

  async getEnquiriesPage(params: EnquiryFilterParams = {}): Promise<PaginatedResponse<Enquiry>> {
    this.assertAdminAccess();
    const token = this.getAdminSession()?.token;

    // 1. Attempt backend fetch via GET /api/admin/enquiries
    try {
      const q = new URLSearchParams();
      if (params.search?.trim()) q.set('search', params.search.trim());
      if (params.status && params.status !== 'All') q.set('status', params.status);
      if (params.productId) q.set('productId', params.productId.toString());
      if (params.startDate) q.set('startDate', params.startDate);
      if (params.endDate) q.set('endDate', params.endDate);
      if (params.page !== undefined) q.set('page', params.page.toString());
      if (params.size !== undefined) q.set('size', params.size.toString());
      if (params.sort) q.set('sort', params.sort);

      const qs = q.toString();
      const res = await fetch(`${API_BASE_URL}/admin/enquiries${qs ? `?${qs}` : ''}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error('401_UNAUTHORIZED');
      }

      if (res.ok) {
        const data = await res.json();
        const mapped = (data.content || []).map((it: any) => this.mapBackendEnquiry(it));
        return {
          content: mapped,
          totalElements: data.totalElements ?? mapped.length,
          totalPages: data.totalPages ?? 1,
          size: data.size ?? (params.size || 20),
          number: data.number ?? 0,
          first: data.first ?? true,
          last: data.last ?? true,
          empty: data.empty ?? mapped.length === 0,
        };
      }
    } catch (err: any) {
      if (err.message === '401_UNAUTHORIZED') throw err;
      console.warn('Backend /api/admin/enquiries not reachable, falling back to local query:', err);
    }

    // 2. Local resilient fallback
    const all = loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    let filtered = [...all];

    if (params.status && params.status !== 'All') {
      filtered = filtered.filter((e) => e.status === params.status);
    }

    if (params.productId) {
      filtered = filtered.filter((e) => e.productId === Number(params.productId));
    }

    if (params.startDate) {
      const startIso = `${params.startDate}T00:00:00`;
      filtered = filtered.filter((e) => e.createdAt >= startIso);
    }

    if (params.endDate) {
      const endIso = `${params.endDate}T23:59:59`;
      filtered = filtered.filter((e) => e.createdAt <= endIso);
    }

    if (params.search?.trim()) {
      const s = params.search.trim().toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.enquiryNumber.toLowerCase().includes(s) ||
          e.customerName.toLowerCase().includes(s) ||
          e.phone.includes(s) ||
          (e.companyName && e.companyName.toLowerCase().includes(s)) ||
          (e.productName && e.productName.toLowerCase().includes(s))
      );
    }

    // Sort by createdAt desc
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const pageSize = params.size || 20;
    const pageNum = params.page || 0;
    const totalElements = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalElements / pageSize));
    const startIdx = pageNum * pageSize;
    const content = filtered.slice(startIdx, startIdx + pageSize);

    return {
      content,
      totalElements,
      totalPages,
      size: pageSize,
      number: pageNum,
      first: pageNum === 0,
      last: pageNum >= totalPages - 1,
      empty: content.length === 0,
    };
  },

  async getEnquiryById(id: number): Promise<Enquiry> {
    this.assertAdminAccess();
    const token = this.getAdminSession()?.token;

    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${id}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error('401_UNAUTHORIZED');
      }

      if (res.ok) {
        const data = await res.json();
        return this.mapBackendEnquiry(data);
      }
    } catch (err: any) {
      if (err.message === '401_UNAUTHORIZED') throw err;
      console.warn(`Backend /api/admin/enquiries/${id} error, fallback to local storage:`, err);
    }

    const enquiries = loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const target = enquiries.find((e) => e.id === id);
    if (!target) throw new Error(`Enquiry ${id} not found.`);
    return target;
  },

  async updateEnquiryStatus(id: number, status: EnquiryStatus, adminNotes?: string): Promise<Enquiry> {
    this.assertAdminAccess();
    const token = this.getAdminSession()?.token;

    // 1. Attempt backend update via PUT /api/admin/enquiries/{id}/status
    try {
      const res = await fetch(`${API_BASE_URL}/admin/enquiries/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          status,
          remarks: adminNotes?.trim() || undefined,
        }),
      });

      if (res.status === 401 || res.status === 403) {
        throw new Error('401_UNAUTHORIZED');
      }

      if (res.ok) {
        const data = await res.json();
        const updated = this.mapBackendEnquiry(data);
        // Sync local storage
        const enquiries = loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
        const idx = enquiries.findIndex((e) => e.id === id);
        if (idx !== -1) {
          enquiries[idx] = updated;
          saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);
        }
        return updated;
      } else {
        const errorData = await res.json().catch(() => null);
        const msg = errorData?.message || `Status update rejected (${res.status})`;
        throw new Error(msg);
      }
    } catch (err: any) {
      // Re-throw validation/unauthorized errors
      if (err.message && (err.message.includes('transition') || err.message === '401_UNAUTHORIZED' || err.message.startsWith('Invalid status transition'))) {
        throw err;
      }
      console.warn('Backend status update offline, applying locally with validation:', err);
    }

    // 2. Local transition validation and update
    const enquiries = loadFromStorage<Enquiry[]>(STORAGE_KEYS.ENQUIRIES, INITIAL_ENQUIRIES);
    const target = enquiries.find((e) => e.id === id);
    if (!target) throw new Error(`Enquiry ${id} not found.`);

    if (!canTransitionEnquiryStatus(target.status, status)) {
      throw new Error(`Invalid status transition from ${target.status} to ${status}.`);
    }

    target.status = status;
    if (adminNotes !== undefined) {
      target.adminNotes = adminNotes;
    }
    saveToStorage(STORAGE_KEYS.ENQUIRIES, enquiries);
    return target;
  },

  // ==========================================
  // CUSTOMERS
  // ==========================================

  async getCustomers(): Promise<Customer[]> {
    this.assertAdminAccess();
    return loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
  },

  async upsertCustomerFromEnquiry(enquiry: Enquiry): Promise<Customer> {
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const existing = customers.find(
      (c) =>
        c.phone.replace(/\D/g, '') === enquiry.phone.replace(/\D/g, '') ||
        (enquiry.email && c.email.toLowerCase() === enquiry.email.toLowerCase())
    );

    if (existing) {
      existing.totalEnquiries = (existing.totalEnquiries || 0) + 1;
      if (enquiry.companyName && !existing.companyName) {
        existing.companyName = enquiry.companyName;
      }
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return existing;
    }

    const newCustomer: Customer = {
      id: Date.now(),
      name: enquiry.customerName,
      companyName: enquiry.companyName || '',
      email: enquiry.email || `${enquiry.phone.replace(/\D/g, '')}@client.royaledge.internal`,
      phone: enquiry.phone,
      createdAt: new Date().toISOString(),
      totalEnquiries: 1,
      totalOrders: 0,
    };

    customers.unshift(newCustomer);
    saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    return newCustomer;
  },

  async saveCustomer(customerData: Partial<Customer>): Promise<Customer> {
    this.assertAdminAccess();
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    if (customerData.id) {
      const idx = customers.findIndex((c) => c.id === customerData.id);
      if (idx === -1) throw new Error('Customer not found');
      customers[idx] = { ...customers[idx], ...customerData };
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return customers[idx];
    } else {
      const newCust: Customer = {
        id: Date.now(),
        name: customerData.name || 'New Client',
        companyName: customerData.companyName || '',
        email: customerData.email || '',
        phone: customerData.phone || '',
        address: customerData.address || '',
        city: customerData.city || '',
        state: customerData.state || '',
        pincode: customerData.pincode || '',
        gstNumber: customerData.gstNumber || '',
        createdAt: new Date().toISOString(),
        totalEnquiries: 0,
        totalOrders: 0,
      };
      customers.unshift(newCust);
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
      return newCust;
    }
  },

  // ==========================================
  // PRIVATE QUOTATIONS
  // ==========================================

  async getQuotations(): Promise<Quotation[]> {
    this.assertAdminAccess();
    return loadFromStorage<Quotation[]>(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
  },

  async createQuotation(data: Omit<Quotation, 'id' | 'quotationNumber' | 'createdAt'>): Promise<Quotation> {
    this.assertAdminAccess();
    const quotations = loadFromStorage<Quotation[]>(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
    const seq = 40 + quotations.length + 1;
    const quotationNumber = `QUO-2026-${seq.toString().padStart(4, '0')}`;

    const newQuotation: Quotation = {
      ...data,
      id: Date.now(),
      quotationNumber,
      createdAt: new Date().toISOString(),
    };

    quotations.unshift(newQuotation);
    saveToStorage(STORAGE_KEYS.QUOTATIONS, quotations);

    // If linked to an enquiry, update enquiry status to QUOTATION_PREPARED
    if (data.enquiryId) {
      await this.updateEnquiryStatus(
        data.enquiryId,
        'QUOTATION_PREPARED',
        `Quotation ${quotationNumber} prepared on ${new Date().toLocaleDateString('en-IN')}`
      );
    }

    return newQuotation;
  },

  async updateQuotationStatus(id: number, status: QuotationStatus): Promise<Quotation> {
    this.assertAdminAccess();
    const quotations = loadFromStorage<Quotation[]>(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
    const quote = quotations.find((q) => q.id === id);
    if (!quote) throw new Error('Quotation not found');
    quote.status = status;
    saveToStorage(STORAGE_KEYS.QUOTATIONS, quotations);
    return quote;
  },

  // ==========================================
  // ORDER MANAGEMENT
  // ==========================================

  async getOrders(): Promise<CustomerOrder[]> {
    this.assertAdminAccess();
    return loadFromStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
  },

  async convertQuotationToOrder(
    quotationId: number,
    shippingAddress: string,
    paymentMethod: PaymentMethod
  ): Promise<CustomerOrder> {
    this.assertAdminAccess();
    const quotations = loadFromStorage<Quotation[]>(STORAGE_KEYS.QUOTATIONS, INITIAL_QUOTATIONS);
    const quote = quotations.find((q) => q.id === quotationId);
    if (!quote) throw new Error(`Quotation ${quotationId} not found.`);

    // Update quote status to ACCEPTED
    quote.status = 'ACCEPTED';
    saveToStorage(STORAGE_KEYS.QUOTATIONS, quotations);

    const orders = loadFromStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const orderSeq = 12 + orders.length + 1;
    const orderNumber = `ORD-2026-${orderSeq.toString().padStart(4, '0')}`;

    const newOrder: CustomerOrder = {
      id: Date.now(),
      orderNumber,
      quotationId: quote.id,
      quotationNumber: quote.quotationNumber,
      customerId: quote.customerId,
      customerName: quote.customerName,
      companyName: quote.companyName,
      customerPhone: quote.customerPhone,
      customerEmail: quote.customerEmail,
      shippingAddress: shippingAddress || 'Standard Delivery to Business Address',
      paymentMethod: paymentMethod || 'BANK_TRANSFER',
      paymentStatus: 'PENDING',
      orderStatus: 'PENDING',
      totalAmount: quote.totalAmount,
      items: quote.items.map((it) => ({
        id: it.id,
        productId: it.productId,
        productName: it.productName,
        category: it.category,
        quantity: it.quantity,
        unit: it.unit,
        unitPrice: it.unitPrice,
        subtotal: it.subtotal,
      })),
      createdAt: new Date().toISOString(),
      notes: `Generated from accepted quotation ${quote.quotationNumber}`,
    };

    orders.unshift(newOrder);
    saveToStorage(STORAGE_KEYS.ORDERS, orders);

    // If linked to an enquiry, update enquiry status to ACCEPTED
    if (quote.enquiryId) {
      await this.updateEnquiryStatus(
        quote.enquiryId,
        'ACCEPTED',
        `Quotation accepted. Confirmed order ${orderNumber} created.`
      );
    }

    // Update customer totalOrders count
    const customers = loadFromStorage<Customer[]>(STORAGE_KEYS.CUSTOMERS, INITIAL_CUSTOMERS);
    const cust = customers.find((c) => c.id === quote.customerId);
    if (cust) {
      cust.totalOrders = (cust.totalOrders || 0) + 1;
      saveToStorage(STORAGE_KEYS.CUSTOMERS, customers);
    }

    return newOrder;
  },

  async updateOrderStatus(
    orderId: number,
    orderStatus: OrderStatus,
    paymentStatus?: PaymentStatus,
    trackingNumber?: string,
    notes?: string
  ): Promise<CustomerOrder> {
    this.assertAdminAccess();
    const orders = loadFromStorage<CustomerOrder[]>(STORAGE_KEYS.ORDERS, INITIAL_ORDERS);
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    order.orderStatus = orderStatus;
    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;
    if (notes !== undefined) order.notes = notes;
    saveToStorage(STORAGE_KEYS.ORDERS, orders);
    return order;
  },

  // ==========================================
  // ADMIN AUTHENTICATION & ROLE-BASED ACCESS
  // ==========================================

  getAdminSession(): AdminSession | null {
    const session = loadFromStorage<AdminSession | null>(STORAGE_KEYS.ADMIN_SESSION, null);
    if (!session || !session.authenticated) return null;
    if (Date.now() > session.expiresAt) {
      this.adminLogout();
      return null;
    }
    return session;
  },

  isAdminAuthenticated(): boolean {
    const session = this.getAdminSession();
    return Boolean(session && session.authenticated && session.role === 'ROLE_ADMIN');
  },

  getAdminRole(): string | null {
    const session = this.getAdminSession();
    return session ? session.role : null;
  },

  async adminLogin(
    password: string,
    username = 'admin'
  ): Promise<{ success: boolean; token?: string; error?: string }> {
    // 1. Attempt backend independent authentication if API endpoint is online
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 1500);
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
        signal: controller.signal,
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        const session: AdminSession = {
          authenticated: true,
          token: data.token || `RE-BEARER-${Date.now()}`,
          username: data.username || username,
          role: 'ROLE_ADMIN',
          expiresAt: Date.now() + (data.expiresIn ? data.expiresIn * 1000 : 12 * 3600 * 1000),
        };
        saveToStorage(STORAGE_KEYS.ADMIN_SESSION, session);
        return { success: true, token: session.token };
      } else if (res.status === 401 || res.status === 403) {
        return { success: false, error: 'Invalid administrator credentials.' };
      }
    } catch {
      // Backend not running; proceed with verified local authentication
    }

    // 2. Verified admin passcodes
    if (password === 'admin123' || password === 'royaledge2026') {
      const session: AdminSession = {
        authenticated: true,
        token: `RE-ADMIN-SESSION-${Date.now()}`,
        username,
        role: 'ROLE_ADMIN',
        expiresAt: Date.now() + 12 * 60 * 60 * 1000,
      };
      saveToStorage(STORAGE_KEYS.ADMIN_SESSION, session);
      return { success: true, token: session.token };
    }

    return { success: false, error: 'Invalid administrator password.' };
  },

  adminLogout(): void {
    localStorage.removeItem(STORAGE_KEYS.ADMIN_SESSION);
    localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
  },
};
