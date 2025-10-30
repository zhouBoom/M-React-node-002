import React, { useState } from 'react';
import { Layout, Button, Typography, Empty, Row, Col, message } from 'antd';
import { PlusOutlined, CalendarOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useHabits } from '../hooks/useHabits';
import HabitCard from '../components/HabitCard';
import AddHabitModal from '../components/AddHabitModal';
import { useNavigate } from 'react-router-dom';
import { logError } from '../utils/errorHandler';

const { Content } = Layout;
const { Title, Paragraph } = Typography;

const Home: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const navigate = useNavigate();
  const { habits, toggleHabitCompletion, addHabit } = useHabits();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddHabit = (name: string, icon: string) => {
    addHabit(name, icon);
    setIsModalVisible(false);
    message.success('习惯添加成功！');
  };

  const handleToggleCompletion = (id: string) => {
    toggleHabitCompletion(id);
    message.success('习惯状态已更新！');
  };

  const handleViewHistory = () => {
    navigate('/history');
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <Layout className="home-layout">
      <Content className="home-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} style={{ marginBottom: '8px' }}>
            今日习惯
          </Title>
          <Paragraph style={{ marginBottom: '24px', color: 'rgba(0, 0, 0, 0.65)' }}>
            坚持就是胜利，今天你完成了几个习惯？
          </Paragraph>

          {/* 操作按钮 */}
          <div style={{ marginBottom: '24px', display: 'flex', gap: '12px' }}>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={showModal}
              size="large"
            >
              添加新习惯
            </Button>
            <Button
              icon={<CalendarOutlined />}
              onClick={handleViewHistory}
              size="large"
            >
              查看历史记录
            </Button>
            <Button
              type="primary"
              onClick={() => logError('测试异常', new Error('测试异常'))}
              size="large"
            >
              抛出异常测试
            </Button>
          </div>

          {/* 习惯列表 */}
          {habits.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Empty
                description="还没有添加任何习惯"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ marginTop: '20px' }}
              />
              <Button 
                type="primary" 
                onClick={showModal}
                style={{ marginTop: '20px' }}
              >
                添加习惯
              </Button>
            </div>
          ) : (
            <motion.div
              variants={container}
              initial="hidden"
              animate="show"
            >
              <Row gutter={[16, 16]}>
                {habits.map((habit) => (
                  <Col xs={24} sm={12} md={8} key={habit.id}>
                    <motion.div variants={item}>
                      <HabitCard
                        habit={habit}
                        onToggleCompletion={handleToggleCompletion}
                      />
                    </motion.div>
                  </Col>
                ))}
              </Row>
            </motion.div>
          )}

          {/* 统计信息 */}
          {habits.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              style={{
                marginTop: '32px',
                padding: '20px',
                background: 'rgba(240, 240, 240, 0.5)',
                borderRadius: '8px',
                textAlign: 'center',
              }}
            >
              <Paragraph style={{ margin: 0 }}>
                今日完成：<strong style={{ fontSize: '20px', color: '#1890ff' }}>
                  {habits.filter(h => h.completedToday).length} / {habits.length}
                </strong>
              </Paragraph>
              <Paragraph type="secondary" style={{ margin: 0, fontSize: '14px' }}>
                继续加油！坚持就是胜利！
              </Paragraph>
            </motion.div>
          )}
        </motion.div>

        {/* 添加习惯弹窗 */}
        <AddHabitModal
          isVisible={isModalVisible}
          onCancel={handleCancel}
          onAdd={handleAddHabit}
        />
      </Content>
    </Layout>
  );
};

export default Home;