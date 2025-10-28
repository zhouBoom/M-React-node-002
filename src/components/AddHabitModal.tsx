import React from 'react';
import { Modal, Form, Input, Button, InputNumber, Select } from 'antd';
import { message } from 'antd';

interface AddHabitModalProps {
  isVisible: boolean;
  onCancel: () => void;
  onAdd: (name: string, icon: string, targetDays?: number) => void;
}

// 常用习惯图标
const HABIT_ICONS = [
  { value: '💪', label: '💪 运动' },
  { value: '📚', label: '📚 阅读' },
  { value: '🌅', label: '🌅 早起' },
  { value: '💧', label: '💧 喝水' },
  { value: '🧘', label: '🧘 冥想' },
  { value: '✍️', label: '✍️ 写作' },
  { value: '🎯', label: '🎯 专注' },
  { value: '😴', label: '😴 早睡' },
];

const AddHabitModal: React.FC<AddHabitModalProps> = ({ isVisible, onCancel, onAdd }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form.validateFields()
      .then((values) => {
        onAdd(values.name, values.icon || '📝', values.targetDays);
        message.success('添加成功');
        form.resetFields();
      })
      .catch((info) => {
        console.log('Validate Failed:', info);
      });
  };

  return (
    <Modal
      title="添加新习惯"
      open={isVisible}
      onOk={handleSubmit}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          取消
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          确定
        </Button>,
      ]}
      width={400}
    >
      <Form
        form={form}
        layout="vertical"
        name="add_habit_form"
        initialValues={{ icon: '📝' }}
      >
        <Form.Item
          name="name"
          label="习惯名称"
          rules={[{ required: true, message: '请输入习惯名称' }]}
        >
          <Input placeholder="例如：运动、阅读、早起..." />
        </Form.Item>

        <Form.Item
          name="icon"
          label="选择图标"
        >
          <Select placeholder="选择一个图标">
            {HABIT_ICONS.map((item) => (
              <Select.Option key={item.value} value={item.value}>
                {item.label}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="targetDays"
          label="目标天数"
          tooltip="设置目标连续天数，可选"
        >
          <InputNumber min={1} max={365} style={{ width: '100%' }} placeholder="目标连续天数" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddHabitModal;