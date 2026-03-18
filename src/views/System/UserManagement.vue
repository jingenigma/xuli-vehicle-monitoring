<template>
  <div class="user-management">
    <h2>用户管理</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" style="width: 150px;"></el-input>
        </el-form-item>
        <el-form-item label="角色">
          <el-select v-model="searchForm.role" placeholder="选择角色" style="width: 150px;">
            <el-option label="管理员" value="admin" />
            <el-option label="运营人员" value="operator" />
            <el-option label="查看人员" value="viewer" />
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="选择状态" style="width: 150px;">
            <el-option label="启用" value="active" />
            <el-option label="禁用" value="inactive" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchUser">查询</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="action-section">
      <el-button type="primary" @click="addUser">添加用户</el-button>
      <el-button type="primary" @click="importUser">导入用户</el-button>
      <el-button @click="exportUser">导出用户</el-button>
    </div>
    <el-table :data="userList" style="width: 100%">
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="role" label="角色" width="100" />
      <el-table-column prop="department" label="部门" width="150" />
      <el-table-column prop="phone" label="联系电话" width="150" />
      <el-table-column prop="status" label="状态" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editUser(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="deleteUser(scope.row.id)">删除</el-button>
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
  username: '',
  role: '',
  status: ''
})

// 用户列表
const userList = ref([
  { id: 1, username: 'admin', name: '管理员', role: '管理员', department: '技术部', phone: '13800138001', status: '启用' },
  { id: 2, username: 'operator1', name: '运营员', role: '运营人员', department: '运营部', phone: '13800138002', status: '启用' },
  { id: 3, username: 'viewer1', name: '查看员', role: '查看人员', department: '市场部', phone: '13800138003', status: '禁用' },
  { id: 4, username: 'operator2', name: '运营员2', role: '运营人员', department: '运营部', phone: '13800138004', status: '启用' },
  { id: 5, username: 'viewer2', name: '查看员2', role: '查看人员', department: '销售部', phone: '13800138005', status: '启用' }
])

// 分页
const currentPage = ref(1)

// 查询用户
const searchUser = () => {
  console.log('查询用户:', searchForm.value)
}

// 重置表单
const resetForm = () => {
  searchForm.value = {
    username: '',
    role: '',
    status: ''
  }
}

// 添加用户
const addUser = () => {
  console.log('添加用户')
}

// 编辑用户
const editUser = (row) => {
  console.log('编辑用户:', row)
}

// 删除用户
const deleteUser = (id) => {
  console.log('删除用户:', id)
}

// 导入用户
const importUser = () => {
  console.log('导入用户')
}

// 导出用户
const exportUser = () => {
  console.log('导出用户')
}

// 分页处理
const handleCurrentChange = (val) => {
  currentPage.value = val
  console.log('当前页码:', val)
}
</script>

<style scoped>
.user-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.user-management h2 {
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