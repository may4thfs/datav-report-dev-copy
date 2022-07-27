import request from '../utils/request'

const icode = '1003CAC5A3283EF3'

// 拿到 axios 实例，在该基础之上分别实现三个请求
// 报表词云数据
export function wordcloud() {
  return request({
    url: '/screen/wordcloud',
    method: 'get',
    params: { icode }
  })
}

// 报表地图散点数据
export function mapScatter() {
  return request({
    url: '/screen/map/scatter',
    method: 'get',
    params: { icode }
  })
}

// 报表/大屏数据
export function screenData() {
  return request({
    url: '/screen/data',
    method: 'get',
    params: { icode }
  })
}
