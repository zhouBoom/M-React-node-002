import React from 'react';
import { Layout } from 'antd';

const { Footer } = Layout;

const AppFooter: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <Footer style={{ textAlign: 'center', padding: '24px 0' }}>
      <div>
        <p style={{ margin: 0, fontSize: '14px' }}>
          📝 Habit Tracker ©{currentYear} 版权所有
        </p>
        <p style={{ margin: '4px 0 0 0', fontSize: '12px', opacity: 0.7 }}>
          让每一天都成为更好的自己
        </p>
      </div>
    </Footer>
  );
};

export default AppFooter;