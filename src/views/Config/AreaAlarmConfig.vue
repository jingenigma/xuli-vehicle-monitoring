<template>
  <div class="area-alarm-config">
    <h3>区域报警设置</h3>
    <div class="config-header">
      <el-button type="primary" @click="addArea">添加区域</el-button>
      <el-button type="primary" @click="importArea">导入区域</el-button>
      <el-button @click="exportArea">导出区域</el-button>
    </div>
    <el-table :data="areaList" style="width: 100%">
      <el-table-column prop="name" label="区域名称" width="150" />
      <el-table-column prop="type" label="区域类型" width="120" />
      <el-table-column prop="description" label="区域描述" min-width="200" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editArea(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteArea(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 区域列表
const areaList = ref([
  { id: 1, name: '深圳宝安机场', type: '矩形', description: '深圳宝安国际机场区域', status: '启用' },
  { id: 2, name: '广州天河区', type: '圆形', description: '广州市天河区核心区域', status: '启用' },
  { id: 3, name: '珠海香洲区', type: '多边形', description: '珠海市香洲区商业中心', status: '禁用' }
])

// 添加区域
const addArea = () => {
  console.log('添加区域')
  // 实际项目中这里会打开添加区域的弹窗
}

// 编辑区域
const editArea = (row) => {
  console.log('编辑区域:', row)
  // 实际项目中这里会打开编辑区域的弹窗
}

// 删除区域
const deleteArea = (id) => {
  console.log('删除区域:', id)
  // 实际项目中这里会弹出确认对话框，然后删除区域
}

// 导入区域
const importArea = () => {
  console.log('导入区域')
  // 实际项目中这里会打开文件选择对话框
}

// 导出区域
const exportArea = () => {
  console.log('导出区域')
  // 实际项目中这里会导出区域数据
}
</script>

<style scoped>
.area-alarm-config {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.area-alarm-config h3 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}

.config-header {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>