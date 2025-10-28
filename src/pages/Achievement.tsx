import React from 'react';
import { Layout, Typography, Card, Empty, Row, Col, Statistic } from 'antd';
import { motion } from 'framer-motion';
import { TrophyOutlined, FireOutlined, StarOutlined } from '@ant-design/icons';
import { useHabits } from '../hooks/useHabits';
import { getAchievementData } from '../utils/scoreHelper';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Achievement: React.FC = () => {
  const { habits } = useHabits();
  const achievementData = getAchievementData(habits);

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
    <Layout className="achievement-layout">
      <Content className="achievement-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <TrophyOutlined /> 成就面板
          </Title>
          <Paragraph style={{ marginBottom: '24px', color: 'rgba(0, 0, 0, 0.65)' }}>
            查看你的成就和积分，继续保持良好习惯！
          </Paragraph>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* 总积分卡片 */}
            <motion.div variants={item}>
              <Card
                title="总积分"
                style={{ marginBottom: '24px' }}
                className="achievement-card"
              >
                <div style={{ textAlign: 'center', padding: '20px 0' }}>
                  <Statistic
                    title="" 
                    value={achievementData.totalScore}
                    valueStyle={{ fontSize: '48px', color: '#ff6b6b' }}
                    suffix="积分"
                    prefix={<StarOutlined />}
                  />
                </div>
              </Card>
            </motion.div>

            <Row gutter={[16, 16]}>
              {/* 完成次数最多的习惯 */}
              <Col xs={24} md={12}>
                <motion.div variants={item}>
                  <Card
                    title="完成次数最多的习惯"
                    style={{ height: '100%' }}
                    className="achievement-card"
                  >
                    {achievementData.mostCompletedHabit ? (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                          {achievementData.mostCompletedHabit.icon}
                        </div>
                        <Title level={4} style={{ margin: '0 0 8px 0' }}>
                          {achievementData.mostCompletedHabit.name}
                        </Title>
                        <Text type="secondary">完成了 {achievementData.mostCompletedHabit.completions} 次</Text>
                      </div>
                    ) : (
                      <Empty description="还没有完成任何习惯" />
                    )}
                  </Card>
                </motion.div>
              </Col>

              {/* 连续天数最长的习惯 */}
              <Col xs={24} md={12}>
                <motion.div variants={item}>
                  <Card
                    title="连续天数最长的习惯"
                    style={{ height: '100%' }}
                    className="achievement-card"
                  >
                    {achievementData.longestStreakHabit ? (
                      <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{ fontSize: '48px', marginBottom: '12px' }}>
                          {achievementData.longestStreakHabit.icon}
                        </div>
                        <Title level={4} style={{ margin: '0 0 8px 0' }}>
                          {achievementData.longestStreakHabit.name}
                        </Title>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <FireOutlined style={{ color: '#ff6b6b', fontSize: '18px' }} />
                          <Text type="secondary">连续 {achievementData.longestStreakHabit.streak} 天</Text>
                        </div>
                      </div>
                    ) : (
                      <Empty description="还没有开始记录" />
                    )}
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

export default Achievement;