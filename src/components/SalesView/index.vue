<template>
  <div class="sales-view">
    <el-card shadow="hover" :body-style="{ padding: '0 0 20px 0' }">
      <template v-slot:header>
        <div class="menu-wrapper">
          <el-menu :default-active="activeIndex" mode="horizontal" @select="onMenuSelect" class="sales-view-menu">
            <el-menu-item index="1">销售额</el-menu-item>
            <el-menu-item index="2">访问量</el-menu-item>
          </el-menu>
          <div class="menu-right">
            <el-radio-group v-model="radioSelect" size="small">
              <el-radio-button label="今日" />
              <el-radio-button label="本周" />
              <el-radio-button label="本月" />
              <el-radio-button label="今年" />
            </el-radio-group>
            <el-date-picker type="daterange" v-model="date" range-separator="至" start-placeholder="开始日期"
              end-placeholder="结束日期" size="small" unlink-panels :picker-options="pickerOptions"
              class="sales-view-date-picker">
            </el-date-picker>
          </div>
        </div>
      </template>
      <template>
        <div class="sales-view-chart-wrapper">
          <v-chart :options="chartOption" />
          <div class="sales-view-list">
            <div class="sales-view-title">排行榜</div>
            <div class="list-item-wrapper">
              <div class="list-item" v-for="item in rankData" :key="item.no">
                <!-- 索引前三，使用top-no样式 -->
                <div :class="['list-item-no', +item.no <= 3 ? 'top-no' : '']">{{ item.no }}</div>
                <div class="list-item-name">{{ item.name }}</div>
                <div class="list-item-money">{{ item.money }}</div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </el-card>
  </div>
</template>

<script>
import commonDataMixin from '../../mixins/commonDataMixin'

export default {
  mixins: [commonDataMixin],
  data() {
    return {
      activeIndex: '1',
      radioSelect: '今日',
      date: null,
      pickerOptions: {
        // 快捷选项（点击后会快速选择指定日期）
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            console.log(picker)
            const start = new Date()
            const end = new Date()
            // 当前时间-7天时间（3600s*24h*1000ms*7d）
            start.setTime(start.getTime() - 3600 * 24 * 1000 * 7)
            // 触发pick事件设置选择器的值（picker表示的是日期对象而不是vue的实例）
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 24 * 1000 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const start = new Date()
            const end = new Date()
            start.setTime(start.getTime() - 3600 * 24 * 1000 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      chartOption: {}
    }
  },
  computed: {
    // 根据当前索引切换对应的数据【右侧的排行榜】
    rankData() {
      return this.activeIndex === '1' ? this.orderRank : this.userRank
    }
  },
  watch: {
    // 年度销售额【来到该页面默认渲染销售额数据】
    orderFullYear() {
      this.render(this.orderFullYear, this.orderFullYearAxis, '年度销售额')
    }
  },
  methods: {
    // 获取当前点击的Menu索引，渲染对应的图标数据
    onMenuSelect(index) {
      this.activeIndex = index
      if (index === '1') {
        this.render(this.orderFullYear, this.orderFullYearAxis, '年度销售额')
      } else {
        this.render(this.userFullYear, this.userFullYearAxis, '年度用户访问量')
      }
    },
    // 配置当前图表数据
    render(data, axis, title) {
      this.chartOption = {
        title: {
          text: title,
          textStyle: {
            fontSize: 12,
            color: '#666'
          },
          left: 25,
          top: 20
        },
        xAxis: {
          type: 'category',
          data: axis, //
          axisTick: {
            // 刻度线和标签对齐
            alignWithLabel: true,
            lineStyle: {
              color: '#999'
            }
          },
          axisLine: {
            lineStyle: {
              color: '#999'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#eee'
            }
          }
        },
        series: [{
          type: 'bar',
          barWidth: '35%',
          data //
        }],
        color: ['#3398DB'],
        grid: {
          top: 70,
          left: 60,
          right: 60,
          bottom: 50
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.sales-view {
  margin-top: 20px;

  // header 部分
  .menu-wrapper {
    position: relative;
    display: flex;

    .sales-view-menu {
      // 宽度100%，它的下划线也会100%
      width: 100%;
      padding-left: 20px;

      .el-menu-item {
        height: 50px;
        line-height: 50px;
        margin: 0 20px;
      }
    }

    .menu-right {
      // 子绝父相
      position: absolute;
      top: 0;
      right: 20px;
      height: 50px;
      // 开启 flex
      display: flex;
      align-items: center;
      justify-content: flex-end;

      .sales-view-date-picker {
        margin-left: 20px;
      }
    }
  }

  // body 部分
  .sales-view-chart-wrapper {
    display: flex;
    height: 270px;

    // 左侧图表
    .echarts {
      // 占父弹性盒容器主轴尺寸 70% 宽度
      flex: 0 0 70%;
      width: 70%;
      height: 100%;
    }

    // 右侧列表
    .sales-view-list {
      // flex-grow 1 占满剩余宽度
      flex: 1;
      width: 100%;
      height: 100%;
      // 超出部分不展示
      overflow: hidden;

      // 列表标题
      .sales-view-title {
        margin-top: 20px;
        font-size: 12px;
        color: #666;
        font-weight: 500;
      }

      // 列表内容
      .list-item-wrapper {
        margin-top: 15px;

        // 每一列
        .list-item {
          display: flex;
          align-items: center;
          font-size: 12px;
          height: 20px;
          padding: 6px 20px 6px 0;

          .list-item-no {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            color: #333;

            // .list-item-no.top-no{}
            &.top-no {
              // 黑色的圆形
              background: #000;
              border-radius: 50%;
              color: #fff;
              font-weight: 500;
            }
          }

          .list-item-name {
            margin-left: 10px;
            color: #333;
          }

          .list-item-money {
            flex: 1;
            text-align: right;
          }
        }
      }
    }
  }
}
</style>
