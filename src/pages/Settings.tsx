import React, { useState, useEffect } from 'react';
import { Layout, Switch, Typography, Card, Divider, List } from 'antd';
import { MoonOutlined, SunOutlined } from '@ant-design/icons';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings, saveSettings } from '../utils/localStorage';

const { Content } = Layout;
const { Title, Paragraph, Text } = Typography;

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    // 从localStorage读取主题设置
    const settings = getSettings();
    setTheme(settings.theme);
    document.documentElement.classList.toggle('dark-theme', settings.theme === 'dark');
  }, []);

  const handleThemeChange = (checked: boolean) => {
    const newTheme = checked ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.classList.toggle('dark-theme', newTheme === 'dark');
    saveSettings({ theme: newTheme });
  };

  const features = [
    { title: '习惯追踪', description: '记录每日习惯完成情况，自动计算连续天数' },
    { title: '历史查看', description: '支持周视图和月视图，查看过去的完成情况' },
    { title: '主题切换', description: '支持深色和浅色主题，保护眼睛' },
    { title: '数据持久化', description: '所有数据保存在本地，无需网络连接' },
    { title: '响应式设计', description: '适配各种屏幕尺寸，移动端友好' },
  ];

  return (
    <Layout className="settings-layout">
      <Content className="settings-content">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Title level={2} style={{ marginBottom: '24px' }}>
            设置
          </Title>

          {/* 主题设置卡片 */}
          <AnimatePresence mode="wait">
            <motion.div
              key={theme}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card
                title="主题设置"
                style={{ marginBottom: '24px' }}
                className="settings-card"
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <Text strong style={{ fontSize: '16px', marginRight: '8px' }}>
                      {theme === 'dark' ? '🌙 深色模式' : '☀️ 浅色模式'}
                    </Text>
                    <Text type="secondary">
                      {theme === 'dark' ? '夜间使用更舒适' : '日间使用更清晰'}
                    </Text>
                  </div>
                  <Switch
                    checked={theme === 'dark'}
                    onChange={handleThemeChange}
                    checkedChildren={<MoonOutlined />}
                    unCheckedChildren={<SunOutlined />}
                  />
                </div>
              </Card>

              {/* 功能列表 */}
              <Card
                title="功能介绍"
                className="settings-card"
              >
                <List
                  itemLayout="horizontal"
                  dataSource={features}
                  renderItem={(item) => (
                    <List.Item
                      actions={[<span key="check">✓</span>]}
                    >
                      <List.Item.Meta
                        title={<Text strong>{item.title}</Text>}
                        description={item.description}
                      />
                    </List.Item>
                  )}
                />

                <Divider style={{ margin: '24px 0' }} />

                <div style={{ textAlign: 'center' }}>
                  <Paragraph type="secondary" style={{ marginBottom: '8px' }}>
                    Habit Tracker v1.0
                  </Paragraph>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    让每一天都成为更好的自己 💪
                  </Text>
                </div>
              </Card>
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </Content>
    </Layout>
  );
};

export default Settings;