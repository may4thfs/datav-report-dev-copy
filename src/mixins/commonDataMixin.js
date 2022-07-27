// 千分号处理
function format(v) {
  const reg = /\d{1,3}(?=(\d{3})+$)/g
  return `${v}`.replace(reg, '$&,')
}

function wrapperObject(o, k) {
  // o有值，且k有一个点
  if (o && k.indexOf('.') >= 0) {
    // 把key根据点分开，返回数组
    const keys = k.split('.')
    // 将key迭代调用，会变成0.k.k
    keys.forEach(key => {
      o = o[key]
    })
    return o
  } else {
    return o && o[k] ? o[k] : {}
  }
}

// wrapperXXX 对数据统一处理
function wrapperArray(o, k) {
  // 0和o[k]都存在的时候，返回o[k]，否则为[]
  return o && o[k] ? o[k] : []
}

function wrapperMoney(o, k) {
  return o && o[k] ? `¥ ${format(o[k])}` : '¥ 0.00'
}

function wrapperOriginalNumber(o, k) {
  return o && o[k] ? o[k] : 0
}

function wrapperNumber(o, k) {
  return o && o[k] ? format(o[k]) : 0
}

function wrapperPercentage(o, k) {
  return o && o[k] ? `${o[k]}%` : '0%'
}

export default {
  computed: {
    reportData() {
      return this.getReportData()
    },

    // 1-1 累计销售额卡片 ToalSales:
    salesToday() {
      return wrapperMoney(this.reportData, 'salesToday')
    },
    salesGrowthLastDay() {
      return wrapperPercentage(this.reportData, 'salesGrowthLastDay')
    },
    salesGrowthLastMonth() {
      return wrapperPercentage(this.reportData, 'salesGrowthLastMonth')
    },
    salesLastDay() {
      return wrapperMoney(this.reportData, 'salesLastDay')
    },

    // 1-2 今日订单卡片 TotalOrders：
    orderToday() {
      return wrapperNumber(this.reportData, 'orderToday')
    },
    orderLastDay() {
      return wrapperNumber(this.reportData, 'orderLastDay')
    },
    orderTrend() { // Echart data
      return wrapperArray(this.reportData, 'orderTrend')
    },

    // 1-3 今日交易用户 TodayUsers：
    orderUser() {
      return wrapperNumber(this.reportData, 'orderUser')
    },
    returnRate() {
      return wrapperPercentage(this.reportData, 'returnRate')
    },
    orderUserTrend() { // EChart data
      return wrapperArray(this.reportData, 'orderUserTrend')
    },
    orderUserTrendAxis() { // EChart data
      return wrapperArray(this.reportData, 'orderUserTrendAxis')
    },

    // 1-4 累计用户 TotalUsers：
    userToday() {
      return wrapperNumber(this.reportData, 'userToday')
    },
    userTodayNumber() { // ECharts data
      return wrapperOriginalNumber(this.reportData, 'userToday')
    },
    userLastMonth() { // ECharts data
      return wrapperOriginalNumber(this.reportData, 'userLastMonth')
    },
    userGrowthLastDay() {
      return wrapperNumber(this.reportData, 'userGrowthLastDay')
    },
    userGrowthLastMonth() { // 它同时也为【水球图】所用
      return wrapperNumber(this.reportData, 'userGrowthLastMonth')
    },

    // 2-1 销售额
    orderFullYear() {
      return wrapperArray(this.reportData, 'orderFullYear')
    },
    orderFullYearAxis() {
      return wrapperArray(this.reportData, 'orderFullYearAxis')
    },
    orderRank() { // 右侧排行榜
      return wrapperArray(this.reportData, 'orderRank')
    },

    // 2-2 用户访问量
    userFullYear() {
      return wrapperArray(this.reportData, 'userFullYear')
    },
    userFullYearAxis() {
      return wrapperArray(this.reportData, 'userFullYearAxis')
    },
    userRank() { // 右侧排行榜
      return wrapperArray(this.reportData, 'userRank')
    },

    // 3-1 关键词搜索 BottomView
    wordCloud() {
      // wordCloud 是一个数组，单个元素为{count,user,word}格式的对象，对应【关键词搜索】的其中三列数据
      return this.getWordCloud()
    },

    // 3-2 分类销售排行
    category1() {
      return wrapperObject(this.reportData, 'category.data1')
    },
    category2() {
      return wrapperObject(this.reportData, 'category.data2')
    },

    // 4 地图数据
    mapData() {
      return this.getMapData()
    }
  },
  // vue2 的过滤器
  filters: {
    format(v) {
      return format(v)
    }
  },
  inject: ['getReportData', 'getWordCloud', 'getMapData']
}
