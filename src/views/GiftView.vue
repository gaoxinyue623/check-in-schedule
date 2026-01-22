<template>
  <div class="gift-page">
    <header class="header">
      <button class="back-home-btn" @click="router.push('/')">
        <span class="icon">🏠</span> 首页
      </button>
      <h1>🎁 礼品兑换中心 🎁</h1>
      <div class="star-counter pulse">
        <span class="star-icon">⭐</span>
        <span class="star-count">{{ totalStars }}</span>
        <span class="star-label">颗星星</span>
      </div>
      <p class="subtitle">用你的努力换取心仪的礼物吧！</p>
    </header>

    <!-- 兑换提示 -->
    <div class="tips-card card">
      <div class="tip-icon">💡</div>
      <div class="tip-content">
        <strong>温馨提示：</strong>完成每日任务可以获得星星，积累星星就可以兑换礼物啦！
      </div>
    </div>

    <div class="gifts-card card">
      <div class="gifts-header">
        <h2>🎯 可兑换礼品</h2>
        <button class="btn btn-primary btn-sm" @click="showAddGiftModal = true">
          ➕ 添加礼品
        </button>
      </div>
      <div v-if="gifts && gifts.length > 0" class="gifts-grid">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="gift-item"
          :class="{ 
            affordable: totalStars >= gift.stars,
            'not-affordable': totalStars < gift.stars
          }"
        >
          <div class="gift-actions">
            <button class="btn-icon" @click="editGift(gift)" title="编辑">✏️</button>
            <button class="btn-icon" @click="deleteGiftConfirm(gift)" title="删除">🗑️</button>
          </div>
          <div class="gift-icon">{{ gift.icon }}</div>
          <div class="gift-name">{{ gift.name }}</div>
          <div class="gift-cost">
            <span class="star">⭐</span>{{ gift.stars }}
          </div>
          <div class="gift-redeemed" v-if="gift.redeemed > 0">
            已兑换 {{ gift.redeemed }} 次
          </div>
          <!-- Removed :disabled condition to allow clicking for friendly prompt -->
          <button
            class="btn btn-warning btn-sm"
            :class="{ 'btn-disabled': totalStars < gift.stars }"
            @click="handleRedeemClick(gift)"
          >
            {{ totalStars >= gift.stars ? '立即兑换' : `还差${gift.stars - totalStars}⭐` }}
          </button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>暂时没有礼品数据，请尝试刷新页面或重置计划。</p>
        <button class="btn btn-secondary btn-sm" @click="initMonthSchedule">重置数据</button>
      </div>
    </div>

    <!-- 添加/编辑礼品模态框 -->
    <div v-if="showAddGiftModal || showEditGiftModal" class="modal-overlay" @click="closeGiftModals">
      <div class="modal-content" @click.stop>
        <h2>{{ showEditGiftModal ? '✏️ 编辑礼品' : '➕ 添加礼品' }}</h2>
        
        <div class="form-group">
          <label>礼品名称：</label>
          <input v-model="giftForm.name" type="text" placeholder="例如：益智玩具" class="input" />
        </div>
        
        <div class="form-group">
          <label>礼品图标：</label>
          <input v-model="giftForm.icon" type="text" placeholder="例如：🎁" class="input" />
          <small class="hint">可以使用 emoji 表情，如 🎁 🎨 📚 等</small>
        </div>
        
        <div class="form-group">
          <label>所需星星：</label>
          <input v-model.number="giftForm.stars" type="number" min="1" placeholder="例如：10" class="input" />
        </div>
        
        <div class="modal-actions">
          <button class="btn btn-primary" @click="saveGift">保存</button>
          <button class="btn" @click="closeGiftModals">取消</button>
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
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useScheduleStore } from '../stores/schedule'
import { storeToRefs } from 'pinia'
import Toast from '../components/Toast.vue'
import ConfirmModal from '../components/ConfirmModal.vue'

const router = useRouter()
const store = useScheduleStore()
const { totalStars, gifts } = storeToRefs(store)
const { redeemGift, initMonthSchedule, addGift, updateGift, deleteGift } = store

// 初始化数据
onMounted(() => {
  // 如果没有礼品数据，可能是没初始化或缓存为空，尝试初始化
  if (!gifts.value || gifts.value.length === 0) {
    initMonthSchedule()
  }
})

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

// 礼品表单状态
const showAddGiftModal = ref(false)
const showEditGiftModal = ref(false)
const giftForm = ref({
  name: '',
  icon: '',
  stars: 10
})
const editingGiftId = ref(null)

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

// 处理点击兑换
const handleRedeemClick = (gift) => {
  if (totalStars.value < gift.stars) {
    // 积分不够时的友好提示
    showToast('warning', '星星不够哦', `还需要 ${gift.stars - totalStars.value} 颗星星才能兑换"${gift.name}"。继续加油完成任务吧！💪`, 3000)
    return
  }
  
  redeemGiftConfirm(gift)
}

// 兑换礼品确认
const redeemGiftConfirm = async (gift) => {
  await showConfirm(
    '兑换礼品',
    `确定要用 ${gift.stars} 颗星星兑换"${gift.name}"吗？`,
    () => {
      if (redeemGift(gift.id)) {
        showToast('success', '兑换成功！', `恭喜你！成功兑换了"${gift.name}"！`, 4000)
      } else {
        showToast('warning', '星星不够', '继续加油，多完成任务获得更多星星！')
      }
    }
  )
}

// 编辑礼品
const editGift = (gift) => {
  giftForm.value = {
    name: gift.name,
    icon: gift.icon,
    stars: gift.stars
  }
  editingGiftId.value = gift.id
  showEditGiftModal.value = true
}

// 保存礼品
const saveGift = () => {
  if (!giftForm.value.name || !giftForm.value.icon || !giftForm.value.stars) {
    showToast('warning', '请填写完整信息', '礼品名称、图标和所需星星都不能为空')
    return
  }

  if (giftForm.value.stars < 1) {
    showToast('warning', '星星数量无效', '所需星星必须大于0')
    return
  }

  if (showEditGiftModal.value) {
    // 编辑礼品
    if (updateGift(editingGiftId.value, giftForm.value)) {
      showToast('success', '编辑成功', `礼品"${giftForm.value.name}"已更新`)
      closeGiftModals()
    } else {
      showToast('error', '编辑失败', '请稍后重试')
    }
  } else {
    // 添加礼品
    const newId = addGift(giftForm.value)
    if (newId) {
      showToast('success', '添加成功', `新礼品"${giftForm.value.name}"已添加`)
      closeGiftModals()
    } else {
      showToast('error', '添加失败', '请稍后重试')
    }
  }
}

// 删除礼品确认
const deleteGiftConfirm = async (gift) => {
  await showConfirm(
    '删除礼品',
    `确定要删除"${gift.name}"吗？${gift.redeemed > 0 ? `\n注意：此礼品已被兑换 ${gift.redeemed} 次` : ''}`,
    () => {
      if (deleteGift(gift.id)) {
        showToast('success', '删除成功', `礼品"${gift.name}"已删除`)
      } else {
        showToast('error', '删除失败', '请稍后重试')
      }
    },
    'danger'
  )
}

// 关闭礼品模态框
const closeGiftModals = () => {
  showAddGiftModal.value = false
  showEditGiftModal.value = false
  giftForm.value = {
    name: '',
    icon: '',
    stars: 10
  }
  editingGiftId.value = null
}
</script>

<style src="../assets/layout-optimized.css"></style>

<style scoped>
.gift-page {
  max-width: 800px;
  margin: 0 auto;
  min-height: 100vh;
  /* Ensure padding for fixed header if layout-optimized makes it fixed. 
     But we override header to relative below, so this might not be needed for that reason.
     However, let's look nice. */
}

/* Override fixed header for this page */
.header {
  text-align: center;
  position: relative !important; /* Force override global fixed style */
  top: auto;
  left: auto;
  right: auto;
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 20px 0;
}
h1 {
  margin-bottom: 6px;
}
.back-home-btn {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid transparent; /* Cleaner look initially */
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 6px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-size: 15px;
  font-weight: 600;
  color: var(--text-secondary);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(4px);
}

.back-home-btn:hover {
  background: white;
  color: var(--primary-color);
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 107, 157, 0.2); /* Using primary color hint */
}

.back-home-btn:active {
  transform: translateY(0);
}

.star-counter {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: linear-gradient(135deg, var(--warning-color) 0%, #FFE066 100%);
  padding: 2px 8px;
  border-radius: 50px;
  box-shadow: var(--box-shadow);
}

.star-icon {
  font-size: 16px;
}

.star-count {
  font-size: 24px;
  font-weight: 700;
  color: var(--text-primary);
}

.star-label {
  font-size: 16px;
  color: var(--text-secondary);
}

.subtitle {
  margin-top: 10px;
  font-size: 14px;
  color: var(--text-secondary);
  font-style: italic;
}

/* 提示卡片 */
.tips-card {
  background: linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%);
  margin-bottom: 6px;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border-left: 4px solid #2196F3;
}

.tip-icon {
  font-size: 32px;
  flex-shrink: 0;
}

.tip-content {
  flex: 1;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-primary);
}

.tip-content strong {
  color: #1976D2;
}

.card {
  background: white;
  border-radius: var(--border-radius-lg);
  padding: var(--spacing-lg);
  box-shadow: var(--box-shadow);
  margin-bottom: var(--spacing-lg);
}

/* Override grid constraints from layout-optimized.css */
.gifts-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
  max-height: none !important; /* Allow full height */
  overflow-y: visible !important;
}

.gift-item {
  border: 2px solid #f0f0f0;
  border-radius: var(--border-radius-md);
  padding: var(--spacing-md);
  text-align: center;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.gift-item:hover {
  transform: translateY(-5px);
  box-shadow: 0 5px 15px rgba(0,0,0,0.1);
}

.gift-item.affordable {
  border-color: var(--warning-color);
  background: linear-gradient(to bottom, #fff, #FFF9E6);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.2);
}

.gift-item.not-affordable {
  opacity: 0.6;
  filter: grayscale(30%);
}

.gift-item.not-affordable:hover {
  transform: translateY(-2px);
}

.gift-icon {
  font-size: 40px;
  margin-bottom: 5px;
}

.gift-name {
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 5px;
}

.gift-cost {
  font-weight: 700;
  color: var(--warning-color);
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.gift-redeemed {
  font-size: 12px;
  color: var(--success-color);
  background: #E8F5E9;
  padding: 2px 8px;
  border-radius: 10px;
}

.btn-warning {
  width: 100%;
  margin-top: auto;
  transition: all 0.3s ease;
}

.btn-disabled {
  background: #ccc !important;
  cursor: not-allowed !important;
  opacity: 0.7;
}

.btn-disabled:hover {
  transform: none !important;
  box-shadow: none !important;
}

/* Empty state style */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}

/* 礼品头部 */
.gifts-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.gifts-header h2 {
  margin-bottom: 0;
}

/* 礼品操作按钮 */
.gift-actions {
  position: absolute;
  top: 8px;
  right: 8px;
  display: flex;
  gap: 4px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.gift-item:hover .gift-actions {
  opacity: 1;
}

.btn-icon {
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  padding: 4px 8px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-icon:hover {
  background: white;
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.gift-item {
  position: relative;
}

/* 模态框样式 */
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
  padding: 20px;
}

.modal-content {
  background: white;
  border-radius: var(--border-radius);
  padding: var(--spacing-lg);
  max-width: 500px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-bottom: var(--spacing-lg);
  color: var(--primary-color);
}

.form-group {
  margin-bottom: var(--spacing-md);
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: var(--text-primary);
}

.form-group .input {
  width: 100%;
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-group .input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(255, 107, 157, 0.1);
}

.form-group .hint {
  display: block;
  margin-top: 4px;
  font-size: 12px;
  color: var(--text-light);
}

.modal-actions {
  display: flex;
  gap: var(--spacing-sm);
  justify-content: flex-end;
  margin-top: var(--spacing-lg);
}

.modal-actions .btn {
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.modal-actions .btn-primary {
  background: linear-gradient(135deg, var(--primary-color) 0%, #FF8FB1 100%);
  color: white;
}

.modal-actions .btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 157, 0.3);
}

.modal-actions .btn:not(.btn-primary) {
  background: #f5f5f5;
  color: var(--text-secondary);
}

.modal-actions .btn:not(.btn-primary):hover {
  background: #e0e0e0;
}
</style>

