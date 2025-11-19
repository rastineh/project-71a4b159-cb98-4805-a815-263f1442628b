import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { ArrowRight, ArrowLeft, CheckCircle, Upload, X, Copy, Loader2 } from 'lucide-react';
import { CATEGORIES } from '@/lib/types';
import { PROVINCES, CITIES } from '@/lib/mockData';
import { toast } from 'sonner';

export default function NewReport() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [trackingCode, setTrackingCode] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    province: '',
    city: '',
    description: '',
    files: [] as File[],
  });

  const progress = (step / 4) * 100;

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (field === 'province') {
      setFormData(prev => ({ ...prev, city: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    if (files.length + formData.files.length > 5) {
      toast.error('حداکثر ۵ فایل مجاز است');
      return;
    }

    const validFiles = files.filter(file => {
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`فایل ${file.name} بیش از ۱۰ مگابایت است`);
        return false;
      }
      return true;
    });

    setFormData(prev => ({
      ...prev,
      files: [...prev.files, ...validFiles],
    }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
    }));
  };

  const validateStep = () => {
    switch (step) {
      case 1:
        if (!formData.title.trim() || !formData.category) {
          toast.error('عنوان و دسته‌بندی الزامی است');
          return false;
        }
        return true;
      case 2:
        if (!formData.province || !formData.city) {
          toast.error('استان و شهر الزامی است');
          return false;
        }
        return true;
      case 3:
        if (formData.description.trim().length < 20) {
          toast.error('توضیحات باید حداقل ۲۰ کاراکتر باشد');
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep()) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const generateTrackingCode = () => {
    const randomNum = Math.floor(10000000 + Math.random() * 90000000);
    return `RG-14${randomNum}`;
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      // TODO: ارسال به API واقعی
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const code = generateTrackingCode();
      setTrackingCode(code);
      setStep(5);
      toast.success('گزارش با موفقیت ثبت شد');
    } catch (error) {
      toast.error('خطا در ثبت گزارش');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTrackingCode = () => {
    navigator.clipboard.writeText(trackingCode);
    toast.success('کد رهگیری کپی شد');
  };

  const availableCities = CITIES.filter(
    city => city.provinceId === formData.province
  );

  if (step === 5) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="w-16 h-16 bg-status-answered/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-status-answered" />
              </div>
              <h2 className="text-2xl font-bold mb-2">گزارش با موفقیت ثبت شد</h2>
              <p className="text-muted-foreground mb-6">
                گزارش شما در سامانه ثبت شد و پس از بررسی اولیه، به نهاد مربوطه ارجاع خواهد شد.
              </p>

              <div className="bg-muted p-6 rounded-lg mb-6">
                <Label className="text-sm">کد رهگیری</Label>
                <div className="flex items-center gap-2 mt-2">
                  <code className="flex-1 text-2xl font-bold bg-background p-3 rounded border" dir="ltr">
                    {trackingCode}
                  </code>
                  <Button size="icon" onClick={copyTrackingCode}>
                    <Copy className="h-5 w-5" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  این کد را برای پیگیری گزارش خود ذخیره کنید
                </p>
              </div>

              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => navigate('/dashboard/reports')}>
                  مشاهده گزارش‌های من
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => navigate('/dashboard')}>
                  بازگشت به داشبورد
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">ثبت گزارش جدید</h2>
          <p className="text-muted-foreground">مرحله {step} از ۴</p>
          <Progress value={progress} className="mt-2" />
        </div>

        <Card>
          <CardContent className="pt-6">
            {step === 1 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">عنوان گزارش *</Label>
                  <Input
                    id="title"
                    placeholder="عنوان مختصر گزارش خود را وارد کنید"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">دسته‌بندی *</Label>
                  <Select value={formData.category} onValueChange={(val) => handleChange('category', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="یک دسته انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORIES).map(([key, label]) => (
                        <SelectItem key={key} value={key}>
                          {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="province">استان *</Label>
                  <Select value={formData.province} onValueChange={(val) => handleChange('province', val)}>
                    <SelectTrigger>
                      <SelectValue placeholder="استان را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {PROVINCES.map((province) => (
                        <SelectItem key={province.id} value={province.id}>
                          {province.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">شهر *</Label>
                  <Select 
                    value={formData.city} 
                    onValueChange={(val) => handleChange('city', val)}
                    disabled={!formData.province}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="شهر را انتخاب کنید" />
                    </SelectTrigger>
                    <SelectContent>
                      {availableCities.map((city) => (
                        <SelectItem key={city.id} value={city.id}>
                          {city.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="description">توضیحات (حداقل ۲۰ کاراکتر) *</Label>
                  <Textarea
                    id="description"
                    placeholder="توضیحات کامل گزارش خود را بنویسید..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={6}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.description.length} / حداقل ۲۰ کاراکتر
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="files">فایل‌های ضمیمه (اختیاری - حداکثر ۵ فایل، هر فایل تا ۱۰ مگابایت)</Label>
                  <div className="border-2 border-dashed rounded-lg p-4">
                    <Input
                      id="files"
                      type="file"
                      multiple
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <label
                      htmlFor="files"
                      className="flex flex-col items-center cursor-pointer"
                    >
                      <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                      <span className="text-sm text-muted-foreground">
                        کلیک کنید یا فایل را بکشید
                      </span>
                    </label>
                  </div>

                  {formData.files.length > 0 && (
                    <div className="space-y-2 mt-4">
                      {formData.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between p-2 bg-muted rounded">
                          <span className="text-sm truncate">{file.name}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold">پیش‌نمایش گزارش</h3>
                
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">عنوان</Label>
                    <p className="font-medium">{formData.title}</p>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">دسته‌بندی</Label>
                    <p className="font-medium">{CATEGORIES[formData.category as keyof typeof CATEGORIES]}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-muted-foreground">استان</Label>
                      <p className="font-medium">
                        {PROVINCES.find(p => p.id === formData.province)?.name}
                      </p>
                    </div>
                    <div>
                      <Label className="text-muted-foreground">شهر</Label>
                      <p className="font-medium">
                        {CITIES.find(c => c.id === formData.city)?.name}
                      </p>
                    </div>
                  </div>

                  <div>
                    <Label className="text-muted-foreground">توضیحات</Label>
                    <p className="font-medium whitespace-pre-wrap">{formData.description}</p>
                  </div>

                  {formData.files.length > 0 && (
                    <div>
                      <Label className="text-muted-foreground">فایل‌های ضمیمه</Label>
                      <p className="font-medium">{formData.files.length} فایل</p>
                    </div>
                  )}
                </div>

                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    با کلیک بر روی دکمه «ثبت نهایی»، گزارش شما در سامانه ثبت شده و کد رهگیری به شما اختصاص می‌یابد.
                  </p>
                </div>
              </div>
            )}

            <div className="flex gap-2 mt-6">
              {step > 1 && step < 4 && (
                <Button variant="outline" onClick={handleBack}>
                  <ArrowRight className="ml-2 h-4 w-4" />
                  مرحله قبل
                </Button>
              )}

              {step < 4 ? (
                <Button className="flex-1" onClick={handleNext}>
                  مرحله بعد
                  <ArrowLeft className="mr-2 h-4 w-4" />
                </Button>
              ) : (
                <>
                  <Button variant="outline" onClick={handleBack}>
                    <ArrowRight className="ml-2 h-4 w-4" />
                    بازگشت
                  </Button>
                  <Button 
                    className="flex-1" 
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
                    ثبت نهایی
                  </Button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
