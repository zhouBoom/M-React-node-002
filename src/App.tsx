import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, ConfigProvider } from 'antd';
import { getSettings } from './utils/localStorage';
import Navbar from './components/Navbar';
import AppFooter from './components/Footer';
import Home from './pages/Home';
import History from './pages/History';
import Achievement from './pages/Achievement';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';
import Logs from './pages/Logs';
import Monitor from './pages/Monitor';
import Health from './pages/Health';
import './App.css';

const { Content } = Layout;

const App: React.FC = () => {
  useEffect(() => {
    // 初始化主题
    const settings = getSettings();
    document.documentElement.classList.toggle('dark-theme', settings.theme === 'dark');
  }, []);

  return (
    <Router>
      <ConfigProvider>
        <Layout className="app-layout">
          <Navbar />
          <Content className="main-content">
            <div className="container">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
                <Route path="/achievement" element={<Achievement />} />
                <Route path="/statistics" element={<Statistics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/logs" element={<Logs />} />
<Route path="/monitor" element={<Monitor />} />
                <Route path="/health" element={<Health />} />
              </Routes>
            </div>
          </Content>
          <AppFooter />
        </Layout>
      </ConfigProvider>
    </Router>
  );
}

export default App
