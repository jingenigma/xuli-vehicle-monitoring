<template>
  <div class="log-management">
    <h2>日志管理</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="操作人">
          <el-input v-model="searchForm.username" placeholder="请输入操作人" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="操作类型">
          <el-select v-model="searchForm.type" placeholder="选择操作类型" style="width: 150px;">
            <el-option label="登录" value="login" />
            <el-option label="操作" value="operation" />
            <el-option label="异常" value="error" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            style="width: 200px;"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchLog">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="exportLog">导出日志</el-button>
    </div>
    <el-table :data="logList" style="width: 100%">
      <el-table-column prop="time" label="操作时间" width="180" />
      <el-table-column prop="username" label="操作人" width="120" />
      <el-table-column prop="type" label="操作类型" width="100" />
      <el-table-column prop="content" label="操作内容" min-width="300" />
      <el-table-column prop="ip" label="IP地址" width="150" />
      <el-table-column prop="status" label="状态" width="100" />
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
  username: '',
  type: '',
  startTime: '',
  endTime: ''
})

// 日志列表
const logList = ref([
  { id: 1, time: '2026-03-16 10:30:00', username: 'admin', type: '登录', content: '管理员登录系统', ip: '192.168.1.100', status: '成功' },
  { id: 2, time: '2026-03-16 10:25:00', username: 'operator1', type: '操作', content: '添加车辆信息', ip: '192.168.1.101', status: '成功' },
  { id: 3, time: '2026-03-16 10:20:00', username: 'viewer1', type: '操作', content: '查看报警记录', ip: '192.168.1.102', status: '成功' },
  { id: 4, time: '2026-03-16 10:15:00', username: 'admin', type: '操作', content: '修改报警设置', ip: '192.168.1.100', status: '成功' },
  { id: 5, time: '2026-03-16 10:10:00', username: 'operator2', type: '异常', content: '导出报表失败', ip: '192.168.1.103', status: '失败' }
])

// 分页
const currentPage = ref(1)

// 查询日志
const searchLog = () => {
  console.log('查询日志:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    username: '',
    type: '',
    startTime: '',
    endTime: ''
  }
}

// 导出日志
const exportLog = () => {
  console.log('导出日志')
  // 实际项目中这里会导出日志
  alert('日志导出成功')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.log-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.log-management h2 {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.search-section {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}

.search-form {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.action-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>