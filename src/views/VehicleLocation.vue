<template>
  <div class="vehicle-location-container" :class="{ 'fullscreen': isFullscreen }">
    <!-- 地图工具栏 -->
    <div class="map-toolbar">
      <div class="toolbar-item" @mouseenter="showToolMenu = true" @mouseleave="showToolMenu = false">
        <el-button type="primary" size="small">工具</el-button>
        <div class="tool-menu" v-show="showToolMenu">
          <el-button size="small" @click="mapAction('zoomIn')">拉框放大</el-button>
          <el-button size="small" @click="mapAction('zoomOut')">拉框缩小</el-button>
          <el-button size="small" @click="mapAction('measureDistance')">测量距离</el-button>
          <el-button size="small" @click="mapAction('measureArea')">测量面积</el-button>
          <el-button size="small" @click="mapAction('addPosition')">添加位置</el-button>
          <el-button size="small" @click="mapAction('addArea')">添加区域</el-button>
          <el-button size="small" @click="mapAction('addAdminArea')">添加行政区域</el-button>
        </div>
      </div>
      <div class="toolbar-item" @mouseenter="showSearchMenu = true" @mouseleave="showSearchMenu = false">
        <el-button type="primary" size="small">查车</el-button>
        <div class="search-menu" v-show="showSearchMenu">
          <el-button size="small" @click="searchAction('area')">区域查车</el-button>
          <el-button size="small" @click="searchAction('rectangle')">矩形查车</el-button>
          <el-button size="small" @click="searchAction('circle')">圆形查车</el-button>
        </div>
      </div>
      <div class="toolbar-item" @mouseenter="showSettingMenu = true" @mouseleave="showSettingMenu = false">
        <el-button type="primary" size="small">显示设置</el-button>
        <div class="setting-menu" v-show="showSettingMenu">
          <div class="setting-item">
            <span>车辆聚合：</span>
            <el-switch v-model="aggregateSetting.enabled" />
          </div>
          <div class="setting-item">
            <span>聚合阈值：</span>
            <el-select v-model="aggregateSetting.threshold" size="small" style="width: 100px;">
              <el-option label="50像素" value="50" />
              <el-option label="100像素" value="100" />
              <el-option label="150像素" value="150" />
              <el-option label="200像素" value="200" />
            </el-select>
          </div>
          <div class="setting-item">
            <span>图标样式：</span>
            <el-select v-model="iconSetting.style" size="small" style="width: 100px;">
              <el-option label="样式1" value="style1" />
              <el-option label="样式2" value="style2" />
              <el-option label="样式3" value="style3" />
            </el-select>
          </div>
          <div class="setting-item">
            <span>图标大小：</span>
            <el-select v-model="iconSetting.size" size="small" style="width: 100px;">
              <el-option label="小" value="small" />
              <el-option label="中" value="medium" />
              <el-option label="大" value="large" />
            </el-select>
          </div>
          <div class="setting-item">
            <span>信息显示：</span>
            <el-checkbox-group v-model="infoSetting.display">
              <el-checkbox label="车牌号">车牌号</el-checkbox>
              <el-checkbox label="速度">速度</el-checkbox>
              <el-checkbox label="温度">温度</el-checkbox>
            </el-checkbox-group>
          </div>
        </div>
      </div>
      <div class="toolbar-item">
        <el-button type="primary" size="small" @click="toggleFullscreen">
          {{ isFullscreen ? '退出全屏' : '地图全屏' }}
        </el-button>
      </div>
    </div>

    <!-- 右侧内容区 -->
    <div class="right-content">
      <!-- 地图区域 -->
      <div class="map-area">
        <!-- 地图容器 -->
        <div class="map-container" ref="mapContainer">
          <!-- 模拟高德地图 -->
          <div class="amap-container">
            <div class="amap-header">
              <div class="amap-logo">高德地图</div>
              <div class="amap-search">
                <input type="text" placeholder="搜索地点" />
                <button>搜索</button>
              </div>
            </div>
            <div class="amap-map">
              <!-- 车辆标记 -->
              <div class="vehicle-marker online driving" style="top: 30%; left: 20%;" @click="viewVehicleInfo(vehicles[0])">
                <div class="marker-icon online driving">🚗</div>
                <div class="marker-label">{{ vehicles[0].plate }}</div>
              </div>
              <div class="vehicle-marker online parking" style="top: 50%; left: 60%;" @click="viewVehicleInfo(vehicles[1])">
                <div class="marker-icon online parking">🚗</div>
                <div class="marker-label">{{ vehicles[1].plate }}</div>
              </div>
              <div class="vehicle-marker offline" style="top: 70%; left: 30%;" @click="viewVehicleInfo(vehicles[2])">
                <div class="marker-icon offline">🚗</div>
                <div class="marker-label">{{ vehicles[2].plate }}</div>
              </div>
              <div class="vehicle-marker online alarm" style="top: 40%; left: 70%;" @click="viewVehicleInfo(vehicles[3])">
                <div class="marker-icon online alarm">🚗</div>
                <div class="marker-label">{{ vehicles[3].plate }}</div>
              </div>
              <div class="vehicle-marker abnormal" style="top: 60%; left: 40%;" @click="viewVehicleInfo(vehicles[4])">
                <div class="marker-icon abnormal">🚗</div>
                <div class="marker-label">{{ vehicles[4].plate }}</div>
              </div>
            </div>
            <div class="amap-controls">
              <div class="amap-zoom">
                <button>+</button>
                <button>-</button>
              </div>
              <div class="amap-location">
                <button>定位</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 车辆信息弹窗 -->
        <el-dialog
          v-model="showVehicleInfo"
          :title="selectedVehicle.plate"
          width="500px"
          custom-class="vehicle-info-dialog"
        >
          <div class="vehicle-info">
            <div class="vehicle-image">
              <img src="https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=卡通风格的汽车图标，可爱，蓝色，正面视角&image_size=square" alt="车辆图片" />
            </div>
            <div class="info-item">
              <span class="label">速度：</span>
              <span class="value">{{ selectedVehicle.speed }} km/h</span>
            </div>
            <div class="info-item">
              <span class="label">今日里程：</span>
              <span class="value">{{ selectedVehicle.todayMileage }} km</span>
            </div>
            <div class="info-item">
              <span class="label">定位时间：</span>
              <span class="value">{{ selectedVehicle.locationTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">位置：</span>
              <span class="value">{{ selectedVehicle.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">车辆状态：</span>
              <span class="value">{{ selectedVehicle.status }}</span>
            </div>
            <div class="info-item">
              <span class="label">所属车组：</span>
              <span class="value">{{ selectedVehicle.group }}</span>
            </div>
            <div class="info-item">
              <span class="label">驾驶员：</span>
              <span class="value">{{ selectedVehicle.driver }}</span>
            </div>
            <div class="info-item">
              <span class="label">经度：</span>
              <span class="value">{{ selectedVehicle.longitude }}</span>
            </div>
            <div class="info-item">
              <span class="label">纬度：</span>
              <span class="value">{{ selectedVehicle.latitude }}</span>
            </div>
            <div class="info-item">
              <span class="label">方向：</span>
              <span class="value">{{ selectedVehicle.direction }}</span>
            </div>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <div class="blue-buttons">
                <el-tooltip content="车辆详情" placement="top">
                  <el-button type="primary" @click="viewDetails">详情</el-button>
                </el-tooltip>
                <el-tooltip content="轨迹回放" placement="top">
                  <el-button type="primary" @click="viewTrack">轨迹</el-button>
                </el-tooltip>
                <el-tooltip content="实时视频" placement="top">
                  <el-button type="primary" @click="viewVideo">视频</el-button>
                </el-tooltip>
                <el-tooltip content="单向/双向对讲" placement="top">
                  <el-button type="primary" @click="intercom">对讲</el-button>
                </el-tooltip>
                <el-tooltip content="文本指令下发" placement="top">
                  <el-button type="primary" @click="tts">TTS</el-button>
                </el-tooltip>
                <el-tooltip content="查看报警与处置" placement="top">
                  <el-button type="primary" @click="viewAlarm">报警</el-button>
                </el-tooltip>
              </div>
              <div class="close-button">
                <el-button @click="showVehicleInfo = false">关闭</el-button>
              </div>
            </div>
          </template>
        </el-dialog>
      </div>

      <!-- 车辆状态标签页 -->
      <div class="vehicle-status-tabs" :class="{ 'hidden': isFullscreen }">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane :label="`全部 (${allVehicles.length})`" name="all">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ allVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="allVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="reportTime" label="最近上报时间" width="180" />
                <el-table-column prop="speed" label="行驶速度" width="100" />
                <el-table-column prop="direction" label="行驶方向" width="100" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`异常 (${abnormalVehicles.length})`" name="abnormal">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ abnormalVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="abnormalVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="abnormalType" label="异常类型" width="150" />
                <el-table-column prop="motionStatus" label="运动状态" width="100" />
                <el-table-column prop="accStatus" label="ACC状态" width="80" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
                <el-table-column prop="accuracy" label="定位精度" width="100" />
                <el-table-column prop="lastAccurateTime" label="最后精确时间" width="180" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`报警 (${alarmVehicles.length})`" name="alarm">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ alarmVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="alarmVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="alarmType" label="报警类型" width="120" />
                <el-table-column prop="alarmTime" label="报警时间" width="180" />
                <el-table-column prop="alarmValue" label="报警数值" width="120" />
                <el-table-column prop="duration" label="持续时间" width="120" />
                <el-table-column prop="motionStatus" label="运动状态" width="100" />
                <el-table-column prop="accStatus" label="ACC状态" width="80" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`在线 (${onlineVehicles.length})`" name="online">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ onlineVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="onlineVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="motionStatus" label="运动状态" width="100" />
                <el-table-column prop="accStatus" label="ACC状态" width="80" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
                <el-table-column prop="reportTime" label="最近上报时间" width="180" />
                <el-table-column prop="speed" label="速度" width="80" />
                <el-table-column prop="direction" label="方向" width="100" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`行驶 (${drivingVehicles.length})`" name="driving">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ drivingVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="drivingVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="motionStatus" label="运动状态" width="100" />
                <el-table-column prop="accStatus" label="ACC状态" width="80" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
                <el-table-column prop="reportTime" label="最近上报时间" width="180" />
                <el-table-column prop="speed" label="速度" width="80" />
                <el-table-column prop="direction" label="方向" width="100" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`停车 (${parkingVehicles.length})`" name="parking">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ parkingVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="parkingVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="parkingStartTime" label="开始停车时间" width="180" />
                <el-table-column prop="parkingDuration" label="停车时长" width="120" />
                <el-table-column prop="accStatus" label="ACC状态" width="80" />
                <el-table-column prop="location" label="当前位置" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`离线 (${offlineVehicles.length})`" name="offline">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ offlineVehicles.length }} 辆车</span>
                <div class="tab-actions">
                  <el-button type="primary" size="small" @click="exportData">导出</el-button>
                  <el-button type="primary" size="small" @click="showFieldSettings = true">设置</el-button>
                </div>
              </div>
              <el-table :data="offlineVehicles" style="width: 100%">
                <el-table-column label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="group" label="所属车队" width="150" />
                <el-table-column prop="type" label="车辆类型" width="100" />
                <el-table-column prop="terminalId" label="终端ID" width="150" />
                <el-table-column prop="status" label="车辆状态" width="120" />
                <el-table-column prop="offlineTime" label="离线时间" width="180" />
                <el-table-column prop="offlineDuration" label="离线时长" width="120" />
                <el-table-column prop="lastLocation" label="最后位置" min-width="200" />
                <el-table-column prop="lastMotionStatus" label="最后运动状态" width="120" />
                <el-table-column prop="lastDirection" label="最后方向" width="100" />
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 字段设置弹窗 -->
    <el-dialog
      v-model="showFieldSettings"
      title="字段设置"
      width="500px"
    >
      <div class="field-settings">
        <el-checkbox-group v-model="selectedFields">
          <el-checkbox v-for="field in availableFields" :key="field.value" :label="field.value">
            {{ field.label }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showFieldSettings = false">取消</el-button>
          <el-button type="primary" @click="saveFieldSettings">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// 地图工具栏状态
const showToolMenu = ref(false)
const showSearchMenu = ref(false)
const showSettingMenu = ref(false)

// 聚合设置
const aggregateSetting = ref({
  enabled: true,
  threshold: '100'
})

// 图标设置
const iconSetting = ref({
  style: 'style1',
  size: 'medium'
})

// 信息显示设置
const infoSetting = ref({
  display: ['车牌号', '速度']
})

// 全屏状态
const isFullscreen = ref(false)

// 切换全屏
const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  // 实际项目中这里会调用地图API的全屏方法
}

// 地图操作
const mapAction = (action) => {
  console.log('Map action:', action)
  // 实际项目中这里会调用地图API的相应方法
}

// 查车操作
const searchAction = (type) => {
  console.log('Search action:', type)
  // 实际项目中这里会调用相应的查车方法
}

// 车辆数据
const vehicles = ref([
  {
    id: 1,
    plate: '粤A54321',
    group: '广州分公司',
    type: '货车',
    terminalId: 'T100001',
    sim: '13800138001',
    frame: 'LBV3M2100K5123456',
    status: '在线，行驶中',
    speed: 65,
    todayMileage: 120.5,
    locationTime: '2026-03-17 10:30:25',
    location: '广园快速路 天河段',
    driver: '张三',
    longitude: '113.3249',
    latitude: '23.1291',
    direction: '东',
    motionStatus: '行驶',
    accStatus: '开',
    reportTime: '2026-03-17 10:30:25',
    lastLocation: '广园快速路 天河段',
    lastMotionStatus: '行驶',
    lastDirection: '东'
  },
  {
    id: 2,
    plate: '粤A09876',
    group: '广州分公司',
    type: '客车',
    terminalId: 'T100002',
    sim: '13800138002',
    frame: 'LBV3M2100K5123457',
    status: '在线，停车',
    speed: 0,
    todayMileage: 85.2,
    locationTime: '2026-03-17 10:25:18',
    location: '广州市天河区珠江新城',
    driver: '李四',
    longitude: '113.3249',
    latitude: '23.1291',
    direction: '南',
    motionStatus: '停车',
    accStatus: '关',
    reportTime: '2026-03-17 10:25:18',
    parkingStartTime: '2026-03-17 10:15:00',
    parkingDuration: '10分钟',
    lastLocation: '广州市天河区珠江新城',
    lastMotionStatus: '停车',
    lastDirection: '南'
  },
  {
    id: 3,
    plate: '粤A13579',
    group: '广州分公司',
    type: '货车',
    terminalId: 'T100003',
    sim: '13800138003',
    frame: 'LBV3M2100K5123458',
    status: '离线',
    speed: 0,
    todayMileage: 50.8,
    locationTime: '2026-03-17 09:45:30',
    location: '广州市白云区白云机场',
    driver: '王五',
    longitude: '113.3094',
    latitude: '23.3905',
    direction: '西',
    motionStatus: '停车',
    accStatus: '关',
    reportTime: '2026-03-17 09:45:30',
    offlineTime: '2026-03-17 09:45:30',
    offlineDuration: '45分钟',
    lastLocation: '广州市白云区白云机场',
    lastMotionStatus: '停车',
    lastDirection: '西'
  },
  {
    id: 4,
    plate: '粤A24680',
    group: '广州分公司',
    type: '客车',
    terminalId: 'T100004',
    sim: '13800138004',
    frame: 'LBV3M2100K5123459',
    status: '在线，报警',
    speed: 96,
    todayMileage: 150.3,
    locationTime: '2026-03-17 10:35:42',
    location: '广园快速路 萝岗段',
    driver: '赵六',
    longitude: '113.4312',
    latitude: '23.1085',
    direction: '北',
    motionStatus: '行驶',
    accStatus: '开',
    reportTime: '2026-03-17 10:35:42',
    alarmType: '超速',
    alarmTime: '2026-03-17 10:30:00',
    alarmValue: '96km/h（平台限速60）',
    duration: '5分钟',
    lastLocation: '广园快速路 萝岗段',
    lastMotionStatus: '行驶',
    lastDirection: '北'
  },
  {
    id: 5,
    plate: '粤T12345',
    group: '中山分公司',
    type: '货车',
    terminalId: 'T100005',
    sim: '13800138005',
    frame: 'LBV3M2100K5123460',
    status: '异常',
    speed: 0,
    todayMileage: 30.2,
    locationTime: '2026-03-17 10:20:15',
    location: '中山市东区中山五路',
    driver: '孙七',
    longitude: '113.3845',
    latitude: '22.5276',
    direction: '东北',
    motionStatus: '停车',
    accStatus: '关',
    reportTime: '2026-03-17 10:20:15',
    abnormalType: 'GPS漂移',
    accuracy: '150米',
    lastAccurateTime: '2026-03-17 10:00:00',
    lastLocation: '中山市东区中山五路',
    lastMotionStatus: '停车',
    lastDirection: '东北'
  },
  {
    id: 6,
    plate: '粤T67890',
    group: '中山分公司',
    type: '货车',
    terminalId: 'T100006',
    sim: '13800138006',
    frame: 'LBV3M2100K5123461',
    status: '在线，行驶中',
    speed: 55,
    todayMileage: 95.6,
    locationTime: '2026-03-17 10:32:08',
    location: '广珠西线高速 中山段',
    driver: '周八',
    longitude: '113.3845',
    latitude: '22.5276',
    direction: '东南',
    motionStatus: '行驶',
    accStatus: '开',
    reportTime: '2026-03-17 10:32:08',
    lastLocation: '广珠西线高速 中山段',
    lastMotionStatus: '行驶',
    lastDirection: '东南'
  },
  {
    id: 7,
    plate: '粤T54321',
    group: '中山分公司',
    type: '客车',
    terminalId: 'T100007',
    sim: '13800138007',
    frame: 'LBV3M2100K5123462',
    status: '在线，停车',
    speed: 0,
    todayMileage: 45.8,
    locationTime: '2026-03-17 10:15:30',
    location: '中山市西区富华道',
    driver: '吴九',
    longitude: '113.3845',
    latitude: '22.5276',
    direction: '西南',
    motionStatus: '停车',
    accStatus: '关',
    reportTime: '2026-03-17 10:15:30',
    parkingStartTime: '2026-03-17 10:00:00',
    parkingDuration: '15分钟',
    lastLocation: '中山市西区富华道',
    lastMotionStatus: '停车',
    lastDirection: '西南'
  },
  {
    id: 8,
    plate: '粤T09876',
    group: '中山分公司',
    type: '货车',
    terminalId: 'T100008',
    sim: '13800138008',
    frame: 'LBV3M2100K5123463',
    status: '离线',
    speed: 0,
    todayMileage: 60.5,
    locationTime: '2026-03-17 09:30:20',
    location: '中山市古镇镇',
    driver: '郑十',
    longitude: '113.3845',
    latitude: '22.5276',
    direction: '西北',
    motionStatus: '行驶',
    accStatus: '开',
    reportTime: '2026-03-17 09:30:20',
    offlineTime: '2026-03-17 09:30:20',
    offlineDuration: '1小时',
    lastLocation: '中山市古镇镇',
    lastMotionStatus: '行驶',
    lastDirection: '西北'
  },
  {
    id: 9,
    plate: '粤A36925',
    group: '增城分公司',
    type: '客车',
    terminalId: 'T100009',
    sim: '13800138009',
    frame: 'LBV3M2100K5123464',
    status: '在线，报警',
    speed: 0,
    todayMileage: 25.3,
    locationTime: '2026-03-17 10:28:45',
    location: '广州市增城区增城广场',
    driver: '王十一',
    longitude: '113.8107',
    latitude: '23.1631',
    direction: '南',
    motionStatus: '停车',
    accStatus: '关',
    reportTime: '2026-03-17 10:28:45',
    alarmType: '超时停车',
    alarmTime: '2026-03-17 10:00:00',
    alarmValue: '停车超过30分钟',
    duration: '28分钟',
    lastLocation: '广州市增城区增城广场',
    lastMotionStatus: '停车',
    lastDirection: '南'
  },
  {
    id: 10,
    plate: '粤A85274',
    group: '增城分公司',
    type: '货车',
    terminalId: 'T100010',
    sim: '13800138010',
    frame: 'LBV3M2100K5123465',
    status: '异常',
    speed: 185,
    todayMileage: 180.2,
    locationTime: '2026-03-17 10:36:12',
    location: '广惠高速 增城段',
    driver: '李十二',
    longitude: '113.8107',
    latitude: '23.1631',
    direction: '北',
    motionStatus: '行驶',
    accStatus: '开',
    reportTime: '2026-03-17 10:36:12',
    abnormalType: '速度>180',
    accuracy: '50米',
    lastAccurateTime: '2026-03-17 10:36:12',
    lastLocation: '广惠高速 增城段',
    lastMotionStatus: '行驶',
    lastDirection: '北'
  }
])

// 选中的车辆
const selectedVehicle = ref({})
const showVehicleInfo = ref(false)

// 查看车辆信息
const viewVehicleInfo = (vehicle) => {
  selectedVehicle.value = vehicle
  showVehicleInfo.value = true
}

// 操作按钮点击事件
const viewDetails = () => {
  console.log('查看详情:', selectedVehicle.value.plate)
}

const viewTrack = () => {
  console.log('轨迹回放:', selectedVehicle.value.plate)
}

const viewVideo = () => {
  console.log('实时视频:', selectedVehicle.value.plate)
}

const intercom = () => {
  console.log('对讲:', selectedVehicle.value.plate)
}

const tts = () => {
  console.log('TTS:', selectedVehicle.value.plate)
}

const viewAlarm = () => {
  console.log('查看报警:', selectedVehicle.value.plate)
}

// 标签页状态
const activeTab = ref('all')

// 处理标签页点击
const handleTabClick = (tab) => {
  activeTab.value = tab.props.name
}

// 过滤车辆数据
const allVehicles = computed(() => vehicles.value)

const abnormalVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('异常'))
})

const alarmVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('报警'))
})

const onlineVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('在线') && !vehicle.status.includes('报警') && !vehicle.status.includes('异常'))
})

const drivingVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('在线') && vehicle.status.includes('行驶中'))
})

const parkingVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('在线') && vehicle.status.includes('停车'))
})

const offlineVehicles = computed(() => {
  return vehicles.value.filter(vehicle => vehicle.status.includes('离线'))
})

// 导出数据
const exportData = () => {
  console.log('导出数据')
  // 实际项目中这里会导出Excel文件
  alert('数据导出成功')
}

// 字段设置
const showFieldSettings = ref(false)
const availableFields = [
  { label: '车牌号', value: 'plate' },
  { label: '车架号', value: 'frame' },
  { label: '终端号', value: 'terminalId' },
  { label: 'SIM卡号', value: 'sim' },
  { label: '所属车队', value: 'group' },
  { label: '车辆类型', value: 'type' },
  { label: '车辆状态', value: 'status' },
  { label: '最近上报时间', value: 'reportTime' },
  { label: '行驶速度', value: 'speed' },
  { label: '行驶方向', value: 'direction' },
  { label: '当前位置', value: 'location' },
  { label: '异常类型', value: 'abnormalType' },
  { label: '运动状态', value: 'motionStatus' },
  { label: 'ACC状态', value: 'accStatus' },
  { label: '定位精度', value: 'accuracy' },
  { label: '最后精确时间', value: 'lastAccurateTime' },
  { label: '报警类型', value: 'alarmType' },
  { label: '报警时间', value: 'alarmTime' },
  { label: '报警数值', value: 'alarmValue' },
  { label: '持续时间', value: 'duration' },
  { label: '开始停车时间', value: 'parkingStartTime' },
  { label: '停车时长', value: 'parkingDuration' },
  { label: '离线时间', value: 'offlineTime' },
  { label: '离线时长', value: 'offlineDuration' },
  { label: '最后位置', value: 'lastLocation' },
  { label: '最后运动状态', value: 'lastMotionStatus' },
  { label: '最后方向', value: 'lastDirection' },
  { label: '油量', value: 'fuel' },
  { label: '温度', value: 'temperature' },
  { label: '湿度', value: 'humidity' },
  { label: '经度', value: 'longitude' },
  { label: '纬度', value: 'latitude' },
  { label: '道路', value: 'road' },
  { label: '地区', value: 'area' }
]

const selectedFields = ref(['plate', 'group', 'type', 'terminalId', 'status'])

// 保存字段设置
const saveFieldSettings = () => {
  console.log('保存字段设置:', selectedFields.value)
  showFieldSettings.value = false
}

// 组件挂载后初始化地图
onMounted(() => {
  // 实际项目中这里会初始化地图API
  console.log('初始化地图')
})
</script>

<style scoped>
.vehicle-location-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
}

.vehicle-location-container.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

/* 地图工具栏 */
.map-toolbar {
  display: flex;
  gap: 10px;
  padding: 10px 20px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  justify-content: flex-end;
  z-index: 100;
  position: relative;
}

.toolbar-item {
  position: relative;
}

/* 工具菜单 */
.tool-menu,
.search-menu,
.setting-menu {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 5px;
  z-index: 1000;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 10px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  min-width: 150px;
  max-width: 350px;
  overflow: auto;
}

.tool-menu,
.search-menu {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.setting-menu {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 300px;
  max-width: 350px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item span {
  width: 80px;
  font-size: 14px;
}

.right-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* 地图区域 */
.map-area {
  flex: 1;
  position: relative;
  background-color: #f0f2f5;
  min-height: 500px;
}

/* 地图容器 */
.map-container {
  width: 100%;
  height: 100%;
  background-color: #e6e6e6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #606266;
}

/* 模拟高德地图 */
.amap-container {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
  position: relative;
}

.amap-header {
  height: 50px;
  background-color: white;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  padding: 0 20px;
  justify-content: space-between;
}

.amap-logo {
  font-weight: bold;
  color: #1976d2;
  font-size: 16px;
}

.amap-search {
  display: flex;
  gap: 10px;
}

.amap-search input {
  width: 300px;
  height: 32px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 0 10px;
}

.amap-search button {
  height: 32px;
  background-color: #1976d2;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 15px;
  cursor: pointer;
}

.amap-map {
  flex: 1;
  position: relative;
  height: calc(100% - 50px);
  background-image: url('https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=广州地区高德地图界面，珠江，广州塔，天河区，道路网清晰，建筑物，绿色区域，蓝色水域&image_size=landscape_16_9');
  background-size: cover;
  background-position: center;
}

/* 车辆标记 */
.vehicle-marker {
  position: absolute;
  cursor: pointer;
  transform: translate(-50%, -50%);
}

.marker-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  font-size: 24px;
}

.marker-icon.online {
  color: #67c23a;
}

.marker-icon.offline {
  color: #909399;
  opacity: 0.7;
}

.marker-icon.abnormal {
  color: #67c23a;
  position: relative;
}

.marker-icon.abnormal::after {
  content: '!';
  position: absolute;
  top: -5px;
  right: -5px;
  width: 16px;
  height: 16px;
  background-color: #e6a23c;
  color: white;
  border-radius: 50%;
  font-size: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.marker-icon.alarm {
  color: #f56c6c;
  animation: alarmFlash 1s infinite;
}

.marker-icon.driving {
  animation: pulse 2s infinite;
}

.marker-label {
  position: absolute;
  top: 35px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

/* 动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(103, 194, 58, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(103, 194, 58, 0);
  }
}

@keyframes alarmFlash {
  0% {
    box-shadow: 0 0 5px 2px #f56c6c;
  }
  50% {
    box-shadow: 0 0 15px 5px #f56c6c;
  }
  100% {
    box-shadow: 0 0 5px 2px #f56c6c;
  }
}

.amap-controls {
  position: absolute;
  right: 20px;
  top: 70px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.amap-zoom {
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 4px;
  overflow: hidden;
}

.amap-zoom button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: white;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
}

.amap-zoom button:first-child {
  border-bottom: 1px solid #e4e7ed;
}

.amap-location button {
  width: 30px;
  height: 30px;
  border: none;
  background-color: white;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
}

/* 车辆信息弹窗 */
.vehicle-info-dialog .el-dialog__header {
  background-color: #1976d2;
  color: white;
}

.vehicle-info-dialog .el-dialog__title {
  color: white;
}

.vehicle-info {
  display: flex;
  flex-direction: column;
  gap: 0;
  position: relative;
  padding-top: 90px;
}

.vehicle-image {
  position: absolute;
  top: 0;
  right: 0;
  width: 80px;
  height: 80px;
  z-index: 1;
}

.vehicle-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.info-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #f0f0f0;
  position: relative;
  z-index: 2;
}

.info-item:last-child {
  border-bottom: none;
}

.info-item .label {
  font-weight: bold;
  color: #303133;
}

.info-item .value {
  color: #606266;
  text-align: right;
  max-width: 60%;
  word-wrap: break-word;
}

.dialog-footer {
  display: flex;
  flex-direction: column;
  gap: 10px;
  align-items: flex-start;
  width: 100%;
}

.blue-buttons {
  display: flex;
  gap: 8px;
  flex-wrap: nowrap;
  justify-content: flex-start;
  width: 100%;
  overflow-x: auto;
  padding-bottom: 5px;
}

.blue-buttons::-webkit-scrollbar {
  height: 4px;
}

.blue-buttons::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 2px;
}

.blue-buttons::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.blue-buttons::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.close-button {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: 5px;
}

/* 车辆状态标签页 */
.vehicle-status-tabs {
  height: 300px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
  transition: all 0.3s;
}

.vehicle-status-tabs.hidden {
  height: 0;
  margin-top: 0;
  overflow: hidden;
}

.tab-content {
  height: calc(100% - 60px);
  display: flex;
  flex-direction: column;
}

.tab-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #e4e7ed;
}

.tab-header span {
  font-size: 14px;
  color: #606266;
}

.tab-actions {
  display: flex;
  gap: 10px;
}

/* 字段设置 */
.field-settings {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
  max-height: 300px;
  overflow-y: auto;
}

/* 响应式设计 */
@media screen and (max-height: 800px) {
  .vehicle-status-tabs {
    height: 250px;
  }
}

@media screen and (max-height: 700px) {
  .vehicle-status-tabs {
    height: 200px;
  }
}
</style>