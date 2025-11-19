import { ReactNode, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useReportStore } from '@/store/reportStore';
import { Button } from '@/components/ui/button';
import { Bell, FileText, Home, User, LogOut, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { unreadCount, fetchNotifications } = useReportStore();

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/dashboard', icon: Home, label: 'داشبورد' },
    { path: '/dashboard/reports', icon: FileText, label: 'گزارش‌های من' },
    { path: '/dashboard/notifications', icon: Bell, label: 'اعلان‌ها', badge: unreadCount },
    { path: '/dashboard/profile', icon: User, label: 'پروفایل' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* هدر */}
      <header className="bg-card border-b border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">رهگیریار</h1>
                <p className="text-xs text-muted-foreground">سامانه ملی گزارش‌دهی</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                onClick={() => navigate('/dashboard/new-report')}
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">ثبت گزارش جدید</span>
              </Button>

              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground hidden sm:inline">کاربر:</span>
                <span className="font-medium">{user?.firstName} {user?.lastName}</span>
              </div>

              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* نوار ناوبری موبایل */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 h-full relative',
                  isActive ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-xs mt-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="absolute top-2 right-1/2 translate-x-3 bg-destructive text-destructive-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </nav>

      {/* سایدبار دسکتاپ */}
      <div className="hidden lg:flex">
        <aside className="fixed right-0 top-16 h-[calc(100vh-4rem)] w-64 border-l border-border bg-card">
          <nav className="p-4 space-y-2">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-muted text-muted-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className="mr-auto bg-destructive text-destructive-foreground text-xs rounded-full px-2 py-0.5">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* محتوای اصلی */}
        <main className="mr-64 flex-1 p-6">
          <div className="container mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>

      {/* محتوای اصلی موبایل */}
      <main className="lg:hidden p-4 pb-20">
        {children}
      </main>
    </div>
  );
};
