import React from 'react';
import { Card, Checkbox, Tag } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import type { Habit } from '../utils/localStorage';
import type { CheckboxChangeEvent } from 'antd';

interface HabitCardProps {
  habit: Habit;
  onToggleCompletion: (id: string) => void;
}

const HabitCard: React.FC<HabitCardProps> = ({ habit, onToggleCompletion }) => {
  const handleChange = (_: CheckboxChangeEvent) => {
    onToggleCompletion(habit.id);
  };

  return (
    <AnimatePresence>
      <motion.div
        layout
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.3 }}
        whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)' }}
      >
        <Card 
          className="habit-card"
          hoverable
          bodyStyle={{ padding: '20px' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <span style={{ fontSize: '24px' }}>{habit.icon}</span>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{habit.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Tag color={habit.streak >= 7 ? 'gold' : habit.streak >= 3 ? 'green' : 'blue'}>
                    🔥 连续 {habit.streak} 天
                  </Tag>
                </div>
              </div>
            </div>
            <Checkbox
              checked={habit.completedToday}
              onChange={handleChange}
              style={{ transform: 'scale(1.5)' }}
            />
          </div>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};

export default HabitCard;