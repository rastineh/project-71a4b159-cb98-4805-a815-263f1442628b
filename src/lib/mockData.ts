import { Province, City, Report, ReportStatusHistory, ChatMessage, Notification } from './types';

// داده‌های تست استان‌ها و شهرها
export const PROVINCES: Province[] = [
  { id: '1', name: 'تهران' },
  { id: '2', name: 'اصفهان' },
  { id: '3', name: 'فارس' },
  { id: '4', name: 'خراسان رضوی' },
  { id: '5', name: 'خوزستان' },
];

export const CITIES: City[] = [
  { id: '1-1', name: 'تهران', provinceId: '1' },
  { id: '1-2', name: 'شهریار', provinceId: '1' },
  { id: '1-3', name: 'ری', provinceId: '1' },
  { id: '2-1', name: 'اصفهان', provinceId: '2' },
  { id: '2-2', name: 'کاشان', provinceId: '2' },
  { id: '3-1', name: 'شیراز', provinceId: '3' },
  { id: '3-2', name: 'مرودشت', provinceId: '3' },
  { id: '4-1', name: 'مشهد', provinceId: '4' },
  { id: '4-2', name: 'نیشابور', provinceId: '4' },
  { id: '5-1', name: 'اهواز', provinceId: '5' },
  { id: '5-2', name: 'دزفول', provinceId: '5' },
];

// داده‌های تست گزارش‌ها
export const MOCK_REPORTS: Report[] = [
  {
    id: '1',
    trackingCode: 'RG-1403987601',
    title: 'مشکل در سامانه احراز هویت',
    category: 'system_issues',
    province: 'تهران',
    city: 'تهران',
    description: 'سامانه احراز هویت با خطا مواجه می‌شود و امکان ورود وجود ندارد.',
    status: 'answered',
    createdAt: '2024-01-15T10:30:00',
    updatedAt: '2024-01-18T14:20:00',
    userId: 'user1',
    response: 'مشکل شناسایی و برطرف شد. از صبوری شما متشکریم.',
    responseDate: '2024-01-18T14:20:00',
  },
  {
    id: '2',
    trackingCode: 'RG-1403987602',
    title: 'گزارش تخلف نرم‌افزاری',
    category: 'software_violation',
    province: 'اصفهان',
    city: 'اصفهان',
    description: 'نرم‌افزار غیرمجاز در سیستم نصب شده است.',
    status: 'referred',
    createdAt: '2024-01-20T09:15:00',
    updatedAt: '2024-01-21T11:00:00',
    userId: 'user1',
  },
  {
    id: '3',
    trackingCode: 'RG-1403987603',
    title: 'مشکل امنیتی در پورتال',
    category: 'security',
    province: 'فارس',
    city: 'شیراز',
    description: 'آسیب‌پذیری امنیتی در بخش ورود به سیستم مشاهده شده است.',
    status: 'pending',
    createdAt: '2024-01-22T16:45:00',
    updatedAt: '2024-01-22T16:45:00',
    userId: 'user1',
  },
];

export const MOCK_STATUS_HISTORY: Record<string, ReportStatusHistory[]> = {
  '1': [
    { id: '1-1', status: 'pending', date: '2024-01-15T10:30:00', note: 'ثبت گزارش' },
    { id: '1-2', status: 'approved', date: '2024-01-16T09:00:00', note: 'تأیید و بررسی اولیه' },
    { id: '1-3', status: 'referred', date: '2024-01-17T11:30:00', note: 'ارجاع به واحد فنی' },
    { id: '1-4', status: 'answered', date: '2024-01-18T14:20:00', note: 'پاسخ نهایی ارسال شد' },
  ],
  '2': [
    { id: '2-1', status: 'pending', date: '2024-01-20T09:15:00', note: 'ثبت گزارش' },
    { id: '2-2', status: 'approved', date: '2024-01-20T15:00:00', note: 'تأیید گزارش' },
    { id: '2-3', status: 'referred', date: '2024-01-21T11:00:00', note: 'ارجاع به نهاد مربوطه' },
  ],
  '3': [
    { id: '3-1', status: 'pending', date: '2024-01-22T16:45:00', note: 'ثبت گزارش' },
  ],
};

export const MOCK_MESSAGES: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: 'm1-1',
      reportId: '1',
      senderId: 'user1',
      senderType: 'user',
      message: 'سلام، لطفاً در اسرع وقت این مشکل را بررسی کنید.',
      createdAt: '2024-01-15T10:35:00',
      isRead: true,
    },
    {
      id: 'm1-2',
      reportId: '1',
      senderId: 'op1',
      senderType: 'operator',
      message: 'سلام، گزارش شما دریافت شد و در حال بررسی است.',
      createdAt: '2024-01-15T11:00:00',
      isRead: true,
    },
    {
      id: 'm1-3',
      reportId: '1',
      senderId: 'op1',
      senderType: 'operator',
      message: 'مشکل شناسایی و برطرف شد. از صبوری شما متشکریم.',
      createdAt: '2024-01-18T14:20:00',
      isRead: true,
    },
  ],
  '2': [
    {
      id: 'm2-1',
      reportId: '2',
      senderId: 'user1',
      senderType: 'user',
      message: 'این گزارش فوری است.',
      createdAt: '2024-01-20T09:20:00',
      isRead: true,
    },
  ],
};

export const MOCK_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'status_change',
    title: 'تغییر وضعیت گزارش',
    message: 'گزارش RG-1403987601 به وضعیت «پاسخ داده شده» تغییر یافت.',
    reportId: '1',
    isRead: false,
    createdAt: '2024-01-18T14:20:00',
  },
  {
    id: 'n2',
    type: 'new_message',
    title: 'پیام جدید',
    message: 'پیام جدیدی در گزارش RG-1403987601 دریافت شد.',
    reportId: '1',
    isRead: false,
    createdAt: '2024-01-18T14:21:00',
  },
  {
    id: 'n3',
    type: 'status_change',
    title: 'تغییر وضعیت گزارش',
    message: 'گزارش RG-1403987602 به وضعیت «ارجاع به نهاد» تغییر یافت.',
    reportId: '2',
    isRead: true,
    createdAt: '2024-01-21T11:00:00',
  },
];
