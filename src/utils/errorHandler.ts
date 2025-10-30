import React, { useState, useRef, useEffect } from 'react';

// 错误日志类型定义
export interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  componentName?: string;
}

// 记录错误到localStorage和console
export const logError = (message: string, error: Error, componentName?: string): void => {
  const errorLog: ErrorLog = {
    timestamp: new Date().toISOString(),
    message,
    stack: error.stack,
    componentName
  };

  // 记录到console
  console.error('[HabitTracker Error]', errorLog);

  // 记录到localStorage
  try {
    const existingLogs = localStorage.getItem('error_logs');
    const logs = existingLogs ? JSON.parse(existingLogs) : [];
    logs.push(errorLog);
    localStorage.setItem('error_logs', JSON.stringify(logs));
  } catch (storageError) {
    console.error('保存错误日志到localStorage失败:', storageError);
  }
};

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

// 防抖函数
export const debounce = <T extends (...args: any[]) => any>(func: T, waitFor: number): (...args: Parameters<T>) => void => {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>): void => {
    if (timeout !== null) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(() => func(...args), waitFor);
  };
};

// 防止组件卸载后setState
export const useSafeState = <T>(initialState: T): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const isMountedRef = useRef(true);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const safeSetState = (newState: React.SetStateAction<T>): void => {
    if (isMountedRef.current) {
      setState(newState);
    }
  };

  return [state, safeSetState];
};

// 全局错误处理器
export const setupGlobalErrorHandler = (): void => {
  window.addEventListener('error', (event) => {
    logError('全局错误:', event.error as Error, 'window.error');
  });

  window.addEventListener('unhandledrejection', (event) => {
    logError('未处理的Promise拒绝:', event.reason as Error, 'window.unhandledrejection');
  });

  // React错误边界
  const originalErrorBoundary = React.Component.prototype.componentDidCatch;
  React.Component.prototype.componentDidCatch = function(error, errorInfo) {
    logError('React组件错误:', error, this.constructor.name);
    if (originalErrorBoundary) {
      originalErrorBoundary.call(this, error, errorInfo);
    }
  };
};