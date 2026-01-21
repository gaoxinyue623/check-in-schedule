<template>
  <div class="schedule-page">
    <!-- 头部 -->
    <header class="header">
      <h2>🌈 寒假学习计划（1.24-2.20）🌈</h2>
      <div class="star-counter pulse">
        <span class="star-icon">⭐</span>
        <span class="star-count">{{ totalStars }}</span>
        <span class="star-label">颗星星</span>
      </div>
    </header>

    <!-- 日期导航 -->
    <div class="month-nav card">
      <button
        v-for="(day, index) in monthSchedule"
        :key="index"
        class="day-btn"
        :class="{ active: currentDayIndex === index }"
        @click="selectDay(index)"
      >
        <div class="day-number">第{{ day.day }}天</div>
        <div class="day-name">{{ day.dayName }}</div>
        <div class="day-date">{{ day.date }}</div>
        <div class="day-stars">
          <span v-if="getDayStars(index) > 0">⭐{{ getDayStars(index) }}</span>
        </div>
      </button>
    </div>

    <!-- 当前日期的进度 -->
    <div class="progress-card card">
      <h2>📊 今日进度</h2>
      <div class="progress-bar-container">
        <div class="progress-bar" :style="{ width: getCurrentDayProgress + '%' }">
          <span class="progress-text">{{ getCurrentDayProgress }}%</span>
        </div>
      </div>
      <div class="progress-info">
        <span>今日已获得 <strong class="star">⭐{{ getCurrentDayStars }}</strong> 颗星星</span>
      </div>
    </div>

    <!-- 任务列表 -->
    <div class="tasks-card card">
      <div class="tasks-header">
        <h2>📝 今日任务</h2>
        <div class="header-buttons">
          <button class="btn btn-success btn-sm" @click="downloadCheckList" title="下载打卡表">
            📥 下载打卡表
          </button>
          <button class="btn btn-primary btn-sm" @click="showAddTaskModal = true">
            ➕ 添加任务
          </button>
        </div>
      </div>
      
      <div class="task-categories">
        <button
          v-for="cat in categories"
          :key="cat.value"
          class="category-btn"
          :class="{ active: selectedCategory === cat.value }"
          @click="selectedCategory = cat.value"
        >
          {{ cat.icon }} {{ cat.label }}
        </button>
      </div>

      <div class="tasks-list">
        <div
          v-for="task in filteredTasks"
          :key="task.id"
          class="task-item"
          :class="{ completed: task.completed, [task.category]: true }"
        >
          <div class="task-checkbox">
            <input
              type="checkbox"
              :id="'task-' + task.id"
              :checked="task.completed"
              @change="toggleTask(currentDayIndex, task.id)"
              class="checkbox"
            />
          </div>
          
          <div class="task-content">
            <div class="task-time">{{ task.time }}</div>
            <div class="task-activity">{{ task.activity }}</div>
            <div v-if="task.description" class="task-description">{{ task.description }}</div>
          </div>
          
          <div class="task-reward">
            <span v-if="task.stars" class="task-stars">
              <span v-for="n in task.stars" :key="n" class="star">⭐</span>
            </span>
          </div>
          
          <div class="task-actions">
            <button class="btn-icon" @click="editTask(task)" title="编辑">✏️</button>
            <button class="btn-icon" @click="deleteTaskConfirm(task)" title="删除">🗑️</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 礼品兑换 -->
    <!-- 礼品兑换入口 -->
    <div class="gifts-entry-card card" @click="router.push('/gifts')">
      <div class="entry-content">
        <div class="entry-icon">🎁</div>
        <div class="entry-info">
          <h2>礼品兑换中心</h2>
          <p>去看看能兑换什么好礼物吧！</p>
        </div>
        <div class="entry-action">
          <button class="btn btn-warning">去兑换 ➔</button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑任务模态框 -->
    <div v-if="showAddTaskModal || showEditTaskModal" class="modal-overlay" @click="closeModals">
      <div class="modal-content" @click.stop>
        <h2>{{ showEditTaskModal ? '✏️ 编辑任务' : '➕ 添加任务' }}</h2>
        
        <div class="form-group">
          <label>时间：</label>
          <input v-model="taskForm.time" type="text" placeholder="例如：08:00-09:00" class="input" />
        </div>
        
        <div class="form-group">
          <label>活动内容：</label>
          <input v-model="taskForm.activity" type="text" placeholder="输入活动内容" class="input" />
        </div>
        
        <div class="form-group">
          <label>详细说明（可选）：</label>
          <textarea v-model="taskForm.description" placeholder="例如：拼音/生字/看图说话" class="input" rows="3"></textarea>
        </div>
        
        <div class="form-group">
          <label>类别：</label>
          <select v-model="taskForm.category" class="input">
            <option value="study">学习</option>
            <option value="reading">阅读</option>
            <option value="sport">运动</option>
            <option value="housework">家庭劳动</option>
            <option value="daily">日常</option>
            <option value="break">休息</option>
          </select>
        </div>
        
        <div class="form-group">
          <label>奖励星星：</label>
          <input v-model.number="taskForm.stars" type="number" min="0" max="5" class="input" />
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary" @click="saveTask">保存</button>
          <button class="btn" @click="closeModals">取消</button>
        </div>
      </div>
    </div>

    <!-- Toast提示 -->
    <Toast 
      v-model:visible="toast.visible" 
      :type="toast.type"
      :title="toast.title"
      :message="toast.message"
      :duration="toast.duration"
    />

    <!-- 确认对话框 -->
    <ConfirmModal
      v-model:visible="confirmModal.visible"
      :type="confirmModal.type"
      :title="confirmModal.title"
      :message="confirmModal.message"
      @confirm="confirmModal.onConfirm"
      @cancel="confirmModal.onCancel"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useScheduleStore } from '../stores/schedule'
import { storeToRefs } from 'pinia'
import Toast from '../components/Toast.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const store = useScheduleStore()
const { monthSchedule, currentDayIndex, totalStars } = storeToRefs(store)
const { toggleTask, updateTask, addTask, deleteTask, getCurrentDayProgress, getCurrentDayStars } = store

// Toast提示状态
const toast = ref({
  visible: false,
  type: 'success',
  title: '',
  message: '',
  duration: 3000
})

// 确认对话框状态
const confirmModal = ref({
  visible: false,
  type: 'confirm',
  title: '',
  message: '',
  onConfirm: () => {},
  onCancel: () => {}
})

// 显示Toast
const showToast = (type, title, message = '', duration = 3000) => {
  toast.value = {
    visible: true,
    type,
    title,
    message,
    duration
  }
}

// 显示确认对话框
const showConfirm = (title, message, onConfirm, type = 'confirm') => {
  return new Promise((resolve) => {
    confirmModal.value = {
      visible: true,
      type,
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm()
        resolve(true)
      },
      onCancel: () => {
        resolve(false)
      }
    }
  })
}

// 初始化
store.initMonthSchedule()

// 分类
const categories = [
  { value: 'all', label: '全部', icon: '📋' },
  { value: 'study', label: '学习', icon: '📚' },
  { value: 'reading', label: '阅读', icon: '📖' },
  { value: 'sport', label: '运动', icon: '⚽' },
  { value: 'housework', label: '家务', icon: '🧹' },
  { value: 'daily', label: '日常', icon: '🏠' }
]

const selectedCategory = ref('all')

// 过滤任务
const filteredTasks = computed(() => {
  const day = monthSchedule.value[currentDayIndex.value]
  if (!day) return []
  if (selectedCategory.value === 'all') return day.tasks
  return day.tasks.filter(t => t.category === selectedCategory.value)
})

// 选择日期
const selectDay = (index) => {
  currentDayIndex.value = index
  selectedCategory.value = 'all'
}

// 获取某天的星星数
const getDayStars = (dayIndex) => {
  const day = monthSchedule.value[dayIndex]
  if (!day) return 0
  return day.tasks
    .filter(t => t.completed && t.stars)
    .reduce((sum, t) => sum + t.stars, 0)
}

// 任务表单
const showAddTaskModal = ref(false)
const showEditTaskModal = ref(false)
const taskForm = ref({
  time: '',
  activity: '',
  description: '',
  category: 'study',
  stars: 1
})
const editingTaskId = ref(null)

// 编辑任务
const editTask = (task) => {
  taskForm.value = {
    time: task.time,
    activity: task.activity,
    description: task.description || '',
    category: task.category,
    stars: task.stars || 0
  }
  editingTaskId.value = task.id
  showEditTaskModal.value = true
}

// 保存任务
const saveTask = () => {
  if (!taskForm.value.time || !taskForm.value.activity) {
    alert('请填写完整信息！')
    return
  }
  
  if (showEditTaskModal.value) {
    updateTask(currentDayIndex.value, editingTaskId.value, taskForm.value)
  } else {
    addTask(currentDayIndex.value, taskForm.value)
  }
  
  closeModals()
}

// 关闭模态框
const closeModals = () => {
  showAddTaskModal.value = false
  showEditTaskModal.value = false
  taskForm.value = {
    time: '',
    activity: '',
    description: '',
    category: 'study',
    stars: 1
  }
  editingTaskId.value = null
}

// 删除任务确认
const deleteTaskConfirm = async (task) => {
  await showConfirm(
    '删除任务',
    `确定要删除"${task.activity}"吗？`,
    () => {
      deleteTask(currentDayIndex.value, task.id)
      showToast('success', '删除成功', '任务已删除')
    },
    'danger'
  )
}



// 下载打卡表（导出为PDF）- 单页简化版
const downloadCheckList = () => {
  const currentDay = monthSchedule.value[currentDayIndex.value]
  if (!currentDay) return
  
  const totalStars = currentDay.tasks.filter(t => t.stars).reduce((sum, t) => sum + t.stars, 0)
  const completedTasks = currentDay.tasks.filter(t => t.completed).length
  
  /* eslint-disable */
  const html = `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><title>第${currentDay.day}天打卡表</title>
<style>@page{size:A4;margin:8mm}*{margin:0;padding:0;box-sizing:border-box}body{font-family:"Microsoft YaHei",Arial,sans-serif;font-size:9pt;padding:6mm;line-height:1.3}.header{text-align:center;margin-bottom:8px;padding-bottom:6px;border-bottom:2px solid #FF6B9D}.header h1{color:#FF6B9D;font-size:14pt;margin-bottom:3px}.header .info{font-size:9pt;color:#666}.task{display:flex;align-items:flex-start;margin:10px 0;padding:4px 6px;border:1px solid #e0e0e0;border-radius:3px;page-break-inside:avoid}.checkbox{width:14px;height:14px;border:1.5px solid #FF6B9D;border-radius:2px;margin:1px 6px 0 0;flex-shrink:0}.content{flex:1;display:flex;align-items:baseline;gap:4px}.time{font-size:8pt;color:#999;min-width:60px}.title{font-weight:600;font-size:9pt;flex:1}.stars{color:#FFD93D;font-size:8pt;white-space:nowrap}.footer{margin-top:8px;padding-top:6px;border-top:1px solid #ddd;text-align:center;font-size:8pt;color:#888;display:flex;justify-content:space-around}.summary{color:#FFD93D;font-weight:600}</style>
</head><body onload="setTimeout(()=>window.print(),300)">
<div class="header"><h1>🌈 寒假学习打卡表<\/h1><div class="info">第${currentDay.day}天 · ${currentDay.date} ${currentDay.dayName} · 已完成 ${completedTasks}/${currentDay.tasks.length}<\/div><\/div>
${currentDay.tasks.map(t => `<div class="task"><div class="checkbox">${t.completed ? '✓' : ''}<\/div><div class="content"><span class="time">${t.time}<\/span><span class="title">${t.activity}${t.description ? ' - ' + t.description : ''}<\/span>${t.stars ? `<span class="stars">${'⭐'.repeat(t.stars)}<\/span>` : ''}<\/div><\/div>`).join('')}
<div class="footer"><span>完成任务后打✓<\/span><span class="summary">今日可获得 ${totalStars} ⭐<\/span><span>加油！💪<\/span><\/div>
<\/body><\/html>`
  /* eslint-enable */
  
  try {
    // 创建Blob并下载（适用于移动端和桌面端）
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `打卡表_第${currentDay.day}天_${currentDay.date}.html`
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    
    // 清理
    setTimeout(() => {
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }, 100)
    
    showToast('success', '打卡表已下载', '打开文件后可打印或保存为PDF', 3000)
  } catch (error) {
    console.error('下载失败:', error)
    showToast('error', '下载失败', '请稍后重试', 3000)
  }
}

</script>

<style src="../assets/layout-optimized.css"></style>

<style scoped>
.schedule-page {
  padding-bottom: 40px;
}

/* 头部 */
.header {
  text-align: center;
  margin-bottom: var(--spacing-lg);
  position: relative;
}

.star-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--warning-color) 0%, #FFE066 100%);
  padding: 8px 16px;
  border-radius: 50px;
  box-shadow: var(--box-shadow);
}

.star-icon {
  font-size: 28px;
}

.star-count {
  font-size: 32px;
  font-weight: 700;
  color: var(--text-primary);
}

.star-label {
  font-size: 16px;
  color: var(--text-secondary);
}

/* 月份导航（28天） */
.month-nav {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  overflow-x: auto;
  scroll-behavior: smooth;
}

.month-nav::-webkit-scrollbar {
  height: 8px;
}

.month-nav::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 10px;
}

.month-nav::-webkit-scrollbar-thumb {
  background: var(--primary-color);
  border-radius: 10px;
}

.day-btn {
  background: white;
  border: 2px solid transparent;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-width: 100px;
  flex-shrink: 0;
}

.day-btn:hover {
  transform: translateY(-2px);
  border-color: var(--primary-color);
}

.day-btn.active {
  background: linear-gradient(135deg, var(--primary-color) 0%, #FF8FB1 100%);
  color: white;
  border-color: var(--primary-color);
}

.day-number {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 2px;
  color: var(--primary-color);
}

.day-btn.active .day-number {
  color: white;
}

.day-name {
  font-weight: 600;
  font-size: 13px;
  margin-bottom: 2px;
}

.day-date {
  font-size: 11px;
  opacity: 0.8;
  margin-bottom: 2px;
}

.day-stars {
  margin-top: 4px;
  font-size: 11px;
  min-height: 16px;
}

/* 进度卡片 */
.progress-card {
  margin-bottom: var(--spacing-lg);
}

.progress-bar-container {
  background: #f0f0f0;
  border-radius: 50px;
  height: 40px;
  overflow: hidden;
  margin: var(--spacing-md) 0;
  position: relative;
}

.progress-bar {
  background: linear-gradient(135deg, var(--success-color) 0%, #B4E7D8 100%);
  height: 100%;
  border-radius: 50px;
  transition: width 0.5s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.progress-text {
  color: white;
  font-weight: 600;
  font-size: 16px;
}

.progress-info {
  text-align: center;
  font-size: 18px;
  color: var(--text-secondary);
}

/* 任务卡片 */
.tasks-card {
  margin-bottom: var(--spacing-lg);
}

.tasks-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.header-buttons {
  display: flex;
  gap: 10px;
}

.btn-sm {
  padding: 8px 16px;
  font-size: 14px;
}

.task-categories {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-md);
  flex-wrap: wrap;
}

.category-btn {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 20px;
  background: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 14px;
}

.category-btn:hover {
  border-color: var(--primary-color);
}

.category-btn.active {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.tasks-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm);
}

.task-item {
  display: flex;
  position: relative; /* Actions positioning */
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-md);
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: var(--border-radius-sm);
  transition: all 0.3s ease;
}

.task-item:hover {
  border-color: var(--primary-color);
  transform: translateX(4px);
}

.task-item.completed {
  opacity: 0.6;
  background: #f9f9f9;
}

.task-item.completed .task-activity {
  text-decoration: line-through;
}

.task-checkbox {
  flex-shrink: 0;
}

.task-content {
  flex: 1;
}

.task-time {
  font-size: 12px;
  color: var(--text-light);
  margin-bottom: 4px;
}

.task-activity {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.task-description {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 6px;
  line-height: 1.5;
  white-space: pre-line;
  background: #f8f8f8;
  padding: 8px;
  border-radius: 6px;
  border-left: 3px solid var(--primary-color);
}

.task-reward {
  position: absolute;
  top: 0;
  right: 64px; /* Left of actions */
  flex-shrink: 0;
}

.task-stars {
  display: flex;
  gap: 2px;
  font-size: 12px;
}

.task-actions {
  display: flex;
  gap: 4px;
  position: absolute;
  top: 10px;
  right: 10px;
  flex-shrink: 0;
}

.task-actions .btn-icon {
  font-size: 14px;
  padding: 2px;
}

.btn-icon {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 4px;
  transition: transform 0.2s ease;
}

.btn-icon:hover {
  transform: scale(1.2);
}

/* 礼品卡片 */
.gifts-card {
  margin-bottom: var(--spacing-lg);
}

.gifts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
}

.gift-item {
  background: white;
  border: 2px solid #f0f0f0;
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-md);
  text-align: center;
  transition: all 0.3s ease;
}

.gift-item:hover {
  transform: translateY(-4px);
  box-shadow: var(--box-shadow);
}

.gift-item.affordable {
  border-color: var(--warning-color);
  background: linear-gradient(135deg, #FFF9E6 0%, #FFFBF0 100%);
}

.gift-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-sm);
}

.gift-name {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-primary);
}

.gift-cost {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.gift-redeemed {
  font-size: 12px;
  color: var(--success-color);
  margin-bottom: var(--spacing-sm);
}

/* 模态框 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-md);
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  max-width: 500px;
  width: 100%;
  box-shadow: var(--box-shadow-lg);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: var(--spacing-sm);
  font-weight: 600;
  color: var(--text-primary);
}

.input {
  width: 100%;
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: var(--border-radius-sm);
  font-size: 16px;
  transition: border-color 0.3s ease;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
}

.modal-actions .btn {
  flex: 1;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .week-nav {
    grid-template-columns: repeat(4, 1fr);
  }
  
  .gifts-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  
  /* Task item adjustments for mobile if needed, but absolute positioning handles actions */
}

/* 礼品入口卡片 */
.gifts-entry-card {
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  margin-bottom: var(--spacing-lg);
  border: 2px solid transparent;
}

.gifts-entry-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--box-shadow);
  border-color: var(--warning-color);
}

.entry-content {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  padding: var(--spacing-sm);
}

.entry-icon {
  font-size: 36px;
  background: #FFF9E6;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 2px solid var(--warning-color);
  flex-shrink: 0;
}

.entry-info {
  flex: 1;
}

.entry-info h2 {
  margin: 0 0 4px 0;
  font-size: 18px;
  color: var(--text-primary);
}

.entry-info p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 14px;
}

.entry-action {
  flex-shrink: 0;
}
</style>
