<template>
  <div class="terminal-management">
    <h2>终端管理</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="终端ID">
          <el-input v-model="searchForm.terminalId" placeholder="请输入终端ID" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="SIM卡号">
          <el-input v-model="searchForm.sim" placeholder="请输入SIM卡号" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" style="width: 150px;">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="故障" value="fault" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchTerminal">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="addTerminal">添加终端</el-button>
      <el-button type="primary" @click="importTerminal">导入终端</el-button>
      <el-button @click="exportTerminal">导出终端</el-button>
    </div>
    <el-table :data="terminalList" style="width: 100%">
      <el-table-column prop="terminalId" label="终端ID" width="180" />
      <el-table-column prop="sim" label="SIM卡号" width="180" />
      <el-table-column prop="model" label="终端型号" width="150" />
      <el-table-column prop="vehicle" label="绑定车辆" width="120" />
      <el-table-column prop="installDate" label="安装日期" width="150" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editTerminal(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteTerminal(scope.row.id)">删除</el-button>
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
  sim: '',
  status: ''
})

// 终端列表
const terminalList = ref([
  { id: 1, terminalId: 'T100001', sim: '13800138001', model: 'KT800', vehicle: '粤B12345', installDate: '2026-01-01', status: '在线' },
  { id: 2, terminalId: 'T100002', sim: '13800138002', model: 'KT800', vehicle: '粤B67890', installDate: '2026-01-02', status: '在线' },
  { id: 3, terminalId: 'T100003', sim: '13800138003', model: 'KT900', vehicle: '粤A54321', installDate: '2026-01-03', status: '离线' },
  { id: 4, terminalId: 'T100004', sim: '13800138004', model: 'KT900', vehicle: '粤A09876', installDate: '2026-01-04', status: '在线' },
  { id: 5, terminalId: 'T100005', sim: '13800138005', model: 'KT800', vehicle: '粤C13579', installDate: '2026-01-05', status: '故障' }
])

// 分页
const currentPage = ref(1)

// 查询终端
const searchTerminal = () => {
  console.log('查询终端:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    terminalId: '',
    sim: '',
    status: ''
  }
}

// 添加终端
const addTerminal = () => {
  console.log('添加终端')
}

// 编辑终端
const editTerminal = (row) => {
  console.log('编辑终端:', row)
}

// 删除终端
const deleteTerminal = (id) => {
  console.log('删除终端:', id)
}

// 导入终端
const importTerminal = () => {
  console.log('导入终端')
}

// 导出终端
const exportTerminal = () => {
  console.log('导出终端')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.terminal-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.terminal-management h2 {
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