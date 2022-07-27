<template>
  <ve-liquidfill :data="chartData" height="100%" :settings="chartSettings" />
</template>

<script>
  import commonDataMixin from '../../mixins/commonDataMixin'
  function getColor(value) {
    // 不同区间数值显示不同颜色
    return value > 0 && value <= 0.5 ? 'rgba(97,216,0,.7)'
      : value > 0.5 && value <= 0.8 ? 'rgba(204,178,26,.7)'
        : value > 0.8 ? 'rgba(241,47,28,.7)' : '#c7c7cb'
  }

  export default {
    mixins: [commonDataMixin],
    watch: {
      userGrowthLastMonth() {
        // 定义表格的数据
        this.chartData = {
          columns: ['title', 'percent'],
          rows: [{
            title: '用户月同比增长',
            percent: this.userGrowthLastMonth / 100
          }]
        }
        this.chartSettings = {
          seriesMap: {
            用户月同比增长: {
              radius: '80%', // 单个水球图的半径
              label: { // 图形上的文本标签
                formatter: (v) => {
                  return `${(v.data.value * 100).toFixed(2)}%`
                },
                textStyle: {
                  fontSize: 36,
                  color: '#999',
                  fontWeight: 'normal'
                },
                position: ['50%', '50%'],
                insideColor: '#fff' // 波浪淹过部分的文字颜色（默认白色
              },
              outline: { // 水球图的外边框设置
                itemStyle: {
                  borderColor: '#aaa4a4',
                  borderWidth: 1,
                  color: 'none',
                  shadowBlur: 0,
                  shadowColor: '#fff'
                },
                borderDistance: 0
              },
              backgroundStyle: {
                color: '#fff'
              },
              itemStyle: { // 水球图样式
                shadowBlur: 0,
                shadowColor: '#fff'
              },
              amplitude: 8, // 水波的起伏程度(数值越大，起伏程度越大)
              // data中第一个数据对应color中第一个颜色，以此类推。
              color: [getColor(this.chartData.rows[0].percent)]
            }
          }
        }
      }
    },
    data() {
      return {
        chartData: {},
        chartSettings: {}
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>
