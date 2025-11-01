import type { Task } from './localStorage';
import { logError } from './errorHandler';

export interface TaskHealth {    id: string;
    name: string;
    success: number;
    fail: number;
    healthScore: number;
    status: '异常' | '一般' | '健康' | '数据不足';
}

export const calculateTaskHealth = (tasks: Task[]): TaskHealth[] => {
    return tasks.map(task => {
        try {
            const { id, name, success, fail } = task;
            const total = success + fail;
            let healthScore = 0;
            let status: TaskHealth['status'] = '数据不足';

            if (total >= 3) {
                healthScore = Math.round((success / total) * 100);
                
                if (healthScore < 60) {
                    status = '异常';
                } else if (healthScore < 90) {
                    status = '一般';
                } else {
                    status = '健康';
                }
            }

            return { id, name, success, fail, healthScore, status };
        } catch (error) {
            logError(`计算任务 ${task.name} 健康度失败:`, error as Error, 'calculateTaskHealth');
            return {
                id: task.id,
                name: task.name,
                success: task.success,
                fail: task.fail,
                healthScore: 0,
                status: '数据不足'
            };
        }
    });
};

export const getStatusColor = (status: TaskHealth['status']): string => {
    switch (status) {
        case '异常':
            return '#FF4D4F';
        case '一般':
            return '#FF7D00';
        case '健康':
            return '#52C41A';
        case '数据不足':
        default:
            return '#BFCCD6';
    }
};