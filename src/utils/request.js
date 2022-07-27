import axios from 'axios'

// 创建 axios 实例
const service = axios.create({
  baseURL: 'https://apis.imooc.com',
  timeout: 5000
})

// 响应拦截器
// ues(成功时的处理，异常时的处理)
service.interceptors.response.use(
  response => {
    // 当满足状态200 且data有值的时候，返回数据
    if (response.status === 200 && response.data) {
      console.log(response.data)
      return response.data
    } else {
      return Promise.reject(new Error('请求失败'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
