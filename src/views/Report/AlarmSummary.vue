<template>
  <div class="alarm-summary">
    <h3>报警统计汇总</h3>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="开始日期">
          <el-date-picker
            v-model="searchForm.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 150px;"
          />
        </el-form-item>
        <el-form-item label="结束日期">
          <el-date-picker
            v-model="searchForm.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 150px;"
          />
        </el-form-item>
        <el-form-item label="报警类型">
          <el-select v-model="searchForm.alarmType" placeholder="选择报警类型" style="width: 150px;">
            <el-option label="全部" value="all" />
            <el-option label="超速" value="speed" />
            <el-option label="疲劳驾驶" value="fatigue" />
            <el-option label="超时停车" value="parking" />
            <el-option label="抽烟" value="smoking" />
            <el-option label="玩手机" value="phone" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchAlarm">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="exportReport">导出报表</el-button>
    </div>
    <div class="chart-section">
      <div class="chart-item">
        <h4>报警类型分布</h4>
        <div class="chart-container"></div>
      </div>
      <div class="chart-item">
        <h4>报警趋势</h4>
        <div class="chart-container"></div>
      </div>
    </div>
    <el-table :data="alarmSummary" style="width: 100%">
      <el-table-column prop="alarmType" label="报警类型" width="120" />
      <el-table-column prop="count" label="报警次数" width="100" />
      <el-table-column prop="vehicleCount" label="涉及车辆数" width="120" />
      <el-table-column prop="avgDuration" label="平均持续时间" width="150" />
      <el-table-column prop="maxDuration" label="最长持续时间" width="150" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 搜索表单
const searchForm = ref({
  startDate: '',
  endDate: '',
  alarmType: 'all'
})

// 报警汇总数据
const alarmSummary = ref([
  { alarmType: '超速', count: 120, vehicleCount: 35, avgDuration: '5分钟', maxDuration: '30分钟' },
  { alarmType: '疲劳驾驶', count: 85, vehicleCount: 28, avgDuration: '10分钟', maxDuration: '45分钟' },
  { alarmType: '超时停车', count: 60, vehicleCount: 20, avgDuration: '45分钟', maxDuration: '2小时' },
  { alarmType: '抽烟', count: 35, vehicleCount: 15, avgDuration: '3分钟', maxDuration: '10分钟' },
  { alarmType: '玩手机', count: 45, vehicleCount: 18, avgDuration: '2分钟', maxDuration: '8分钟' }
])

// 查询报警
const searchAlarm = () => {
  console.log('查询报警:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    startDate: '',
    endDate: '',
    alarmType: 'all'
  }
}

// 导出报表
const exportReport = () => {
  console.log('导出报表')
  // 实际项目中这里会导出报表
  alert('报表导出成功')
}
</script>

<style scoped>
.alarm-summary {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alarm-summary h3 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.search-section {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  margin-bottom: 20px;
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
}

.action-section {
  margin-bottom: 20px;
}

.chart-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-bottom: 20px;
}

.chart-item {
  background-color: #f5f7fa;
  border-radius: 8px;
  padding: 15px;
  display: flex;
  flex-direction: column;
}

.chart-item h4 {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 15px;
}

.chart-container {
  flex: 1;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}
</style>