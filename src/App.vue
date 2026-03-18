<template>
  <div class="app-container">
    <!-- 顶部导航栏 -->
    <header class="app-header">
      <div class="logo">旭利视控平台</div>
      <nav class="main-nav">
        <div 
          v-for="item in navMenu" 
          :key="item.id"
          class="nav-item"
          @mouseenter="showSubMenu(item.id)"
          @mouseleave="hideSubMenu"
        >
          <router-link :to="item.path" class="nav-link" :class="{ 'active': isActive(item.path) }">
            {{ item.name }}
          </router-link>
        </div>
      </nav>
      <!-- 子菜单 -->
      <template v-for="item in navMenu" :key="'submenu-' + item.id">
        <div 
          v-if="item.children && item.children.length > 0" 
          class="sub-menu" 
          v-show="activeSubMenu === item.id"
        >
          <div class="sub-menu-content">
            <div class="second-level">
              <div 
                v-for="child in item.children" 
                :key="child.id"
                class="second-level-item"
                @mouseenter="activeSecondLevel = child.id"
              >
                <span class="second-level-title">{{ child.name }}</span>
              </div>
            </div>
            <div class="third-level-container">
              <template v-for="(child, index) in item.children" :key="child.id">
                <div 
                  v-if="child.children && child.children.length > 0"
                  class="third-level"
                  v-show="activeSecondLevel === child.id || (activeSecondLevel === null && index === 0)"
                >
                  <router-link 
                    v-for="grandchild in child.children" 
                    :key="grandchild.id"
                    :to="grandchild.path"
                    class="third-level-item"
                  >
                    {{ grandchild.name }}
                  </router-link>
                </div>
              </template>
            </div>
          </div>
        </div>
      </template>
    </header>

    <!-- 面包屑 -->
    <div class="breadcrumb">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-for="(item, index) in breadcrumb" :key="index">
          {{ item.name }}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>

    <!-- 主内容区 -->
    <main class="app-main">
      <!-- 左侧车辆列表 -->
      <aside class="vehicle-sidebar" :class="{ 'collapsed': isSidebarCollapsed }">
        <div class="sidebar-header">
          <h3>车辆列表</h3>
          <button class="collapse-btn" @click="toggleSidebar">
            <span v-if="!isSidebarCollapsed">《</span>
            <span v-else>》</span>
          </button>
        </div>
        <div class="vehicle-tabs" v-if="!isSidebarCollapsed">
          <el-tabs v-model="activeVehicleTab">
            <el-tab-pane label="自营车辆 (520)">
              <div class="search-section">
                <el-select v-model="searchType" placeholder="搜索类型" class="search-type">
                  <el-option label="车牌号" value="plate" />
                  <el-option label="车架号" value="frame" />
                  <el-option label="SIM卡号" value="sim" />
                  <el-option label="终端ID" value="terminal" />
                  <el-option label="车组名称" value="group" />
                </el-select>
                <el-input 
                  v-model="searchValue" 
                  placeholder="请输入搜索内容" 
                  class="search-input"
                  :error="searchError"
                  :validate-event="false"
                >
                  <template #append>
                    <el-button type="primary" icon="el-icon-search" @click="validateSearch">搜索</el-button>
                  </template>
                </el-input>
                <div v-if="searchError" class="error-message">{{ searchError }}</div>
              </div>
              <div class="vehicle-tree">
                <el-tree
                  :data="selfVehicleTree"
                  :props="treeProps"
                  node-key="id"
                  default-expand-all
                  show-checkbox
                  @node-click="handleNodeClick"
                  @check-change="handleCheckChange"
                  :highlight-current="true"
                  current-node-key="currentNodeKey"
                />
              </div>
            </el-tab-pane>
            <el-tab-pane label="合作车辆 (145)">
              <div class="search-section">
                <el-select v-model="searchType" placeholder="搜索类型" class="search-type">
                  <el-option label="车牌号" value="plate" />
                  <el-option label="车架号" value="frame" />
                  <el-option label="SIM卡号" value="sim" />
                  <el-option label="终端ID" value="terminal" />
                  <el-option label="车组名称" value="group" />
                </el-select>
                <el-input 
                  v-model="searchValue" 
                  placeholder="请输入搜索内容" 
                  class="search-input"
                  :error="searchError"
                  :validate-event="false"
                >
                  <template #append>
                    <el-button type="primary" icon="el-icon-search" @click="validateSearch">搜索</el-button>
                  </template>
                </el-input>
                <div v-if="searchError" class="error-message">{{ searchError }}</div>
              </div>
              <div class="vehicle-tree">
                <el-tree
                  :data="coopVehicleTree"
                  :props="treeProps"
                  node-key="id"
                  default-expand-all
                  show-checkbox
                  @node-click="handleNodeClick"
                  @check-change="handleCheckChange"
                  :highlight-current="true"
                  current-node-key="currentNodeKey"
                />
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </aside>

      <!-- 右侧内容 -->
      <div class="content-area">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

// 导航菜单数据
const navMenu = [
  { id: 1, name: '首页大屏', path: '/home' },
  { id: 2, name: '车辆定位', path: '/vehicle-location' },
  { id: 3, name: '轨迹回放', path: '/track-playback' },
  { id: 4, name: '实时视频', path: '/live-video' },
  { id: 5, name: '视频回放', path: '/video-playback' },
  { 
    id: 6, 
    name: '配置中心', 
    path: '/config/alarm',
    children: [
      { 
        id: 61, 
        name: '报警设置',
        children: [
          { id: 611, name: '常规报警设置', path: '/config/alarm/general' },
          { id: 612, name: '区域报警设置', path: '/config/alarm/area' }
        ]
      }
    ]
  },
  { 
    id: 7, 
    name: '运营管理', 
    path: '/operation/vehicle',
    children: [
      { id: 71, name: '车辆管理', path: '/operation/vehicle' },
      { id: 72, name: '驾驶员管理', path: '/operation/driver' },
      { id: 73, name: '终端管理', path: '/operation/terminal' },
      { id: 74, name: '终端配置', path: '/operation/terminal-config' }
    ]
  },
  { 
    id: 8, 
    name: '报表统计', 
    path: '/report/alarm',
    children: [
      { 
        id: 81, 
        name: '报警统计',
        children: [
          { id: 811, name: '报警统计汇总', path: '/report/alarm/summary' },
          { id: 812, name: '报警统计明细', path: '/report/alarm/detail' },
          { id: 813, name: '报警处理统计', path: '/report/alarm/processing' }
        ]
      },
      { 
        id: 82, 
        name: '行驶数据',
        children: [
          { id: 821, name: '里程报表（日）', path: '/report/driving/daily' },
          { id: 822, name: '里程报表（周）', path: '/report/driving/weekly' },
          { id: 823, name: '里程报表（月）', path: '/report/driving/monthly' },
          { id: 824, name: '里程报表（日期）', path: '/report/driving/date' }
        ]
      }
    ]
  },
  { 
    id: 9, 
    name: '系统管理', 
    path: '/system/user',
    children: [
      { id: 91, name: '用户管理', path: '/system/user' },
      { id: 92, name: '角色管理', path: '/system/role' },
      { id: 93, name: '日志管理', path: '/system/log' }
    ]
  }
]

// 子菜单状态
const activeSubMenu = ref(null)
const activeSecondLevel = ref(null)

// 显示子菜单
const showSubMenu = (id) => {
  activeSubMenu.value = id
  activeSecondLevel.value = null
}

// 隐藏子菜单
const hideSubMenu = () => {
  activeSubMenu.value = null
  activeSecondLevel.value = null
}

// 侧边栏状态
const isSidebarCollapsed = ref(false)

// 切换侧边栏
const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

// 车辆Tab
const activeVehicleTab = ref('0')

// 搜索相关
const searchType = ref('plate')
const searchValue = ref('')
const searchError = ref('')

// 验证搜索
const validateSearch = () => {
  searchError.value = ''
  
  if (!searchValue.value) {
    searchError.value = '请输入搜索内容'
    return
  }
  
  // 根据搜索类型验证输入内容
  switch (searchType.value) {
    case 'plate':
      // 车牌号验证：粤A12345格式
      if (!/^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$/.test(searchValue.value)) {
        searchError.value = '输入的内容与所选的搜索类型不匹配'
      }
      break
    case 'frame':
      // 车架号验证：17位字母数字
      if (!/^[A-HJ-NPR-Z0-9]{17}$/.test(searchValue.value)) {
        searchError.value = '输入的内容与所选的搜索类型不匹配'
      }
      break
    case 'sim':
      // SIM卡号验证：11位数字
      if (!/^1[3-9]\d{9}$/.test(searchValue.value)) {
        searchError.value = '输入的内容与所选的搜索类型不匹配'
      }
      break
    case 'terminal':
      // 终端ID验证：字母数字组合
      if (!/^[A-Z0-9]+$/.test(searchValue.value)) {
        searchError.value = '输入的内容与所选的搜索类型不匹配'
      }
      break
    case 'group':
      // 车组名称验证：不做严格验证
      break
  }
  
  if (!searchError.value) {
    // 搜索逻辑
    console.log('搜索:', searchType.value, searchValue.value)
  }
}

// 自营车辆树形数据
const selfVehicleTree = ref([
  {
    id: 1,
    label: '公司车辆 (520)',
    children: [
      {
        id: 11,
        label: '广州地区 (300)',
        children: [
          {
            id: 111,
            label: '广州分公司 (200)',
            children: [
              { id: 1111, label: '粤A54321', plate: '粤A54321' },
              { id: 1112, label: '粤A09876', plate: '粤A09876' },
              { id: 1113, label: '粤A13579', plate: '粤A13579' },
              { id: 1114, label: '粤A24680', plate: '粤A24680' }
            ]
          },
          {
            id: 112,
            label: '增城分公司 (100)',
            children: [
              { id: 1121, label: '粤A36925', plate: '粤A36925' },
              { id: 1122, label: '粤A85274', plate: '粤A85274' }
            ]
          }
        ]
      },
      {
        id: 12,
        label: '中山地区 (220)',
        children: [
          {
            id: 121,
            label: '中山分公司 (220)',
            children: [
              { id: 1211, label: '粤T12345', plate: '粤T12345' },
              { id: 1212, label: '粤T67890', plate: '粤T67890' },
              { id: 1213, label: '粤T54321', plate: '粤T54321' },
              { id: 1214, label: '粤T09876', plate: '粤T09876' }
            ]
          }
        ]
      }
    ]
  }
])

// 合作车辆树形数据
const coopVehicleTree = ref([
  {
    id: 2,
    label: '合作车辆 (145)',
    children: [
      {
        id: 21,
        label: '物流合作 (145)',
        children: [
          {
            id: 211,
            label: '广州物流 (80)',
            children: [
              { id: 2111, label: '粤C13579', plate: '粤C13579' },
              { id: 2112, label: '粤C24680', plate: '粤C24680' }
            ]
          },
          {
            id: 212,
            label: '中山物流 (65)',
            children: [
              { id: 2121, label: '粤C36925', plate: '粤C36925' },
              { id: 2122, label: '粤C85274', plate: '粤C85274' }
            ]
          }
        ]
      }
    ]
  }
])

// 树形配置
const treeProps = {
  children: 'children',
  label: 'label'
}

// 当前选中节点
const currentNodeKey = ref(null)

// 节点点击事件
const handleNodeClick = (data) => {
  currentNodeKey.value = data.id
  if (data.plate) {
    // 处理车辆点击
    console.log('Selected vehicle:', data.plate)
  } else {
    // 处理车组点击
    console.log('Selected group:', data.label)
  }
}

// 节点勾选事件
const handleCheckChange = (data, checked, indeterminate) => {
  console.log('Check change:', data.label, checked, indeterminate)
  // 实际项目中这里会处理车组选择逻辑
}

// 面包屑
const breadcrumb = ref([])

// 更新面包屑
const updateBreadcrumb = (path) => {
  const parts = path.split('/').filter(Boolean)
  const breadcrumbItems = []
  
  // 首页
  breadcrumbItems.push({ name: '首页', path: '/' })
  
  // 其他路径
  let currentPath = ''
  for (const part of parts) {
    currentPath += '/' + part
    // 查找对应的菜单名称
    const menuItem = findMenuItem(navMenu, currentPath)
    if (menuItem) {
      breadcrumbItems.push({ name: menuItem.name, path: currentPath })
    }
  }
  
  breadcrumb.value = breadcrumbItems
}

// 查找菜单项
const findMenuItem = (menu, path) => {
  for (const item of menu) {
    if (item.path === path) {
      return item
    }
    if (item.children) {
      const found = findMenuItem(item.children, path)
      if (found) {
        return found
      }
    }
  }
  return null
}

// 监听路由变化，更新面包屑
watch(() => route.path, (newPath) => {
  updateBreadcrumb(newPath)
}, { immediate: true })

// 判断菜单项是否激活
const isActive = (path) => {
  return route.path.startsWith(path) || route.path === path
}
</script>

<style scoped>
.app-container {
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f7fa;
}

/* 顶部导航栏 */
.app-header {
  height: 60px;
  background-color: #1976d2;
  color: white;
  display: flex;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 100;
}

.logo {
  font-size: 20px;
  font-weight: bold;
  margin-right: 40px;
}

.main-nav {
  display: flex;
  gap: 10px;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: block;
  padding: 0 20px;
  height: 60px;
  line-height: 60px;
  color: white;
  text-decoration: none;
  transition: background-color 0.3s;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

/* 子菜单 */
.sub-menu {
  position: fixed;
  top: 60px;
  left: 0;
  background-color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 0 0 4px 4px;
  overflow: hidden;
  z-index: 9999;
  width: 100vw;
  margin-left: 0;
}

.sub-menu-content {
  padding: 20px;
  display: flex;
  width: 100%;
  margin: 0;
}

.second-level {
  display: flex;
  flex-direction: column;
  gap: 15px;
  width: 200px;
  border-right: 1px solid #e4e7ed;
  padding-right: 20px;
  margin-right: 20px;
}

.second-level-item {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.second-level-title {
  font-weight: bold;
  color: #303133;
  padding: 5px 0;
  cursor: pointer;
  transition: color 0.3s;
  font-size: 14px;
}

.second-level-title:hover {
  color: #409eff;
}

.third-level-container {
  display: flex;
  flex: 1;
  align-items: flex-start;
}

.third-level {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  flex: 1;
  align-content: flex-start;
  padding-top: 5px;
}

.third-level-item {
  padding: 15px 20px;
  color: #606266;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s;
  background-color: white;
  border: 1px solid #e4e7ed;
  font-size: 14px;
  white-space: nowrap;
  min-width: 120px;
  text-align: center;
  font-weight: 500;
}

.third-level-item:hover {
  background-color: #ecf5ff;
  color: #409eff;
  border-color: #409eff;
}

/* 面包屑 */
.breadcrumb {
  background-color: white;
  padding: 10px 20px;
  border-bottom: 1px solid #e4e7ed;
}

/* 主内容区 */
.app-main {
  flex: 1;
  display: flex;
  overflow: hidden;
}

/* 左侧车辆列表 */
.vehicle-sidebar {
  width: 300px;
  background-color: white;
  border-right: 1px solid #e4e7ed;
  display: flex;
  flex-direction: column;
  transition: width 0.3s;
  overflow: hidden;
}

.vehicle-sidebar.collapsed {
  width: 80px;
}

.vehicle-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

:deep(.el-tabs__content) {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.vehicle-tree {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

.sidebar-header {
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.sidebar-header h3 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
}

.collapse-btn {
  padding: 4px;
  background-color: #ecf5ff;
  border: 1px solid #d9ecff;
  border-radius: 4px;
  color: #409eff;
  cursor: pointer;
  font-size: 12px;
  transition: all 0.3s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
}

.collapse-btn:hover {
  background-color: #409eff;
  color: white;
}

.search-section {
  padding: 15px;
  border-bottom: 1px solid #e4e7ed;
}

.search-type {
  width: 100%;
  margin-bottom: 10px;
}

.search-input {
  width: 100%;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}

.vehicle-tree {
  flex: 1;
  padding: 10px;
  overflow-y: auto;
}

/* 树形控件样式 */
:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: #409eff !important;
  color: white !important;
  font-weight: bold;
}

:deep(.el-tree-node.is-current > .el-tree-node__content:hover) {
  background-color: #409eff !important;
}

:deep(.el-tree-node__content:hover) {
  background-color: #ecf5ff !important;
}

/* 右侧内容 */
.content-area {
  flex: 1;
  overflow: auto;
  padding: 20px;
}

/* 过渡动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>