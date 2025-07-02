import mongoose from 'mongoose';

const businessInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    default: 'Pickle Paradise'
  },
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  gstin: {
    type: String,
    required: true,
    match: [/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/, 'Invalid GSTIN format']
  },
  pan: {
    type: String,
    required: true,
    match: [/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, 'Invalid PAN format']
  },
  email: {
    type: String,
    required: true
  },
  phone: {
    type: String,
    required: true
  },
  website: String,
  logo: String,
  bankDetails: {
    accountName: String,
    accountNumber: String,
    ifscCode: String,
    bankName: String,
    branch: String
  }
});

const customerInfoSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  phone: String,
  address: {
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: { type: String, default: 'India' }
  },
  gstin: String, // Optional for B2B customers
  pan: String
});

const invoiceItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  description: String,
  sku: {
    type: String,
    required: true
  },
  hsn: String, // HSN/SAC code for GST
  quantity: {
    type: Number,
    required: true,
    min: [1, 'Quantity must be at least 1']
  },
  unit: {
    type: String,
    default: 'pcs'
  },
  rate: {
    type: Number,
    required: true,
    min: [0, 'Rate cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  taxRate: {
    type: Number,
    required: true,
    min: [0, 'Tax rate cannot be negative']
  },
  amount: {
    type: Number,
    required: true,
    min: [0, 'Amount cannot be negative']
  }
});

const pricingBreakdownSchema = new mongoose.Schema({
  subtotal: {
    type: Number,
    required: true,
    min: [0, 'Subtotal cannot be negative']
  },
  discount: {
    type: Number,
    default: 0,
    min: [0, 'Discount cannot be negative']
  },
  taxableAmount: {
    type: Number,
    required: true,
    min: [0, 'Taxable amount cannot be negative']
  },
  cgst: {
    type: Number,
    default: 0,
    min: [0, 'CGST cannot be negative']
  },
  sgst: {
    type: Number,
    default: 0,
    min: [0, 'SGST cannot be negative']
  },
  igst: {
    type: Number,
    default: 0,
    min: [0, 'IGST cannot be negative']
  },
  cess: {
    type: Number,
    default: 0,
    min: [0, 'CESS cannot be negative']
  },
  totalTax: {
    type: Number,
    required: true,
    min: [0, 'Total tax cannot be negative']
  },
  roundOff: {
    type: Number,
    default: 0
  },
  grandTotal: {
    type: Number,
    required: true,
    min: [0, 'Grand total cannot be negative']
  },
  amountInWords: String
});

const deliveryTrackingSchema = new mongoose.Schema({
  email: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    deliveredAt: Date,
    openedAt: Date,
    downloadedAt: Date,
    bounced: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: Date,
    errorMessage: String
  },
  whatsapp: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    deliveredAt: Date,
    readAt: Date,
    downloadedAt: Date,
    failed: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: Date,
    errorMessage: String,
    messageId: String
  },
  sms: {
    sent: {
      type: Boolean,
      default: false
    },
    sentAt: Date,
    deliveredAt: Date,
    failed: {
      type: Boolean,
      default: false
    },
    attempts: {
      type: Number,
      default: 0
    },
    lastAttemptAt: Date,
    errorMessage: String
  }
});

const fileInfoSchema = new mongoose.Schema({
  pdf: {
    url: String,
    size: Number,
    generatedAt: Date,
    template: String,
    version: String
  },
  xml: {
    url: String,
    size: Number,
    generatedAt: Date
  },
  json: {
    url: String,
    size: Number,
    generatedAt: Date
  }
});

const complianceSchema = new mongoose.Schema({
  gstCompliant: {
    type: Boolean,
    default: true
  },
  eInvoiceRequired: {
    type: Boolean,
    default: false
  },
  eInvoiceGenerated: {
    type: Boolean,
    default: false
  },
  irn: String, // Invoice Reference Number for e-Invoice
  ackNo: String, // Acknowledgment Number
  ackDate: Date,
  qrCode: String,
  digitalSignature: String,
  einvoiceError: String
});

const triggerSettingsSchema = new mongoose.Schema({
  autoSendEmail: {
    type: Boolean,
    default: true
  },
  autoSendWhatsApp: {
    type: Boolean,
    default: false
  },
  autoSendSMS: {
    type: Boolean,
    default: false
  },
  sendOnOrderConfirm: {
    type: Boolean,
    default: true
  },
  sendOnPayment: {
    type: Boolean,
    default: true
  },
  sendOnShipping: {
    type: Boolean,
    default: false
  },
  sendOnDelivery: {
    type: Boolean,
    default: false
  },
  reminderEnabled: {
    type: Boolean,
    default: true
  },
  reminderDays: {
    type: [Number],
    default: [7, 15, 30]
  }
});

const invoiceSchema = new mongoose.Schema({
  invoiceNumber: {
    type: String,
    required: true,
    unique: true,
    uppercase: true
  },
  order: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  
  // Invoice details
  type: {
    type: String,
    enum: ['proforma', 'tax_invoice', 'credit_note', 'debit_note'],
    default: 'tax_invoice'
  },
  status: {
    type: String,
    enum: ['draft', 'generated', 'sent', 'viewed', 'downloaded', 'paid', 'overdue'],
    default: 'draft'
  },
  
  // Business and customer information
  business: businessInfoSchema,
  customer: customerInfoSchema,
  
  // Invoice items
  items: {
    type: [invoiceItemSchema],
    required: true,
    validate: {
      validator: function(items) {
        return items && items.length > 0;
      },
      message: 'Invoice must have at least one item'
    }
  },
  
  // Pricing breakdown
  pricing: pricingBreakdownSchema,
  
  // Delivery tracking
  delivery: deliveryTrackingSchema,
  
  // File information
  files: fileInfoSchema,
  
  // Compliance
  compliance: complianceSchema,
  
  // Auto-trigger settings
  triggers: triggerSettingsSchema,
  
  // Additional invoice metadata
  dueDate: Date,
  paymentTerms: {
    type: String,
    default: 'Immediate'
  },
  notes: String,
  termsAndConditions: String,
  
  // Reference information
  referenceNumber: String,
  purchaseOrderNumber: String,
  dispatchDocumentNumber: String,
  dispatchedThrough: String,
  destination: String,
  
  // Payment tracking
  paymentStatus: {
    type: String,
    enum: ['unpaid', 'partially_paid', 'paid', 'overdue'],
    default: 'unpaid'
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: [0, 'Amount paid cannot be negative']
  },
  amountDue: {
    type: Number,
    default: 0,
    min: [0, 'Amount due cannot be negative']
  },
  
  // Analytics
  analytics: {
    viewCount: {
      type: Number,
      default: 0
    },
    downloadCount: {
      type: Number,
      default: 0
    },
    firstViewedAt: Date,
    lastViewedAt: Date,
    firstDownloadedAt: Date,
    lastDownloadedAt: Date,
    timeToPayment: Number // in hours
  },
  
  // Automation tracking
  automationEvents: [{
    event: String,
    triggeredAt: Date,
    status: {
      type: String,
      enum: ['success', 'failed', 'pending']
    },
    errorMessage: String
  }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for performance
invoiceSchema.index({ invoiceNumber: 1 });
invoiceSchema.index({ order: 1 });
invoiceSchema.index({ user: 1, createdAt: -1 });
invoiceSchema.index({ status: 1, createdAt: -1 });
invoiceSchema.index({ type: 1, status: 1 });
invoiceSchema.index({ dueDate: 1, paymentStatus: 1 });
invoiceSchema.index({ 'compliance.eInvoiceRequired': 1, 'compliance.eInvoiceGenerated': 1 });

// Virtual for overdue status
invoiceSchema.virtual('isOverdue').get(function() {
  return this.dueDate && new Date() > this.dueDate && this.paymentStatus !== 'paid';
});

// Virtual for days overdue
invoiceSchema.virtual('daysOverdue').get(function() {
  if (!this.isOverdue) return 0;
  
  const diffTime = Math.abs(new Date() - this.dueDate);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Virtual for delivery success rate
invoiceSchema.virtual('deliverySuccessRate').get(function() {
  let successCount = 0;
  let totalAttempts = 0;
  
  if (this.delivery.email.attempts > 0) {
    totalAttempts++;
    if (this.delivery.email.sent && !this.delivery.email.bounced) successCount++;
  }
  
  if (this.delivery.whatsapp.attempts > 0) {
    totalAttempts++;
    if (this.delivery.whatsapp.sent && !this.delivery.whatsapp.failed) successCount++;
  }
  
  if (this.delivery.sms.attempts > 0) {
    totalAttempts++;
    if (this.delivery.sms.sent && !this.delivery.sms.failed) successCount++;
  }
  
  return totalAttempts > 0 ? (successCount / totalAttempts) * 100 : 0;
});

// Pre-save middleware to generate invoice number
invoiceSchema.pre('save', async function(next) {
  if (this.isNew && !this.invoiceNumber) {
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    
    // Generate based on invoice type
    let prefix = 'INV';
    switch (this.type) {
      case 'proforma':
        prefix = 'PI';
        break;
      case 'credit_note':
        prefix = 'CN';
        break;
      case 'debit_note':
        prefix = 'DN';
        break;
      default:
        prefix = 'INV';
    }
    
    // Find the last invoice of the month for this type
    const lastInvoice = await this.constructor.findOne({
      type: this.type,
      invoiceNumber: new RegExp(`^${prefix}${year}${month}`)
    }).sort({ invoiceNumber: -1 });
    
    let sequence = 1;
    if (lastInvoice) {
      const lastSequence = parseInt(lastInvoice.invoiceNumber.slice(-4));
      sequence = lastSequence + 1;
    }
    
    this.invoiceNumber = `${prefix}${year}${month}${sequence.toString().padStart(4, '0')}`;
  }
  next();
});

// Pre-save middleware to calculate pricing
invoiceSchema.pre('save', function(next) {
  // Calculate item amounts
  this.items.forEach(item => {
    const discountAmount = (item.rate * item.quantity * item.discount) / 100;
    const taxableAmount = (item.rate * item.quantity) - discountAmount;
    item.amount = taxableAmount + (taxableAmount * item.taxRate / 100);
  });
  
  // Calculate pricing breakdown
  this.pricing.subtotal = this.items.reduce((total, item) => {
    const discountAmount = (item.rate * item.quantity * item.discount) / 100;
    return total + (item.rate * item.quantity) - discountAmount;
  }, 0);
  
  this.pricing.taxableAmount = this.pricing.subtotal - this.pricing.discount;
  
  // Calculate GST (simplified - should be more complex based on state)
  if (this.customer.address.state === this.business.address.state) {
    // Intra-state: CGST + SGST
    this.pricing.cgst = this.items.reduce((total, item) => {
      const taxableAmount = (item.rate * item.quantity) - (item.rate * item.quantity * item.discount / 100);
      return total + (taxableAmount * item.taxRate / 200); // Half of tax rate for CGST
    }, 0);
    this.pricing.sgst = this.pricing.cgst; // Same as CGST
    this.pricing.igst = 0;
  } else {
    // Inter-state: IGST
    this.pricing.igst = this.items.reduce((total, item) => {
      const taxableAmount = (item.rate * item.quantity) - (item.rate * item.quantity * item.discount / 100);
      return total + (taxableAmount * item.taxRate / 100);
    }, 0);
    this.pricing.cgst = 0;
    this.pricing.sgst = 0;
  }
  
  this.pricing.totalTax = this.pricing.cgst + this.pricing.sgst + this.pricing.igst + this.pricing.cess;
  
  const totalBeforeRounding = this.pricing.taxableAmount + this.pricing.totalTax;
  this.pricing.grandTotal = Math.round(totalBeforeRounding);
  this.pricing.roundOff = this.pricing.grandTotal - totalBeforeRounding;
  
  // Convert amount to words (simplified)
  this.pricing.amountInWords = this.convertToWords(this.pricing.grandTotal);
  
  // Update amount due
  this.amountDue = this.pricing.grandTotal - this.amountPaid;
  
  next();
});

// Pre-save middleware to check e-invoice requirement
invoiceSchema.pre('save', function(next) {
  // E-invoice required for B2B transactions above ₹5 lakh
  if (this.customer.gstin && this.pricing.grandTotal >= 500000) {
    this.compliance.eInvoiceRequired = true;
  }
  next();
});

// Instance methods
invoiceSchema.methods.convertToWords = function(amount) {
  // Simplified number to words conversion
  // In a real implementation, use a proper library like 'number-to-words'
  const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine'];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  if (amount === 0) return 'Zero Rupees Only';
  if (amount < 100) return `${ones[Math.floor(amount / 10)]}${tens[amount % 10]} Rupees Only`;
  
  // Simplified for demo - implement full conversion in production
  return `Rupees ${Math.floor(amount)} Only`;
};

invoiceSchema.methods.markAsViewed = function() {
  this.analytics.viewCount += 1;
  this.analytics.lastViewedAt = new Date();
  
  if (!this.analytics.firstViewedAt) {
    this.analytics.firstViewedAt = new Date();
    this.status = 'viewed';
  }
  
  return this.save();
};

invoiceSchema.methods.markAsDownloaded = function() {
  this.analytics.downloadCount += 1;
  this.analytics.lastDownloadedAt = new Date();
  
  if (!this.analytics.firstDownloadedAt) {
    this.analytics.firstDownloadedAt = new Date();
    this.status = 'downloaded';
  }
  
  return this.save();
};

invoiceSchema.methods.recordPayment = function(amount, paymentMethod, transactionId) {
  this.amountPaid += amount;
  this.amountDue = this.pricing.grandTotal - this.amountPaid;
  
  if (this.amountDue <= 0) {
    this.paymentStatus = 'paid';
    this.status = 'paid';
    
    // Calculate time to payment
    if (this.analytics.firstViewedAt) {
      const timeDiff = new Date() - this.analytics.firstViewedAt;
      this.analytics.timeToPayment = Math.floor(timeDiff / (1000 * 60 * 60)); // in hours
    }
  } else if (this.amountPaid > 0) {
    this.paymentStatus = 'partially_paid';
  }
  
  return this.save();
};

invoiceSchema.methods.markEmailSent = function(success = true, errorMessage = null) {
  this.delivery.email.attempts += 1;
  this.delivery.email.lastAttemptAt = new Date();
  
  if (success) {
    this.delivery.email.sent = true;
    this.delivery.email.sentAt = new Date();
    this.status = 'sent';
  } else {
    this.delivery.email.bounced = true;
    this.delivery.email.errorMessage = errorMessage;
  }
  
  return this.save();
};

invoiceSchema.methods.markWhatsAppSent = function(success = true, messageId = null, errorMessage = null) {
  this.delivery.whatsapp.attempts += 1;
  this.delivery.whatsapp.lastAttemptAt = new Date();
  
  if (success) {
    this.delivery.whatsapp.sent = true;
    this.delivery.whatsapp.sentAt = new Date();
    this.delivery.whatsapp.messageId = messageId;
  } else {
    this.delivery.whatsapp.failed = true;
    this.delivery.whatsapp.errorMessage = errorMessage;
  }
  
  return this.save();
};

invoiceSchema.methods.generateEInvoice = async function() {
  if (!this.compliance.eInvoiceRequired) {
    throw new Error('E-invoice not required for this invoice');
  }
  
  try {
    // In a real implementation, integrate with GST portal APIs
    this.compliance.eInvoiceGenerated = true;
    this.compliance.irn = `IRN${Date.now()}${Math.random().toString(36).substr(2, 9)}`;
    this.compliance.ackNo = `ACK${Date.now()}`;
    this.compliance.ackDate = new Date();
    
    return this.save();
  } catch (error) {
    this.compliance.einvoiceError = error.message;
    throw error;
  }
};

// Static methods
invoiceSchema.statics.findOverdueInvoices = function() {
  return this.find({
    dueDate: { $lt: new Date() },
    paymentStatus: { $ne: 'paid' }
  }).populate('user', 'email profile.firstName profile.lastName');
};

invoiceSchema.statics.findPendingEInvoices = function() {
  return this.find({
    'compliance.eInvoiceRequired': true,
    'compliance.eInvoiceGenerated': false
  });
};

invoiceSchema.statics.getInvoiceStats = function(startDate, endDate) {
  const matchStage = {
    createdAt: {
      $gte: startDate,
      $lte: endDate
    }
  };
  
  return this.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        totalAmount: { $sum: '$pricing.grandTotal' },
        paidAmount: { $sum: '$amountPaid' },
        overdueInvoices: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $lt: ['$dueDate', new Date()] },
                  { $ne: ['$paymentStatus', 'paid'] }
                ]
              },
              1,
              0
            ]
          }
        }
      }
    }
  ]);
};

invoiceSchema.statics.getDeliveryStats = function(startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        createdAt: { $gte: startDate, $lte: endDate }
      }
    },
    {
      $group: {
        _id: null,
        totalInvoices: { $sum: 1 },
        emailsSent: {
          $sum: { $cond: ['$delivery.email.sent', 1, 0] }
        },
        whatsappSent: {
          $sum: { $cond: ['$delivery.whatsapp.sent', 1, 0] }
        },
        emailBounces: {
          $sum: { $cond: ['$delivery.email.bounced', 1, 0] }
        }
      }
    }
  ]);
};

const Invoice = mongoose.model('Invoice', invoiceSchema);

export default Invoice;