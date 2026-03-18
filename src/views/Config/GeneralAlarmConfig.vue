<template>
  <div class="general-alarm-config">
    <h3>常规报警设置</h3>
    <el-form :model="alarmSettings" label-width="120px">
      <el-form-item label="超速报警">
        <el-input-number v-model="alarmSettings.speedLimit" :min="0" :max="200" style="width: 150px;"></el-input-number>
        <span style="margin-left: 10px;">km/h</span>
      </el-form-item>
      <el-form-item label="疲劳驾驶">
        <el-input-number v-model="alarmSettings.fatigueTime" :min="0" :max="24" style="width: 150px;"></el-input-number>
        <span style="margin-left: 10px;">小时</span>
      </el-form-item>
      <el-form-item label="超时停车">
        <el-input-number v-model="alarmSettings.parkingTime" :min="0" :max="120" style="width: 150px;"></el-input-number>
        <span style="margin-left: 10px;">分钟</span>
      </el-form-item>
      <el-form-item label="抽烟检测">
        <el-switch v-model="alarmSettings.smokingDetection"></el-switch>
      </el-form-item>
      <el-form-item label="玩手机检测">
        <el-switch v-model="alarmSettings.phoneDetection"></el-switch>
      </el-form-item>
      <el-form-item label="GPS漂移">
        <el-switch v-model="alarmSettings.gpsDrift"></el-switch>
      </el-form-item>
      <el-form-item label="速度异常">
        <el-switch v-model="alarmSettings.speedAbnormal"></el-switch>
      </el-form-item>
      <el-form-item label="ACC异常">
        <el-switch v-model="alarmSettings.accAbnormal"></el-switch>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="saveSettings">保存设置</el-button>
        <el-button @click="resetSettings">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 报警设置
const alarmSettings = ref({
  speedLimit: 60,
  fatigueTime: 4,
  parkingTime: 30,
  smokingDetection: true,
  phoneDetection: true,
  gpsDrift: true,
  speedAbnormal: true,
  accAbnormal: true
})

// 保存设置
const saveSettings = () => {
  console.log('保存报警设置:', alarmSettings.value)
  // 实际项目中这里会调用API保存设置
  alert('设置保存成功')
}

// 重置设置
const resetSettings = () => {
  alarmSettings.value = {
    speedLimit: 60,
    fatigueTime: 4,
    parkingTime: 30,
    smokingDetection: true,
    phoneDetection: true,
    gpsDrift: true,
    speedAbnormal: true,
    accAbnormal: true
  }
}
</script>

<style scoped>
.general-alarm-config {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.general-alarm-config h3 {
  font-size: 16px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 20px;
}
</style>