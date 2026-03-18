<template>
  <div class="alarm-config-container">
    <h2>报警设置</h2>
    <div class="config-menu">
      <el-menu :default-active="activeMenu" class="el-menu-vertical-demo" @select="handleMenuSelect">
        <el-menu-item index="general">
          <span>常规报警设置</span>
        </el-menu-item>
        <el-menu-item index="area">
          <span>区域报警设置</span>
        </el-menu-item>
      </el-menu>
    </div>
    <div class="config-content">
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
  if (path.includes('general')) return 'general'
  if (path.includes('area')) return 'area'
  return 'general'
})

const handleMenuSelect = (key) => {
  if (key === 'general') {
    router.push('/config/alarm/general')
  } else if (key === 'area') {
    router.push('/config/alarm/area')
  }
}
</script>

<style scoped>
.alarm-config-container {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 20px;
}

.alarm-config-container h2 {
  position: absolute;
  top: 20px;
  left: 20px;
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.config-menu {
  width: 200px;
  margin-top: 60px;
}

.config-content {
  flex: 1;
  margin-top: 60px;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
</style>