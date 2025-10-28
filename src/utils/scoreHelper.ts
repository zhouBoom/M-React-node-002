// 积分数据类型定义
export interface ScoreData {
  totalScore: number;
  lastUpdated: string;
  // 存储每个习惯的积分历史，用于计算连续奖励
  habitScores: Record<string, {
    totalScore: number;
    consecutiveDays: number;
    lastRewardDay?: string;
  }>;
}

// 从localStorage读取积分数据
export const getScoreData = (): ScoreData => {
  try {
    const scoreStr = localStorage.getItem('scores');
    return scoreStr ? JSON.parse(scoreStr) : {
      totalScore: 0,
      lastUpdated: new Date().toISOString(),
      habitScores: {}
    };
  } catch (error) {
    console.error('读取积分数据失败:', error);
    return {
      totalScore: 0,
      lastUpdated: new Date().toISOString(),
      habitScores: {}
    };
  }
};

// 保存积分数据到localStorage
export const saveScoreData = (scoreData: ScoreData): void => {
  try {
    localStorage.setItem('scores', JSON.stringify(scoreData));
  } catch (error) {
    console.error('保存积分数据失败:', error);
  }
};

// 获取今天的日期字符串
const getTodayString = (): string => {
  return new Date().toISOString().split('T')[0];
};

// 计算习惯完成时的积分奖励
export const calculateHabitCompletionScore = (
  habitId: string,
  isCompletion: boolean,
  currentStreak: number
): {
  scoreData: ScoreData;
  earnedScore: number;
  message?: string;
} => {
  const scoreData = getScoreData();
  let earnedScore = 0;
  let message = '';
  
  // 确保习惯的积分数据存在
  if (!scoreData.habitScores[habitId]) {
    scoreData.habitScores[habitId] = {
      totalScore: 0,
      consecutiveDays: 0
    };
  }
  
  const habitScore = scoreData.habitScores[habitId];
  const today = getTodayString();
  
  if (isCompletion) {
    // 完成习惯奖励10积分
    earnedScore = 10;
    message = '完成习惯获得10积分！';
    
    // 检查是否达到7天连续完成
    if (currentStreak === 7 && habitScore.lastRewardDay !== today) {
      earnedScore += 50;
      message = '连续7天完成习惯！额外奖励50积分！';
      habitScore.lastRewardDay = today;
    }
    
    // 更新积分数据
    habitScore.consecutiveDays = currentStreak;
  } else {
    // 如果取消完成，需要减去已获得的积分
    // 但要避免减去连续奖励的积分
    earnedScore = -10;
    message = '取消习惯完成，扣除10积分';
    
    // 重新计算连续天数
    habitScore.consecutiveDays = Math.max(0, currentStreak);
  }
  
  // 更新总积分
  habitScore.totalScore += earnedScore;
  scoreData.totalScore += earnedScore;
  scoreData.lastUpdated = new Date().toISOString();
  
  // 确保积分不为负数
  if (habitScore.totalScore < 0) habitScore.totalScore = 0;
  if (scoreData.totalScore < 0) scoreData.totalScore = 0;
  
  saveScoreData(scoreData);
  
  return {
    scoreData,
    earnedScore,
    message
  };
};

// 获取成就数据
export const getAchievementData = (habits: Array<{
  id: string;
  name: string;
  icon: string;
  streak: number;
  history: Record<string, boolean>;
}>) => {
  const scoreData = getScoreData();
  
  // 找出完成次数最多的习惯
  let maxCompletions = 0;
  let mostCompletedHabit: any = null;
  
  habits.forEach(habit => {
    const completions = Object.values(habit.history).filter(completed => completed).length;
    if (completions > maxCompletions) {
      maxCompletions = completions;
      mostCompletedHabit = habit;
    }
  });
  
  // 找出连续天数最长的习惯
  let maxStreak = 0;
  let longestStreakHabit: any = null;
  
  habits.forEach(habit => {
    if (habit.streak > maxStreak) {
      maxStreak = habit.streak;
      longestStreakHabit = habit;
    }
  });
  
  return {
    totalScore: scoreData.totalScore,
    mostCompletedHabit: mostCompletedHabit ? {
      name: mostCompletedHabit.name,
      icon: mostCompletedHabit.icon,
      completions: maxCompletions
    } : null,
    longestStreakHabit: longestStreakHabit ? {
      name: longestStreakHabit.name,
      icon: longestStreakHabit.icon,
      streak: maxStreak
    } : null
  };
};

// 获取最近7天的统计数据
export const getWeeklyStats = (habits: Array<{
  id: string;
  name: string;
  history: Record<string, boolean>;
}>) => {
  const today = new Date();
  const dateLabels: string[] = [];
  const dailyCompletions: number[] = [];
  
  // 生成最近7天的日期
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    const dateLabel = `${date.getMonth() + 1}/${date.getDate()}`;
    dateLabels.push(dateLabel);
    
    // 计算当天完成的习惯数量
    let completedCount = 0;
    habits.forEach(habit => {
      if (habit.history[dateStr]) {
        completedCount++;
      }
    });
    dailyCompletions.push(completedCount);
  }
  
  return {
    dateLabels,
    dailyCompletions
  };
};