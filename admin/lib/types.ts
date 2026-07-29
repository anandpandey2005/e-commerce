export type NavIconName = 
  | "account"
  | "analytics" 
  | "employees"
  | "inventory"
  | "orders" 
  | "user-orders"
  | "stories"
  | "products"
  | "customers" 
  | "settings"
  | "home";

export interface NavItem {
  title: string;
  href: string;
  icon: NavIconName;
  badge?: string;
}

export interface UserProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl?: string;
}

export interface MetricCardData {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  period: string;
  icon: NavIconName;
}

export interface SalesOverviewPoint {
  month: string;
  revenue: number;
  orders: number;
}

export type OrderStatusType = "Completed" | "Pending" | "Processing" | "Cancelled" | "Refunded";
export type PaymentStatusType = "Paid" | "Refunded" | "Partially Refunded" | "Payment Failed" | "Pending Capture";

export interface DetailedOrder {
  id: string;
  date: string;
  timestamp: number;
  items: {
    name: string;
    quantity: number;
    price: number;
    sku: string;
  }[];
  totalAmount: number;
  status: OrderStatusType;
  paymentDetails: {
    method: string;
    cardLast4?: string;
    transactionId: string;
    status: PaymentStatusType;
    paidAt: string;
    billingAddress: string;
  };
  shippingAddress: string;
  trackingNumber?: string;
  refundHistory?: {
    refundId: string;
    amount: number;
    reason: string;
    date: string;
  }[];
}

export interface CustomerUserDetail {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  avatar: string;
  joinedDate: string;
  totalOrdersCount: number;
  totalSpent: number;
  loyaltyTier: string;
  orders: DetailedOrder[]; // Array of orders, sorted with latest order on top
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  product: string;
  amount: number;
  status: OrderStatusType;
  date: string;
}

export interface ICloudinaryImage {
  public_id: string;
  secure_url: string;
  resource_type: string;
}

export interface ICategory {
  _id: string;
  media: ICloudinaryImage[];
  name: string;
  slug: string;
  description: string;
  is_active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  productCount?: number;
}

export interface IProductHighlight {
  title: string;
  description: string;
}

export interface IProductSpecification {
  category_name: string;
  specs: {
    key: string;
    value: string;
  }[];
}

export interface IProductFAQ {
  question: string;
  answer: string;
  asked_by?: string;
}

export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  original_price: number;
  current_price: number;
  discount_percentage?: number;
  sku: string;
  stock: number;
  is_in_stock: boolean;
  is_it_featured: boolean;
  category_id: string;
  category_name?: string;
  brand: string;
  media: ICloudinaryImage[];
  thumbnail: string;
  highlights: IProductHighlight[];
  specifications: IProductSpecification[];
  faqs: IProductFAQ[];
  ratings: {
    average: number;
    count: number;
  };
  stock_availabilty_flag: "IN_STOCK" | "OUT_OF_STOCK" | "LOW_STOCK" | string;
  is_active: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

