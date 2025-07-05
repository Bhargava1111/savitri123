import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import mongoose from 'mongoose';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Configure CORS
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// Configure express to handle JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../dist/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'product-' + uniqueSuffix + ext);
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Middleware
app.use(express.static(path.join(__dirname, '../dist')));

// Admin middleware
const isAdmin = (req, res, next) => {
  const user = db.users.find(u => u.ID === '1'); // Assuming user with ID '1' is admin
  if (user && user.Email === 'admin@example.com') {
    next();
  } else {
    res.status(403).json({ success: false, error: 'Unauthorized' });
  }
};

// In-memory database (for development purposes)
let db = {
  users: [],
  userProfiles: [],
  products: [],
  orders: [],
  orderItems: [],
  notifications: [],
  categories: [],
  campaigns: [],
  wishlist: [],
  reviews: [], // Added for reviews
  whatsapp: [], // Added for WhatsApp messages
  banners: [] // Added for banners
};

// Load initial data if available
const dataPath = path.join(__dirname, 'db.json');
if (fs.existsSync(dataPath)) {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    db = { ...db, ...JSON.parse(data) }; // Merge loaded data, preserving default empty arrays
    console.log('Database loaded from db.json');
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

// Ensure all top-level arrays exist after loading from db.json
db.users = db.users || [];
db.userProfiles = db.userProfiles || [];
db.products = db.products || [];
db.orders = db.orders || [];
db.orderItems = db.orderItems || [];
db.notifications = db.notifications || [];
db.categories = db.categories || [];
db.campaigns = db.campaigns || [];
db.wishlist = db.wishlist || [];
db.reviews = db.reviews || [];
db.whatsapp = db.whatsapp || [];

// Save database to file
const saveDatabase = () => {
  try {
    fs.writeFileSync(dataPath, JSON.stringify(db, null, 2), 'utf8');
    console.log('Database saved to db.json');
  } catch (error) {
    console.error('Error saving database:', error);
  }
};

// Initialize with some data if empty
if (db.users.length === 0) {
  // Add admin user
  const adminUser = {
    ID: '1',
    Name: 'Admin User',
    Email: 'admin@example.com',
    Password: 'admin123' // In a real app, this would be hashed
  };
  db.users.push(adminUser);

  // Add admin profile
  const adminProfile = {
    user_id: '1',
    phone_number: '1234567890',
    full_name: 'Admin User',
    avatar_url: '',
    email_notifications: true,
    whatsapp_notifications: true,
    marketing_notifications: true,
    auth_method: 'email',
    created_at: new Date().toISOString()
  };
  db.userProfiles.push(adminProfile);
}

// Initialize products only if they don't exist
if (db.products.length === 0) {
  // Add some sample products
  for (let i = 1; i <= 10; i++) {
    db.products.push({
      id: i.toString(),
      name: `Product ${i}`,
      description: `Description for Product ${i}`,
      price: Math.floor(Math.random() * 100) + 10,
      image: '/placeholder.svg',
      category_id: (Math.floor(Math.random() * 3) + 1).toString(),
      stock: Math.floor(Math.random() * 100) + 1,
      created_at: new Date().toISOString()
    });
  }
}

// Initialize categories only if they don't exist
if (db.categories.length === 0) {
  // Add some sample categories
  db.categories.push(
    { id: '1', name: 'Category 1', description: 'Description for Category 1' },
    { id: '2', name: 'Category 2', description: 'Description for Category 2' },
    { id: '3', name: 'Category 3', description: 'Description for Category 3' }
  );
}

// Initialize orders only if they don't exist
if (db.orders.length === 0) {
  // Add some sample orders
  for (let i = 1; i <= 5; i++) {
    const orderId = i.toString();
    const order = {
      id: orderId,
      user_id: '1',
      order_total: Math.floor(Math.random() * 500) + 50,
      order_status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
      shipping_address: JSON.stringify({
        street: '123 Main St',
        city: 'Anytown',
        state: 'CA',
        zip: '12345',
        country: 'USA'
      }),
      payment_method: 'credit_card',
      order_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      tracking_number: `TN${Math.floor(Math.random() * 1000000)}`,
      estimated_delivery: new Date(Date.now() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString()
    };
    db.orders.push(order);

    // Add order items
    for (let j = 1; j <= Math.floor(Math.random() * 3) + 1; j++) {
      const productId = Math.floor(Math.random() * 10) + 1;
      const product = db.products.find(p => p.id === productId.toString());
      if (product) {
        db.orderItems.push({
          id: `${orderId}_${j}`,
          order_id: orderId,
          product_id: product.id,
          product_name: product.name,
          product_price: product.price,
          quantity: Math.floor(Math.random() * 3) + 1,
          product_image: product.image
        });
      }
    }
  }

  // Add some sample notifications
  const notificationTypes = ['system', 'order', 'campaign', 'promotion'];
  const notificationChannels = ['in_app', 'email', 'whatsapp'];
  const notificationStatuses = ['sent', 'read', 'failed'];

  for (let i = 1; i <= 10; i++) {
    db.notifications.push({
      id: i.toString(),
      user_id: '1',
      title: `Notification ${i}`,
      message: `This is notification ${i} message content.`,
      type: notificationTypes[Math.floor(Math.random() * notificationTypes.length)],
      channel: notificationChannels[Math.floor(Math.random() * notificationChannels.length)],
      status: notificationStatuses[Math.floor(Math.random() * notificationStatuses.length)],
      is_read: Math.random() > 0.5,
      metadata: JSON.stringify({ key: 'value' }),
      sent_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Add some sample reviews
  for (let i = 1; i <= 10; i++) {
    db.reviews.push({
      id: i.toString(),
      user_id: '1',
      product_id: (Math.floor(Math.random() * 10) + 1).toString(),
      rating: Math.floor(Math.random() * 5) + 1,
      review_text: `This is a sample review for product ${i}.`,
      review_date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
      verified_purchase: Math.random() > 0.5
    });
  }

  // Add some sample WhatsApp messages (for campaigns)
  for (let i = 1; i <= 5; i++) {
    db.whatsapp.push({
      id: i.toString(),
      phone_number: `+1${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      message_type: 'text',
      message_content: `This is a sample WhatsApp message ${i}.`,
      status: ['sent', 'delivered', 'read', 'failed'][Math.floor(Math.random() * 4)],
      user_id: '1',
      campaign_id: (Math.floor(Math.random() * 3) + 1).toString(),
      sent_at: new Date(Date.now() - Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString()
    });
  }

  // Save initial database
  saveDatabase();
}

// API Endpoints

// User Authentication
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = db.users.find(u => u.Email.toLowerCase() === email.toLowerCase() && u.Password === password);
  
  if (user) {
    // Don't send password to client
    const { Password, ...userWithoutPassword } = user;
    const isAdmin = user.Email === 'admin@example.com';
    res.json({ success: true, data: { ...userWithoutPassword, isAdmin } });
  } else {
    res.status(401).json({ success: false, error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  
  // Check if user already exists
  if (db.users.some(u => u.Email.toLowerCase() === email.toLowerCase())) {
    return res.status(400).json({ success: false, error: 'User already exists' });
  }
  
  const newUser = {
    ID: uuidv4(),
    Name: name,
    Email: email,
    Password: password // In a real app, this would be hashed
  };
  
  db.users.push(newUser);
  
  // Create user profile
  const newProfile = {
    user_id: newUser.ID,
    phone_number: '',
    full_name: name,
    avatar_url: '',
    email_notifications: true,
    whatsapp_notifications: false,
    marketing_notifications: true,
    auth_method: 'email',
    created_at: new Date().toISOString()
  };
  
  db.userProfiles.push(newProfile);
  saveDatabase();
  
  // Don't send password to client
  const { Password, ...userWithoutPassword } = newUser;
  res.json({ success: true, data: userWithoutPassword });
});

app.get('/api/auth/user', (req, res) => {
  // In a real app, this would use JWT or session
  // For demo, we'll return the admin user
  const adminUser = db.users.find(u => u.ID === '1');
  if (adminUser) {
    const { Password, ...userWithoutPassword } = adminUser;
    res.json({ success: true, data: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, error: 'Not authenticated' });
  }
});

// Generic Table API
app.post('/api/table/:tableId', (req, res) => {
  console.log(`[SERVER] Received POST request for /api/table/${req.params.tableId}`);
  try {
    const { tableId } = req.params;
    const { PageNo, PageSize, OrderByField, IsAsc, Filters } = req.body;
    
    let tableData;
    switch (tableId) {
      case '10411':
      case 'userProfiles':
        tableData = db.userProfiles;
        break;
      case '10412':
      case 'notifications':
        tableData = db.notifications;
        break;
      case '10403':
      case 'products':
        tableData = db.products;
        break;
      case '10399':
      case 'wishlist':
        tableData = db.wishlist;
        break;
      case '10401':
      case 'orders':
        tableData = db.orders;
        break;
      case '10413':
      case 'campaigns':
        tableData = db.campaigns;
        break;
      case '10400':
      case 'reviews':
        tableData = db.reviews;
        break;
      case '10414':
      case 'whatsapp':
        tableData = db.whatsapp;
        break;
      case 'order_items':
        tableData = db.orderItems;
        break;
      default:
        console.warn(`[SERVER] Table ID ${tableId} not found.`);
        return res.status(404).json({ success: false, error: 'Table not found' });
    }
  
  // Apply filters if provided
  let filteredData = [...tableData];
  if (Filters && Filters.length > 0) {
    filteredData = filteredData.filter(item => {
      return Filters.every(filter => {
        const { name, op, value } = filter;
        
        if (!item[name]) return false;
        
        switch (op) {
          case 'Equal':
            return item[name] == value;
          case 'NotEqual':
            return item[name] != value;
          case 'Like':
            if (typeof value === 'string' && typeof item[name] === 'string') {
              if (value.startsWith('%') && value.endsWith('%')) {
                return item[name].includes(value.slice(1, -1));
              } else if (value.startsWith('%')) {
                return item[name].endsWith(value.slice(1));
              } else if (value.endsWith('%')) {
                return item[name].startsWith(value.slice(0, -1));
              }
            }
            return item[name] === value;
          case 'NotLike':
            if (typeof value === 'string' && typeof item[name] === 'string') {
              if (value.startsWith('%') && value.endsWith('%')) {
                return !item[name].includes(value.slice(1, -1));
              } else if (value.startsWith('%')) {
                return !item[name].endsWith(value.slice(1));
              } else if (value.endsWith('%')) {
                return !item[name].startsWith(value.slice(0, -1));
              }
            }
            return item[name] !== value;
          case 'StringContains': // Added StringContains operator
            if (typeof value === 'string' && typeof item[name] === 'string') {
              return item[name].toLowerCase().includes(value.toLowerCase());
            }
            return false;
          case 'GreaterThanOrEqual': // Added GreaterThanOrEqual operator
            return item[name] >= value;
          case 'LessThanOrEqual': // Added LessThanOrEqual operator
            return item[name] <= value;
          default:
            console.warn(`[SERVER] Unknown filter operator: ${op}`);
            return true;
        }
      });
    });
  }
  
  // Apply sorting if provided
  if (OrderByField) {
    filteredData.sort((a, b) => {
      if (a[OrderByField] < b[OrderByField]) return IsAsc ? -1 : 1;
      if (a[OrderByField] > b[OrderByField]) return IsAsc ? 1 : -1;
      return 0;
    });
  }
  
  // Apply pagination
  const page = PageNo || 1;
  const pageSize = PageSize || 10;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = filteredData.slice(startIndex, endIndex);
  
  res.setHeader('Content-Type', 'application/json'); // Explicitly set Content-Type
  console.log(`[SERVER] Sending JSON response for /api/table/${tableId}`);
  return res.json({
    success: true,
    data: {
      List: paginatedData,
      VirtualCount: filteredData.length,
      PageNo: page,
      PageSize: pageSize
    }
  });
  } catch (error) {
    console.error(`[SERVER] Error fetching table data for ${req.params.tableId}:`, error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to fetch table data' });
  }
});

// Create record in table
app.post('/api/table/create/:tableId', (req, res) => {
  try {
    const { tableId } = req.params;
    const data = req.body;
    
    // Add validation and logging for product creation
    if (tableId === '10403') {
      console.log('Attempting to create product with data:', data);
      if (!data.name || !data.price || !data.category || data.stock_quantity === undefined) {
        return res.status(400).json({ success: false, error: 'Missing required fields: name, price, category, stock_quantity' });
      }
    }
    
    let targetArray;
    switch (tableId) {
      case '10411': // Users
        targetArray = db.userProfiles;
        break;
      case '10412': // Notifications
        targetArray = db.notifications;
        break;
      case '10403': // Products
        targetArray = db.products;
        break;
      case '10399': // Wishlist
        targetArray = db.wishlist;
        break;
      case '10401': // Orders
        targetArray = db.orders;
        break;
      case '10413': // Campaigns
        targetArray = db.campaigns;
        break;
      case '10400': // Reviews
        targetArray = db.reviews;
        break;
      case '10414': // WhatsApp
        targetArray = db.whatsapp;
        break;
      default:
        return res.status(404).json({ success: false, error: 'Table not found' });
    }
    
    // Add ID if not provided
    const newRecord = { ...data };
    if (!newRecord.id) {
      if (tableId === '10401') {
        // Orders: generate sequential MANA000XXXXX ID
        const lastOrder = db.orders
          .map(o => parseInt((o.id || '').replace('MANA000', ''), 10))
          .filter(n => !isNaN(n))
          .sort((a, b) => b - a)[0] || 0;
        const newOrderNumber = lastOrder + 1;
        newRecord.id = `MANA000${newOrderNumber.toString().padStart(5, '0')}`;
      } else if (tableId === '10403') {
        // Products: generate sequential MANAPROD00001 ID
        const lastProd = db.products
          .map(p => parseInt((p.id || '').replace('MANAPROD', ''), 10))
          .filter(n => !isNaN(n))
          .sort((a, b) => b - a)[0] || 0;
        const newProdNumber = lastProd + 1;
        newRecord.id = `MANAPROD${newProdNumber.toString().padStart(5, '0')}`;
      } else if (tableId === '10411') {
        // Users: generate sequential MANAUSER00001 ID
        const lastUser = db.userProfiles
          .map(u => parseInt((u.user_id || u.id || '').replace('MANAUSER', ''), 10))
          .filter(n => !isNaN(n))
          .sort((a, b) => b - a)[0] || 0;
        const newUserNumber = lastUser + 1;
        newRecord.user_id = `MANAUSER${newUserNumber.toString().padStart(5, '0')}`;
        newRecord.id = newRecord.user_id;
      } else if (tableId === '10413') {
        // Campaigns: generate sequential MANACAMP00001 ID
        const lastCamp = db.campaigns
          .map(c => parseInt((c.id || '').replace('MANACAMP', ''), 10))
          .filter(n => !isNaN(n))
          .sort((a, b) => b - a)[0] || 0;
        const newCampNumber = lastCamp + 1;
        newRecord.id = `MANACAMP${newCampNumber.toString().padStart(5, '0')}`;
      } else {
        newRecord.id = uuidv4();
      }
    }
    
    targetArray.push(newRecord);
    saveDatabase();
    
    return res.json({ success: true, data: newRecord });
  } catch (error) {
    console.error('Error creating record:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to create record' });
  }
});

// Update record in table
app.post('/api/table/update/:tableId', (req, res) => {
  try {
    const { tableId } = req.params;
    const { id, ...updateData } = req.body;
    
    let targetArray;
    switch (tableId) {
      case '10411':
      case 'userProfiles':
        targetArray = db.userProfiles;
        break;
      case '10412':
      case 'notifications':
        targetArray = db.notifications;
        break;
      case '10403':
      case 'products':
        targetArray = db.products;
        break;
      case '10399':
      case 'wishlist':
        targetArray = db.wishlist;
        break;
      case '10401':
      case 'orders':
        targetArray = db.orders;
        break;
      case '10413':
      case 'campaigns':
        targetArray = db.campaigns;
        break;
      case '10400':
      case 'reviews':
        targetArray = db.reviews;
        break;
      case '10414':
      case 'whatsapp':
        targetArray = db.whatsapp;
        break;
      case 'order_items':
        targetArray = db.orderItems;
        break;
      default:
        return res.status(404).json({ success: false, error: 'Table not found' });
    }
  
    const index = targetArray.findIndex(item => item.id == id || item.ID == id || item.user_id == id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
  
    targetArray[index] = { ...targetArray[index], ...updateData };
    saveDatabase();
  
    return res.json({ success: true, data: targetArray[index] });
  } catch (error) {
    console.error('Error updating record:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to update record' });
  }
});

// Delete record from table
app.post('/api/table/delete/:tableId', (req, res) => {
  try {
    const { tableId } = req.params;
    const { id } = req.body;
    
    let targetArray;
    switch (tableId) {
      case '10411': // Users
        targetArray = db.userProfiles;
        break;
      case '10412': // Notifications
        targetArray = db.notifications;
        break;
      case '10403': // Products
        targetArray = db.products;
        break;
      case '10399': // Wishlist
        targetArray = db.wishlist;
        break;
      case '10401': // Orders
        targetArray = db.orders;
        break;
      case '10413': // Campaigns
        targetArray = db.campaigns;
        break;
      case '10400': // Reviews
        targetArray = db.reviews;
        break;
      case '10414': // WhatsApp
        targetArray = db.whatsapp;
        break;
      default:
        return res.status(404).json({ success: false, error: 'Table not found' });
    }
    
    const index = targetArray.findIndex(item => item.id == id || item.ID == id || item.user_id == id);
    if (index === -1) {
      return res.status(404).json({ success: false, error: 'Record not found' });
    }
    
    targetArray.splice(index, 1);
    saveDatabase();
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting record:', error);
    return res.status(500).json({ success: false, error: error.message || 'Failed to delete record' });
  }
});

// Get user info (for auth)
app.get('/api/getUserInfo', (req, res) => {
  // In a real app, this would use JWT or session
  // For demo, we'll return the admin user
  const adminUser = db.users.find(u => u.ID === '1');
  if (adminUser) {
    const { Password, ...userWithoutPassword } = adminUser;
    res.json({ success: true, data: userWithoutPassword });
  } else {
    res.status(401).json({ success: false, error: 'Not authenticated' });
  }
});

// Razer Pay API Endpoints
app.post('/api/razerpay/create-order', (req, res) => {
  const { amount, currency, receipt, notes } = req.body;
  
  // In a real implementation, this would make an API call to Razer Pay
  // For this demo, we'll simulate the response
  const razerpayOrderId = `rzp_${Date.now()}`;
  
  // Log the order creation
  console.log(`Created Razer Pay order: ${razerpayOrderId} for amount ${amount} ${currency}`);
  
  // Return a simulated successful response
  res.json({
    success: true,
    data: {
      id: razerpayOrderId,
      entity: 'order',
      amount: amount,
      amount_paid: 0,
      amount_due: amount,
      currency: currency,
      receipt: receipt,
      status: 'created',
      notes: notes,
      created_at: Math.floor(Date.now() / 1000)
    }
  });
});

app.post('/api/razerpay/verify-payment', (req, res) => {
  const { razerpay_payment_id, razerpay_order_id, razerpay_signature, internal_order_id } = req.body;
  
  // In a real implementation, this would verify the signature with Razer Pay
  // For this demo, we'll simulate a successful verification
  const isValid = true; // Assume the signature is valid
  
  if (isValid) {
    // Log the payment verification
    console.log(`Verified Razer Pay payment: ${razerpay_payment_id} for order ${razerpay_order_id}`);
    
    // Return a successful response
    res.json({
      success: true,
      data: {
        payment_id: razerpay_payment_id,
        order_id: razerpay_order_id,
        signature: razerpay_signature,
        status: 'verified'
      }
    });
  } else {
    // Return a failed verification response
    res.status(400).json({
      success: false,
      error: 'Invalid signature'
    });
  }
});

// Product Management Specific Endpoints

// Get all products with filtering and pagination
app.get('/api/products', (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      category,
      search,
      minPrice,
      maxPrice,
      sortBy = 'id',
      sortOrder = 'desc'
    } = req.query;

    // Start with all products
    let filteredProducts = [...db.products];
    
    // Apply filters
    if (category) {
      filteredProducts = filteredProducts.filter(p => p.category_id === category);
    }
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredProducts = filteredProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm) || 
        p.description.toLowerCase().includes(searchTerm)
      );
    }
    
    if (minPrice) {
      filteredProducts = filteredProducts.filter(p => p.price >= Number(minPrice));
    }
    
    if (maxPrice) {
      filteredProducts = filteredProducts.filter(p => p.price <= Number(maxPrice));
    }

    // Apply sorting
    filteredProducts.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];
      
      // Handle numeric sorting
      if (sortBy === 'price' || sortBy === 'stock') {
        aValue = Number(aValue) || 0;
        bValue = Number(bValue) || 0;
      }
      
      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Calculate pagination
    const total = filteredProducts.length;
    const skip = (Number(page) - 1) * Number(limit);
    const paginatedProducts = filteredProducts.slice(skip, skip + Number(limit));

    res.json({ 
      success: true, 
      data: paginatedProducts,
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit))
    });
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get product by ID
app.get('/api/products/:id', isAdmin, (req, res) => {
  const { id } = req.params;
  const product = db.products.find(p => p.id === id);
  
  if (product) {
    res.json({ success: true, data: product });
  } else {
    res.status(404).json({ success: false, error: 'Product not found' });
  }
});

// Create new product
app.post('/api/products', (req, res) => {
  const productData = req.body;
  
  // Validate required fields
  if (!productData.name || !productData.price) {
    return res.status(400).json({ success: false, error: 'Name and price are required' });
  }
  
  const newProduct = {
    id: uuidv4(),
    ...productData,
    created_at: new Date().toISOString(),
    is_active: true
  };
  
  db.products.push(newProduct);
  saveDatabase();
  
  res.json({ success: true, data: newProduct });
});

// Update product
app.put('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  // Update the product
  db.products[index] = {
    ...db.products[index],
    ...updateData,
    updated_at: new Date().toISOString()
  };
  
  saveDatabase();
  
  res.json({ success: true, data: db.products[index] });
});

// Delete product
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  
  const index = db.products.findIndex(p => p.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Product not found' });
  }
  
  // Remove the product
  db.products.splice(index, 1);
  saveDatabase();
  
  res.json({ success: true, message: 'Product deleted successfully' });
});

// Upload product image
app.post('/api/products/upload-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file provided' });
    }
    
    // Create relative URL path for the uploaded file
    const imageUrl = `/uploads/${req.file.filename}`;
    
    res.json({
      success: true,
      data: {
        imageUrl: imageUrl,
        filename: req.file.filename,
        originalname: req.file.originalname,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ success: false, error: 'Failed to upload image' });
  }
});

// Get all categories
app.get('/api/categories', (req, res) => {
  try {
    res.json({ success: true, data: db.categories });
  } catch (err) {
    console.error('Error fetching categories:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new category
app.post('/api/categories', (req, res) => {
  const { name, description } = req.body;
  
  if (!name) {
    return res.status(400).json({ success: false, error: 'Category name is required' });
  }
  
  const newCategory = {
    id: uuidv4(),
    name,
    description: description || '',
    created_at: new Date().toISOString()
  };
  
  db.categories.push(newCategory);
  saveDatabase();
  
  res.json({ success: true, data: newCategory });
});

// Update category
app.put('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  
  // Update the category
  db.categories[index] = {
    ...db.categories[index],
    name: name || db.categories[index].name,
    description: description !== undefined ? description : db.categories[index].description,
    updated_at: new Date().toISOString()
  };
  
  saveDatabase();
  
  res.json({ success: true, data: db.categories[index] });
});

// Delete category
app.delete('/api/categories/:id', (req, res) => {
  const { id } = req.params;
  
  const index = db.categories.findIndex(c => c.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Category not found' });
  }
  
  // Remove the category
  db.categories.splice(index, 1);
  saveDatabase();
  
  res.json({ success: true, message: 'Category deleted successfully' });
});

// Banner API Endpoints
app.get('/api/banners', (req, res) => {
  res.json({ success: true, data: db.banners || [] });
});

app.post('/api/banners', (req, res) => {
  // Optionally, add admin check here
  const banners = req.body;
  if (!Array.isArray(banners)) {
    return res.status(400).json({ success: false, error: 'Banners must be an array' });
  }
  db.banners = banners;
  saveDatabase();
  res.json({ success: true, data: db.banners });
});

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler - must be last
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/ezsite', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const mongoConnection = mongoose.connection;
mongoConnection.on('error', console.error.bind(console, 'connection error:'));
mongoConnection.once('open', function() {
  console.log('Connected to MongoDB!');
});

const categorySchema = new mongoose.Schema({
  name: String,
  description: String,
  created_at: String
});
const Category = mongoose.model('Category', categorySchema);
