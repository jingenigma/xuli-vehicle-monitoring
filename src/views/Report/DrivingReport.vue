<template>
  <div class="driving-report">
    <h2>行驶数据</h2>
    <div class="report-menu">
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect">
        <el-menu-item index="daily">
          <span>里程报表（日）</span>
        </el-menu-item>
        <el-menu-item index="weekly">
          <span>里程报表（周）</span>
        </el-menu-item>
        <el-menu-item index="monthly">
          <span>里程报表（月）</span>
        </el-menu-item>
        <el-menu-item index="date">
          <span>里程报表（日期）</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="report-content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const activeMenu = computed(() => {
  const path = route.path
  if (path.includes('daily')) return 'daily'
  if (path.includes('weekly')) return 'weekly'
  if (path.includes('monthly')) return 'monthly'
  if (path.includes('date')) return 'date'
  return 'daily'
})

const handleMenuSelect = (key) => {
  if (key === 'daily') {
    router.push('/report/driving/daily')
  } else if (key === 'weekly') {
    router.push('/report/driving/weekly')
  } else if (key === 'monthly') {
    router.push('/report/driving/monthly')
  } else if (key === 'date') {
    router.push('/report/driving/date')
  }
}
</script>

<style scoped>
.driving-report {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
}

.driving-report h2 {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.report-menu {
  width: 200px;
  margin-top: 60px;
}

.report-content {
  flex: 1;
  margin-top: 60px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>