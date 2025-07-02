import { Document, ObjectId } from 'mongoose';

// Base interface for all models
export interface BaseModel {
  _id: ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

// Address interface (reusable)
export interface IAddress {
  _id?: ObjectId;
  type: 'home' | 'work' | 'other';
  firstName: string;
  lastName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  landmark?: string;
  isDefault: boolean;
}

// User related interfaces
export interface IUserPreferences {
  spiceLevel: 'mild' | 'medium' | 'hot' | 'extra-hot';
  dietaryRestrictions: string[];
  favoriteCategories: ObjectId[];
  language: 'en' | 'hi' | 'ta' | 'te';
  notifications: {
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
    push: boolean;
  };
}

export interface IUserAuthentication {
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin?: Date;
  loginAttempts: number;
  lockUntil?: Date;
  resetPasswordToken?: string;
  resetPasswordExpires?: Date;
  emailVerificationToken?: string;
  phoneVerificationCode?: string;
}

export interface IUserLoyalty {
  points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  totalSpent: number;
  tierUpgradeDate?: Date;
  pointsHistory: {
    points: number;
    type: 'earned' | 'redeemed';
    description: string;
    date: Date;
  }[];
}

export interface IUserSocial {
  googleId?: string;
  facebookId?: string;
  appleId?: string;
}

export interface IUser extends BaseModel, Document {
  email: string;
  password: string;
  profile: {
    firstName: string;
    lastName: string;
    phone: string;
    avatar?: string;
    dateOfBirth?: Date;
    gender?: 'male' | 'female' | 'other';
  };
  addresses: IAddress[];
  preferences: IUserPreferences;
  authentication: IUserAuthentication;
  loyalty: IUserLoyalty;
  social: IUserSocial;
  role: 'customer' | 'admin' | 'moderator';
  status: 'active' | 'inactive' | 'suspended';
}

// Product related interfaces
export interface IProductVariant {
  sku: string;
  weight: number; // in grams
  price: number;
  compareAtPrice?: number;
  stock: number;
  lowStockThreshold: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  barcode?: string;
  packaging: 'glass-jar' | 'plastic-container' | 'pouch';
}

export interface INutritionalInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  sodium: number;
  sugar: number;
  servingSize: string;
}

export interface IIngredient {
  name: string;
  percentage?: number;
  allergen: boolean;
  organic: boolean;
}

export interface IProductAttributes {
  spiceLevel: number; // 1-10 scale
  sweetness: number;
  sourness: number;
  saltiness: number;
  texture: string;
  color: string;
  preservatives: boolean;
  vegan: boolean;
  glutenFree: boolean;
  diabeticFriendly: boolean;
}

export interface IProductSourcing {
  origin: string;
  farmLocation: string;
  harvestDate?: Date;
  certifications: string[];
  carbonFootprint?: number;
}

export interface IProductImage {
  url: string;
  alt: string;
  primary: boolean;
  order: number;
}

export interface IProductVideo {
  url: string;
  type: 'product-demo' | 'recipe' | 'making-process';
  title: string;
  duration: number;
}

export interface IProductSEO {
  metaTitle: string;
  metaDescription: string;
  keywords: string[];
  openGraphImage?: string;
}

export interface IProductAnalytics {
  views: number;
  purchases: number;
  wishlistAdds: number;
  cartAdds: number;
  conversionRate: number;
  averageRating: number;
  reviewCount: number;
}

export interface IProduct extends BaseModel, Document {
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  category: ObjectId;
  subcategory?: ObjectId;
  brand: string;
  variants: IProductVariant[];
  nutritionalInfo: INutritionalInfo;
  ingredients: IIngredient[];
  attributes: IProductAttributes;
  sourcing: IProductSourcing;
  images: IProductImage[];
  videos?: IProductVideo[];
  seo: IProductSEO;
  status: 'active' | 'inactive' | 'discontinued';
  featured: boolean;
  seasonal: boolean;
  seasonalPeriod?: {
    startMonth: number;
    endMonth: number;
  };
  analytics: IProductAnalytics;
}

// Order related interfaces
export interface IOrderItem {
  product: ObjectId;
  variant: {
    sku: string;
    weight: number;
    price: number;
  };
  quantity: number;
  priceAtTime: number;
  discountApplied?: number;
}

export interface IOrderPricing {
  subtotal: number;
  discount: number;
  tax: number;
  shipping: number;
  total: number;
  currency: 'INR';
  appliedCoupons: string[];
}

export interface IOrderShipping {
  address: IAddress;
  method: string;
  provider: 'bluedart' | 'delhivery' | 'dtdc' | 'fedex' | 'ecom';
  trackingNumber?: string;
  estimatedDelivery: Date;
  actualDelivery?: Date;
  cost: number;
}

export interface IOrderPayment {
  method: 'razorpay' | 'cod' | 'wallet';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  paidAt?: Date;
  failureReason?: string;
}

export interface IOrderStatusHistory {
  status: string;
  timestamp: Date;
  note?: string;
  updatedBy: ObjectId;
}

export interface IOrderSubscription {
  subscriptionId: ObjectId;
  frequency: 'weekly' | 'monthly' | 'quarterly';
  nextDelivery: Date;
}

export interface IOrderGift {
  recipientName: string;
  recipientEmail: string;
  message: string;
  deliveryDate: Date;
}

export interface IOrder extends BaseModel, Document {
  orderNumber: string;
  user: ObjectId;
  items: IOrderItem[];
  pricing: IOrderPricing;
  shipping: IOrderShipping;
  payment: IOrderPayment;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';
  statusHistory: IOrderStatusHistory[];
  subscription?: IOrderSubscription;
  giftOrder?: IOrderGift;
  notes: string;
  internalNotes: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
}

// Chat and AI interfaces
export interface IChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  content: string;
  type: 'text' | 'image' | 'audio' | 'quick_reply' | 'carousel' | 'button';
  timestamp: Date;
  metadata?: {
    intent?: string;
    confidence?: number;
    entities?: Record<string, any>;
    suggestions?: string[];
  };
}

export interface IChatContext {
  intent: string;
  entities: Record<string, any>;
  currentStep: string;
  conversationFlow: string;
  language: 'en' | 'hi' | 'ta' | 'te';
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
}

export interface IChatAIData {
  userPreferences: {
    spiceLevel: string;
    favoriteProducts: ObjectId[];
    priceRange: { min: number; max: number; };
    dietaryRestrictions: string[];
  };
  conversationSummary: string;
  resolvedIssues: string[];
  escalationReasons: string[];
}

export interface IChatResolution {
  type: 'self_service' | 'bot_resolved' | 'agent_resolved';
  summary: string;
  satisfactionRating?: number;
  feedbackText?: string;
}

export interface IChatConversation extends BaseModel, Document {
  sessionId: string;
  user?: ObjectId;
  customerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
  context: IChatContext;
  messages: IChatMessage[];
  aiData: IChatAIData;
  status: 'active' | 'resolved' | 'escalated' | 'abandoned';
  escalatedTo?: ObjectId; // Agent ID
  resolution?: IChatResolution;
  lastActivity: Date;
}

// Invoice interfaces
export interface IInvoiceBusinessInfo {
  name: string;
  address: string;
  gstin: string;
  pan: string;
  email: string;
  phone: string;
  website: string;
  logo: string;
}

export interface IInvoiceCustomerInfo {
  name: string;
  email: string;
  phone: string;
  address: string;
  gstin?: string;
}

export interface IInvoiceItem {
  product: ObjectId;
  name: string;
  description: string;
  sku: string;
  quantity: number;
  rate: number;
  discount: number;
  taxRate: number;
  amount: number;
}

export interface IInvoicePricing {
  subtotal: number;
  discount: number;
  taxableAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  roundOff: number;
  grandTotal: number;
  amountInWords: string;
}

export interface IInvoiceDelivery {
  email: {
    sent: boolean;
    sentAt?: Date;
    deliveredAt?: Date;
    openedAt?: Date;
    downloadedAt?: Date;
    bounced: boolean;
    attempts: number;
  };
  whatsapp: {
    sent: boolean;
    sentAt?: Date;
    deliveredAt?: Date;
    readAt?: Date;
    downloadedAt?: Date;
    failed: boolean;
    attempts: number;
  };
}

export interface IInvoiceFiles {
  pdf: {
    url: string;
    size: number;
    generatedAt: Date;
  };
  xml?: {
    url: string;
    size: number;
    generatedAt: Date;
  };
}

export interface IInvoiceCompliance {
  gstCompliant: boolean;
  eInvoiceRequired: boolean;
  eInvoiceGenerated: boolean;
  irn?: string;
  qrCode?: string;
}

export interface IInvoiceTriggers {
  autoSendEmail: boolean;
  autoSendWhatsApp: boolean;
  sendOnOrderConfirm: boolean;
  sendOnPayment: boolean;
  sendOnShipping: boolean;
  sendOnDelivery: boolean;
  reminderEnabled: boolean;
  reminderDays: number[];
}

export interface IInvoice extends BaseModel, Document {
  invoiceNumber: string;
  order: ObjectId;
  user: ObjectId;
  type: 'proforma' | 'tax_invoice' | 'credit_note' | 'debit_note';
  status: 'draft' | 'generated' | 'sent' | 'viewed' | 'downloaded';
  business: IInvoiceBusinessInfo;
  customer: IInvoiceCustomerInfo;
  items: IInvoiceItem[];
  pricing: IInvoicePricing;
  delivery: IInvoiceDelivery;
  files: IInvoiceFiles;
  compliance: IInvoiceCompliance;
  triggers: IInvoiceTriggers;
}

// Category interfaces
export interface ICategory extends BaseModel, Document {
  name: string;
  slug: string;
  description: string;
  image?: string;
  parent?: ObjectId;
  children: ObjectId[];
  status: 'active' | 'inactive';
  sortOrder: number;
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
}

// Review interfaces
export interface IReview extends BaseModel, Document {
  user: ObjectId;
  product: ObjectId;
  order: ObjectId;
  rating: number; // 1-5
  title: string;
  comment: string;
  images?: string[];
  verified: boolean;
  helpful: number;
  status: 'pending' | 'approved' | 'rejected';
  moderationNote?: string;
}

// Notification interfaces
export interface INotification extends BaseModel, Document {
  user: ObjectId;
  type: 'order' | 'payment' | 'shipping' | 'promotion' | 'system';
  title: string;
  message: string;
  data?: Record<string, any>;
  read: boolean;
  readAt?: Date;
  channels: {
    push: boolean;
    email: boolean;
    sms: boolean;
    whatsapp: boolean;
  };
  deliveryStatus: {
    push?: 'sent' | 'delivered' | 'failed';
    email?: 'sent' | 'delivered' | 'bounced' | 'failed';
    sms?: 'sent' | 'delivered' | 'failed';
    whatsapp?: 'sent' | 'delivered' | 'read' | 'failed';
  };
}

// Cart interfaces
export interface ICartItem {
  product: ObjectId;
  variant: string; // SKU
  quantity: number;
  addedAt: Date;
  priceAtTime: number;
}

export interface ICart extends BaseModel, Document {
  user: ObjectId;
  items: ICartItem[];
  subtotal: number;
  estimatedTax: number;
  estimatedShipping: number;
  estimatedTotal: number;
  appliedCoupons: string[];
  expiresAt: Date;
}

// Wishlist interfaces
export interface IWishlistItem {
  product: ObjectId;
  addedAt: Date;
  priceWhenAdded: number;
  notifyOnPriceChange: boolean;
  targetPrice?: number;
}

export interface IWishlist extends BaseModel, Document {
  user: ObjectId;
  items: IWishlistItem[];
  isPublic: boolean;
  shareCode?: string;
}

// API Response interfaces
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: string[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface PaginationQuery {
  page?: number;
  limit?: number;
  sort?: string;
  order?: 'asc' | 'desc';
}

export interface SearchQuery extends PaginationQuery {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  spiceLevel?: string[];
  dietary?: string[];
}

// Authentication interfaces
export interface LoginRequest {
  email: string;
  password: string;
  remember?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface AuthUser {
  _id: ObjectId;
  email: string;
  role: string;
  profile: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
}

// Socket.io interfaces
export interface SocketUser {
  userId: string;
  socketId: string;
  connectedAt: Date;
}

export interface ChatSocketData {
  sessionId: string;
  userId?: string;
  message: string;
  type: 'text' | 'image' | 'audio';
}

// Service interfaces
export interface EmailData {
  to: string | string[];
  subject: string;
  template: string;
  data: Record<string, any>;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export interface SMSData {
  to: string;
  message: string;
  templateId?: string;
}

export interface WhatsAppData {
  to: string;
  message: string;
  type: 'text' | 'template' | 'media';
  template?: {
    name: string;
    parameters: string[];
  };
  media?: {
    type: 'image' | 'document' | 'video';
    url: string;
    caption?: string;
  };
}

// Export all types
export * from './errors.js';
export * from './express.js';