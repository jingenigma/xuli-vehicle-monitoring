<template>
  <div class="video-playback-container">
    <h2>视频回放</h2>
    <div class="search-section">
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="车辆选择">
          <el-select v-model="searchForm.vehicle" placeholder="选择车辆">
            <el-option label="粤B12345" value="粤B12345" />
            <el-option label="粤B67890" value="粤B67890" />
            <el-option label="粤A54321" value="粤A54321" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="选择开始时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="选择结束时间"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="searchVideo">查询</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="playback-section">
      <div class="video-player">
        <div class="video-placeholder">
          <span>视频回放播放器</span>
        </div>
      </div>
      <div class="playback-controls">
        <el-button icon="el-icon-video-play">播放</el-button>
        <el-button icon="el-icon-video-pause">暂停</el-button>
        <el-button icon="el-icon-video-stop">停止</el-button>
        <el-slider v-model="playbackProgress" :min="0" :max="100" style="width: 300px; margin: 0 20px;"></el-slider>
        <span>{{ currentTime }} / {{ totalTime }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 搜索表单
const searchForm = ref({
  vehicle: '',
  startTime: '',
  endTime: ''
})

// 回放控制
const playbackProgress = ref(0)
const currentTime = ref('00:00:00')
const totalTime = ref('00:30:00')

// 查询视频
const searchVideo = () => {
  console.log('查询视频:', searchForm.value)
}
</script>

<style scoped>
.video-playback-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-playback-container h2 {
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

.playback-section {
  flex: 1;
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.video-player {
  flex: 1;
  background-color: #000;
  border-radius: 4px;
  overflow: hidden;
}

.video-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #606266;
  font-size: 14px;
}

.playback-controls {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>