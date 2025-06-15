import React, { useState, useEffect } from 'react';
import { Bell, X, Eye, Trash2, MoreVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

interface Notification {
  ID: number;
  user_id: string;
  title: string;
  message: string;
  type: string;
  channel: string;
  status: string;
  is_read: boolean;
  campaign_id: string;
  metadata: string;
  sent_at: string;
  created_at: string;
}

export default function NotificationCenter() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadNotifications = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await window.ezsite.apis.tablePage(10412, {
        PageNo: 1,
        PageSize: 20,
        OrderByField: 'ID',
        IsAsc: false,
        Filters: [{ name: 'user_id', op: 'Equal', value: user.ID }]
      });

      if (!error && data?.List) {
        setNotifications(data.List);
        setUnreadCount(data.List.filter((n: Notification) => !n.is_read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(loadNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const markAsRead = async (notificationId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableUpdate(10412, {
        ID: notificationId,
        is_read: true
      });

      if (!error) {
        setNotifications((prev) =>
        prev.map((n) => n.ID === notificationId ? { ...n, is_read: true } : n)
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const deleteNotification = async (notificationId: number) => {
    try {
      const { error } = await window.ezsite.apis.tableDelete(10412, {
        ID: notificationId
      });

      if (!error) {
        const notification = notifications.find((n) => n.ID === notificationId);
        setNotifications((prev) => prev.filter((n) => n.ID !== notificationId));
        if (notification && !notification.is_read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }
        toast({
          title: 'Success',
          description: 'Notification deleted'
        });
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete notification',
        variant: 'destructive'
      });
    }
  };

  const markAllAsRead = async () => {
    const unreadNotifications = notifications.filter((n) => !n.is_read);

    try {
      for (const notification of unreadNotifications) {
        await window.ezsite.apis.tableUpdate(10412, {
          ID: notification.ID,
          is_read: true
        });
      }

      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
      setUnreadCount(0);
      toast({
        title: 'Success',
        description: 'All notifications marked as read'
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark all as read',
        variant: 'destructive'
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'order':
        return '📦';
      case 'campaign':
        return '📢';
      case 'promotion':
        return '🎉';
      case 'system':
      default:
        return '🔔';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'order':
        return 'bg-blue-500';
      case 'campaign':
        return 'bg-purple-500';
      case 'promotion':
        return 'bg-green-500';
      case 'system':
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return `${Math.floor(diffInSeconds / 86400)}d ago`;
  };

  if (!user) return null;

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen} data-id="e7ugc2vvo" data-path="src/components/NotificationCenter.tsx">
      <PopoverTrigger asChild data-id="hivnu74gc" data-path="src/components/NotificationCenter.tsx">
        <Button variant="ghost" size="sm" className="relative" data-id="b60rbac9u" data-path="src/components/NotificationCenter.tsx">
          <Bell className="h-5 w-5" data-id="nr9wwg97y" data-path="src/components/NotificationCenter.tsx" />
          {unreadCount > 0 &&
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs" data-id="2xiqmroju" data-path="src/components/NotificationCenter.tsx">

              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          }
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0" data-id="mbj0ytvx5" data-path="src/components/NotificationCenter.tsx">
        <Card className="border-0 shadow-lg" data-id="6e20lyjiu" data-path="src/components/NotificationCenter.tsx">
          <CardHeader className="pb-3" data-id="vevnbmlyq" data-path="src/components/NotificationCenter.tsx">
            <div className="flex items-center justify-between" data-id="k42ri1opb" data-path="src/components/NotificationCenter.tsx">
              <CardTitle className="text-lg" data-id="l6ki83jbi" data-path="src/components/NotificationCenter.tsx">Notifications</CardTitle>
              <div className="flex items-center gap-2" data-id="cv8zps8k5" data-path="src/components/NotificationCenter.tsx">
                {unreadCount > 0 &&
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={markAllAsRead}
                  className="text-xs" data-id="8iedtxmux" data-path="src/components/NotificationCenter.tsx">

                    Mark all read
                  </Button>
                }
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)} data-id="n2ou71dq3" data-path="src/components/NotificationCenter.tsx">

                  <X className="h-4 w-4" data-id="bs9db8kio" data-path="src/components/NotificationCenter.tsx" />
                </Button>
              </div>
            </div>
            {unreadCount > 0 &&
            <CardDescription data-id="x3xuwyqwo" data-path="src/components/NotificationCenter.tsx">
                You have {unreadCount} unread notification{unreadCount > 1 ? 's' : ''}
              </CardDescription>
            }
          </CardHeader>
          <Separator data-id="rxin3bv7r" data-path="src/components/NotificationCenter.tsx" />
          <CardContent className="p-0 max-h-96 overflow-y-auto" data-id="yuzhf2enl" data-path="src/components/NotificationCenter.tsx">
            {isLoading ?
            <div className="p-4 text-center text-gray-500" data-id="an7tut49u" data-path="src/components/NotificationCenter.tsx">
                Loading notifications...
              </div> :
            notifications.length === 0 ?
            <div className="p-4 text-center text-gray-500" data-id="bzncc1xoi" data-path="src/components/NotificationCenter.tsx">
                No notifications yet
              </div> :

            <div className="space-y-0" data-id="dinigc2zv" data-path="src/components/NotificationCenter.tsx">
                {notifications.map((notification, index) =>
              <div key={notification.ID} data-id="b0z4kemi2" data-path="src/components/NotificationCenter.tsx">
                    <div
                  className={`p-4 hover:bg-gray-50 transition-colors ${
                  !notification.is_read ? 'bg-blue-50 border-l-4 border-blue-500' : ''}`
                  } data-id="an9tiqf3n" data-path="src/components/NotificationCenter.tsx">

                      <div className="flex items-start gap-3" data-id="zlk1hd3pu" data-path="src/components/NotificationCenter.tsx">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getNotificationColor(notification.type)}`} data-id="b8ekbokwp" data-path="src/components/NotificationCenter.tsx">
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0" data-id="6oy4iuali" data-path="src/components/NotificationCenter.tsx">
                          <div className="flex items-start justify-between gap-2" data-id="qtga7b97g" data-path="src/components/NotificationCenter.tsx">
                            <div className="flex-1" data-id="j6byp4x4o" data-path="src/components/NotificationCenter.tsx">
                              <p className={`font-medium text-sm ${!notification.is_read ? 'text-gray-900' : 'text-gray-700'}`} data-id="c7oprzm15" data-path="src/components/NotificationCenter.tsx">
                                {notification.title}
                              </p>
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2" data-id="vkfreus41" data-path="src/components/NotificationCenter.tsx">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2" data-id="h6kjjiivl" data-path="src/components/NotificationCenter.tsx">
                                {formatTime(notification.sent_at || notification.created_at)}
                              </p>
                            </div>
                            <DropdownMenu data-id="4nkh33v2j" data-path="src/components/NotificationCenter.tsx">
                              <DropdownMenuTrigger asChild data-id="3j347u8fw" data-path="src/components/NotificationCenter.tsx">
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0" data-id="9qkhxnv1y" data-path="src/components/NotificationCenter.tsx">
                                  <MoreVertical className="h-4 w-4" data-id="abx225xj8" data-path="src/components/NotificationCenter.tsx" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" data-id="1jzygl49t" data-path="src/components/NotificationCenter.tsx">
                                {!notification.is_read &&
                            <DropdownMenuItem
                              onClick={() => markAsRead(notification.ID)}
                              className="cursor-pointer" data-id="5eyana5s1" data-path="src/components/NotificationCenter.tsx">

                                    <Eye className="h-4 w-4 mr-2" data-id="8k7k4s84q" data-path="src/components/NotificationCenter.tsx" />
                                    Mark as read
                                  </DropdownMenuItem>
                            }
                                <DropdownMenuItem
                              onClick={() => deleteNotification(notification.ID)}
                              className="cursor-pointer text-red-600" data-id="6wk8rivm9" data-path="src/components/NotificationCenter.tsx">

                                  <Trash2 className="h-4 w-4 mr-2" data-id="hxsjgo3zo" data-path="src/components/NotificationCenter.tsx" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </div>
                    </div>
                    {index < notifications.length - 1 && <Separator data-id="axjt9l1m2" data-path="src/components/NotificationCenter.tsx" />}
                  </div>
              )}
              </div>
            }
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>);

}