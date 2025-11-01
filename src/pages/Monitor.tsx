import React, { useEffect, useState } from 'react';
import { Typography, Card, Button, Modal, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { ClearOutlined, BarChartOutlined, WarningOutlined, SettingOutlined, ClockCircleOutlined, AppstoreOutlined } from '@ant-design/icons';
import { safeLocalStorage } from '../utils/localStorage';
import { Column, Line } from '@ant-design/charts';

const { Title, Text } = Typography;


// 错误日志类型定义
interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  componentName?: string;
}

// 错误类型统计
interface ErrorTypeStat {
  type: string;
  count: number;
}

// 错误趋势数据
interface ErrorTrendData {
  time: string;
  count: number;
}

// 性能信息
interface PerformanceInfo {
  firstPaintTime: number;
  memoryUsage: number;
  activeComponents: number;
}

const Monitor: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const [errorTypeStats, setErrorTypeStats] = useState<ErrorTypeStat[]>([]);
  const [errorTrendData, setErrorTrendData] = useState<ErrorTrendData[]>([]);
  const [performanceInfo, setPerformanceInfo] = useState<PerformanceInfo>({
    firstPaintTime: 0,
    memoryUsage: 0,
    activeComponents: 0
  });

  // 从localStorage加载错误日志
  const loadErrorLogs = () => {
    try {
      const logs = safeLocalStorage.getItem('error_logs');
      if (logs) {
        const parsedLogs = JSON.parse(logs);
        setErrorLogs(parsedLogs);
        analyzeErrorLogs(parsedLogs);
      } else {
        setErrorLogs([]);
        setErrorTypeStats([]);
        setErrorTrendData([]);
      }
    } catch (error) {
      console.error('加载错误日志失败:', error);
      setErrorLogs([]);
      setErrorTypeStats([]);
      setErrorTrendData([]);
    }
  };

  // 分析错误日志
  const analyzeErrorLogs = (logs: ErrorLog[]) => {
    // 统计错误类型
    const typeStats: Record<string, number> = {};
    logs.forEach(log => {
      // 从错误信息中提取错误类型
      const errorType = log.message.split(':')[0] || '未知错误';
      typeStats[errorType] = (typeStats[errorType] || 0) + 1;
    });

    // 转换为图表数据格式
    const statsArray = Object.entries(typeStats).map(([type, count]) => ({
      type,
      count
    }));
    setErrorTypeStats(statsArray);

    // 生成错误趋势数据
    const trendData: ErrorTrendData[] = [];
    const now = new Date();
    
    // 生成最近24小时的趋势数据
    for (let i = 23; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 60 * 60 * 1000);
      const hour = time.getHours();
      const timeLabel = `${hour}:00`;
      
      // 统计该小时内的错误数量
      const count = logs.filter(log => {
        const logTime = new Date(log.timestamp);
        return logTime.getHours() === hour && 
               logTime.getDate() === now.getDate() && 
               logTime.getMonth() === now.getMonth() && 
               logTime.getFullYear() === now.getFullYear();
      }).length;
      
      trendData.push({ time: timeLabel, count });
    }
    
    setErrorTrendData(trendData);
  };

  // 清空错误日志
  const clearErrorLogs = () => {
    try {
      safeLocalStorage.removeItem('error_logs');
      setErrorLogs([]);
      setErrorTypeStats([]);
      setErrorTrendData([]);
      setIsClearModalVisible(false);
    } catch (error) {
      console.error('清空错误日志失败:', error);
    }
  };

  // 显示清空确认模态框
  const showClearModal = () => {
    setIsClearModalVisible(true);
  };

  // 关闭清空确认模态框
  const handleClearModalCancel = () => {
    setIsClearModalVisible(false);
  };

  // 获取性能信息
  const getPerformanceInfo = () => {
    try {
      // 首屏加载时间
      const navigationEntry = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      const firstPaintTime = navigationEntry?.domContentLoadedEventEnd || 0;
      
      // 内存占用（模拟数据）
      const memoryUsage = Math.round(Math.random() * 1000) + 500;
      
      // 当前活动组件数量（模拟数据）
      const activeComponents = Math.round(Math.random() * 20) + 5;
      
      setPerformanceInfo({
        firstPaintTime: Math.round(firstPaintTime),
        memoryUsage,
        activeComponents
      });
    } catch (error) {
      console.error('获取性能信息失败:', error);
    }
  };

  // 初始化
  useEffect(() => {
    loadErrorLogs();
    getPerformanceInfo();
    
    // 每5秒刷新一次性能信息
    const interval = setInterval(() => {
      getPerformanceInfo();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <Title level={2}>系统监控</Title>
          <Button 
            type="default" 
            icon={<ClearOutlined />} 
            onClick={showClearModal}
            disabled={errorLogs.length === 0}
            title="清空日志"
          >
            清空日志
          </Button>
        </div>

        {/* 异常统计模块 */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5 }}
        >
          <Card title="异常统计" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
              <Statistic
                title="异常总数"
                value={errorLogs.length}
                prefix={<WarningOutlined />}
                valueStyle={{ color: '#FF4D4F' }}
              />
              <Statistic
                title="最近24小时"
                value={errorTrendData.reduce((sum, item) => sum + item.count, 0)}
                prefix={<ClockCircleOutlined />}
              />
              <Statistic
                title="错误类型"
                value={errorTypeStats.length}
                prefix={<BarChartOutlined />}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <Title level={4}>最近5条异常</Title>
              {errorLogs.slice(0, 5).map((log, index) => (
                <div key={index} style={{ marginBottom: '12px', padding: '12px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong>{new Date(log.timestamp).toLocaleString()}</Text>
                    <Text type="danger">{log.message.split(':')[0] || '未知错误'}</Text>
                  </div>
                  <Text ellipsis style={{ display: 'block', marginTop: '8px' }}>{log.message}</Text>
                </div>
              ))}
              {errorLogs.length === 0 && (
                <Text type="secondary">没有错误日志</Text>
              )}
            </div>

            <div>
              <Title level={4}>错误类型分布</Title>
              {errorTypeStats.length > 0 ? (
                <div style={{ height: '300px' }}>
                  <Column
                    data={errorTypeStats}
                    xField="type"
                    yField="count"
                    colorField="type"
                    legend={{ position: 'right' }}
                    tooltip={{ formatter: (datum: any) => ({ name: datum.type, value: datum.count }) }}
                  />
                </div>
              ) : (
                <Text type="secondary">没有错误日志</Text>
              )}
            </div>
          </Card>
        </motion.div>

        {/* 性能信息模块 */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card title="性能信息" style={{ marginBottom: '24px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Statistic
                  title="首屏加载时间"
                  value={performanceInfo.firstPaintTime}
                  suffix="ms"
                  prefix={<ClockCircleOutlined />}
                  valueStyle={{ color: performanceInfo.firstPaintTime < 2000 ? '#52C41A' : performanceInfo.firstPaintTime < 5000 ? '#FAAD14' : '#FF4D4F' }}
                />
                <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                  {performanceInfo.firstPaintTime < 2000 ? '优秀' : performanceInfo.firstPaintTime < 5000 ? '良好' : '一般'}
                </Text>
              </Card>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                    <Statistic
                      title="内存占用"
                      value={performanceInfo.memoryUsage}
                      suffix="MB"
                      prefix={<SettingOutlined />}
                      valueStyle={{ color: performanceInfo.memoryUsage < 1000 ? '#52C41A' : performanceInfo.memoryUsage < 1500 ? '#FAAD14' : '#FF4D4F' }}
                    />
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      {performanceInfo.memoryUsage < 1000 ? '优秀' : performanceInfo.memoryUsage < 1500 ? '良好' : '一般'}
                    </Text>
                  </Card>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                    <Statistic
                      title="活动组件数"
                      value={performanceInfo.activeComponents}
                      prefix={<AppstoreOutlined />}
                      valueStyle={{ color: performanceInfo.activeComponents < 15 ? '#52C41A' : performanceInfo.activeComponents < 25 ? '#FAAD14' : '#FF4D4F' }}
                    />
                    <Text type="secondary" style={{ fontSize: '12px', marginTop: '8px', display: 'block' }}>
                      {performanceInfo.activeComponents < 15 ? '优秀' : performanceInfo.activeComponents < 25 ? '良好' : '一般'}
                    </Text>
                  </Card>
            </div>
          </Card>
        </motion.div>

        {/* 错误趋势图 */}
        <motion.div
          variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
          initial="hidden"
          animate="show"
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card title="错误趋势图">
            {errorTrendData.length > 0 ? (
              <div style={{ height: '300px' }}>
                <Line
                    data={errorTrendData}
                    xField="time"
                    yField="count"
                    smooth
                    color="#1890ff"
                    tooltip={{ formatter: (datum: any) => ({ name: datum.time, value: datum.count }) }}
                    point={{ size: 6, shape: 'circle' }}
                    activePoint={{ size: 8 }}
                  />
              </div>
            ) : (
              <Text type="secondary">没有错误日志</Text>
            )}
          </Card>
        </motion.div>
      </motion.div>

      {/* 清空确认模态框 */}
      <Modal
        title="确认清空日志"
        open={isClearModalVisible}
        onOk={clearErrorLogs}
        onCancel={handleClearModalCancel}
        okText="清空"
        cancelText="取消"
        okType="danger"
      >
        <p>确定要清空所有错误日志吗？此操作不可恢复。</p>
      </Modal>
    </div>
  );
};

export default Monitor;