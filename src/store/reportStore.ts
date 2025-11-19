import { create } from 'zustand';
import { Report, Notification } from '@/lib/types';
import { MOCK_REPORTS, MOCK_NOTIFICATIONS } from '@/lib/mockData';

interface ReportState {
  reports: Report[];
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  fetchReports: () => Promise<void>;
  fetchNotifications: () => Promise<void>;
  markNotificationAsRead: (id: string) => void;
  markAllAsRead: () => void;
}

export const useReportStore = create<ReportState>((set) => ({
  reports: [],
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  fetchReports: async () => {
    set({ isLoading: true });
    // TODO: اتصال به API واقعی
    await new Promise(resolve => setTimeout(resolve, 500));
    set({ reports: MOCK_REPORTS, isLoading: false });
  },

  fetchNotifications: async () => {
    // TODO: اتصال به API واقعی
    await new Promise(resolve => setTimeout(resolve, 300));
    const unreadCount = MOCK_NOTIFICATIONS.filter(n => !n.isRead).length;
    set({ notifications: MOCK_NOTIFICATIONS, unreadCount });
  },

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map(n =>
        n.id === id ? { ...n, isRead: true } : n
      ),
      unreadCount: Math.max(0, state.unreadCount - 1),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, isRead: true })),
      unreadCount: 0,
    }));
  },
}));
