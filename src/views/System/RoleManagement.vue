<template>
  <div class="role-management">
    <h2>角色管理</h2>
    <div class="action-section">
      <el-button type="primary" @click="addRole">添加角色</el-button>
    </div>
    <el-table :data="roleList" style="width: 100%">
      <el-table-column prop="name" label="角色名称" width="150" />
      <el-table-column prop="description" label="角色描述" min-width="200" />
      <el-table-column prop="userCount" label="用户数量" width="100" />
      <el-table-column label="操作" width="150">
        <template #default="scope">
          <el-button size="small" @click="editRole(scope.row)">编辑</el-button>
          <el-button size="small" @click="setPermission(scope.row)">权限设置</el-button>
          <el-button size="small" type="danger" @click="deleteRole(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 角色列表
const roleList = ref([
  { id: 1, name: '管理员', description: '系统管理员，拥有所有权限', userCount: 2 },
  { id: 2, name: '运营人员', description: '运营管理权限，可管理车辆、驾驶员等', userCount: 5 },
  { id: 3, name: '查看人员', description: '只能查看数据，无管理权限', userCount: 10 }
])

// 添加角色
const addRole = () => {
  console.log('添加角色')
}

// 编辑角色
const editRole = (row) => {
  console.log('编辑角色:', row)
}

// 设置权限
const setPermission = (row) => {
  console.log('设置权限:', row)
}

// 删除角色
const deleteRole = (id) => {
  console.log('删除角色:', id)
}
</script>

<style scoped>
.role-management {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.role-management h2 {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.action-section {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
</style>