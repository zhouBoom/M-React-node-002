// 安全的localStorage操作
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('读取localStorage失败:', error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('保存到localStorage失败:', error);
    }
  },

  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('删除localStorage项失败:', error);
    }
  },

  clear: (): void => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('清空localStorage失败:', error);
    }
  }
};

export { safeLocalStorage };

// 习惯数据类型定义
export interface Habit {
  id: string;
  name: string;
  icon: string;
  streak: number;
  completedToday: boolean;
  history: Record<string, boolean>;
}

// 主题设置类型
export interface Settings {
  theme: 'light' | 'dark';
}

// 存储习惯数据到localStorage
export const saveHabits = (habits: Habit[]): void => {
  try {
    safeLocalStorage.setItem('habits', JSON.stringify(habits));
  } catch (error) {
    console.error('保存习惯数据失败:', error);
  }
};

// 从localStorage读取习惯数据
export const getHabits = (): Habit[] => {
  try {
    const habitsStr = safeLocalStorage.getItem('habits');
    return habitsStr ? JSON.parse(habitsStr) : [];
  } catch (error) {
    console.error('读取习惯数据失败:', error);
    return [];
  }
};

// 保存设置到localStorage
export const saveSettings = (settings: Settings): void => {
  try {
    safeLocalStorage.setItem('settings', JSON.stringify(settings));
  } catch (error) {
    console.error('保存设置失败:', error);
  }
};

// 从localStorage读取设置
export const getSettings = (): Settings => {
  try {
    const settingsStr = safeLocalStorage.getItem('settings');
    return settingsStr ? JSON.parse(settingsStr) : { theme: 'light' };
  } catch (error) {
    console.error('读取设置失败:', error);
    return { theme: 'light' };
  }
};

// 生成唯一ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// 获取今天的日期字符串（YYYY-MM-DD）
export const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};