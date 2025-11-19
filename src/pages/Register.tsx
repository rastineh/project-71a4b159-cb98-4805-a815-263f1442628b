import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { OTPInput } from '@/components/auth/OTPInput';
import { FileText, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Register() {
  const navigate = useNavigate();
  const { register, isAuthenticated } = useAuthStore();
  const [step, setStep] = useState<'info' | 'otp'>('info');
  const [formData, setFormData] = useState({
    mobile: '',
    nationalId: '',
    firstName: '',
    lastName: '',
  });
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!/^09\d{9}$/.test(formData.mobile)) {
      toast.error('شماره موبایل نامعتبر است');
      return false;
    }
    if (!/^\d{10}$/.test(formData.nationalId)) {
      toast.error('کد ملی باید ۱۰ رقم باشد');
      return false;
    }
    if (!formData.firstName.trim() || !formData.lastName.trim()) {
      toast.error('نام و نام‌خانوادگی الزامی است');
      return false;
    }
    return true;
  };

  const handleSendOtp = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      // TODO: فراخوانی API ارسال OTP
      await new Promise(resolve => setTimeout(resolve, 1000));
      setStep('otp');
      setCountdown(120);
      toast.success('کد تأیید ارسال شد');
    } catch (error) {
      toast.error('خطا در ارسال کد تأیید');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (otp.length !== 6) {
      toast.error('کد تأیید باید ۶ رقم باشد');
      return;
    }

    setIsLoading(true);
    try {
      await register({ ...formData, otp });
      toast.success('ثبت‌نام با موفقیت انجام شد');
      navigate('/dashboard?welcome=true');
    } catch (error: any) {
      toast.error(error.message || 'خطا در ثبت‌نام');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* لوگو و عنوان */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <FileText className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold mb-2">رهگیریار</h1>
          <p className="text-muted-foreground">سامانه ملی گزارش‌دهی و پیگیری</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>ثبت‌نام در سامانه</CardTitle>
            <CardDescription>
              {step === 'info' 
                ? 'اطلاعات خود را وارد کنید'
                : 'کد ۶ رقمی ارسال شده را وارد کنید'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {step === 'info' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="mobile">شماره موبایل</Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="09123456789"
                    value={formData.mobile}
                    onChange={(e) => handleChange('mobile', e.target.value)}
                    maxLength={11}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="nationalId">کد ملی</Label>
                  <Input
                    id="nationalId"
                    type="text"
                    placeholder="0123456789"
                    value={formData.nationalId}
                    onChange={(e) => handleChange('nationalId', e.target.value)}
                    maxLength={10}
                    dir="ltr"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firstName">نام</Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="نام خود را وارد کنید"
                    value={formData.firstName}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName">نام‌خانوادگی</Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="نام‌خانوادگی خود را وارد کنید"
                    value={formData.lastName}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                  />
                </div>

                <Button 
                  className="w-full" 
                  onClick={handleSendOtp}
                  disabled={isLoading}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  ارسال کد تأیید
                </Button>
              </>
            ) : (
              <>
                <div>
                  <OTPInput value={otp} onChange={setOtp} />
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    کد تأیید به شماره {formData.mobile} ارسال شد
                  </p>
                </div>

                {countdown > 0 ? (
                  <p className="text-sm text-center text-muted-foreground">
                    ارسال مجدد کد تا {countdown} ثانیه دیگر
                  </p>
                ) : (
                  <Button 
                    variant="ghost" 
                    className="w-full"
                    onClick={handleSendOtp}
                  >
                    ارسال مجدد کد
                  </Button>
                )}

                <Button 
                  className="w-full" 
                  onClick={handleRegister}
                  disabled={isLoading || otp.length !== 6}
                >
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  تأیید و ثبت‌نام
                </Button>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setStep('info')}
                >
                  بازگشت
                </Button>
              </>
            )}

            <div className="text-center text-sm">
              <span className="text-muted-foreground">حساب کاربری دارید؟ </span>
              <Link to="/login" className="text-primary hover:underline">
                وارد شوید
              </Link>
            </div>
          </CardContent>
        </Card>

        <p className="text-xs text-center text-muted-foreground mt-4">
          برای تست از کد ۱۲۳۴۵۶ استفاده کنید
        </p>
      </div>
    </div>
  );
}
