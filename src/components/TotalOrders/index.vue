<template>
  <common-card title="累计订单量" :value="orderToday">
    <template>
      <v-chart :options="getOptions()" />
    </template>
    <template v-slot:footer>
      <span>昨日订单量 </span>
      <span class="emphasis">{{orderLastDay}}</span>
    </template>
  </common-card>
</template>

<script>
import commonCardMixin from '../../mixins/commonCardMixin'
import commonDataMixin from '../../mixins/commonDataMixin'

export default {
  mixins: [commonCardMixin, commonDataMixin],
  methods: {
    getOptions() {
      // 当获取到图表的数据时，才初始化图表
      return this.orderTrend.length > 0 ? {
        xAxis: {
          type: 'category',
          show: false,
          // 默认为true，即在x轴距离两端有间距。所以这里设置false
          boundaryGap: false
        },
        yAxis: {
          // 隐藏y轴
          show: false
        },
        series: [{
          type: 'line',
          data: this.orderTrend,
          // 设置折线图的填充区域样式
          areaStyle: {
            color: 'purple'
          },
          // 平滑曲线图
          smooth: true,
          // 将线条和坐标点都隐去
          lineStyle: {
            width: 0
          },
          itemStyle: {
            opacity: 0
          }
        }],
        // 布局
        grid: {
          top: 0,
          bottom: 0,
          left: 0,
          right: 0
        }
      } : null
    }
  }
}
</script>
