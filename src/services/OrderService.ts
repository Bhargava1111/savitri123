import { CartItem } from '../contexts/CartContext';

const ORDERS_TABLE_ID = '10401';
const ORDER_ITEMS_TABLE_ID = '10402';
const NOTIFICATIONS_TABLE_ID = '10412';

export interface Order {
  id: number;
  user_id: string;
  order_total: number;
  order_status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  payment_method: string;
  order_date: string;
  tracking_number: string;
  estimated_delivery: string;
  razerpay_order_id?: string; // Updated field for Razer Pay Order ID
  razerpay_payment_id?: string; // Updated field for Razer Pay Payment ID
}

export interface OrderItem {
  id: number;
  order_id: string;
  product_id: string;
  product_name: string;
  product_price: number;
  quantity: number;
  product_image: string;
}

export class OrderService {
  // Create a new order (initial creation before payment)
  static async createOrder(params: {
    userId: string;
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
    razerpayOrderId?: string; // Updated for Razer Pay Order ID
    razerpayPaymentId?: string; // Updated for Razer Pay Payment ID
  }) {
    try {
      const { userId, cartItems, shippingAddress, paymentMethod, razerpayOrderId, razerpayPaymentId } = params;

      const orderTotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const orderId = `ORDER_${Date.now()}`;

      // Create order
      const orderData = {
        user_id: userId,
        order_total: orderTotal,
        order_status: 'pending', // Initial status is pending
        shipping_address: JSON.stringify(shippingAddress),
        payment_method: paymentMethod,
        order_date: new Date().toISOString(),
        tracking_number: `TN${Date.now().toString().slice(-8)}`,
        estimated_delivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
        razerpay_order_id: razerpayOrderId,
        razerpay_payment_id: razerpayPaymentId,
      };

      console.log(`OrderService: Creating order in table ${ORDERS_TABLE_ID} with data:`, orderData);
      const { error: orderError } = await window.ezsite.apis.tableCreate(ORDERS_TABLE_ID, orderData);
      if (orderError) {
        console.error('OrderService: Error creating order:', orderError);
        throw new Error(orderError);
      }
      console.log('OrderService: Order created successfully.');

      // Get the created order to get its ID
      console.log(`OrderService: Fetching created order from table ${ORDERS_TABLE_ID} for user ${userId}`);
      const { data: orderData2, error: fetchError } = await window.ezsite.apis.tablePage(ORDERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [
          { name: 'user_id', op: 'Equal', value: userId }
        ]
      });

      if (fetchError || !orderData2?.List?.[0]) {
        console.error('OrderService: Failed to retrieve created order:', fetchError);
        throw new Error('Failed to retrieve created order');
      }
      console.log('OrderService: Successfully retrieved created order:', orderData2.List[0]);

      const createdOrder = orderData2.List[0];

      // Create order items
      for (const item of cartItems) {
        const orderItemData = {
          order_id: createdOrder.id.toString(),
          product_id: item.id,
          product_name: item.name,
          product_price: item.price,
          quantity: item.quantity,
          product_image: item.image
        };

        console.log(`OrderService: Creating order item in table ${ORDER_ITEMS_TABLE_ID} with data:`, orderItemData);
        const { error: itemError } = await window.ezsite.apis.tableCreate(ORDER_ITEMS_TABLE_ID, orderItemData);
        if (itemError) {
          console.error('OrderService: Error creating order item:', itemError);
        } else {
          console.log('OrderService: Order item created successfully.');
        }
      }

      // Create notification for user
      console.log(`OrderService: Creating notification for user ${userId} in table ${NOTIFICATIONS_TABLE_ID}`);
      try {
        await window.ezsite.apis.tableCreate(NOTIFICATIONS_TABLE_ID, {
          user_id: userId,
          title: 'Order Confirmed',
          message: `Your order #${createdOrder.id} has been confirmed and is being processed.`,
          type: 'order',
          channel: 'in_app',
          status: 'sent',
          created_at: new Date().toISOString(),
          sent_at: new Date().toISOString()
        });
        console.log('OrderService: Order confirmation notification created successfully.');
      } catch (notifError) {
        console.error('OrderService: Error creating order notification:', notifError);
      }

      // Send order confirmation email
      console.log('OrderService: Sending order confirmation email to admin.');
      try {
        await window.ezsite.apis.sendEmail({
          from: 'support@ezsite.ai',
          to: ['admin@company.com'],
          subject: 'New Order Received',
          html: `
            <h2>New Order #${createdOrder.id}</h2>
            <p><strong>Customer ID:</strong> ${userId}</p>
            <p><strong>Total:</strong> $${orderTotal.toFixed(2)}</p>
            <p><strong>Items:</strong> ${cartItems.length}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod}</p>
            <p><strong>Order Date:</strong> ${new Date().toLocaleString()}</p>
          `
        });
        console.log('OrderService: Order confirmation email sent successfully.');
      } catch (emailError) {
        console.error('OrderService: Error sending order email:', emailError);
      }

      return {
        success: true,
        orderId: createdOrder.id,
        trackingNumber: createdOrder.tracking_number
      };
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  // Method to create a Razer Pay order on the backend
  static async createRazerPayOrder(params: {
    amount: number;
    currency: string;
    receipt: string;
    userId: string;
    cartItems: CartItem[];
    shippingAddress: any;
  }) {
    try {
      const { amount, currency, receipt, userId, cartItems, shippingAddress } = params;

      // First, create an internal order with 'pending' status
      const createOrderResult = await this.createOrder({
        userId,
        cartItems,
        shippingAddress,
        paymentMethod: 'Razer Pay',
        razerpayOrderId: '', // Will be updated after Razer Pay order creation
        razerpayPaymentId: '', // Will be updated after payment success
      });

      if (!createOrderResult.success) {
        throw new Error('Failed to create internal order for Razer Pay.');
      }

      const internalOrderId = createOrderResult.orderId;

      // Call the Razer Pay API to create an order
      console.log(`OrderService: Creating Razer Pay order for internal order ID ${internalOrderId}`);
      const razerpayOrderResponse = await window.ezsite.apis.callApi({
        method: 'POST',
        url: '/api/razerpay/create-order', // Updated endpoint for Razer Pay
        data: {
          amount: (amount * 100).toFixed(0), // Razer Pay expects amount in smallest currency unit
          currency,
          receipt,
          notes: {
            internal_order_id: internalOrderId,
            user_id: userId,
          },
        },
      });

      if (!razerpayOrderResponse.success || !razerpayOrderResponse.data?.id) {
        throw new Error(razerpayOrderResponse.message || 'Failed to create Razer Pay order on backend.');
      }

      const razerpayOrderId = razerpayOrderResponse.data.id;

      // Update the internal order with the Razer Pay Order ID
      await window.ezsite.apis.tableUpdate(ORDERS_TABLE_ID, {
        id: internalOrderId,
        razerpay_order_id: razerpayOrderId,
      });

      return {
        success: true,
        razerpayOrderId,
        orderId: internalOrderId, // Return your internal order ID
        message: 'Razer Pay order created successfully.'
      };
    } catch (error: any) {
      console.error('Error creating Razer Pay order:', error);
      return { success: false, message: error.message || 'An unknown error occurred.' };
    }
  }

  // Method to verify Razer Pay payment on the backend
  static async verifyRazerPayPayment(params: {
    razerpay_payment_id: string;
    razerpay_order_id: string;
    razerpay_signature: string;
    orderId: number; // Your internal order ID
  }) {
    try {
      const { razerpay_payment_id, razerpay_order_id, razerpay_signature, orderId } = params;

      // Call the Razer Pay API to verify the payment
      console.log(`OrderService: Verifying Razer Pay payment for internal order ID ${orderId}`);
      const verificationResponse = await window.ezsite.apis.callApi({
        method: 'POST',
        url: '/api/razerpay/verify-payment', // Updated endpoint for Razer Pay
        data: {
          razerpay_payment_id,
          razerpay_order_id,
          razerpay_signature,
          internal_order_id: orderId,
        },
      });

      if (verificationResponse.success) {
        // Update internal order status to 'processing' and store payment ID
        await window.ezsite.apis.tableUpdate(ORDERS_TABLE_ID, {
          id: orderId,
          order_status: 'processing',
          razerpay_payment_id: razerpay_payment_id,
        });
        console.log(`OrderService: Payment verified and internal order ${orderId} updated to 'processing'.`);
        return { success: true, message: 'Payment verified successfully.' };
      } else {
        // Update internal order status to 'failed' if verification fails
        await window.ezsite.apis.tableUpdate(ORDERS_TABLE_ID, {
          id: orderId,
          order_status: 'failed',
        });
        console.error(`OrderService: Payment verification failed for internal order ${orderId}.`);
        return { success: false, message: verificationResponse.message || 'Payment verification failed.' };
      }
    } catch (error: any) {
      console.error('Error verifying Razer Pay payment:', error);
      return { success: false, message: error.message || 'An unknown error occurred during verification.' };
    }
  }

  // Get orders for a user
  static async getUserOrders(userId: string) {
    try {
      if (!window.ezsite || !window.ezsite.apis) {
        console.error('OrderService: window.ezsite.apis is not defined. Cannot get user orders.');
        throw new Error('API not available');
      }
      console.log(`OrderService: Fetching orders for user ${userId} from table ${ORDERS_TABLE_ID}`);
      const { data, error } = await window.ezsite.apis.tablePage(ORDERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 100,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [
          { name: 'user_id', op: 'Equal', value: userId }
        ]
      });

      if (error) {
        console.error(`OrderService: Error fetching user orders for user ${userId}:`, error);
        throw new Error(error);
      }
      console.log(`OrderService: Successfully fetched orders for user ${userId}:`, data);

      return data?.List || [];
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw error;
    }
  }

  // Get order details by ID
  static async getOrderById(orderId: string) {
    try {
      if (!window.ezsite || !window.ezsite.apis) {
        console.error('OrderService: window.ezsite.apis is not defined. Cannot get order details.');
        throw new Error('API not available');
      }
      console.log(`OrderService: Fetching order ${orderId} from table ${ORDERS_TABLE_ID}`);
      const { data, error } = await window.ezsite.apis.tablePage(ORDERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1,
        Filters: [
          { name: 'id', op: 'Equal', value: orderId }
        ]
      });

      if (error) {
        console.error(`OrderService: Error fetching order ${orderId}:`, error);
        throw new Error(error);
      }

      if (!data?.List?.[0]) {
        console.error(`OrderService: Order ${orderId} not found.`);
        throw new Error('Order not found');
      }

      console.log(`OrderService: Successfully fetched order ${orderId}:`, data.List[0]);

      // Get order items
      console.log(`OrderService: Fetching items for order ${orderId} from table ${ORDER_ITEMS_TABLE_ID}`);
      const { data: itemsData, error: itemsError } = await window.ezsite.apis.tablePage(ORDER_ITEMS_TABLE_ID, {
        PageNo: 1,
        PageSize: 100,
        Filters: [
          { name: 'order_id', op: 'Equal', value: orderId }
        ]
      });

      if (itemsError) {
        console.error(`OrderService: Error fetching items for order ${orderId}:`, itemsError);
        throw new Error(itemsError);
      }

      console.log(`OrderService: Successfully fetched items for order ${orderId}:`, itemsData);

      return {
        order: data.List[0],
        items: itemsData?.List || []
      };
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Update order status
  static async updateOrderStatus(orderId: string, status: Order['order_status']) {
    try {
      if (!window.ezsite || !window.ezsite.apis) {
        console.error('OrderService: window.ezsite.apis is not defined. Cannot update order status.');
        throw new Error('API not available');
      }
      console.log(`OrderService: Updating status of order ${orderId} to ${status}`);
      const { error } = await window.ezsite.apis.tableUpdate(ORDERS_TABLE_ID, {
        id: orderId,
        order_status: status
      });

      if (error) {
        console.error(`OrderService: Error updating status of order ${orderId}:`, error);
        throw new Error(error);
      }

      console.log(`OrderService: Successfully updated status of order ${orderId} to ${status}`);
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Cancel order
  static async cancelOrder(orderId: string) {
    return this.updateOrderStatus(orderId, 'cancelled');
  }

  // Get order statistics for admin dashboard
  static async getOrderStatistics() {
    try {
      if (!window.ezsite || !window.ezsite.apis) {
        console.error('OrderService: window.ezsite.apis is not defined. Cannot get order statistics.');
        throw new Error('API not available');
      }
      console.log(`OrderService: Fetching all orders from table ${ORDERS_TABLE_ID} for statistics`);
      const { data, error } = await window.ezsite.apis.tablePage(ORDERS_TABLE_ID, {
        PageNo: 1,
        PageSize: 1000, // Get a large number of orders for statistics
      });

      if (error) {
        console.error('OrderService: Error fetching orders for statistics:', error);
        throw new Error(error);
      }

      const orders = data?.List || [];
      console.log(`OrderService: Successfully fetched ${orders.length} orders for statistics`);

      // Calculate statistics
      const totalOrders = orders.length;
      const totalRevenue = orders.reduce((sum, order) => sum + parseFloat(order.order_total || 0), 0);
      
      const statusCounts = {
        pending: 0,
        processing: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0
      };

      orders.forEach(order => {
        if (statusCounts.hasOwnProperty(order.order_status)) {
          statusCounts[order.order_status as keyof typeof statusCounts]++;
        }
      });

      // Get recent orders (last 5)
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.order_date).getTime() - new Date(a.order_date).getTime())
        .slice(0, 5);

      return {
        totalOrders,
        totalRevenue,
        statusCounts,
        recentOrders
      };
    } catch (error) {
      console.error('Error getting order statistics:', error);
      throw error;
    }
  }
}
