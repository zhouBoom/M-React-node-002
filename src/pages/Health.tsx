import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, Card, message } from 'antd';
import type { ColumnType } from 'antd/es/table/interface';
import type { AlignType } from 'rc-table/lib/interface';
import { ReloadOutlined, ClearOutlined } from '@ant-design/icons';
import { getTasks, saveTasks } from '../utils/localStorage';
import { calculateTaskHealth, getStatusColor } from '../utils/healthHelper';
import type { TaskHealth } from '../utils/healthHelper';
import { logError } from '../utils/errorHandler';

const Health: React.FC = () => {
  const [tasksHealth, setTasksHealth] = useState<TaskHealth[]>([]);
  const [loading, setLoading] = useState(false);

  // 计算任务健康度
  const fetchTaskHealth = () => {
    setLoading(true);
    try {
      const tasks = getTasks();
      const healthData = calculateTaskHealth(tasks);
      setTasksHealth(healthData);
      message.success('任务健康度计算完成');
    } catch (error) {
      logError('获取任务健康度失败:', error as Error, 'HealthPage.fetchTaskHealth');
      message.error('获取任务健康度失败');
    } finally {
      setLoading(false);
    }
  };

  // 清空任务数据
  const clearTasks = () => {
    try {
      saveTasks([]);
      setTasksHealth([]);
      message.success('任务数据已清空');
    } catch (error) {
      logError('清空任务数据失败:', error as Error, 'HealthPage.clearTasks');
      message.error('清空任务数据失败');
    }
  };

  // 表格列配置
  const columns: ColumnType<TaskHealth>[] = [
    {
      title: '任务名称',
      dataIndex: 'name',
      key: 'name',
      ellipsis: true,
      width: 200,
    },
    {      title: '成功次数',      dataIndex: 'success',      key: 'success',      align: 'center' as AlignType,      width: 120,    },
    {
      title: '失败次数',
      dataIndex: 'fail',
      key: 'fail',
      align: 'center' as AlignType,
      width: 120,
    },
    {
      title: '健康度分值',
      dataIndex: 'health',
      key: 'health',
      align: 'center' as AlignType,
      width: 120,
      render: (health: number) => `${health}%`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      align: 'center' as AlignType,
      width: 120,
      render: (status: TaskHealth['status']) => (
        <Tag color={getStatusColor(status)}>{status}</Tag>
      ),
    },
  ];

  // 初始加载
  useEffect(() => {
    fetchTaskHealth();
  }, []);

  // 生成示例数据（用于测试）
  const generateSampleData = () => {
    try {
      const sampleTasks = [
        { id: '1', name: '每日健身', success: 15, fail: 3 },
        { id: '2', name: '学习英语', success: 8, fail: 5 },
        { id: '3', name: '阅读书籍', success: 2, fail: 1 },
        { id: '4', name: '早起打卡', success: 20, fail: 1 },
        { id: '5', name: '写日记', success: 5, fail: 7 },
      ];
      saveTasks(sampleTasks);
      fetchTaskHealth();
      message.success('示例数据已生成');
    } catch (error) {
      logError('生成示例数据失败:', error as Error, 'HealthPage.generateSampleData');
      message.error('生成示例数据失败');
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 24 }}>任务健康度</h1>
      
      <Card style={{ marginBottom: 24 }}>
        <Space size="middle">
          <Button
            type="primary"
            icon={<ReloadOutlined />}
            onClick={fetchTaskHealth}
            loading={loading}
          >
            刷新健康度
          </Button>
          <Button
            danger
            icon={<ClearOutlined />}
            onClick={clearTasks}
          >
            清空任务数据
          </Button>
          <Button
            onClick={generateSampleData}
          >
            生成示例数据
          </Button>
        </Space>
      </Card>

      <Card>
        <Table
          columns={columns}
          dataSource={tasksHealth}
          rowKey="id"
          bordered
          pagination={{ pageSize: 10 }}
          loading={loading}
          locale={{ emptyText: '暂无任务数据，请先添加任务或生成示例数据' }}
        />
      </Card>
    </div>
  );
};

export default Health;