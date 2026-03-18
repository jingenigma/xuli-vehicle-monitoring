<template>
  <div class="home-container">
    <div class="dashboard">
      <div class="dashboard-header">
        <h2>旭利视控平台 - 首页大屏</h2>
        <div class="date-time">
          <span>{{ currentDate }}</span>
          <span>{{ currentTime }}</span>
        </div>
      </div>
      
      <div class="dashboard-stats">
        <div class="stat-card">
          <div class="stat-icon vehicle-icon"></div>
          <div class="stat-content">
            <div class="stat-value">{{ totalVehicles }}</div>
            <div class="stat-label">总车辆数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon online-icon"></div>
          <div class="stat-content">
            <div class="stat-value">{{ onlineVehicles }}</div>
            <div class="stat-label">在线车辆</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon offline-icon"></div>
          <div class="stat-content">
            <div class="stat-value">{{ offlineVehicles }}</div>
            <div class="stat-label">离线车辆</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon alarm-icon"></div>
          <div class="stat-content">
            <div class="stat-value">{{ alarmVehicles }}</div>
            <div class="stat-label">报警车辆</div>
          </div>
        </div>
      </div>
      
      <div class="dashboard-content">
        <div class="left-panel">
          <div class="map-section">
            <h3>车辆分布</h3>
            <div class="map-container"></div>
          </div>
        </div>
        <div class="right-panel">
          <div class="alarm-section">
            <h3>报警统计</h3>
            <div class="alarm-chart"></div>
          </div>
          <div class="driving-section">
            <h3>行驶数据</h3>
            <div class="driving-chart"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// 统计数据
const totalVehicles = ref(120)
const onlineVehicles = ref(105)
const offlineVehicles = ref(15)
const alarmVehicles = ref(8)

// 当前时间
const currentDate = ref('')
const currentTime = ref('')

// 更新时间
const updateDateTime = () => {
  const now = new Date()
  currentDate.value = now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
  currentTime.value = now.toLocaleTimeString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

// 定时器
let timer = null

onMounted(() => {
  updateDateTime()
  timer = setInterval(updateDateTime, 1000)
})

onUnmounted(() => {
  if (timer) {
    clearInterval(timer)
  }
})
</script>

<style scoped>
.home-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.dashboard {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.dashboard-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.dashboard-header h2 {
  font-size: 20px;
  font-weight: bold;
  color: #303133;
}

.date-time {
  display: flex;
  gap: 20px;
  font-size: 14px;
  color: #606266;
}

.dashboard-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.stat-card {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  transition: transform 0.3s;
}

.stat-card:hover {
  transform: translateY(-5px);
}

.stat-icon {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.vehicle-icon {
  background-color: #ecf5ff;
  color: #409eff;
}

.online-icon {
  background-color: #f0f9eb;
  color: #67c23a;
}

.offline-icon {
  background-color: #f5f7fa;
  color: #909399;
}

.alarm-icon {
  background-color: #fef0f0;
  color: #f56c6c;
}

.stat-content {
  flex: 1;
}

.stat-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.stat-label {
  font-size: 14px;
  color: #606266;
}

.dashboard-content {
  flex: 1;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
}

.left-panel {
  display: flex;
  flex-direction: column;
}

.right-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.map-section,
.alarm-section,
.driving-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.map-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.alarm-section,
.driving-section {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.map-section h3,
.alarm-section h3,
.driving-section h3 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.map-container {
  flex: 1;
  background-color: #e6e6e6;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}

.alarm-chart,
.driving-chart {
  flex: 1;
  background-color: #f5f7fa;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}

/* 响应式设计 */
@media screen and (max-width: 1200px) {
  .dashboard-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .dashboard-content {
    grid-template-columns: 1fr;
  }
}

@media screen and (max-width: 768px) {
  .dashboard-stats {
    grid-template-columns: 1fr;
  }
}
</style>