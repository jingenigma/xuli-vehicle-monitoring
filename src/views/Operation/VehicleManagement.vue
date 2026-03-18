<template>
  <div class="vehicle-management">
    <h2>车辆管理</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="车牌号">
          <el-input v-model="searchForm.plate" placeholder="请输入车牌号" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="车辆类型">
          <el-select v-model="searchForm.type" placeholder="选择车辆类型" style="width: 150px;">
            <el-option label="货车" value="truck" />
            <el-option label="客车" value="bus" />
            <el-option label="轿车" value="car" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" style="width: 150px;">
            <el-option label="在线" value="online" />
            <el-option label="离线" value="offline" />
            <el-option label="报警" value="alarm" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchVehicle">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="addVehicle">添加车辆</el-button>
      <el-button type="primary" @click="importVehicle">导入车辆</el-button>
      <el-button @click="exportVehicle">导出车辆</el-button>
    </div>
    <el-table :data="vehicleList" style="width: 100%">
      <el-table-column prop="plate" label="车牌号" width="120" />
      <el-table-column prop="type" label="车辆类型" width="100" />
      <el-table-column prop="model" label="车型" width="150" />
      <el-table-column prop="group" label="所属车队" width="150" />
      <el-table-column prop="driver" label="驾驶员" width="100" />
      <el-table-column prop="terminalId" label="终端ID" width="150" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editVehicle(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteVehicle(scope.row.id)">删除</el-button>
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
  plate: '',
  type: '',
  status: ''
})

// 车辆列表
const vehicleList = ref([
  { id: 1, plate: '粤B12345', type: '货车', model: '解放J6', group: '深圳分公司', driver: '张三', terminalId: 'T100001', status: '在线' },
  { id: 2, plate: '粤B67890', type: '客车', model: '宇通客车', group: '深圳分公司', driver: '李四', terminalId: 'T100002', status: '在线' },
  { id: 3, plate: '粤A54321', type: '货车', model: '东风天龙', group: '广州分公司', driver: '王五', terminalId: 'T100003', status: '离线' },
  { id: 4, plate: '粤A09876', type: '客车', model: '金龙客车', group: '广州分公司', driver: '赵六', terminalId: 'T100004', status: '报警' },
  { id: 5, plate: '粤C13579', type: '货车', model: '福田欧曼', group: '物流合作', driver: '孙七', terminalId: 'T100005', status: '在线' }
])

// 分页
const currentPage = ref(1)

// 查询车辆
const searchVehicle = () => {
  console.log('查询车辆:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    plate: '',
    type: '',
    status: ''
  }
}

// 添加车辆
const addVehicle = () => {
  console.log('添加车辆')
}

// 编辑车辆
const editVehicle = (row) => {
  console.log('编辑车辆:', row)
}

// 删除车辆
const deleteVehicle = (id) => {
  console.log('删除车辆:', id)
}

// 导入车辆
const importVehicle = () => {
  console.log('导入车辆')
}

// 导出车辆
const exportVehicle = () => {
  console.log('导出车辆')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.vehicle-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.vehicle-management h2 {
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