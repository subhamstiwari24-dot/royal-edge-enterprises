export type ProductCategory =
  | 'Fusible Elastic'
  | 'Elastic'
  | 'Microdot'
  | 'Belt Roll'
  | 'Patti'
  | 'Collar & Cuff'
  | 'Strip'
  | 'Spunbond';

export interface ProductSpecifications {
  width?: string;
  composition?: string;
  weightGsm?: string;
  coatingType?: string;
  fusingTemperature?: string;
  fusingPressure?: string;
  colors?: string[];
  recommendedUses?: string[];
  packaging?: string;
}

// Public catalog product - NEVER contains internal prices
export interface PublicProduct {
  id: number;
  name: string;
  category: ProductCategory;
  description: string;
  imageUrl: string;
  unit: string;
  minimumOrderQuantity: number;
  specifications: ProductSpecifications;
  active: boolean;
  featured?: boolean;
  sku?: string;
}

// Internal admin product with confidential pricing
export interface AdminProduct extends PublicProduct {
  retailPrice: number;
  wholesalePrice: number;
  costPrice?: number;
  stockQuantity: number;
  sku: string;
  createdAt?: string;
  updatedAt?: string;
}

export type EnquiryType = 'RETAIL' | 'BULK';

export type EnquiryStatus =
  | 'NEW'
  | 'IN_REVIEW'
  | 'CONTACTED'
  | 'QUOTATION_PREPARED'
  | 'CONVERTED'
  | 'REJECTED';

export type PreferredContact = 'WHATSAPP' | 'PHONE' | 'EMAIL';

export interface Enquiry {
  id: number;
  enquiryNumber: string;
  customerName: string;
  companyName?: string;
  phone: string;
  email?: string;
  category: ProductCategory;
  productName?: string;
  productId?: number;
  quantity: number;
  unit: string;
  enquiryType: EnquiryType;
  message?: string;
  preferredContact: PreferredContact;
  status: EnquiryStatus;
  createdAt: string;
  adminNotes?: string;
}

export interface Customer {
  id: number;
  name: string;
  companyName?: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
  createdAt: string;
  totalEnquiries?: number;
  totalOrders?: number;
}

export type QuotationStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'REJECTED' | 'EXPIRED';

export interface QuotationItem {
  id: string;
  productId: number;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface Quotation {
  id: number;
  quotationNumber: string;
  enquiryId?: number;
  enquiryNumber?: string;
  customerId: number;
  customerName: string;
  companyName?: string;
  customerPhone: string;
  customerEmail?: string;
  items: QuotationItem[];
  subtotalAmount: number;
  taxRatePercent: number;
  taxAmount: number;
  totalAmount: number;
  status: QuotationStatus;
  validUntil: string;
  termsAndNotes?: string;
  createdAt: string;
}

export type OrderStatus =
  | 'PENDING'
  | 'IN_PRODUCTION'
  | 'DISPATCHED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'BANK_TRANSFER' | 'CHEQUE' | 'COD' | 'CREDIT_TERMS' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PARTIAL' | 'PAID';

export interface OrderItem {
  id: string;
  productId: number;
  productName: string;
  category: ProductCategory;
  quantity: number;
  unit: string;
  unitPrice: number;
  subtotal: number;
}

export interface CustomerOrder {
  id: number;
  orderNumber: string;
  quotationId?: number;
  quotationNumber?: string;
  customerId: number;
  customerName: string;
  companyName?: string;
  customerPhone: string;
  customerEmail?: string;
  shippingAddress: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderItem[];
  totalAmount: number;
  createdAt: string;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  notes?: string;
}
