import type { Task } from './localStorage';
import { logError } from './errorHandler';

export interface TaskHealth {
  id: string;
  name: string;
  success: number;
  fail: number;
  health: number;
  status: '数据不足' | '异常' | '一般' | '健康';
}

/**
 * 计算任务健康度
 * @param tasks 任务列表
 * @returns 包含健康度信息的任务列表
 */
export const calculateTaskHealth = (tasks: Task[]): TaskHealth[] => {
  try {
    if (!Array.isArray(tasks)) {
      throw new Error('任务数据不是有效的数组');
    }

    return tasks.map(task => {
      try {
        const { id, name, success, fail } = task;

        // 验证数据类型
        if (typeof success !== 'number' || typeof fail !== 'number') {
          throw new Error(`任务 ${name} 的成功/失败次数不是有效的数字`);
        }

        const total = success + fail;
        let health = 0;
        let status: TaskHealth['status'] = '数据不足';

        if (total >= 3) {
          health = Math.round((success / total) * 100);
          
          if (health < 60) {
            status = '异常';
          } else if (health >= 60 && health < 90) {
            status = '一般';
          } else if (health >= 90) {
            status = '健康';
          }
        }

        return {
          id,
          name,
          success,
          fail,
          health,
          status
        };
      } catch (error) {
        logError(`计算任务 ${task?.name || '未知'} 健康度失败:`, error as Error, 'calculateTaskHealth');
        // 返回默认值，避免整个计算失败
        return {
          id: task?.id || '',
          name: task?.name || '未知任务',
          success: task?.success || 0,
          fail: task?.fail || 0,
          health: 0,
          status: '数据不足'
        };
      }
    });
  } catch (error) {
    logError('计算任务健康度失败:', error as Error, 'calculateTaskHealth');
    return [];
  }
};

/**
 * 获取状态标签的颜色
 * @param status 状态
 * @returns 颜色值
 */
export const getStatusColor = (status: TaskHealth['status']): string => {
  switch (status) {
    case '健康':
      return '#52c41a';
    case '一般':
      return '#faad14';
    case '异常':
      return '#f5222d';
    case '数据不足':
    default:
      return '#bfbfbf';
  }
};