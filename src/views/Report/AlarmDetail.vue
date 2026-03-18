<template>
  <div class="alarm-detail">
    <h3>报警统计明细</h3>
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
        <el-form-item label="车牌号">
          <el-input v-model="searchForm.plate" placeholder="请输入车牌号" style="width: 150px;"></el-input>
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
    <el-table :data="alarmDetails" style="width: 100%">
      <el-table-column prop="plate" label="车牌号" width="120" />
      <el-table-column prop="alarmType" label="报警类型" width="120" />
      <el-table-column prop="alarmTime" label="报警时间" width="180" />
      <el-table-column prop="alarmValue" label="报警数值" width="150" />
      <el-table-column prop="duration" label="持续时间" width="120" />
      <el-table-column prop="location" label="报警位置" min-width="200" />
      <el-table-column prop="status" label="处理状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="viewDetail(scope.row)">查看详情</el-button>
          <el-button size="small" type="primary" @click="handleAlarm(scope.row)">处理</el-button>
        </template>
      </el-table-column>
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
  plate: '',
  alarmType: 'all'
})

// 报警明细数据
const alarmDetails = ref([
  { id: 1, plate: '粤B12345', alarmType: '超速', alarmTime: '2026-03-16 10:00:00', alarmValue: '96km/h（限速60）', duration: '5分钟', location: '广深高速 宝安段', status: '未处理' },
  { id: 2, plate: '粤A09876', alarmType: '疲劳驾驶', alarmTime: '2026-03-16 09:30:00', alarmValue: '连续驾驶4小时', duration: '15分钟', location: '广园快速路 萝岗段', status: '已处理' },
  { id: 3, plate: '粤B89012', alarmType: '超时停车', alarmTime: '2026-03-16 10:00:00', alarmValue: '停车超过30分钟', duration: '28分钟', location: '深圳市宝安区宝安中心区', status: '未处理' },
  { id: 4, plate: '粤C34567', alarmType: '超速', alarmTime: '2026-03-16 10:36:12', alarmValue: '185km/h（限速120）', duration: '2分钟', location: '广珠西线高速 中山段', status: '未处理' },
  { id: 5, plate: '粤B12345', alarmType: '抽烟', alarmTime: '2026-03-16 08:15:00', alarmValue: '检测到抽烟', duration: '3分钟', location: '广深高速 福永段', status: '已处理' }
])

// 分页
const currentPage = ref(1)

// 查询报警
const searchAlarm = () => {
  console.log('查询报警:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    startDate: '',
    endDate: '',
    plate: '',
    alarmType: 'all'
  }
}

// 查看详情
const viewDetail = (row) => {
  console.log('查看详情:', row)
}

// 处理报警
const handleAlarm = (row) => {
  console.log('处理报警:', row)
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
.alarm-detail {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.alarm-detail h3 {
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
  flex-wrap: wrap;
}

.action-section {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>