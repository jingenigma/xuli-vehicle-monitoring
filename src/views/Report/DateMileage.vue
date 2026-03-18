<template>
  <div class="date-mileage">
    <h3>里程报表（日期）</h3>
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
        <el-form-item label="车队">
          <el-select v-model="searchForm.group" placeholder="选择车队" style="width: 150px;">
            <el-option label="全部" value="all" />
            <el-option label="深圳分公司" value="shenzhen" />
            <el-option label="广州分公司" value="guangzhou" />
            <el-option label="物流合作" value="logistics" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchMileage">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="exportReport">导出报表</el-button>
    </div>
    <div class="chart-section">
      <div class="chart-item">
        <h4>日期里程趋势</h4>
        <div class="chart-container"></div>
      </div>
    </div>
    <el-table :data="dateMileage" style="width: 100%">
      <el-table-column prop="plate" label="车牌号" width="120" />
      <el-table-column prop="date" label="日期" width="150" />
      <el-table-column prop="mileage" label="行驶里程(km)" width="120" />
      <el-table-column prop="maxSpeed" label="最高速度(km/h)" width="120" />
      <el-table-column prop="avgSpeed" label="平均速度(km/h)" width="120" />
      <el-table-column prop="drivingTime" label="行驶时长" width="120" />
      <el-table-column prop="group" label="所属车队" width="150" />
    </el-table>
    <div class="pagination">
      <el-pagination
        layout="prev, pager, next"
        :total="100"
        :page-size="10"
        :current-page="currentPage"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 搜索表单
const searchForm = ref({
  startDate: '',
  endDate: '',
  group: 'all'
})

// 日期里程数据
const dateMileage = ref([
  { id: 1, plate: '粤B12345', date: '2026-03-14', mileage: 110.5, maxSpeed: 90, avgSpeed: 42.2, drivingTime: '2小时20分钟', group: '深圳分公司' },
  { id: 2, plate: '粤B12345', date: '2026-03-15', mileage: 130.5, maxSpeed: 96, avgSpeed: 48.2, drivingTime: '2小时40分钟', group: '深圳分公司' },
  { id: 3, plate: '粤B12345', date: '2026-03-16', mileage: 120.5, maxSpeed: 92, avgSpeed: 45.2, drivingTime: '2小时30分钟', group: '深圳分公司' },
  { id: 4, plate: '粤B67890', date: '2026-03-14', mileage: 75.2, maxSpeed: 60, avgSpeed: 38.5, drivingTime: '1小时50分钟', group: '深圳分公司' },
  { id: 5, plate: '粤B67890', date: '2026-03-15', mileage: 95.2, maxSpeed: 65, avgSpeed: 42.5, drivingTime: '2小时20分钟', group: '深圳分公司' }
])

// 分页
const currentPage = ref(1)

// 查询里程
const searchMileage = () => {
  console.log('查询里程:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    startDate: '',
    endDate: '',
    group: 'all'
  }
}

// 导出报表
const exportReport = () => {
  console.log('导出报表')
  // 实际项目中这里会导出报表
  alert('报表导出成功')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.date-mileage {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.date-mileage h3 {
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
  height: 300px;
  background-color: white;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>