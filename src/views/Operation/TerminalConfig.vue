<template>
  <div class="terminal-config">
    <h2>终端配置</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="终端ID">
          <el-input v-model="searchForm.terminalId" placeholder="请输入终端ID" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="车辆">
          <el-select v-model="searchForm.vehicle" placeholder="选择车辆" style="width: 150px;">
            <el-option label="粤B12345" value="粤B12345" />
            <el-option label="粤B67890" value="粤B67890" />
            <el-option label="粤A54321" value="粤A54321" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchConfig">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="addConfig">添加配置</el-button>
      <el-button type="primary" @click="batchConfig">批量配置</el-button>
      <el-button @click="exportConfig">导出配置</el-button>
    </div>
    <el-table :data="configList" style="width: 100%">
      <el-table-column prop="terminalId" label="终端ID" width="180" />
      <el-table-column prop="vehicle" label="车辆" width="120" />
      <el-table-column prop="configName" label="配置名称" width="150" />
      <el-table-column prop="configValue" label="配置值" min-width="200" />
      <el-table-column prop="updateTime" label="更新时间" width="150" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editConfig(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteConfig(scope.row.id)">删除</el-button>
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
  terminalId: '',
  vehicle: ''
})

// 配置列表
const configList = ref([
  { id: 1, terminalId: 'T100001', vehicle: '粤B12345', configName: '上报间隔', configValue: '30秒', updateTime: '2026-03-16 10:00:00' },
  { id: 2, terminalId: 'T100001', vehicle: '粤B12345', configName: '超速阈值', configValue: '60km/h', updateTime: '2026-03-16 10:00:00' },
  { id: 3, terminalId: 'T100002', vehicle: '粤B67890', configName: '上报间隔', configValue: '60秒', updateTime: '2026-03-16 10:00:00' },
  { id: 4, terminalId: 'T100002', vehicle: '粤B67890', configName: '超速阈值', configValue: '80km/h', updateTime: '2026-03-16 10:00:00' },
  { id: 5, terminalId: 'T100003', vehicle: '粤A54321', configName: '上报间隔', configValue: '30秒', updateTime: '2026-03-16 10:00:00' }
])

// 分页
const currentPage = ref(1)

// 查询配置
const searchConfig = () => {
  console.log('查询配置:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    terminalId: '',
    vehicle: ''
  }
}

// 添加配置
const addConfig = () => {
  console.log('添加配置')
}

// 编辑配置
const editConfig = (row) => {
  console.log('编辑配置:', row)
}

// 删除配置
const deleteConfig = (id) => {
  console.log('删除配置:', id)
}

// 批量配置
const batchConfig = () => {
  console.log('批量配置')
}

// 导出配置
const exportConfig = () => {
  console.log('导出配置')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.terminal-config {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.terminal-config h2 {
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
}

.action-section {
  display: flex;
  gap: 10px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>