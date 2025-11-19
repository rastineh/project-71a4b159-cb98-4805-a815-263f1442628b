import { create } from 'zustand';
import { User } from '@/lib/types';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (mobile: string, otp: string) => Promise<void>;
  register: (data: { mobile: string; nationalId: string; firstName: string; lastName: string; otp: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  checkAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (mobile: string, otp: string) => {
    // TODO: اتصال به API واقعی
    // در حال حاضر از داده‌های تست استفاده می‌شود
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (otp === '123456') {
      const user: User = {
        id: '1',
        mobile,
        nationalId: '0123456789',
        firstName: 'محمد',
        lastName: 'محمدی',
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      throw new Error('کد وارد شده صحیح نمی‌باشد');
    }
  },

  register: async (data) => {
    // TODO: اتصال به API واقعی
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (data.otp === '123456') {
      const user: User = {
        id: '1',
        mobile: data.mobile,
        nationalId: data.nationalId,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString(),
      };
      
      localStorage.setItem('auth_token', 'mock_token_123');
      localStorage.setItem('user', JSON.stringify(user));
      
      set({ user, isAuthenticated: true, isLoading: false });
    } else {
      throw new Error('کد وارد شده صحیح نمی‌باشد');
    }
  },

  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    set({ user: null, isAuthenticated: false });
  },

  updateProfile: async (data) => {
    // TODO: اتصال به API واقعی
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set((state) => {
      if (!state.user) return state;
      
      const updatedUser = { ...state.user, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      
      return { user: updatedUser };
    });
  },

  checkAuth: () => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ user: null, isAuthenticated: false, isLoading: false });
      }
    } else {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },
}));
