import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { saveHabits } from './utils/localStorage'

// 添加默认的mock数据
const mockHabits = [
  {
    id: '1',
    name: '早起',
    icon: '🌅',
    streak: 3,
    completedToday: false,
    history: {
      [new Date().toISOString().split('T')[0]]: false,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 259200000).toISOString().split('T')[0]]: true,
    }
  },
  {
    id: '2',
    name: '运动',
    icon: '💪',
    streak: 5,
    completedToday: true,
    history: {
      [new Date().toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 172800000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 259200000).toISOString().split('T')[0]]: true,
      [new Date(Date.now() - 345600000).toISOString().split('T')[0]]: true,
    }
  },
  {
    id: '3',
    name: '阅读',
    icon: '📚',
    streak: 0,
    completedToday: false,
    history: {
      [new Date(Date.now() - 86400000).toISOString().split('T')[0]]: false,
    }
  }
]

// 检查localStorage中是否已有数据，如果没有则添加mock数据
if (!localStorage.getItem('habits')) {
  saveHabits(mockHabits)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
