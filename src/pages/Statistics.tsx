import React from 'react';
import { Layout, Typography, Card, Row, Col } from 'antd';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { BarChartOutlined } from '@ant-design/icons';
import { useHabits } from '../hooks/useHabits';
import { getWeeklyStats } from '../utils/scoreHelper';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Statistics: React.FC = () => {
  const { habits } = useHabits();
  const weeklyStats = getWeeklyStats(habits);

  // 准备图表数据
  const chartData = (weeklyStats.dateLabels || []).map((date, index) => ({
    date,
    完成数量: (weeklyStats.dailyCompletions || [])[index] || 0,
  }));

  // 计算平均值
  const averageCompletions = habits.length > 0 
    ? weeklyStats.dailyCompletions.reduce((sum, count) => sum + count, 0) / weeklyStats.dailyCompletions.length
    : 0;

  // 计算最高完成数
  const maxCompletions = Math.max(...weeklyStats.dailyCompletions, 0);

  // 页面动画配置
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Layout className="statistics-layout">
      <Content className="statistics-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <BarChartOutlined /> 周报统计
          </Title>
          <Paragraph style={{ marginBottom: '24px', color: 'rgba(0, 0, 0, 0.65)' }}>
            查看最近7天的习惯完成情况，持续改进！
          </Paragraph>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* 统计图表 */}
            <motion.div variants={item}>
              <Card
                title="最近7天完成情况"
                style={{ marginBottom: '24px' }}
                className="statistics-card"
              >
                <div style={{ height: '400px', padding: '20px 0' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={chartData}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis 
                        domain={[0, Math.max(habits.length, maxCompletions) + 1]} 
                        ticks={Array.from({ length: Math.max(habits.length, maxCompletions) + 2 }, (_, i) => i)}
                      />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="完成数量"
                        stroke="#1890ff"
                        strokeWidth={2}
                        dot={{ r: 6 }}
                        activeDot={{ r: 8 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </motion.div>

            {/* 统计摘要 */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={8}>
                <motion.div variants={item}>
                  <Card
                    title="本周习惯总数"
                    style={{ height: '100%' }}
                    className="statistics-card"
                  >
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <Typography.Title level={3} style={{ color: '#1890ff' }}>
                        {habits.length}
                      </Typography.Title>
                      <Typography.Text type="secondary">个习惯</Typography.Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={8}>
                <motion.div variants={item}>
                  <Card
                    title="平均每日完成"
                    style={{ height: '100%' }}
                    className="statistics-card"
                  >
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <Typography.Title level={3} style={{ color: '#52c41a' }}>
                        {averageCompletions.toFixed(1)}
                      </Typography.Title>
                      <Typography.Text type="secondary">个习惯</Typography.Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>

              <Col xs={24} md={8}>
                <motion.div variants={item}>
                  <Card
                    title="最高完成记录"
                    style={{ height: '100%' }}
                    className="statistics-card"
                  >
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                      <Typography.Title level={3} style={{ color: '#faad14' }}>
                        {maxCompletions}
                      </Typography.Title>
                      <Typography.Text type="secondary">个习惯</Typography.Text>
                    </div>
                  </Card>
                </motion.div>
              </Col>
            </Row>
          </motion.div>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default Statistics;