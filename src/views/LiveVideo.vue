<template>
  <div class="live-video-container">
    <h2>实时视频</h2>
    <div class="video-grid">
      <div class="video-item" v-for="i in 4" :key="i">
        <div class="video-header">
          <span>车辆 {{ i }}</span>
          <div class="video-controls">
            <el-button size="small" type="primary">播放</el-button>
            <el-button size="small">截图</el-button>
            <el-button size="small">对讲</el-button>
          </div>
        </div>
        <div class="video-player">
          <div class="video-placeholder">
            <span>视频播放器 {{ i }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 实时视频模块
</script>

<style scoped>
.live-video-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.live-video-container h2 {
  font-size: 18px;
  font-weight: bold;
  color: #303133;
}

.video-grid {
  flex: 1;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.video-item {
  background-color: white;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
}

.video-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.video-header span {
  font-size: 14px;
  font-weight: bold;
  color: #303133;
}

.video-controls {
  display: flex;
  gap: 5px;
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

/* 响应式设计 */
@media screen and (max-width: 768px) {
  .video-grid {
    grid-template-columns: 1fr;
  }
}
</style>