<template>
  <div class="track-playback-container">
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
              <!-- 轨迹线 -->
              <svg class="track-line-svg" v-if="trackData.length > 0">
                <path 
                  :d="trackPathData" 
                  fill="none" 
                  :stroke="activeTab === 'alarm' ? '#f56c6c' : '#67c23a'" 
                  stroke-width="4"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  style="filter: drop-shadow(0 2px 4px rgba(103, 194, 58, 0.3));"
                />
              </svg>
              
              <!-- 区域边界 -->
              <svg class="area-boundary-svg" v-if="activeTab === 'area' && areaRecords.length > 0">
                <ellipse 
                  v-for="(area, index) in areaRecords" 
                  :key="'area-' + index"
                  :cx="getAreaCenter(area).x + '%'"
                  :cy="getAreaCenter(area).y + '%'"
                  :rx="5 + index * 2 + '%'"
                  :ry="3 + index * 1.5 + '%'"
                  fill="none"
                  stroke="#409eff"
                  stroke-width="2"
                  stroke-dasharray="5,5"
                  opacity="0.6"
                />
              </svg>
              
              <!-- 轨迹点（根据tab显示不同内容） -->
              <div 
                v-for="(point, index) in trackData" 
                :key="index"
                class="track-point"
                :class="{ 'highlighted': highlightedPointIndex === index }"
                :style="{
                  top: (30 + index * 3 + Math.cos(index * 0.3) * 15) + '%', 
                  left: (20 + index * 7 + Math.sin(index * 0.5) * 10) + '%',
                  display: shouldShowTrackPoint(index) ? 'block' : 'none'
                }"
                @click="showPointInfo(point, index)"
              >
                <div class="point-dot" :class="{ 
                  'start-point': index === 0, 
                  'end-point': index === trackData.length - 1,
                  'parking-point': isParkingPoint(index)
                }"></div>
                <div class="point-label">{{ point.locationTime }}</div>
                <div class="point-mark start" v-if="index === 0">起</div>
                <div class="point-mark end" v-if="index === trackData.length - 1">终</div>
                <div class="point-mark parking" v-if="isParkingPoint(index) && activeTab === 'parking'">P</div>
              </div>
              
              <!-- 报警点 -->
              <div 
                v-for="(alarm, index) in alarmRecords" 
                :key="'alarm-' + index"
                class="alarm-point"
                :class="{ 'highlighted': highlightedAlarmIndex === index }"
                :style="getAlarmPointStyle(alarm, index)"
                @click="showAlarmInfo(alarm, index)"
                v-if="activeTab === 'alarm' || activeTab === 'trackPoints'"
              >
                <div class="alarm-icon">!</div>
              </div>
              
              <!-- 进出区域点 -->
              <div 
                v-for="(area, index) in areaRecords" 
                :key="'area-point-' + index"
                class="area-point"
                :class="{ 'highlighted': highlightedAreaIndex === index }"
                v-if="activeTab === 'area'"
              >
                <div 
                  class="area-arrow enter" 
                  :style="getAreaEnterStyle(area, index)"
                  @click="showAreaInfo(area, index, 'enter')"
                >
                  ↓
                </div>
                <div 
                  class="area-arrow leave" 
                  :style="getAreaLeaveStyle(area, index)"
                  @click="showAreaInfo(area, index, 'leave')"
                >
                  ↑
                </div>
              </div>
              
              <!-- 停车点（独立显示） -->
              <div 
                v-for="(record, index) in parkingRecords" 
                :key="'parking-' + index"
                class="parking-point"
                :class="{ 'highlighted': highlightedParkingIndex === index }"
                :style="getParkingPointStyle(record, index)"
                @click="showParkingInfoDialog(record, index)"
                v-if="activeTab === 'parking'"
              >
                <div class="parking-icon">P</div>
              </div>
              
              <!-- 车辆图标 -->
              <div 
                class="vehicle-icon" 
                :style="{
                  top: (30 + playbackProgress * 3 + Math.cos(playbackProgress * 0.3) * 15) + '%', 
                  left: (20 + playbackProgress * 7 + Math.sin(playbackProgress * 0.5) * 10) + '%'
                }" 
                v-if="isPlaying"
              >
                <div class="car-icon"></div>
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

        <!-- 轨迹查询面板 -->
        <div class="track-search-panel">
          <div class="panel-header">
            <h3>轨迹查询</h3>
            <div class="panel-controls">
              <el-tooltip content="收起" placement="top" v-if="!isPanelCollapsed">
                <el-button type="text" icon="el-icon-arrow-up" @click="togglePanel" size="small" />
              </el-tooltip>
              <el-tooltip content="展开" placement="top" v-else>
                <el-button type="text" icon="el-icon-arrow-down" @click="togglePanel" size="small" />
              </el-tooltip>
            </div>
          </div>
          <div class="panel-content" v-show="!isPanelCollapsed">
            <div class="search-form">
              <div class="form-item">
                <label>查询车辆：</label>
                <span class="vehicle-info">粤B12345 / LBV3M2100K5123456 / 13800138001 / T100001</span>
              </div>
              <div class="form-item">
                <label>开始时间：</label>
                <el-date-picker
                  v-model="searchParams.startTime"
                  type="datetime"
                  placeholder="选择开始时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 200px;"
                />
              </div>
              <div class="form-item">
                <label>结束时间：</label>
                <el-date-picker
                  v-model="searchParams.endTime"
                  type="datetime"
                  placeholder="选择结束时间"
                  format="YYYY-MM-DD HH:mm:ss"
                  value-format="YYYY-MM-DD HH:mm:ss"
                  style="width: 200px;"
                />
              </div>
              <div class="form-item">
                <label>查询方式：</label>
                <el-select v-model="searchParams.queryType" style="width: 150px;">
                  <el-option label="按时间间隔" value="time" />
                  <el-option label="按公里间距" value="distance" />
                </el-select>
              </div>
              <div class="form-item" v-if="searchParams.queryType === 'time'">
                <label>时间间隔：</label>
                <el-input-number v-model="searchParams.timeInterval" :min="1" style="width: 100px;" />
                <el-select v-model="searchParams.timeUnit" style="width: 80px; margin-left: 10px;">
                  <el-option label="小时" value="hour" />
                  <el-option label="分钟" value="minute" />
                  <el-option label="秒" value="second" />
                </el-select>
              </div>
              <div class="form-item" v-if="searchParams.queryType === 'distance'">
                <label>公里间距：</label>
                <el-input-number v-model="searchParams.distanceInterval" :min="0.1" :step="0.1" style="width: 100px;" />
                <span style="margin-left: 10px;">公里</span>
              </div>
              <div class="form-item">
                <label>停车过滤：</label>
                <el-input-number v-model="searchParams.parkingThreshold" :min="1" style="width: 100px;" />
                <span style="margin-left: 10px;">分钟</span>
              </div>
              <div class="form-item">
                <label>补传：</label>
                <el-switch v-model="searchParams.include补传" />
              </div>
              <div class="form-actions">
                <el-button type="primary" @click="searchTrack">查询</el-button>
              </div>
            </div>

            <!-- 轨迹回放控制 -->
            <div class="playback-control" v-if="trackData.length > 0">
              <h4>轨迹回放</h4>
              <div class="control-buttons">
                <div class="playback-buttons">
                  <el-tooltip content="播放" placement="top">
                    <el-button type="success" icon="el-icon-video-play" @click="playTrack" size="small" circle />
                  </el-tooltip>
                  <el-tooltip content="暂停" placement="top">
                    <el-button type="danger" icon="el-icon-video-pause" @click="pauseTrack" size="small" circle />
                  </el-tooltip>
                  <el-tooltip content="停止" placement="top">
                    <el-button type="primary" icon="el-icon-video-stop" @click="stopTrack" size="small" circle />
                  </el-tooltip>
                </div>
                <div class="speed-settings">
                  <el-select v-model="playbackSpeed" style="width: 60px;" size="small">
                    <el-option label="0.5X" value="0.5" />
                    <el-option label="1X" value="1" />
                    <el-option label="1.5X" value="1.5" />
                    <el-option label="2X" value="2" />
                    <el-option label="3X" value="3" />
                    <el-option label="5X" value="5" />
                  </el-select>
                </div>
              </div>
              <div class="progress-bar">
                <el-slider
                  v-model="playbackProgress"
                  :min="0"
                  :max="trackData.length - 1"
                  @change="setPlaybackProgress"
                />
              </div>
              <div class="track-info">
                <span>总里程：{{ totalMileage }} km</span>
                <span>补传次数：{{ uploadCount }}</span>
                <el-button type="info" size="small" @click="showOverview = true">概览</el-button>
                <el-button type="info" size="small" @click="showTrackSettings = true">设置</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 轨迹概览弹窗 -->
        <el-dialog
          v-model="showOverview"
          title="轨迹概览"
          width="400px"
        >
          <div class="overview-info">
            <div class="overview-item">
              <span class="label">行驶里程：</span>
              <span class="value">{{ totalMileage }} km</span>
            </div>
            <div class="overview-item">
              <span class="label">补传定位：</span>
              <span class="value">{{ uploadCount }} 个</span>
            </div>
            <div class="overview-item">
              <span class="label">最高时速：</span>
              <span class="value">{{ maxSpeed }} km/h</span>
            </div>
            <div class="overview-item">
              <span class="label">平均速度：</span>
              <span class="value">{{ avgSpeed }} km/h</span>
            </div>
            <div class="overview-item">
              <span class="label">行车时长：</span>
              <span class="value">{{ drivingTime }}</span>
            </div>
            <div class="overview-item">
              <span class="label">停车时长：</span>
              <span class="value">{{ parkingTime }}</span>
            </div>
            <div class="overview-item">
              <span class="label">轨迹时长：</span>
              <span class="value">{{ trackTime }}</span>
            </div>
          </div>
        </el-dialog>

        <!-- 轨迹点信息弹窗 -->
        <el-dialog
          v-model="showPointInfoDialog"
          title="轨迹点详情"
          width="400px"
        >
          <div class="point-info">
            <div class="info-item">
              <span class="label">时间：</span>
              <span class="value">{{ selectedPoint.locationTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">速度：</span>
              <span class="value">{{ selectedPoint.speed }} km/h</span>
            </div>
            <div class="info-item">
              <span class="label">位置：</span>
              <span class="value">{{ selectedPoint.location }}</span>
            </div>
            <div class="info-item">
              <span class="label">海拔：</span>
              <span class="value">100 m</span>
            </div>
          </div>
        </el-dialog>

        <!-- 停车点信息弹窗 -->
        <el-dialog
          v-model="showParkingDialog"
          title="停车点详情"
          width="400px"
        >
          <div class="point-info">
            <div class="info-item">
              <span class="label">停车时长：</span>
              <span class="value">{{ selectedParking.duration }}</span>
            </div>
            <div class="info-item">
              <span class="label">开始时间：</span>
              <span class="value">{{ selectedParking.startTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">结束时间：</span>
              <span class="value">{{ selectedParking.endTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">位置：</span>
              <span class="value">{{ selectedParking.location }}</span>
            </div>
          </div>
        </el-dialog>

        <!-- 报警点信息弹窗 -->
        <el-dialog
          v-model="showAlarmDialog"
          title="报警详情"
          width="400px"
        >
          <div class="point-info">
            <div class="info-item">
              <span class="label">报警类型：</span>
              <span class="value">{{ selectedAlarm.alarmType }}</span>
            </div>
            <div class="info-item">
              <span class="label">报警时间：</span>
              <span class="value">{{ selectedAlarm.startTime }}</span>
            </div>
            <div class="info-item">
              <span class="label">对应数值：</span>
              <span class="value">{{ selectedAlarm.alarmValue || 'N/A' }}</span>
            </div>
            <div class="info-item">
              <span class="label">持续时间：</span>
              <span class="value">{{ selectedAlarm.duration }}</span>
            </div>
          </div>
        </el-dialog>

        <!-- 进出区域信息弹窗 -->
        <el-dialog
          v-model="showAreaDialog"
          title="进出区域详情"
          width="400px"
        >
          <div class="point-info">
            <div class="info-item">
              <span class="label">区域名称：</span>
              <span class="value">{{ selectedArea.areaName || '区域' + (selectedArea.id || '') }}</span>
            </div>
            <div class="info-item">
              <span class="label">进出类型：</span>
              <span class="value">{{ selectedArea.type === 'enter' ? '进入' : '离开' }}</span>
            </div>
            <div class="info-item">
              <span class="label">{{ selectedArea.type === 'enter' ? '进入时间' : '离开时间' }}：</span>
              <span class="value">{{ selectedArea.time }}</span>
            </div>
            <div class="info-item">
              <span class="label">停留时长：</span>
              <span class="value">{{ selectedArea.duration }}</span>
            </div>
          </div>
        </el-dialog>

        <!-- 轨迹点显示设置弹窗 -->
        <el-dialog
          v-model="showTrackSettings"
          title="轨迹点显示设置"
          width="400px"
        >
          <div class="track-settings">
            <el-checkbox-group v-model="trackSettings.display">
              <el-checkbox label="showAllAlarmPoints">显示所有报警点</el-checkbox>
              <el-checkbox label="showAllParkingPoints">显示所有停车点</el-checkbox>
              <el-checkbox label="showAllTrackPoints">显示所有轨迹点</el-checkbox>
            </el-checkbox-group>
          </div>
          <template #footer>
            <div class="dialog-footer">
              <el-button @click="showTrackSettings = false">取消</el-button>
              <el-button type="primary" @click="saveTrackSettings">保存</el-button>
            </div>
          </template>
        </el-dialog>
      </div>

      <!-- 轨迹数据标签页 -->
      <div class="track-data-tabs">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane :label="`轨迹点 (${trackPoints.length})`" name="trackPoints">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ trackPoints.length }} 个轨迹点</span>
                <el-button type="primary" size="small" @click="exportData('trackPoints')">导出</el-button>
              </div>
              <el-table 
                ref="trackPointsTable"
                :data="trackPoints" 
                style="width: 100%" 
                @row-click="handleRowClick"
                :row-class-name="getRowClassName"
                :highlight-current-row="true"
              >
                <el-table-column prop="plate" label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="locationTime" label="定位时间" width="180" />
                <el-table-column prop="speed" label="行驶速度(km/h)" width="120" />
                <el-table-column prop="drivingMileage" label="行驶里程(km)" width="120" />
                <el-table-column prop="totalMileage" label="里程(km)" width="100" />
                <el-table-column prop="status" label="车辆状态" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`停车 (${parkingRecords.length})`" name="parking">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ parkingRecords.length }} 条停车记录</span>
                <el-button type="primary" size="small" @click="exportData('parking')">导出</el-button>
              </div>
              <el-table 
                ref="parkingTable"
                :data="parkingRecords" 
                style="width: 100%" 
                @row-click="handleRowClick"
                :row-class-name="getRowClassName"
                :highlight-current-row="true"
              >
                <el-table-column prop="plate" label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="startTime" label="停车开始时间" width="180" />
                <el-table-column prop="endTime" label="停车结束时间" width="180" />
                <el-table-column prop="duration" label="停车时长" width="120" />
                <el-table-column prop="totalMileage" label="里程(km)" width="100" />
                <el-table-column prop="drivingMileage" label="行驶里程(km)" width="120" />
                <el-table-column prop="location" label="停车位置" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`报警 (${alarmRecords.length})`" name="alarm">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ alarmRecords.length }} 条报警记录</span>
                <el-button type="primary" size="small" @click="exportData('alarm')">导出</el-button>
              </div>
              <el-table 
                ref="alarmTable"
                :data="alarmRecords" 
                style="width: 100%" 
                @row-click="handleRowClick"
                :row-class-name="getRowClassName"
                :highlight-current-row="true"
              >
                <el-table-column prop="alarmType" label="报警类型" width="120" />
                <el-table-column prop="startTime" label="开始时间" width="180" />
                <el-table-column prop="endTime" label="结束时间" width="180" />
                <el-table-column prop="duration" label="持续时间" width="120" />
                <el-table-column prop="startLocation" label="开始位置" min-width="200" />
                <el-table-column prop="endLocation" label="结束位置" min-width="200" />
              </el-table>
            </div>
          </el-tab-pane>
          <el-tab-pane :label="`进出区域 (${areaRecords.length})`" name="area">
            <div class="tab-content">
              <div class="tab-header">
                <span>共 {{ areaRecords.length }} 条进出区域记录</span>
                <el-button type="primary" size="small" @click="exportData('area')">导出</el-button>
              </div>
              <el-table 
                ref="areaTable"
                :data="areaRecords" 
                style="width: 100%" 
                @row-click="handleRowClick"
                :row-class-name="getRowClassName"
                :highlight-current-row="true"
              >
                <el-table-column prop="plate" label="标识符" width="180">
                  <template #default="{ row }">
                    {{ row.identifier || row.plate || row.frame || row.sim || row.terminalId }}
                  </template>
                </el-table-column>
                <el-table-column prop="enterTime" label="进入区域时间" width="180" />
                <el-table-column prop="leaveTime" label="离开区域时间" width="180" />
                <el-table-column prop="duration" label="停留区域时长" width="120" />
                <el-table-column prop="drivingMileage" label="行驶里程(km)" width="120" />
                <el-table-column prop="totalMileage" label="里程(km)" width="100" />
              </el-table>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <!-- 导出设置弹窗 -->
    <el-dialog
      v-model="showExportDialog"
      title="导出设置"
      width="500px"
    >
      <div class="export-settings">
        <div class="setting-item">
          <span>导出类型：</span>
          <el-radio-group v-model="exportSettings.type">
            <el-radio label="current">当前Tab</el-radio>
            <el-radio label="all">全部Tab</el-radio>
          </el-radio-group>
        </div>
        <div class="setting-item">
          <span>时间范围：</span>
          <el-radio-group v-model="exportSettings.timeRange">
            <el-radio label="recent30">最近30天</el-radio>
            <el-radio label="custom">自定义日期</el-radio>
          </el-radio-group>
        </div>
        <div class="setting-item" v-if="exportSettings.timeRange === 'custom'">
          <span>开始日期：</span>
          <el-date-picker
            v-model="exportSettings.startDate"
            type="date"
            placeholder="选择开始日期"
            style="width: 150px;"
          />
        </div>
        <div class="setting-item" v-if="exportSettings.timeRange === 'custom'">
          <span>结束日期：</span>
          <el-date-picker
            v-model="exportSettings.endDate"
            type="date"
            placeholder="选择结束日期"
            style="width: 150px;"
          />
        </div>
        <div class="setting-item">
          <span>车辆范围：</span>
          <el-select v-model="exportSettings.vehicle" style="width: 200px;">
            <el-option label="当前车辆" value="current" />
            <el-option label="全部车辆" value="all" />
          </el-select>
        </div>
      </div>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="showExportDialog = false">取消</el-button>
          <el-button type="primary" @click="confirmExport">导出</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// 搜索参数
const searchParams = ref({
  startTime: new Date(new Date().setHours(0, 0, 0, 0)).toISOString().slice(0, 19).replace('T', ' '),
  endTime: new Date(new Date().setHours(23, 59, 59, 999)).toISOString().slice(0, 19).replace('T', ' '),
  queryType: 'time',
  timeInterval: 5,
  timeUnit: 'minute',
  distanceInterval: 1,
  parkingThreshold: 5,
  include补传: true
})

// 轨迹数据
const trackData = ref([])
const trackPoints = ref([])
const parkingRecords = ref([])
const alarmRecords = ref([])
const areaRecords = ref([])
const snapRecords = ref([])

// 轨迹统计数据
const totalMileage = ref(125.5)
const uploadCount = ref(5)
const maxSpeed = ref(95)
const avgSpeed = ref(45.2)
const drivingTime = ref('2小时30分钟')
const parkingTime = ref('30分钟')
const trackTime = ref('3小时')

// 回放控制
const isPlaying = ref(false)
const playbackSpeed = ref('1')
const playbackProgress = ref(0)

// 面板折叠状态
const isPanelCollapsed = ref(false)

// 切换面板折叠状态
const togglePanel = () => {
  isPanelCollapsed.value = !isPanelCollapsed.value
}

// 标签页状态
const activeTab = ref('trackPoints')

// 表格引用
const trackPointsTable = ref(null)
const parkingTable = ref(null)
const alarmTable = ref(null)
const areaTable = ref(null)

// 高亮索引
const highlightedPointIndex = ref(-1)
const highlightedParkingIndex = ref(-1)
const highlightedAlarmIndex = ref(-1)
const highlightedAreaIndex = ref(-1)

// 概览弹窗
const showOverview = ref(false)

// 轨迹点信息弹窗
const showPointInfoDialog = ref(false)
const selectedPoint = ref({})

// 停车点信息弹窗
const showParkingDialog = ref(false)
const selectedParking = ref({})

// 报警点信息弹窗
const showAlarmDialog = ref(false)
const selectedAlarm = ref({})

// 进出区域信息弹窗
const showAreaDialog = ref(false)
const selectedArea = ref({})

// 停车点悬停信息
const hoveredParking = ref(null)

// 轨迹线点
const trackLinePoints = computed(() => {
  return trackData.value.map((point, index) => {
    const x = 20 + index * 7 + Math.sin(index * 0.5) * 10
    const y = 30 + index * 3 + Math.cos(index * 0.3) * 15
    return `${x}% ${y}%`
  }).join(' ')
})

// 计算轨迹点坐标（用于SVG）
const trackPointCoords = computed(() => {
  return trackData.value.map((point, index) => {
    const x = 20 + index * 7 + Math.sin(index * 0.5) * 10
    const y = 30 + index * 3 + Math.cos(index * 0.3) * 15
    return { x, y }
  })
})

// 生成SVG路径数据（使用贝塞尔曲线创建平滑轨迹）
const trackPathData = computed(() => {
  if (trackPointCoords.value.length === 0) return ''
  if (trackPointCoords.value.length === 1) return `M ${trackPointCoords.value[0].x}% ${trackPointCoords.value[0].y}%`
  
  let path = `M ${trackPointCoords.value[0].x}% ${trackPointCoords.value[0].y}%`
  
  for (let i = 1; i < trackPointCoords.value.length; i++) {
    const current = trackPointCoords.value[i]
    const prev = trackPointCoords.value[i - 1]
    
    if (i === 1) {
      path += ` L ${current.x}% ${current.y}%`
    } else {
      const prevPrev = trackPointCoords.value[i - 2]
      const next = trackPointCoords.value[i + 1] || current
      
      const cp1x = prev.x + (current.x - prevPrev.x) * 0.3
      const cp1y = prev.y + (current.y - prevPrev.y) * 0.3
      const cp2x = current.x - (next.x - prev.x) * 0.3
      const cp2y = current.y - (next.y - prev.y) * 0.3
      
      path += ` C ${cp1x}% ${cp1y}%, ${cp2x}% ${cp2y}%, ${current.x}% ${current.y}%`
    }
  }
  return path
})

// 判断是否应该显示轨迹点
const shouldShowTrackPoint = (index) => {
  if (activeTab.value === 'trackPoints') {
    return true
  } else if (activeTab.value === 'parking') {
    return index === 0 || index === trackData.value.length - 1 || isParkingPoint(index)
  } else if (activeTab.value === 'alarm') {
    return index === 0 || index === trackData.value.length - 1
  } else if (activeTab.value === 'area') {
    return index === 0 || index === trackData.value.length - 1
  }
  return false
}

// 判断是否是停车点
const isParkingPoint = (index) => {
  if (trackData.value[index]) {
    return trackData.value[index].speed === 0
  }
  return false
}

// 获取报警点样式
const getAlarmPointStyle = (alarm, index) => {
  const trackIndex = trackData.value.findIndex(p => p.locationTime === alarm.startTime)
  if (trackIndex >= 0) {
    return {
      top: (30 + trackIndex * 3 + Math.cos(trackIndex * 0.3) * 15) + '%',
      left: (20 + trackIndex * 7 + Math.sin(trackIndex * 0.5) * 10) + '%'
    }
  }
  return { top: '50%', left: '50%' }
}

// 获取停车点样式
const getParkingPointStyle = (record, index) => {
  const trackIndex = trackData.value.findIndex(p => p.locationTime === record.startTime)
  if (trackIndex >= 0) {
    return {
      top: (30 + trackIndex * 3 + Math.cos(trackIndex * 0.3) * 15) + '%',
      left: (20 + trackIndex * 7 + Math.sin(trackIndex * 0.5) * 10) + '%'
    }
  }
  return { top: (40 + index * 10) + '%', left: (30 + index * 10) + '%' }
}

// 获取区域中心点
const getAreaCenter = (area) => {
  const enterIndex = trackData.value.findIndex(p => p.locationTime === area.enterTime)
  if (enterIndex >= 0) {
    return {
      x: 20 + enterIndex * 7 + Math.sin(enterIndex * 0.5) * 10,
      y: 30 + enterIndex * 3 + Math.cos(enterIndex * 0.3) * 15
    }
  }
  return { x: 50, y: 50 }
}

// 获取区域进入点样式
const getAreaEnterStyle = (area, index) => {
  const enterIndex = trackData.value.findIndex(p => p.locationTime === area.enterTime)
  if (enterIndex >= 0) {
    return {
      top: (30 + enterIndex * 3 + Math.cos(enterIndex * 0.3) * 15) + '%',
      left: (20 + enterIndex * 7 + Math.sin(enterIndex * 0.5) * 10) + '%'
    }
  }
  return { top: '50%', left: '50%' }
}

// 获取区域离开点样式
const getAreaLeaveStyle = (area, index) => {
  const leaveIndex = trackData.value.findIndex(p => p.locationTime === area.leaveTime)
  if (leaveIndex >= 0) {
    return {
      top: (30 + leaveIndex * 3 + Math.cos(leaveIndex * 0.3) * 15) + '%',
      left: (20 + leaveIndex * 7 + Math.sin(leaveIndex * 0.5) * 10) + '%'
    }
  }
  return { top: '50%', left: '50%' }
}

// 获取行类名
const getRowClassName = ({ row, rowIndex }) => {
  if (activeTab.value === 'trackPoints' && highlightedPointIndex.value === rowIndex) {
    return 'highlighted-row'
  } else if (activeTab.value === 'parking' && highlightedParkingIndex.value === rowIndex) {
    return 'highlighted-row'
  } else if (activeTab.value === 'alarm' && highlightedAlarmIndex.value === rowIndex) {
    return 'highlighted-row'
  } else if (activeTab.value === 'area' && highlightedAreaIndex.value === rowIndex) {
    return 'highlighted-row'
  }
  return ''
}

// 显示轨迹点信息
const showPointInfo = (point, index) => {
  selectedPoint.value = point
  highlightedPointIndex.value = index
  showPointInfoDialog.value = true
  scrollToTableRow(index)
}

// 显示停车点信息
const showParkingInfoDialog = (record, index) => {
  selectedParking.value = record
  highlightedParkingIndex.value = index
  showParkingDialog.value = true
  scrollToTableRow(index)
}

// 显示报警点信息
const showAlarmInfo = (alarm, index) => {
  selectedAlarm.value = alarm
  highlightedAlarmIndex.value = index
  showAlarmDialog.value = true
  scrollToTableRow(index)
}

// 显示区域信息
const showAreaInfo = (area, index, type) => {
  selectedArea.value = { ...area, type, time: type === 'enter' ? area.enterTime : area.leaveTime }
  highlightedAreaIndex.value = index
  showAreaDialog.value = true
  scrollToTableRow(index)
}

// 滚动到表格行
const scrollToTableRow = (index) => {
  nextTick(() => {
    let tableRef = null
    if (activeTab.value === 'trackPoints') {
      tableRef = trackPointsTable.value
    } else if (activeTab.value === 'parking') {
      tableRef = parkingTable.value
    } else if (activeTab.value === 'alarm') {
      tableRef = alarmTable.value
    } else if (activeTab.value === 'area') {
      tableRef = areaTable.value
    }
    
    if (tableRef && tableRef.$el) {
      const rows = tableRef.$el.querySelectorAll('.el-table__body-wrapper tbody tr')
      if (rows[index]) {
        rows[index].scrollIntoView({ behavior: 'smooth', block: 'center' })
        rows[index].classList.add('highlighted-row')
      }
    }
  })
}

// 导出设置
const showExportDialog = ref(false)
const exportSettings = ref({
  type: 'current',
  timeRange: 'recent30',
  startDate: '',
  endDate: '',
  vehicle: 'current'
})

// 轨迹点显示设置
const showTrackSettings = ref(false)
const trackSettings = ref({
  display: ['showAllAlarmPoints', 'showAllParkingPoints', 'showAllTrackPoints']
})

// 保存轨迹点显示设置
const saveTrackSettings = () => {
  console.log('保存轨迹点显示设置:', trackSettings.value)
  showTrackSettings.value = false
}

// 查询轨迹
const searchTrack = () => {
  console.log('查询轨迹:', searchParams.value)
  // 模拟轨迹数据
  trackData.value = [
    { id: 1, plate: '粤B12345', locationTime: '2026-03-16 08:00:00', speed: 0, longitude: '113.8846', latitude: '22.5488', location: '深圳市宝安区宝安中心区' },
    { id: 2, plate: '粤B12345', locationTime: '2026-03-16 08:05:00', speed: 45, longitude: '113.9046', latitude: '22.5588', location: '广深高速 宝安入口' },
    { id: 3, plate: '粤B12345', locationTime: '2026-03-16 08:15:00', speed: 65, longitude: '113.9546', latitude: '22.5688', location: '广深高速 福永段' },
    { id: 4, plate: '粤B12345', locationTime: '2026-03-16 08:30:00', speed: 0, longitude: '114.0046', latitude: '22.5788', location: '广深高速 沙井服务区' },
    { id: 5, plate: '粤B12345', locationTime: '2026-03-16 08:45:00', speed: 70, longitude: '114.0546', latitude: '22.5888', location: '广深高速 长安段' },
    { id: 6, plate: '粤B12345', locationTime: '2026-03-16 09:00:00', speed: 60, longitude: '114.1046', latitude: '22.5988', location: '广深高速 虎门段' },
    { id: 7, plate: '粤B12345', locationTime: '2026-03-16 09:15:00', speed: 0, longitude: '114.1546', latitude: '22.6088', location: '广深高速 虎门服务区' },
    { id: 8, plate: '粤B12345', locationTime: '2026-03-16 09:30:00', speed: 65, longitude: '114.2046', latitude: '22.6188', location: '广深高速 厚街段' },
    { id: 9, plate: '粤B12345', locationTime: '2026-03-16 09:45:00', speed: 55, longitude: '114.2546', latitude: '22.6288', location: '广深高速 东莞段' },
    { id: 10, plate: '粤B12345', locationTime: '2026-03-16 10:00:00', speed: 0, longitude: '114.3046', latitude: '22.6388', location: '东莞市东城区' }
  ]

  // 模拟轨迹点数据
  trackPoints.value = [
    { id: 1, plate: '粤B12345', locationTime: '2026-03-16 08:00:00', speed: 0, drivingMileage: 0, totalMileage: 10000, status: 'ACC关，在线，停车' },
    { id: 2, plate: '粤B12345', locationTime: '2026-03-16 08:05:00', speed: 45, drivingMileage: 3.75, totalMileage: 10003.75, status: 'ACC开，在线，行驶' },
    { id: 3, plate: '粤B12345', locationTime: '2026-03-16 08:15:00', speed: 65, drivingMileage: 14.58, totalMileage: 10014.58, status: 'ACC开，在线，行驶' },
    { id: 4, plate: '粤B12345', locationTime: '2026-03-16 08:30:00', speed: 0, drivingMileage: 14.58, totalMileage: 10014.58, status: 'ACC开，在线，停车15分钟' },
    { id: 5, plate: '粤B12345', locationTime: '2026-03-16 08:45:00', speed: 70, drivingMileage: 26.17, totalMileage: 10026.17, status: 'ACC开，在线，行驶' },
    { id: 6, plate: '粤B12345', locationTime: '2026-03-16 09:00:00', speed: 60, drivingMileage: 36.17, totalMileage: 10036.17, status: 'ACC开，在线，行驶' },
    { id: 7, plate: '粤B12345', locationTime: '2026-03-16 09:15:00', speed: 0, drivingMileage: 36.17, totalMileage: 10036.17, status: 'ACC开，在线，停车15分钟' },
    { id: 8, plate: '粤B12345', locationTime: '2026-03-16 09:30:00', speed: 65, drivingMileage: 47.08, totalMileage: 10047.08, status: 'ACC开，在线，行驶' },
    { id: 9, plate: '粤B12345', locationTime: '2026-03-16 09:45:00', speed: 55, drivingMileage: 55.83, totalMileage: 10055.83, status: 'ACC开，在线，行驶' },
    { id: 10, plate: '粤B12345', locationTime: '2026-03-16 10:00:00', speed: 0, drivingMileage: 55.83, totalMileage: 10055.83, status: 'ACC关，在线，停车' }
  ]

  // 模拟停车记录
  parkingRecords.value = [
    { id: 1, plate: '粤B12345', startTime: '2026-03-16 08:00:00', endTime: '2026-03-16 08:05:00', duration: '5分钟', totalMileage: 10000, drivingMileage: 0, location: '深圳市宝安区宝安中心区' },
    { id: 2, plate: '粤B12345', startTime: '2026-03-16 08:30:00', endTime: '2026-03-16 08:45:00', duration: '15分钟', totalMileage: 10014.58, drivingMileage: 14.58, location: '广深高速 沙井服务区' },
    { id: 3, plate: '粤B12345', startTime: '2026-03-16 09:15:00', endTime: '2026-03-16 09:30:00', duration: '15分钟', totalMileage: 10036.17, drivingMileage: 36.17, location: '广深高速 虎门服务区' },
    { id: 4, plate: '粤B12345', startTime: '2026-03-16 10:00:00', endTime: '2026-03-16 10:30:00', duration: '30分钟', totalMileage: 10055.83, drivingMileage: 55.83, location: '东莞市东城区' }
  ]

  // 模拟报警记录
  alarmRecords.value = [
    { id: 1, alarmType: '超速', startTime: '2026-03-16 08:45:00', endTime: '2026-03-16 08:50:00', duration: '5分钟', startLocation: '广深高速 长安段', endLocation: '广深高速 虎门段', alarmValue: '120 km/h' },
    { id: 2, alarmType: '疲劳驾驶', startTime: '2026-03-16 09:30:00', endTime: '2026-03-16 09:45:00', duration: '15分钟', startLocation: '广深高速 厚街段', endLocation: '广深高速 东莞段', alarmValue: '4小时' }
  ]

  // 模拟进出区域记录
  areaRecords.value = [
    { id: 1, plate: '粤B12345', enterTime: '2026-03-16 08:00:00', leaveTime: '2026-03-16 08:05:00', duration: '5分钟', drivingMileage: 3.75, totalMileage: 10003.75, areaName: '宝安区域' },
    { id: 2, plate: '粤B12345', enterTime: '2026-03-16 08:05:00', leaveTime: '2026-03-16 08:30:00', duration: '25分钟', drivingMileage: 14.58, totalMileage: 10014.58, areaName: '高速区域' },
    { id: 3, plate: '粤B12345', enterTime: '2026-03-16 08:45:00', leaveTime: '2026-03-16 09:15:00', duration: '30分钟', drivingMileage: 36.17, totalMileage: 10036.17, areaName: '东莞区域' },
    { id: 4, plate: '粤B12345', enterTime: '2026-03-16 09:30:00', leaveTime: '2026-03-16 10:00:00', duration: '30分钟', drivingMileage: 55.83, totalMileage: 10055.83, areaName: '东城区域' }
  ]

  // 模拟闪拍记录
  snapRecords.value = [
    { id: 1, plate: '粤B12345', snapTime: '2026-03-16 08:00:00', location: '深圳市宝安区宝安中心区', speed: 0 },
    { id: 2, plate: '粤B12345', snapTime: '2026-03-16 08:15:00', location: '广深高速 福永段', speed: 65 },
    { id: 3, plate: '粤B12345', snapTime: '2026-03-16 08:30:00', location: '广深高速 沙井服务区', speed: 0 },
    { id: 4, plate: '粤B12345', snapTime: '2026-03-16 09:00:00', location: '广深高速 虎门段', speed: 60 },
    { id: 5, plate: '粤B12345', snapTime: '2026-03-16 10:00:00', location: '东莞市东城区', speed: 0 }
  ]
}

// 播放轨迹
const playTrack = () => {
  isPlaying.value = true
  console.log('播放轨迹')
}

// 暂停轨迹
const pauseTrack = () => {
  isPlaying.value = false
  console.log('暂停轨迹')
}

// 停止轨迹
const stopTrack = () => {
  isPlaying.value = false
  playbackProgress.value = 0
  console.log('停止轨迹')
}

// 设置回放进度
const setPlaybackProgress = (value) => {
  playbackProgress.value = value
  console.log('设置回放进度:', value)
}

// 处理标签页点击
const handleTabClick = (tab) => {
  activeTab.value = tab.props.name
  // 重置高亮索引
  highlightedPointIndex.value = -1
  highlightedParkingIndex.value = -1
  highlightedAlarmIndex.value = -1
  highlightedAreaIndex.value = -1
  console.log('切换到标签页:', tab.props.name)
}

// 处理表格行点击
const handleRowClick = (row) => {
  console.log('点击表格行:', row)
  // 实现与地图的联动
  if (activeTab.value === 'trackPoints') {
    // 轨迹点点击
    const index = trackPoints.value.findIndex(p => p.locationTime === row.locationTime)
    if (index >= 0) {
      highlightedPointIndex.value = index
      showPointInfo(trackData.value[index], index)
    }
  } else if (activeTab.value === 'parking') {
    // 停车记录点击
    const index = parkingRecords.value.findIndex(p => p.startTime === row.startTime)
    if (index >= 0) {
      highlightedParkingIndex.value = index
      showParkingInfoDialog(row, index)
    }
  } else if (activeTab.value === 'alarm') {
    // 报警记录点击
    const index = alarmRecords.value.findIndex(a => a.startTime === row.startTime)
    if (index >= 0) {
      highlightedAlarmIndex.value = index
      showAlarmInfo(row, index)
    }
  } else if (activeTab.value === 'area') {
    // 进出区域记录点击
    const index = areaRecords.value.findIndex(a => a.enterTime === row.enterTime)
    if (index >= 0) {
      highlightedAreaIndex.value = index
      showAreaInfo(row, index, 'enter')
    }
  }
}

// 导出数据
const exportData = (tab) => {
  exportSettings.value.type = tab === activeTab.value ? 'current' : 'all'
  showExportDialog.value = true
}

// 显示停车点信息
const showParkingInfo = (record) => {
  hoveredParking.value = record
}

// 确认导出
const confirmExport = () => {
  console.log('导出设置:', exportSettings.value)
  showExportDialog.value = false
  // 模拟导出
  alert('导出成功，文件将下载到本地')
}

// 组件挂载后初始化
onMounted(() => {
  // 初始化默认查询
  searchTrack()
})
</script>

<style scoped>
.track-playback-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
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
  font-size: 14px;
  color: #606266;
  position: relative;
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

/* 轨迹线 */
.track-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

.track-line-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 轨迹点 */
.track-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
}

.point-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #409eff;
  border: 2px solid white;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.point-dot.start-point {
  background-color: #67c23a;
  width: 12px;
  height: 12px;
}

.point-dot.end-point {
  background-color: #e6a23c;
  width: 12px;
  height: 12px;
}

.point-mark {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #67c23a;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: bold;
}

.point-mark.start {
  background-color: #67c23a;
}

.point-mark.end {
  background-color: #e6a23c;
}

.point-mark.parking {
  background-color: #e6a23c;
}

.point-dot.parking-point {
  background-color: #e6a23c;
  width: 12px;
  height: 12px;
}

/* 高亮轨迹点 */
.track-point.highlighted {
  z-index: 10;
}

.track-point.highlighted .point-dot {
  box-shadow: 0 0 8px 4px rgba(64, 158, 255, 0.5);
  transform: scale(1.3);
}

/* 报警点 */
.alarm-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
}

.alarm-point.highlighted {
  z-index: 10;
}

.alarm-icon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: #f56c6c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 0 4px rgba(245, 108, 108, 0.5);
}

.alarm-point.highlighted .alarm-icon {
  box-shadow: 0 0 8px 4px rgba(245, 108, 108, 0.5);
  transform: scale(1.3);
}

/* 区域边界 */
.area-boundary-svg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
}

/* 区域点 */
.area-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 5;
}

.area-point.highlighted {
  z-index: 10;
}

.area-arrow {
  position: absolute;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 16px;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
  cursor: pointer;
}

.area-arrow.enter {
  background-color: #67c23a;
}

.area-arrow.leave {
  background-color: #f56c6c;
}

.area-point.highlighted .area-arrow {
  box-shadow: 0 0 8px 4px rgba(64, 158, 255, 0.5);
  transform: scale(1.3);
}

.point-label {
  position: absolute;
  top: 15px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
  transition: opacity 0.3s;
}

.track-point:hover .point-label {
  opacity: 1;
}

/* 停车点 */
.parking-point {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 3;
}

.parking-point.highlighted {
  z-index: 10;
}

.parking-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background-color: #e6a23c;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.3);
}

.parking-point.highlighted .parking-icon {
  box-shadow: 0 0 8px 4px rgba(64, 158, 255, 0.5);
  transform: scale(1.3);
}

/* 车辆图标 */
.vehicle-icon {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 4;
  animation: pulse 2s infinite;
}

.car-icon {
  width: 24px;
  height: 24px;
  background-color: #409eff;
  clip-path: polygon(30% 0%, 70% 0%, 100% 30%, 100% 70%, 70% 100%, 30% 100%, 0% 70%, 0% 30%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
}

/* 动画 */
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0.4);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(64, 158, 255, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(64, 158, 255, 0);
  }
}

.amap-controls {
  position: absolute;
  right: 20px;
  top: 70px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 100;
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

/* 轨迹点信息 */
.point-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.point-info .info-item {
  display: flex;
  justify-content: space-between;
}

.point-info .label {
  font-weight: bold;
  color: #303133;
}

.point-info .value {
  color: #606266;
}

/* 轨迹查询面板 */
.track-search-panel {
  position: absolute;
  top: 80px;
  right: 20px;
  width: 350px;
  background-color: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  padding: 0;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}

.panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  background-color: #1976d2;
  color: white;
  border-radius: 4px 4px 0 0;
}

.panel-header h3 {
  font-size: 16px;
  font-weight: bold;
  margin: 0;
  color: white;
}

.panel-controls {
  display: flex;
  align-items: center;
}

.panel-controls .el-button {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 4px;
  padding: 4px 8px;
}

.panel-controls .el-button:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.3);
}

.panel-content {
  padding: 15px;
}

.search-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.vehicle-info {
  flex: 1;
  font-size: 13px;
  color: #303133;
  font-weight: 500;
}

.form-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-item label {
  width: 80px;
  font-size: 14px;
  color: #606266;
}

.form-actions {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

/* 轨迹回放控制 */
.playback-control {
  margin-top: 20px;
  padding: 20px 15px;
  border-top: 1px solid #e4e7ed;
}

.playback-control h4 {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 15px;
  color: #303133;
}

.control-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-bottom: 15px;
  flex-wrap: nowrap;
  justify-content: space-between;
  padding: 0 5px;
}

.playback-buttons {
  display: flex;
  align-items: center;
  gap: 5px;
}

.speed-settings {
  display: flex;
  align-items: center;
  gap: 5px;
}

.speed-settings .el-button {
  padding: 0 8px;
  font-size: 12px;
}

.progress-bar {
  margin-bottom: 15px;
  padding: 0 5px;
}

.track-info {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
  color: #606266;
  justify-content: flex-end;
  padding: 0 5px;
}

/* 轨迹概览 */
.overview-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.overview-item {
  display: flex;
  justify-content: space-between;
}

.overview-item .label {
  font-weight: bold;
  color: #303133;
}

.overview-item .value {
  color: #606266;
}

/* 轨迹数据标签页 */
.track-data-tabs {
  height: 300px;
  border-top: 1px solid #e4e7ed;
  margin-top: 20px;
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

/* 导出设置 */
.export-settings {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 10px;
}

.setting-item span {
  width: 100px;
  font-size: 14px;
  color: #606266;
}

/* 高亮表格行 */
.highlighted-row {
  background-color: #ecf5ff !important;
}

/* 响应式设计 */
@media screen and (max-height: 800px) {
  .track-data-tabs {
    height: 250px;
  }
}

@media screen and (max-height: 700px) {
  .track-data-tabs {
    height: 200px;
  }
}
</style>