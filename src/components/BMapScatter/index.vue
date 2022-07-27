<template>
  <ve-bmap
    :settings="chartSettings"
    :title="title"
    :tooltip="{}"
    :series="chartSeries"
    height="100%"
  ></ve-bmap>
</template>

<script>
  import commonDataMixin from '../../mixins/commonDataMixin'

  // 将 data&geo 转换成我们需要的数据
  const convertData = function (data, geo) {
    const res = []
    // 遍历data
    data.forEach(item => {
      const { name, value } = item
      // 通过name拿到坐标系
      const coord = geo[name]
      res.push({
        name,
        value: [...coord, value]
      })
    })
    return res
  }

  /* eslint-disable */
  export default {
    mixins: [commonDataMixin],
    data() {
      return {
        // 配置 ECharts 的title
        title: {
          text: '外卖销售数据大盘',
          subtext: '销售趋势统计',
          sublink: 'https://www.baidu.com',
          left: 'center'
        },
        chartSettings: {
          key: 'G1LFyjrNGIkns5OfpZnrCGAKxpycPLwb',
          bmap: {
            center: [104.114129, 37.550339], // 地图中心
            zoom: 5,
            roam: false,
            mapStyle: {
              styleJson: [{
                'featureType': 'water',
                'elementType': 'all',
                'stylers': {
                  'color': '#d1d1d1'
                }
              }, {
                'featureType': 'land',
                'elementType': 'all',
                'stylers': {
                  'color': '#f3f3f3'
                }
              }, {
                'featureType': 'railway',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'highway',
                'elementType': 'all',
                'stylers': {
                  'color': '#fdfdfd'
                }
              }, {
                'featureType': 'highway',
                'elementType': 'labels',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'arterial',
                'elementType': 'geometry',
                'stylers': {
                  'color': '#fefefe'
                }
              }, {
                'featureType': 'arterial',
                'elementType': 'geometry.fill',
                'stylers': {
                  'color': '#fefefe'
                }
              }, {
                'featureType': 'poi',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'green',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'subway',
                'elementType': 'all',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'manmade',
                'elementType': 'all',
                'stylers': {
                  'color': '#d1d1d1'
                }
              }, {
                'featureType': 'local',
                'elementType': 'all',
                'stylers': {
                  'color': '#d1d1d1'
                }
              }, {
                'featureType': 'arterial',
                'elementType': 'labels',
                'stylers': {
                  'visibility': 'off'
                }
              }, {
                'featureType': 'boundary',
                'elementType': 'all',
                'stylers': {
                  'color': '#fefefe'
                }
              }, {
                'featureType': 'building',
                'elementType': 'all',
                'stylers': {
                  'color': '#d1d1d1'
                }
              }, {
                'featureType': 'label',
                'elementType': 'labels.text.fill',
                'stylers': {
                  'color': '#999999'
                }
              }]
            }
          }
        },
        chartSeries: []
      }
    },

    watch: {
      mapData() {
        // 拿到指定数据
        const { data, geo } = this.mapData
        this.chartSeries = [{
          // 散点图绘制到百度地图指定位置
          name: '销售额',
          type: 'scatter', // 散点图
          coordinateSystem: 'bmap',
          data: convertData(data, geo),
          encode: {
            value: 2 // 指定为data中的索引2元素
          },
          itemStyle: {
            color: 'purple'
          },
          symbolSize: function (val) {
            return val[2] / 10 // 根据data中第三个数据大小确定标记大小
          },
          label: { // 文本标签，可用于说明图形的一些数据信息
            show: false,
            position: 'right',
            formatter: function (val) {
              return `${val.data.name} - ${val.data.value[2]}`
            }
          },
          emphasis: { // 高亮的图形和标签样式。
            label: {
              show: true // 显示标签
            }
          }
        }, {
          name: 'Top 10',
          type: 'effectScatter', // 涟漪特效动画的散点（气泡）图
          coordinateSystem: 'bmap',
          // 因为只需要取前10的数据，利用sort和slice
          data: convertData(data.sort(function (a, b) {
            return b.value - a.value
          }), geo).slice(0, 10),
          symbolSize: function (val) {
            return val[2] / 10 // 根据data中第三个数据大小确定标记大小
          },
          encode: {
            value: 2 // 指定为data中的索引2元素
          },
          itemStyle: {
            color: 'purple',
            shadowBlur: 10,
            shadowColor: '#333'
          },
          label: { // 文本标签，可用于说明图形的一些数据信息
            show: true,
            position: 'right',
            formatter: function (val) {
              return `${val.data.name} - ${val.data.value[2]}`
            }
          },
          hoverAnimation: true,
          rippleEffect: {
            brushType: 'stroke'
          }
        }]
      }
    }
  }
</script>
