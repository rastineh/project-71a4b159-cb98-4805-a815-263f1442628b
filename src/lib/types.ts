// انواع داده‌های مورد استفاده در سامانه

export interface User {
  id: string;
  mobile: string;
  nationalId: string;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export type ReportStatus = 
  | 'pending'      // در انتظار بررسی
  | 'approved'     // تأیید شده
  | 'referred'     // ارجاع به نهاد
  | 'answered'     // پاسخ داده شده
  | 'closed'       // بسته شده
  | 'rejected';    // رد شده

export type ReportCategory =
  | 'programming'
  | 'software_violation'
  | 'system_issues'
  | 'security'
  | 'performance'
  | 'other';

export interface Report {
  id: string;
  trackingCode: string;
  title: string;
  category: ReportCategory;
  province: string;
  city: string;
  description: string;
  status: ReportStatus;
  files?: ReportFile[];
  createdAt: string;
  updatedAt: string;
  userId: string;
  response?: string;
  responseDate?: string;
}

export interface ReportFile {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface ReportStatusHistory {
  id: string;
  status: ReportStatus;
  date: string;
  note?: string;
}

export interface ChatMessage {
  id: string;
  reportId: string;
  senderId: string;
  senderType: 'user' | 'operator';
  message: string;
  files?: ReportFile[];
  createdAt: string;
  isRead: boolean;
}

export interface Notification {
  id: string;
  type: 'status_change' | 'new_message' | 'response';
  title: string;
  message: string;
  reportId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface Province {
  id: string;
  name: string;
}

export interface City {
  id: string;
  name: string;
  provinceId: string;
}

export const CATEGORIES: Record<ReportCategory, string> = {
  programming: 'برنامه‌نویسی',
  software_violation: 'تخلف نرم‌افزاری',
  system_issues: 'مشکلات سامانه‌ها',
  security: 'امنیت',
  performance: 'عملکرد',
  other: 'سایر',
};

export const STATUS_LABELS: Record<ReportStatus, string> = {
  pending: 'در انتظار بررسی',
  approved: 'تأیید شده',
  referred: 'ارجاع به نهاد',
  answered: 'پاسخ داده شده',
  closed: 'بسته شده',
  rejected: 'رد شده',
};
