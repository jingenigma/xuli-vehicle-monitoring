<template>
  <div class="driver-management">
    <h2>驾驶员管理</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="姓名">
          <el-input v-model="searchForm.name" placeholder="请输入姓名" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="驾驶证号">
          <el-input v-model="searchForm.license" placeholder="请输入驾驶证号" style="width: 200px;"></el-input>
        </el-form-item>
        <el-form-item label="所属车队">
          <el-select v-model="searchForm.group" placeholder="选择所属车队" style="width: 150px;">
            <el-option label="深圳分公司" value="shenzhen" />
            <el-option label="广州分公司" value="guangzhou" />
            <el-option label="物流合作" value="logistics" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchDriver">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="addDriver">添加驾驶员</el-button>
      <el-button type="primary" @click="importDriver">导入驾驶员</el-button>
      <el-button @click="exportDriver">导出驾驶员</el-button>
    </div>
    <el-table :data="driverList" style="width: 100%">
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="license" label="驾驶证号" width="180" />
      <el-table-column prop="phone" label="联系电话" width="150" />
      <el-table-column prop="group" label="所属车队" width="150" />
      <el-table-column prop="vehicle" label="当前车辆" width="120" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editDriver(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteDriver(scope.row.id)">删除</el-button>
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
  name: '',
  license: '',
  group: ''
})

// 驾驶员列表
const driverList = ref([
  { id: 1, name: '张三', license: '440301199001011234', phone: '13800138001', group: '深圳分公司', vehicle: '粤B12345', status: '在职' },
  { id: 2, name: '李四', license: '440301199102022345', phone: '13800138002', group: '深圳分公司', vehicle: '粤B67890', status: '在职' },
  { id: 3, name: '王五', license: '440101199203033456', phone: '13800138003', group: '广州分公司', vehicle: '粤A54321', status: '在职' },
  { id: 4, name: '赵六', license: '440101199304044567', phone: '13800138004', group: '广州分公司', vehicle: '粤A09876', status: '在职' },
  { id: 5, name: '孙七', license: '440401199405055678', phone: '13800138005', group: '物流合作', vehicle: '粤C13579', status: '在职' }
])

// 分页
const currentPage = ref(1)

// 查询驾驶员
const searchDriver = () => {
  console.log('查询驾驶员:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    name: '',
    license: '',
    group: ''
  }
}

// 添加驾驶员
const addDriver = () => {
  console.log('添加驾驶员')
}

// 编辑驾驶员
const editDriver = (row) => {
  console.log('编辑驾驶员:', row)
}

// 删除驾驶员
const deleteDriver = (id) => {
  console.log('删除驾驶员:', id)
}

// 导入驾驶员
const importDriver = () => {
  console.log('导入驾驶员')
}

// 导出驾驶员
const exportDriver = () => {
  console.log('导出驾驶员')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.driver-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.driver-management h2 {
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