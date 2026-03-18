<template>
  <div class="alarm-report">
    <h2>报警统计</h2>
    <div class="report-menu">
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect">
        <el-menu-item index="summary">
          <span>报警统计汇总</span>
        </el-menu-item>
        <el-menu-item index="detail">
          <span>报警统计明细</span>
        </el-menu-item>
        <el-menu-item index="processing">
          <span>报警处理统计</span>
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
  if (path.includes('summary')) return 'summary'
  if (path.includes('detail')) return 'detail'
  if (path.includes('processing')) return 'processing'
  return 'summary'
})

const handleMenuSelect = (key) => {
  if (key === 'summary') {
    router.push('/report/alarm/summary')
  } else if (key === 'detail') {
    router.push('/report/alarm/detail')
  } else if (key === 'processing') {
    router.push('/report/alarm/processing')
  }
}
</script>

<style scoped>
.alarm-report {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
}

.alarm-report h2 {
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