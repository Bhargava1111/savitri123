import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Plus,
  Edit,
  Trash2,
  Users,
  Package,
  ShoppingCart,
  TrendingUp,
  Settings,
  MessageSquare,
  Bell,
  BarChart,
  DollarSign,
  Save,
  LineChart,
  PieChart,
  Send,
  Eye } from
'lucide-react';
import { Link } from 'react-router-dom';
import CampaignManager from '../components/CampaignManager';
import ProductManagement from '../components/ProductManagement';
import CategoryManagement from '../components/CategoryManagement';
import OrderManagement from '../components/OrderManagement';
import UserManagement from '../components/UserManagement';
import NotificationManagement from '../components/NotificationManagement';
import ReportingAnalytics from '../components/ReportingAnalytics';

const AdminPage: React.FC = () => {
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const [activeTab, setActiveTab] = useState('overview');

  // Enhanced stats for the dashboard
  const stats = [
  { title: 'Total Orders', value: '1,234', icon: ShoppingCart, change: '+12%' },
  { title: 'Products', value: '89', icon: Package, change: '+5%' },
  { title: 'Customers', value: '456', icon: Users, change: '+8%' },
  { title: 'Revenue', value: '$12,345', icon: DollarSign, change: '+15%' },
  { title: 'Campaigns', value: '12', icon: MessageSquare, change: '+3%' },
  { title: 'Notifications', value: '456', icon: Bell, change: '+25%' }];


  const recentOrders = [
  { id: '#12345', customer: 'John Doe', amount: '$129.99', status: 'Pending' },
  { id: '#12346', customer: 'Jane Smith', amount: '$89.99', status: 'Shipped' },
  { id: '#12347', customer: 'Bob Johnson', amount: '$199.99', status: 'Delivered' }];




  // Debug information
  console.log('AdminPage Debug:', { user, isAdmin, userRole: user?.role });

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="wwska36q9" data-path="src/pages/AdminPage.tsx">
        <Card className="max-w-md w-full mx-4" data-id="shqzrxnl1" data-path="src/pages/AdminPage.tsx">
          <CardContent className="p-8 text-center" data-id="j9ns2q8pe" data-path="src/pages/AdminPage.tsx">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="4jdnw7c3g" data-path="src/pages/AdminPage.tsx" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="4edgn3xf8" data-path="src/pages/AdminPage.tsx">
              Login Required
            </h2>
            <p className="text-gray-600 mb-6" data-id="cwvztik0x" data-path="src/pages/AdminPage.tsx">
              Please login to access the admin panel
            </p>
            <div className="space-y-4" data-id="ezjjp8utw" data-path="src/pages/AdminPage.tsx">
              <Button asChild className="w-full" data-id="zis8e9c5o" data-path="src/pages/AdminPage.tsx">
                <Link to="/auth" data-id="mkf2kt0tx" data-path="src/pages/AdminPage.tsx">Login</Link>
              </Button>
              <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-lg" data-id="5gbj9g9qq" data-path="src/pages/AdminPage.tsx">
                <p className="font-semibold mb-2" data-id="b9cx3blwg" data-path="src/pages/AdminPage.tsx">Demo Admin Access:</p>
                <p data-id="cfrb4ypvg" data-path="src/pages/AdminPage.tsx">Email: admin@example.com</p>
                <p data-id="ag9c1gmis" data-path="src/pages/AdminPage.tsx">Password: admin123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>);
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center" data-id="d5j1tzymh" data-path="src/pages/AdminPage.tsx">
        <Card className="max-w-md w-full mx-4" data-id="tsydisc94" data-path="src/pages/AdminPage.tsx">
          <CardContent className="p-8 text-center" data-id="trnb4plcw" data-path="src/pages/AdminPage.tsx">
            <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" data-id="ir9i5n1mc" data-path="src/pages/AdminPage.tsx" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2" data-id="a73o0yvmf" data-path="src/pages/AdminPage.tsx">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-4" data-id="zmdaba25p" data-path="src/pages/AdminPage.tsx">
              You don't have permission to access the admin panel
            </p>
            <div className="text-sm text-gray-500 p-4 bg-gray-100 rounded-lg mb-6" data-id="o63io4ela" data-path="src/pages/AdminPage.tsx">
              <p className="font-semibold mb-2" data-id="6z8doe4t2" data-path="src/pages/AdminPage.tsx">Current User Info:</p>
              <p data-id="6r88oz03j" data-path="src/pages/AdminPage.tsx">Email: {user.Email}</p>
              <p data-id="gp1j1xu2m" data-path="src/pages/AdminPage.tsx">Role: {user.role}</p>
              <p data-id="qn92rgkmz" data-path="src/pages/AdminPage.tsx">ID: {user.ID}</p>
              <div className="mt-2 pt-2 border-t" data-id="imka8s4mb" data-path="src/pages/AdminPage.tsx">
                <p className="font-semibold" data-id="2ev8lwiy8" data-path="src/pages/AdminPage.tsx">Admin Access Requirements:</p>
                <p data-id="e3p4ayqsf" data-path="src/pages/AdminPage.tsx">• Email: admin@example.com OR contains 'admin'</p>
                <p data-id="vglxat4ek" data-path="src/pages/AdminPage.tsx">• User ID: '1'</p>
              </div>
            </div>
            <div className="space-y-2" data-id="gee25hvp6" data-path="src/pages/AdminPage.tsx">
              <Button asChild className="w-full" data-id="486h6qofb" data-path="src/pages/AdminPage.tsx">
                <Link to="/" data-id="45hde94w0" data-path="src/pages/AdminPage.tsx">Go Home</Link>
              </Button>
              <Button variant="outline" asChild className="w-full" data-id="7omazfkzz" data-path="src/pages/AdminPage.tsx">
                <Link to="/auth" data-id="7myej7e55" data-path="src/pages/AdminPage.tsx">Login as Admin</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>);
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" data-id="fdfp9br3v" data-path="src/pages/AdminPage.tsx">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" data-id="5ehvzzl11" data-path="src/pages/AdminPage.tsx">
        <div className="mb-8" data-id="gubnj0l9o" data-path="src/pages/AdminPage.tsx">
          <h1 className="text-3xl font-bold text-gray-900" data-id="6z7g2kfv9" data-path="src/pages/AdminPage.tsx">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2" data-id="4q1q1m6x9" data-path="src/pages/AdminPage.tsx">
            Manage your store, products, campaigns, and notifications
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} data-id="zqe250w4l" data-path="src/pages/AdminPage.tsx">
          <TabsList className="grid w-full grid-cols-8" data-id="qkouar4fl" data-path="src/pages/AdminPage.tsx">
            <TabsTrigger value="overview" data-id="yfqfaof0q" data-path="src/pages/AdminPage.tsx">Overview</TabsTrigger>
            <TabsTrigger value="users" data-id="new-user-tab">Users</TabsTrigger>
            <TabsTrigger value="products" data-id="qufc8u3yz" data-path="src/pages/AdminPage.tsx">Products</TabsTrigger>
            <TabsTrigger value="categories" data-id="k2g3di19v" data-path="src/pages/AdminPage.tsx">Categories</TabsTrigger>
            <TabsTrigger value="campaigns" data-id="z4zcm8am2" data-path="src/pages/AdminPage.tsx">Campaigns</TabsTrigger>
            <TabsTrigger value="orders" data-id="new-orders-tab">Orders</TabsTrigger>
            <TabsTrigger value="reports" data-id="new-reports-tab">Reports</TabsTrigger>
            <TabsTrigger value="notifications" data-id="tze3pcx51" data-path="src/pages/AdminPage.tsx">Notifications</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6" data-id="0t4q0i6se" data-path="src/pages/AdminPage.tsx">
            {/* Enhanced Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-id="9uz978tq6" data-path="src/pages/AdminPage.tsx">
              {stats.map((stat, index) =>
              <Card key={index} data-id="j8l1xgoxu" data-path="src/pages/AdminPage.tsx">
                  <CardContent className="p-6" data-id="cpz4jvqos" data-path="src/pages/AdminPage.tsx">
                    <div className="flex items-center justify-between" data-id="i3ist96j2" data-path="src/pages/AdminPage.tsx">
                      <div data-id="cd3rqdbsd" data-path="src/pages/AdminPage.tsx">
                        <p className="text-sm font-medium text-gray-600" data-id="7nwm9x7tg" data-path="src/pages/AdminPage.tsx">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold text-gray-900" data-id="7qr0iwgk1" data-path="src/pages/AdminPage.tsx">
                          {stat.value}
                        </p>
                        <p className="text-sm text-green-600" data-id="5qsa3hk6c" data-path="src/pages/AdminPage.tsx">
                          {stat.change} from last month
                        </p>
                      </div>
                      <stat.icon className="w-8 h-8 text-blue-600" data-id="ktnlauygs" data-path="src/pages/AdminPage.tsx" />
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Recent Orders */}
            <Card data-id="zndhzvpn3" data-path="src/pages/AdminPage.tsx">
              <CardHeader data-id="9qiy7j7zr" data-path="src/pages/AdminPage.tsx">
                <CardTitle data-id="2ofjw3g31" data-path="src/pages/AdminPage.tsx">Recent Orders</CardTitle>
              </CardHeader>
              <CardContent data-id="pxs9xd655" data-path="src/pages/AdminPage.tsx">
                <div className="space-y-4" data-id="hdqh0nrf8" data-path="src/pages/AdminPage.tsx">
                  {recentOrders.map((order) =>
                  <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg" data-id="my6disroe" data-path="src/pages/AdminPage.tsx">
                      <div data-id="m7e4y64gn" data-path="src/pages/AdminPage.tsx">
                        <p className="font-medium" data-id="s40q3cuok" data-path="src/pages/AdminPage.tsx">{order.id}</p>
                        <p className="text-sm text-gray-600" data-id="ba478nf4y" data-path="src/pages/AdminPage.tsx">{order.customer}</p>
                      </div>
                      <div className="text-right" data-id="ysgq1dy5g" data-path="src/pages/AdminPage.tsx">
                        <p className="font-medium" data-id="q4b7axle2" data-path="src/pages/AdminPage.tsx">{order.amount}</p>
                        <span className={`text-sm px-2 py-1 rounded-full ${
                      order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                      order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'}`
                      } data-id="nvnbyak0b" data-path="src/pages/AdminPage.tsx">
                          {order.status}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="mt-6" data-id="new-user-content">
            <UserManagement />
          </TabsContent>

          <TabsContent value="products" className="mt-6" data-id="z9fpydpi4" data-path="src/pages/AdminPage.tsx">
            <ProductManagement data-id="0buizcs0z" data-path="src/pages/AdminPage.tsx" />
          </TabsContent>

          <TabsContent value="categories" className="mt-6" data-id="djmswnf9k" data-path="src/pages/AdminPage.tsx">
            <CategoryManagement data-id="20mzgn8p6" data-path="src/pages/AdminPage.tsx" />
          </TabsContent>

          <TabsContent value="campaigns" className="mt-6" data-id="36d09c6qe" data-path="src/pages/AdminPage.tsx">
            <CampaignManager data-id="bpup3coy1" data-path="src/pages/AdminPage.tsx" />
          </TabsContent>

          <TabsContent value="orders" className="mt-6" data-id="new-orders-content">
            <OrderManagement />
          </TabsContent>

          <TabsContent value="reports" className="mt-6" data-id="new-reports-content">
            <ReportingAnalytics />
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 mt-6" data-id="b1az5sovm" data-path="src/pages/AdminPage.tsx">
            <NotificationManagement />
          </TabsContent>
        </Tabs>
      </div>
    </div>);

};

export default AdminPage;