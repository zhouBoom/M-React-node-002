import React, { useState, useMemo } from 'react';
import { Layout, Table, Radio, Empty, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import type { Habit } from '../utils/localStorage';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

interface HistoryViewType {
  week: 'week';
  month: 'month';
}

type HistoryView = keyof HistoryViewType;

const History: React.FC = () => {
  const [view, setView] = useState<HistoryView>('week');
  const { habits } = useHabits();

  // 生成日期列表
  const dateList = useMemo(() => {
    const dates: string[] = [];
    const today = new Date();
    const days = view === 'week' ? 7 : 30;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }

    return dates;
  }, [view]);

  // 格式化日期显示
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);

    if (dateStr === now.toISOString().split('T')[0]) {
      return '今天';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 生成表格列
  const columns: ColumnsType<any> = useMemo(() => {
    const cols: ColumnsType<any> = [
      {
        title: '习惯',
        dataIndex: 'habit',
        key: 'habit',
        render: (habit: Habit) => (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>{habit.icon}</span>
            <span style={{ fontWeight: '500' }}>{habit.name}</span>
          </div>
        ),
        width: 150,
      },
    ];

    // 添加日期列
    dateList.forEach((date) => {
      cols.push({
        title: formatDate(date),
        key: date,
        width: 80,
        align: 'center',
        render: (record: any) => {
          const completed = record.history[date];
          return completed ? (
            <span style={{ fontSize: '20px' }}>✅</span>
          ) : record.history[date] !== undefined ? (
            <span style={{ fontSize: '20px' }}>❌</span>
          ) : (
            '-' // 未记录
          );
        },
      });
    });

    return cols;
  }, [dateList]);

  // 准备表格数据
  const tableData = useMemo(() => {
    return habits.map((habit) => ({
      key: habit.id,
      habit,
      history: habit.history,
    }));
  }, [habits]);

  // 计算统计数据
  const stats = useMemo(() => {
    const totalHabits = habits.length;
    const totalDays = dateList.length;
    let totalCompletions = 0;
    let possibleCompletions = 0;

    habits.forEach((habit) => {
      dateList.forEach((date) => {
        if (habit.history[date] !== undefined) {
          possibleCompletions++;
          if (habit.history[date]) {
            totalCompletions++;
          }
        }
      });
    });

    const overallRate = possibleCompletions > 0
      ? Math.round((totalCompletions / possibleCompletions) * 100)
      : 0;

    return {
      totalHabits,
      totalDays,
      totalCompletions,
      overallRate,
    };
  }, [habits, dateList]);

  return (
    <Layout className="history-layout">
      <Content className="history-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} style={{ marginBottom: '8px' }}>
            历史记录
          </Title>
          <Paragraph style={{ marginBottom: '24px', color: 'rgba(0, 0, 0, 0.65)' }}>
            查看你过去的习惯完成情况，坚持就是胜利！
          </Paragraph>

          {/* 视图切换 */}
          <div style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontWeight: '500' }}>视图：</span>
            <Radio.Group value={view} onChange={(e) => setView(e.target.value)}>
              <Radio.Button value="week">周视图</Radio.Button>
              <Radio.Button value="month">月视图</Radio.Button>
            </Radio.Group>
          </div>

          {/* 统计信息 */}
          {stats.totalHabits > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              style={{ 
                marginBottom: '24px', 
                padding: '16px', 
                background: 'rgba(240, 240, 240, 0.5)',
                borderRadius: '8px'
              }}
            >
              <Paragraph style={{ margin: 0, fontSize: '14px', color: 'rgba(0, 0, 0, 0.65)' }}>
                总计 {stats.totalHabits} 个习惯，
                过去 {stats.totalDays} 天内完成 {stats.totalCompletions} 次，
                总体完成率：<strong>{stats.overallRate}%</strong>
              </Paragraph>
            </motion.div>
          )}

          {/* 历史表格 */}
          {habits.length === 0 ? (
            <Empty
              description="暂无习惯记录"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ marginTop: '60px' }}
            />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Table
                columns={columns}
                dataSource={tableData}
                scroll={{ x: 'max-content' }}
                pagination={false}
                rowClassName={(_, index) => (index % 2 === 0 ? 'even-row' : 'odd-row')}
              />
            </motion.div>
          )}
        </motion.div>
      </Content>
    </Layout>
  );
};

export default History;