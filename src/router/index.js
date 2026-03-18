import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
    meta: { title: '首页大屏' }
  },
  {
    path: '/vehicle-location',
    name: 'VehicleLocation',
    component: () => import('../views/VehicleLocation.vue'),
    meta: { title: '车辆定位' }
  },
  {
    path: '/track-playback',
    name: 'TrackPlayback',
    component: () => import('../views/TrackPlayback.vue'),
    meta: { title: '轨迹回放' }
  },
  {
    path: '/live-video',
    name: 'LiveVideo',
    component: () => import('../views/LiveVideo.vue'),
    meta: { title: '实时视频' }
  },
  {
    path: '/video-playback',
    name: 'VideoPlayback',
    component: () => import('../views/VideoPlayback.vue'),
    meta: { title: '视频回放' }
  },
  {
    path: '/config/alarm',
    name: 'AlarmConfig',
    component: () => import('../views/Config/AlarmConfig.vue'),
    meta: { title: '报警设置' }
  },
  {
    path: '/config/alarm/general',
    name: 'GeneralAlarmConfig',
    component: () => import('../views/Config/GeneralAlarmConfig.vue'),
    meta: { title: '常规报警设置' }
  },
  {
    path: '/config/alarm/area',
    name: 'AreaAlarmConfig',
    component: () => import('../views/Config/AreaAlarmConfig.vue'),
    meta: { title: '区域报警设置' }
  },
  {
    path: '/operation/vehicle',
    name: 'VehicleManagement',
    component: () => import('../views/Operation/VehicleManagement.vue'),
    meta: { title: '车辆管理' }
  },
  {
    path: '/operation/driver',
    name: 'DriverManagement',
    component: () => import('../views/Operation/DriverManagement.vue'),
    meta: { title: '驾驶员管理' }
  },
  {
    path: '/operation/terminal',
    name: 'TerminalManagement',
    component: () => import('../views/Operation/TerminalManagement.vue'),
    meta: { title: '终端管理' }
  },
  {
    path: '/operation/terminal-config',
    name: 'TerminalConfig',
    component: () => import('../views/Operation/TerminalConfig.vue'),
    meta: { title: '终端配置' }
  },
  {
    path: '/report/alarm',
    name: 'AlarmReport',
    component: () => import('../views/Report/AlarmReport.vue'),
    meta: { title: '报警统计' }
  },
  {
    path: '/report/alarm/summary',
    name: 'AlarmSummary',
    component: () => import('../views/Report/AlarmSummary.vue'),
    meta: { title: '报警统计汇总' }
  },
  {
    path: '/report/alarm/detail',
    name: 'AlarmDetail',
    component: () => import('../views/Report/AlarmDetail.vue'),
    meta: { title: '报警统计明细' }
  },
  {
    path: '/report/alarm/processing',
    name: 'AlarmProcessing',
    component: () => import('../views/Report/AlarmProcessing.vue'),
    meta: { title: '报警处理统计' }
  },
  {
    path: '/report/driving',
    name: 'DrivingReport',
    component: () => import('../views/Report/DrivingReport.vue'),
    meta: { title: '行驶数据' }
  },
  {
    path: '/report/driving/daily',
    name: 'DailyMileage',
    component: () => import('../views/Report/DailyMileage.vue'),
    meta: { title: '里程报表（日）' }
  },
  {
    path: '/report/driving/weekly',
    name: 'WeeklyMileage',
    component: () => import('../views/Report/WeeklyMileage.vue'),
    meta: { title: '里程报表（周）' }
  },
  {
    path: '/report/driving/monthly',
    name: 'MonthlyMileage',
    component: () => import('../views/Report/MonthlyMileage.vue'),
    meta: { title: '里程报表（月）' }
  },
  {
    path: '/report/driving/date',
    name: 'DateMileage',
    component: () => import('../views/Report/DateMileage.vue'),
    meta: { title: '里程报表（日期）' }
  },
  {
    path: '/system/user',
    name: 'UserManagement',
    component: () => import('../views/System/UserManagement.vue'),
    meta: { title: '用户管理' }
  },
  {
    path: '/system/role',
    name: 'RoleManagement',
    component: () => import('../views/System/RoleManagement.vue'),
    meta: { title: '角色管理' }
  },
  {
    path: '/system/log',
    name: 'LogManagement',
    component: () => import('../views/System/LogManagement.vue'),
    meta: { title: '日志管理' }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || '旭利视控平台'
  next()
})

export default router