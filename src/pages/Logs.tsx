import React, { useEffect, useState } from 'react';
import { Typography, Table, Empty, Card, Button, Space, Modal } from 'antd';
import { motion } from 'framer-motion';
import { ClearOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { safeLocalStorage } from '../utils/localStorage';


const { Title, Text } = Typography;

// 错误日志类型定义
interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  componentName?: string;
}

const Logs: React.FC = () => {
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedLog, setSelectedLog] = useState<ErrorLog | null>(null);

  // 从localStorage加载错误日志
  const loadErrorLogs = () => {
    try {
      const logs = safeLocalStorage.getItem('error_logs');
      if (logs) {
        setErrorLogs(JSON.parse(logs));
      } else {
        setErrorLogs([]);
      }
    } catch (error) {
      console.error('加载错误日志失败:', error);
      setErrorLogs([]);
    }
  };

  // 清空错误日志
  const clearErrorLogs = () => {
    try {
      safeLocalStorage.removeItem('error_logs');
      setErrorLogs([]);
    } catch (error) {
      console.error('清空错误日志失败:', error);
    }
  };

  // 显示错误详情模态框
  const showLogDetails = (log: ErrorLog) => {
    setSelectedLog(log);
    setIsModalVisible(true);
  };

  // 关闭模态框
  const handleModalClose = () => {
    setIsModalVisible(false);
    setSelectedLog(null);
  };

  useEffect(() => {
    loadErrorLogs();
  }, []);

  // 表格列配置
  const columns: ColumnsType<ErrorLog> = [
    {
      title: '时间',
      dataIndex: 'timestamp',
      key: 'timestamp',
      sorter: (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime(),
      render: (timestamp) => (
        <Text>{new Date(timestamp).toLocaleString()}</Text>
      ),
      width: 200,
    },
    {
      title: '错误信息',
      dataIndex: 'message',
      key: 'message',
      ellipsis: true,
    },
    {
      title: '组件名称',
      dataIndex: 'componentName',
      key: 'componentName',
      ellipsis: true,
      width: 150,
    },
    {
      title: '操作',
      key: 'action',
      width: 100,
      render: (_, record) => (
        <Space size="middle">
          <Button 
            type="text" 
            icon={<EyeOutlined />} 
            onClick={() => showLogDetails(record)}
            title="查看详情"
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <Title level={2}>运行时错误日志</Title>
            <Button 
              type="default" 
              icon={<ClearOutlined />} 
              onClick={clearErrorLogs}
              disabled={errorLogs.length === 0}
              title="清空日志"
            >
              清空日志
            </Button>
          </div>

          {errorLogs.length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '60px' }}>
              <Empty
                description="没有错误日志"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ marginTop: '20px' }}
              />
            </div>
          ) : (
            <motion.div
              variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
              initial="hidden"
              animate="show"
              transition={{ duration: 0.5 }}
            >
              <Card>
                <Table
                  columns={columns}
                  dataSource={errorLogs}
                  rowKey="timestamp"
                  pagination={{ pageSize: 10 }}
                  scroll={{ x: 800 }}
                  className="error-log-table"
                />
              </Card>
            </motion.div>
          )}
        </motion.div>

      {/* 错误详情模态框 */}
      <Modal
        title="错误详情"
        open={isModalVisible}
        onCancel={handleModalClose}
        footer={null}
        width={800}
      >
        {selectedLog && (
          <div>
            <p>
              <Text strong>时间:</Text> {new Date(selectedLog.timestamp).toLocaleString()}
            </p>
            <p>
              <Text strong>错误信息:</Text> {selectedLog.message}
            </p>
            <p>
              <Text strong>组件名称:</Text> {selectedLog.componentName || '未知组件'}
            </p>
            <p>
              <Text strong>错误堆栈:</Text>
            </p>
            <div style={{ 
              backgroundColor: '#f5f5f5', 
              padding: '16px', 
              borderRadius: '4px', 
              maxHeight: '400px', 
              overflowY: 'auto',
              whiteSpace: 'pre-wrap',
              fontFamily: 'monospace'
            }}>
              {selectedLog.stack || '无堆栈信息'}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Logs;