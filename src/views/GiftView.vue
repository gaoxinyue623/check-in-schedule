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
    </header>

    <div class="gifts-card card">
      <div v-if="gifts && gifts.length > 0" class="gifts-grid">
        <div
          v-for="gift in gifts"
          :key="gift.id"
          class="gift-item"
          :class="{ affordable: totalStars >= gift.stars }"
        >
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
            @click="handleRedeemClick(gift)"
          >
            兑换
          </button>
        </div>
      </div>
      <div v-else class="empty-state">
        <p>暂时没有礼品数据，请尝试刷新页面或重置计划。</p>
        <button class="btn btn-secondary btn-sm" @click="initMonthSchedule">重置数据</button>
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
const { redeemGift, initMonthSchedule } = store

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
  margin-bottom: var(--spacing-lg);
  position: relative !important; /* Force override global fixed style */
  top: auto;
  left: auto;
  right: auto;
  background: transparent;
  box-shadow: none;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 15px;
  padding: 20px 0;
}

.back-home-btn {
  position: absolute;
  left: 0;
  top: 0;
  background: rgba(255, 255, 255, 0.9);
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
  padding: 12px 24px;
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
}

/* Empty state style */
.empty-state {
  text-align: center;
  padding: 40px;
  color: #888;
  font-size: 16px;
}
</style>
