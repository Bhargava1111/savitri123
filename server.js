import express from 'express';
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'dist')));

// In-memory database (for development purposes)
let db = {
  users: [],
  userProfiles: [],
  products: [],
  orders: [],
  orderItems: [],
  notifications: [],
  categories: [],
  campaigns: []
};

// Load initial data if available
const dataPath = path.join(__dirname, 'db.json');
if (fs.existsSync(dataPath)) {
  try {
    const data = fs.readFileSync(dataPath, 'utf8');
    db = JSON.parse(data);
    console.log('Database loaded from db.json');
  } catch (error) {
    console.error('Error loading database:', error);
  }
}

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

  // Add some sample categories
  db.categories.push(
    { id: '1', name: 'Category 1', description: 'Description for Category 1' },
    { id: '2', name: 'Category 2', description: 'Description for Category 2' },
    { id: '3', name: 'Category 3', description: 'Description for Category 3' }
  );

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
    res.json({ success: true, data: userWithoutPassword });
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
  const { tableId } = req.params;
  const { PageNo, PageSize, OrderByField, IsAsc, Filters } = req.body;
  
  let tableData;
  switch (tableId) {
    case '10411': // Users
      tableData = db.userProfiles;
      break;
    case '10401': // Orders
      tableData = db.orders;
      break;
    case '10402': // Order Items
      tableData = db.orderItems;
      break;
    case '10412': // Notifications
      tableData = db.notifications;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
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
          default:
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
  
  res.json({
    success: true,
    data: {
      List: paginatedData,
      VirtualCount: filteredData.length,
      PageNo: page,
      PageSize: pageSize
    }
  });
});

// Create record in table
app.post('/api/table/create/:tableId', (req, res) => {
  const { tableId } = req.params;
  const data = req.body;
  
  let targetArray;
  switch (tableId) {
    case '10411': // Users
      targetArray = db.userProfiles;
      break;
    case '10401': // Orders
      targetArray = db.orders;
      break;
    case '10402': // Order Items
      targetArray = db.orderItems;
      break;
    case '10412': // Notifications
      targetArray = db.notifications;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
  }
  
  // Add ID if not provided
  const newRecord = { ...data };
  if (!newRecord.id) {
    newRecord.id = uuidv4();
  }
  
  targetArray.push(newRecord);
  saveDatabase();
  
  res.json({ success: true, data: newRecord });
});

// Update record in table
app.post('/api/table/update/:tableId', (req, res) => {
  const { tableId } = req.params;
  const { id, ...updateData } = req.body;
  
  let targetArray;
  switch (tableId) {
    case '10411': // Users
      targetArray = db.userProfiles;
      break;
    case '10401': // Orders
      targetArray = db.orders;
      break;
    case '10402': // Order Items
      targetArray = db.orderItems;
      break;
    case '10412': // Notifications
      targetArray = db.notifications;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
  }
  
  const index = targetArray.findIndex(item => item.id == id || item.ID == id || item.user_id == id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  
  targetArray[index] = { ...targetArray[index], ...updateData };
  saveDatabase();
  
  res.json({ success: true, data: targetArray[index] });
});

// Delete record from table
app.post('/api/table/delete/:tableId', (req, res) => {
  const { tableId } = req.params;
  const { id } = req.body;
  
  let targetArray;
  switch (tableId) {
    case '10411': // Users
      targetArray = db.userProfiles;
      break;
    case '10401': // Orders
      targetArray = db.orders;
      break;
    case '10402': // Order Items
      targetArray = db.orderItems;
      break;
    case '10412': // Notifications
      targetArray = db.notifications;
      break;
    default:
      return res.status(404).json({ error: 'Table not found' });
  }
  
  const index = targetArray.findIndex(item => item.id == id || item.ID == id || item.user_id == id);
  if (index === -1) {
    return res.status(404).json({ success: false, error: 'Record not found' });
  }
  
  targetArray.splice(index, 1);
  saveDatabase();
  
  res.json({ success: true });
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

// Catch-all route to serve the frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});