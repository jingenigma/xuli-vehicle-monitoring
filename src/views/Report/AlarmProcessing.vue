<template>
  <div class="alarm-processing">
    <h3>报警处理统计</h3>
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
        <el-form-item label="处理状态">
          <el-select v-model="searchForm.status" placeholder="选择处理状态" style="width: 150px;">
            <el-option label="全部" value="all" />
            <el-option label="已处理" value="processed" />
            <el-option label="未处理" value="unprocessed" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchProcessing">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="exportReport">导出报表</el-button>
    </div>
    <div class="chart-section">
      <div class="chart-item">
        <h4>处理状态分布</h4>
        <div class="chart-container"></div>
      </div>
      <div class="chart-item">
        <h4>处理时效分析</h4>
        <div class="chart-container"></div>
      </div>
    </div>
    <el-table :data="processingStats" style="width: 100%">
      <el-table-column prop="alarmType" label="报警类型" width="120" />
      <el-table-column prop="totalCount" label="总报警数" width="100" />
      <el-table-column prop="processedCount" label="已处理数" width="100" />
      <el-table-column prop="unprocessedCount" label="未处理数" width="100" />
      <el-table-column prop="processingRate" label="处理率" width="100" />
      <el-table-column prop="avgProcessingTime" label="平均处理时间" width="150" />
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 搜索表单
const searchForm = ref({
  startDate: '',
  endDate: '',
  status: 'all'
})

// 处理统计数据
const processingStats = ref([
  { alarmType: '超速', totalCount: 120, processedCount: 95, unprocessedCount: 25, processingRate: '79.2%', avgProcessingTime: '15分钟' },
  { alarmType: '疲劳驾驶', totalCount: 85, processedCount: 75, unprocessedCount: 10, processingRate: '88.2%', avgProcessingTime: '10分钟' },
  { alarmType: '超时停车', totalCount: 60, processedCount: 45, unprocessedCount: 15, processingRate: '75.0%', avgProcessingTime: '20分钟' },
  { alarmType: '抽烟', totalCount: 35, processedCount: 30, unprocessedCount: 5, processingRate: '85.7%', avgProcessingTime: '8分钟' },
  { alarmType: '玩手机', totalCount: 45, processedCount: 40, unprocessedCount: 5, processingRate: '88.9%', avgProcessingTime: '5分钟' }
])

// 查询处理统计
const searchProcessing = () => {
  console.log('查询处理统计:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    startDate: '',
    endDate: '',
    status: 'all'
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
.alarm-processing {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alarm-processing h3 {
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