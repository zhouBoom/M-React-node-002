import { useState, useEffect, useCallback } from 'react';
import type { Habit } from '../utils/localStorage';
import { getHabits, saveHabits, generateId, getTodayString } from '../utils/localStorage';

export const useHabits = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  // 加载习惯数据
  const loadHabits = useCallback(() => {
    setLoading(true);
    const storedHabits = getHabits();
    // 检查是否需要重置每日完成状态
    const today = getTodayString();
    const updatedHabits = storedHabits.map(habit => {
      // 如果今天的数据不存在或数据是昨天的，重置completedToday
      const lastDate = Object.keys(habit.history).sort().pop();
      if (lastDate !== today) {
        return {
          ...habit,
          completedToday: false
        };
      }
      return habit;
    });
    setHabits(updatedHabits);
    setLoading(false);
  }, []);

  // 初始加载
  useEffect(() => {
    loadHabits();
  }, [loadHabits]);

  // 添加新习惯
  const addHabit = useCallback((name: string, icon: string = '📝') => {
    const newHabit: Habit = {
      id: generateId(),
      name,
      icon,
      streak: 0,
      completedToday: false,
      history: {}
    };
    const updatedHabits = [...habits, newHabit];
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
    return newHabit;
  }, [habits]);

  // 切换习惯完成状态
  const toggleHabitCompletion = useCallback((habitId: string) => {
    const today = getTodayString();
    const updatedHabits = habits.map(habit => {
      if (habit.id === habitId) {
        const newCompleted = !habit.completedToday;
        const newHistory = {
          ...habit.history,
          [today]: newCompleted
        };
        
        // 计算连续天数
        let newStreak = habit.streak;
        if (newCompleted) {
          // 获取昨天的日期
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yesterdayStr = yesterday.toISOString().split('T')[0];
          
          // 如果昨天完成了，增加连续天数
          if (habit.history[yesterdayStr]) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        } else if (habit.completedToday) {
          // 如果取消今天的完成，需要重新计算连续天数
          // 从最近的完成日期开始往前计算连续天数
          newStreak = 0;
          let currentDate = new Date();
          currentDate.setDate(currentDate.getDate() - 1); // 从昨天开始
          
          while (true) {
            const dateStr = currentDate.toISOString().split('T')[0];
            if (newHistory[dateStr]) {
              newStreak += 1;
              currentDate.setDate(currentDate.getDate() - 1);
            } else {
              break;
            }
          }
        }
        
        return {
          ...habit,
          completedToday: newCompleted,
          streak: newStreak,
          history: newHistory
        };
      }
      return habit;
    });
    
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  }, [habits]);

  // 删除习惯
  const deleteHabit = useCallback((habitId: string) => {
    const updatedHabits = habits.filter(habit => habit.id !== habitId);
    setHabits(updatedHabits);
    saveHabits(updatedHabits);
  }, [habits]);

  // 获取习惯历史统计
  const getHabitStats = useCallback((habitId: string) => {
    const habit = habits.find(h => h.id === habitId);
    if (!habit) return null;
    
    const totalDays = Object.keys(habit.history).length;
    const completedDays = Object.values(habit.history).filter(completed => completed).length;
    const completionRate = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;
    
    return {
      totalDays,
      completedDays,
      completionRate,
      currentStreak: habit.streak
    };
  }, [habits]);

  return {
    habits,
    loading,
    addHabit,
    toggleHabitCompletion,
    deleteHabit,
    getHabitStats,
    refreshHabits: loadHabits
  };
};