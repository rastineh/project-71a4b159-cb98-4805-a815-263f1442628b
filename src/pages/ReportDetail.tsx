import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { ReportStatusBadge } from '@/components/reports/ReportStatusBadge';
import { ReportTimeline } from '@/components/reports/ReportTimeline';
import { ChatSection } from '@/components/reports/ChatSection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowRight, Copy, FileText, Clock, MapPin, Loader2 } from 'lucide-react';
import { MOCK_REPORTS, MOCK_STATUS_HISTORY, MOCK_MESSAGES } from '@/lib/mockData';
import { CATEGORIES } from '@/lib/types';
import { format } from 'date-fns-jalali';
import { toast } from 'sonner';

export default function ReportDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  
  // TODO: فراخوانی از API واقعی
  const report = MOCK_REPORTS.find(r => r.id === id);
  const statusHistory = MOCK_STATUS_HISTORY[id || ''] || [];
  const messages = MOCK_MESSAGES[id || ''] || [];

  useEffect(() => {
    // شبیه‌سازی بارگذاری
    setTimeout(() => setIsLoading(false), 500);
  }, [id]);

  const handleCopyTrackingCode = () => {
    if (report) {
      navigator.clipboard.writeText(report.trackingCode);
      toast.success('کد رهگیری کپی شد');
    }
  };

  const handleSendMessage = async (message: string, files?: File[]) => {
    // TODO: ارسال پیام به API
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success('پیام ارسال شد');
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex justify-center items-center min-h-[400px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!report) {
    return (
      <DashboardLayout>
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-bold mb-2">گزارش یافت نشد</h3>
            <p className="text-muted-foreground mb-4">گزارش مورد نظر وجود ندارد</p>
            <Button onClick={() => navigate('/dashboard/reports')}>
              بازگشت به لیست گزارش‌ها
            </Button>
          </CardContent>
        </Card>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* دکمه بازگشت */}
        <Button variant="ghost" onClick={() => navigate('/dashboard/reports')}>
          <ArrowRight className="ml-2 h-4 w-4" />
          بازگشت به لیست
        </Button>

        {/* هدر گزارش */}
        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-2xl mb-2">{report.title}</CardTitle>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <code className="text-sm font-mono bg-muted px-2 py-1 rounded">
                    {report.trackingCode}
                  </code>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopyTrackingCode}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <ReportStatusBadge status={report.status} />
            </div>
          </CardHeader>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ستون راست - اطلاعات گزارش */}
          <div className="lg:col-span-2 space-y-6">
            {/* جزئیات گزارش */}
            <Card>
              <CardHeader>
                <CardTitle>جزئیات گزارش</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">دسته‌بندی</div>
                    <div className="font-medium">{CATEGORIES[report.category]}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">تاریخ ثبت</div>
                    <div className="font-medium flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      {format(new Date(report.createdAt), 'dd MMMM yyyy - HH:mm')}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">موقعیت</div>
                    <div className="font-medium flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      {report.province} - {report.city}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground mb-1">آخرین بروزرسانی</div>
                    <div className="font-medium">
                      {format(new Date(report.updatedAt), 'dd MMMM yyyy - HH:mm')}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-sm text-muted-foreground mb-2">توضیحات</div>
                  <div className="p-4 bg-muted rounded-lg whitespace-pre-wrap">
                    {report.description}
                  </div>
                </div>

                {report.files && report.files.length > 0 && (
                  <div>
                    <div className="text-sm text-muted-foreground mb-2">فایل‌های ضمیمه</div>
                    <div className="grid grid-cols-2 gap-2">
                      {report.files.map((file) => (
                        <div
                          key={file.id}
                          className="p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                        >
                          <div className="text-sm font-medium truncate">{file.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {(file.size / 1024).toFixed(2)} KB
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* پاسخ نهایی */}
            {report.response && (
              <Card>
                <CardHeader>
                  <CardTitle>پاسخ نهایی نهاد</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="p-4 bg-status-answered/10 border border-status-answered/20 rounded-lg">
                    <div className="whitespace-pre-wrap">{report.response}</div>
                    {report.responseDate && (
                      <div className="text-sm text-muted-foreground mt-3">
                        تاریخ پاسخ: {format(new Date(report.responseDate), 'dd MMMM yyyy - HH:mm')}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* چت */}
            <Card>
              <CardHeader>
                <CardTitle>گفتگو با اپراتور مرکز</CardTitle>
              </CardHeader>
              <CardContent>
                <ChatSection
                  messages={messages}
                  reportId={report.id}
                  onSendMessage={handleSendMessage}
                />
              </CardContent>
            </Card>
          </div>

          {/* ستون چپ - تایم‌لاین */}
          <div className="lg:col-span-1">
            <Card className="sticky top-20">
              <CardHeader>
                <CardTitle>تاریخچه وضعیت</CardTitle>
              </CardHeader>
              <CardContent>
                <ReportTimeline history={statusHistory} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
