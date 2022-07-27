<template>
  <div class="bottom-view">
    <!-- 关键词搜索 -->
    <div class="view">
      <el-card shadow="hover">
        <template v-slot:header>
          <div class="title-wrapper">关键词搜索</div>
        </template>
        <template>
          <div class="chart-wrapper">
            <div class="chart-inner">
              <div class="chart">
                <div class="chart-title">搜索用户数</div>
                <div class="chart-data">{{userCount | format}}</div>
                <v-chart :options="searchUserOption" />
              </div>
              <div class="chart">
                <div class="chart-title">搜索量</div>
                <div class="chart-data">{{searchCount | format}}</div>
                <v-chart :options="searchNumberOption" />
              </div>
            </div>
            <div class="table-wrapper">
              <el-table :data="tableData">
                <el-table-column prop="rank" label="排名" />
                <el-table-column prop="keyword" label="关键词" />
                <el-table-column prop="count" label="总搜索量" />
                <el-table-column prop="users" label="搜索用户数" />
                <el-table-column prop="range" label="搜索占比" />
              </el-table>
              <!-- 分页（根据total和page-size自动计算总页数） -->
              <el-pagination
                layout="prev, pager, next"
                :total="total"
                :page-size="pageSize"
                background
                @current-change="onPageChange" />
            </div>
          </div>
        </template>
      </el-card>
    </div>
    <!-- 分类销售排行 -->
    <div class="view">
      <el-card shadow="hover">
        <template v-slot:header>
          <div class="title-wrapper">
            <div class="title">分类销售排行</div>
            <div class="radio-wrapper">
              <el-radio-group v-model="radioSelect" size="small" @change="onCategoryChange">
                <el-radio-button label="品类"></el-radio-button>
                <el-radio-button label="商品"></el-radio-button>
              </el-radio-group>
            </div>
          </div>
        </template>
        <template>
          <div class="chart-wrapper">
            <v-chart :options="categoryOptions" />
          </div>
        </template>
      </el-card>
    </div>
  </div>
</template>

<script>
  import commonDataMixin from '../../mixins/commonDataMixin'

  // 每块饼图需要的color
  const colors = ['#8d7fec', '#5085f2', '#f8726b', '#e7e702', '#78f283', '#4bc1fc']

  // 本组件的数据主要通过 wordCloud 接口
  export default {
    mixins: [commonDataMixin],
    data() {
      return {
        searchUserOption: {},
        searchNumberOption: {},
        tableData: [],
        totalData: [], // table 所需要的数据
        total: 0, // total表示总条目数 - el-Pagination
        pageSize: 4, // 每页显示个数 - el-Pagination
        userCount: 0,
        searchCount: 0,
        radioSelect: '品类', // 默认选中'品类' 选中意味着变量的值为相应 Radio label属性的值
        categoryOptions: {}
      }
    },

    methods: {
      // 当 radio 的change事件触发时
      onCategoryChange(type) {
        // 更改当前 radioSelect，渲染对应的数据
        this.radioSelect = type
        this.renderPieChart()
      },

      // 当前页变动时候触发时调用 - el-Pagination
      onPageChange(page) {
        // 将当前页数传入，获取该页数据
        this.renderTable(page)
      },

      renderPieChart() {
        // 如果没拿到图表的数据，就return
        if (!this.category1.data1 || !this.category2.data1) {
          return
        }

        let data
        let axis
        let total = 0

        // 选中 品类/商品 时，分别传入不同数据
        // （这里将数据控制在6个）
        if (this.radioSelect === '品类') {
          data = this.category1.data1.slice(0, 6)
          axis = this.category1.axisX.slice(0, 6)
          total = data.reduce((s, i) => s + i, 0)
        } else {
          data = this.category2.data1.slice(0, 6)
          axis = this.category2.axisX.slice(0, 6)
          total = data.reduce((s, i) => s + i, 0)
        }

        // 定制图表需要的数据结构，遍历到新数组
        const chartData = []
        data.forEach((item, index) => {
          const percent = `${(item / total * 100).toFixed(2)}%`
          chartData.push({
            legendname: axis[index],
            value: item,
            percent,
            itemStyle: {
              color: colors[index]
            },
            name: `${axis[index]} | ${percent}`
          })
        })

        this.categoryOptions = {
          // 标题组件
          title: [{
            text: `${this.radioSelect}分布`,
            textStyle: {
              fontSize: 14,
              color: '#666'
            },
            // title 组件离容器左侧的距离
            left: 20,
            top: 20
          }, {
            // 主标题文本 和 副标题文本
            text: '累计订单量',
            subtext: total,
            // 将标题位置调整到饼图中间
            x: '34.5%',
            y: '42.5%',
            textStyle: {
              fontSize: 14,
              color: '#999'
            },
            subtextStyle: {
              fontSize: 28,
              color: '#333'
            },
            // 整体（包括 text 和 subtext）的水平对齐
            textAlign: 'center'
          }
          ],
          // 系列
          series: [{
            name: '品类分布',
            type: 'pie',
            data: chartData, //
            label: {
              show: true,
              position: 'outter', // 标签的位置
              formatter: function (params) {
                // 拿到legendname作为标签名
                return params.data.legendname
              }
            },
            // 圆心位置
            center: ['35%', '50%'],
            // [内半径, 外半径]控制内半径的大小形成圆环图
            radius: ['45%', '60%'],
            // 标签引导线(由两个线段构成)
            labelLine: {
              length: 5,
              length2: 3,
              smooth: true
            },
            // 饼图的扇区是否是顺时针排布
            clockwise: false,
            itemStyle: {
              borderWidth: 4, // 描边线宽
              borderColor: '#fff' // 白色
            }
          }],
          // 图例组件
          // (若是饼图，会取series.data中的name作为图例的数据)
          legend: {
            type: 'scroll',
            orient: 'vertical',
            height: 250,
            left: '70%', // 离容器左侧的距离。
            top: 'middle',
            textStyle: {
              color: '#8c8c8c'
            }
          },
          // 提示框组件
          tooltip: {
            // 鼠标移动到 item 上触发
            trigger: 'item',
            // 定制触发后展示的内容
            formatter: function (params) {
              // （marker 是定制的小圆点（它与饼图item颜色相同））
              const str = params.seriesName + '<br />' +
                params.marker + params.data.legendname + '<br />' +
                '数量：' + params.data.value + '<br />' +
                '占比：' + params.data.percent + '%'
              return str
            }
          }
        }
      },

      // 每一页对应的数据
      renderTable(page) {
        // 通过 slice 截断各页需要的数据
        this.tableData = this.totalData.slice(
          (page - 1) * this.pageSize,
          (page - 1) * this.pageSize + this.pageSize
        )
      },

      // 渲染图表
      renderLineChart() {
        // 因为一共两个图表，而且他们配置是一样的，除了data数据不同。
        // 这里封装公共的配置
        const createOption = (key) => {
          const data = []
          const axis = []
          this.wordCloud.forEach(item => data.push(item[key]))
          this.wordCloud.forEach(item => axis.push(item.word))
          return {
            xAxis: {
              type: 'category',
              boundaryGap: false,
              data: axis
            },
            yAxis: {
              show: false
            },
            tooltip: {},
            series: [{
              type: 'line',
              data,
              areaStyle: {
                color: 'rgba(95,187,255,.5)'
              },
              lineStyle: {
                color: 'rgb(95,187,255)'
              },
              itemStyle: {
                opacity: 0
              },
              smooth: true
            }],
            grid: {
              top: 0,
              left: 0,
              bottom: 0,
              right: 0
            }
          }
        }
        // 创建用户图表
        this.searchUserOption = createOption('user')
        // 创建搜索量图表
        this.searchNumberOption = createOption('count')
      }
    },

    mounted() {
      this.renderPieChart()
    },

    watch: {
      // 监听 wordCloud 变化，更新所有数据
      wordCloud() {
        const totalData = []
        // 遍历 wordCloud，将item加上其他数据映射到新的数据结构，同时push到totoData
        this.wordCloud.forEach((item, index) => {
          totalData.push({
            id: index + 1,
            rank: index + 1,
            keyword: item.word,
            count: item.count,
            users: item.user,
            // toFixed 把 Number 四舍五入为指定小数位数的数字，返回值String
            range: `${((item.user / item.count) * 100).toFixed(2)}%`
          })
        })
        this.totalData = totalData

        this.total = this.totalData.length // 设置el-分页的总数量
        this.renderTable(1) // 默认渲染第一页数据

        // reduce 累加搜索用户 / 搜索量
        this.userCount = totalData.reduce((s, i) => i.users + s, 0)
        this.searchCount = totalData.reduce((s, i) => i.count + s, 0)

        this.renderLineChart()
      },

      // 监听 category1，更新饼图
      category1() {
        this.renderPieChart()
      }
    }
  }
</script>

<style lang="scss" scoped>
.bottom-view {
  display: flex;
  margin-top: 20px;

  .view {
    flex: 1;
    width: 50%; // BottomView的 50%
    box-sizing: border-box;

    // （因为有两个view，所以通过该伪类指定）
    // 兄弟元素中的第一个元素 - 即第一个 view
    &:first-child {
      padding: 0 10px 0 0; // 距离右边 10
    }

    // 兄弟元素中的最后一个元素
    &:last-child {
      padding: 0 0 0 10px; // 距离左边 10
    }

    .title-wrapper {
      display: flex;
      align-items: center;
      height: 60px;
      box-sizing: border-box;
      border-bottom: 1px solid #eee;
      font-size: 14px;
      font-weight: 500;
      padding: 0 0 0 20px;

      .radio-wrapper {
        // 占满剩余空间
        flex: 1;
        display: flex;
        justify-content: flex-end;
        padding-right: 20px;
      }
    }

    .chart-wrapper {
      display: flex;
      flex-direction: column;
      height: 452px; // 固定高度

      .chart-inner {
        display: flex;
        padding: 0 10px; // 左右 10
        margin-top: 20px;

        .chart {
          flex: 1;
          padding: 0 10px;

          .chart-title {
            color: #999;
            font-size: 14px;
          }

          .chart-data {
            font-size: 22px;
            color: #333;
            font-weight: 500;
            letter-spacing: 2px;
          }

          .echarts {
            height: 50px;
          }
        }
      }

      .table-wrapper {
        flex: 1;
        margin-top: 20px;
        padding: 0 20px 20px;

        .el-pagination {
          display: flex;
          justify-content: flex-end;
          margin-top: 15px;
        }
      }
    }
  }
}
</style>
