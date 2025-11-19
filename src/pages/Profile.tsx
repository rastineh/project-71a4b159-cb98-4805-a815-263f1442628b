import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Phone, IdCard, LogOut, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Profile() {
  const navigate = useNavigate();
  const { user, updateProfile, logout } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('نام و نام‌خانوادگی نمی‌تواند خالی باشد');
      return;
    }

    setIsLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      toast.success('اطلاعات با موفقیت به‌روزرسانی شد');
    } catch (error) {
      toast.error('خطا در به‌روزرسانی اطلاعات');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('با موفقیت خارج شدید');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h2 className="text-2xl font-bold">پروفایل کاربری</h2>
          <p className="text-muted-foreground">مشاهده و ویرایش اطلاعات حساب کاربری</p>
        </div>

        {/* اطلاعات کاربر */}
        <Card>
          <CardHeader>
            <CardTitle>اطلاعات شخصی</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-12 w-12 text-primary" />
              </div>
            </div>

            {isEditing ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">نام‌خانوادگی</Label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleSave} disabled={isLoading} className="flex-1">
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    ذخیره تغییرات
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false);
                      setFormData({
                        firstName: user?.firstName || '',
                        lastName: user?.lastName || '',
                      });
                    }}
                    className="flex-1"
                  >
                    انصراف
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">نام و نام‌خانوادگی</div>
                      <div className="font-medium">
                        {user?.firstName} {user?.lastName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <Phone className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">شماره موبایل</div>
                      <div className="font-medium" dir="ltr">
                        {user?.mobile}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                    <IdCard className="h-5 w-5 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-sm text-muted-foreground">کد ملی</div>
                      <div className="font-medium" dir="ltr">
                        {user?.nationalId}
                      </div>
                    </div>
                  </div>
                </div>

                <Button onClick={() => setIsEditing(true)} className="w-full">
                  ویرایش اطلاعات
                </Button>
              </>
            )}
          </CardContent>
        </Card>

        {/* تنظیمات */}
        <Card>
          <CardHeader>
            <CardTitle>تنظیمات</CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              variant="destructive"
              onClick={handleLogout}
              className="w-full"
            >
              <LogOut className="ml-2 h-4 w-4" />
              خروج از حساب کاربری
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
