import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { useReportStore } from '@/store/reportStore';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { FileText, Clock, Send, CheckCircle, XCircle, Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns-jalali';
import { toast } from 'sonner';

export default function Dashboard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuthStore();
  const { reports, isLoading, fetchReports } = useReportStore();

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  useEffect(() => {
    if (searchParams.get('welcome') === 'true') {
      toast.success(`خوش آمدید ${user?.firstName} عزیز!`, {
        description: 'ثبت‌نام شما با موفقیت انجام شد',
        duration: 5000,
      });
      // حذف پارامتر welcome از URL
      navigate('/dashboard', { replace: true });
    }
  }, [searchParams, user, navigate]);

  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    referred: reports.filter(r => r.status === 'referred').length,
    answered: reports.filter(r => r.status === 'answered').length,
    closed: reports.filter(r => r.status === 'closed').length,
  };

  const recentReports = reports.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* خوش‌آمدگویی */}
        <div>
          <h2 className="text-3xl font-bold mb-2">خوش آمدید، {user?.firstName} عزیز</h2>
          <p className="text-muted-foreground">مشاهده و مدیریت گزارش‌های خود</p>
        </div>

        {/* کارت‌های آماری */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatsCard
            title="کل گزارش‌ها"
            value={stats.total}
            icon={FileText}
            iconBgColor="bg-primary/10"
            iconColor="text-primary"
          />
          <StatsCard
            title="در انتظار بررسی"
            value={stats.pending}
            icon={Clock}
            iconBgColor="bg-status-pending/10"
            iconColor="text-status-pending"
          />
          <StatsCard
            title="ارجاع شده"
            value={stats.referred}
            icon={Send}
            iconBgColor="bg-status-referred/10"
            iconColor="text-status-referred"
          />
          <StatsCard
            title="پاسخ داده شده"
            value={stats.answered}
            icon={CheckCircle}
            iconBgColor="bg-status-answered/10"
            iconColor="text-status-answered"
          />
          <StatsCard
            title="بسته شده"
            value={stats.closed}
            icon={XCircle}
            iconBgColor="bg-status-closed/10"
            iconColor="text-status-closed"
          />
        </div>

        {/* گزارش‌های اخیر */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>آخرین گزارش‌ها</CardTitle>
            <Button variant="ghost" onClick={() => navigate('/dashboard/reports')}>
              مشاهده همه
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Button>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : recentReports.length === 0 ? (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">هنوز گزارشی ثبت نکرده‌اید</p>
                <Button onClick={() => navigate('/dashboard/new-report')}>
                  ثبت اولین گزارش
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {recentReports.map((report) => (
                  <div
                    key={report.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                    onClick={() => navigate(`/dashboard/reports/${report.id}`)}
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{report.title}</h3>
                        <ReportStatusBadge status={report.status} />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        کد رهگیری: {report.trackingCode}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {format(new Date(report.createdAt), 'dd MMMM yyyy - HH:mm')}
                      </p>
                    </div>
                    <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
