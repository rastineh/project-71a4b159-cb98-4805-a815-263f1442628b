import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useReportStore } from '@/store/reportStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Bell, CheckCheck, FileText, MessageSquare, RefreshCw } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { cn } from '@/lib/utils';

export default function Notifications() {
  const navigate = useNavigate();
  const { notifications, fetchNotifications, markNotificationAsRead, markAllAsRead } =
    useReportStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleNotificationClick = (id: string, reportId?: string) => {
    markNotificationAsRead(id);
    if (reportId) {
      navigate(`/dashboard/reports/${reportId}`);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'status_change':
        return RefreshCw;
      case 'new_message':
        return MessageSquare;
      case 'response':
        return FileText;
      default:
        return Bell;
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">اعلان‌ها</h2>
            <p className="text-muted-foreground">
              {notifications.filter((n) => !n.isRead).length} اعلان خوانده نشده
            </p>
          </div>
          {notifications.some((n) => !n.isRead) && (
            <Button variant="outline" onClick={markAllAsRead}>
              <CheckCheck className="ml-2 h-4 w-4" />
              علامت‌گذاری همه به‌عنوان خوانده شده
            </Button>
          )}
        </div>

        <Card>
          <CardContent className="p-0">
            {notifications.length === 0 ? (
              <div className="text-center py-12">
                <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">اعلانی وجود ندارد</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => {
                  const Icon = getIcon(notification.type);
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        'p-4 cursor-pointer hover:bg-muted/50 transition-colors',
                        !notification.isRead && 'bg-accent/5'
                      )}
                      onClick={() =>
                        handleNotificationClick(notification.id, notification.reportId)
                      }
                    >
                      <div className="flex gap-4">
                        <div
                          className={cn(
                            'w-10 h-10 rounded-full flex items-center justify-center shrink-0',
                            !notification.isRead ? 'bg-primary/10' : 'bg-muted'
                          )}
                        >
                          <Icon
                            className={cn(
                              'h-5 w-5',
                              !notification.isRead ? 'text-primary' : 'text-muted-foreground'
                            )}
                          />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-medium mb-1">{notification.title}</h3>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <div className="w-2 h-2 bg-primary rounded-full shrink-0 mt-2" />
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            {format(new Date(notification.createdAt), 'dd MMMM yyyy - HH:mm')}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
