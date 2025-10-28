import React, { useState } from 'react';
import { Menu, Layout, Drawer, Button } from 'antd';
import { HomeOutlined, HistoryOutlined, TrophyOutlined, BarChartOutlined, SettingOutlined, MenuOutlined } from '@ant-design/icons';
import { Link, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header } = Layout;

const Navbar: React.FC = () => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  const location = useLocation();

  const menuItems: MenuProps['items'] = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: (
        <Link to="/">首页</Link>
      ),
    },
    {
      key: '/history',
      icon: <HistoryOutlined />,
      label: (
        <Link to="/history">历史</Link>
      ),
    },
    {
      key: '/achievement',
      icon: <TrophyOutlined />,
      label: (
        <Link to="/achievement">成就</Link>
      ),
    },
    {
      key: '/statistics',
      icon: <BarChartOutlined />,
      label: (
        <Link to="/statistics">统计</Link>
      ),
    },
    {
      key: '/settings',
      icon: <SettingOutlined />,
      label: (
        <Link to="/settings">设置</Link>
      ),
    },
  ];

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  return (
    <Header className="navbar">
      <div className="logo">
        <Link to="/" style={{ color: 'white', fontSize: '18px', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
          📝 Habit Tracker
        </Link>
      </div>
      
      {/* 桌面端菜单 */}
      <Menu 
        theme="dark" 
        mode="horizontal" 
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="desktop-menu"
      />
      
      {/* 移动端菜单按钮 */}
      <Button 
        type="text" 
        icon={<MenuOutlined style={{ color: 'white' }} />} 
        className="mobile-menu-button"
        onClick={toggleDrawer}
      />
      
      {/* 移动端抽屉菜单 */}
      <Drawer
        title="Habit Tracker"
        placement="right"
        onClose={toggleDrawer}
        open={drawerVisible}
        width={250}
      >
        <Menu
          mode="vertical"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ height: '100%', borderRight: 0 }}
        />
      </Drawer>
    </Header>
  );
};

export default Navbar;