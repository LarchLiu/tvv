import axios from 'axios'
import { message } from 'ant-design-vue'
// import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_GLOB_API_URL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    return config
  },
  error => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */
  // response => response.data,
  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    if (!(res.err === null || res.err === undefined)) {
      const msg = ((res.err.message) ? res.err.message : res.err.code)
      message.error({
        content: msg || 'Error',
        duration: 5
      })
      return Promise.reject(res.err || 'Error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    if (error.response) {
      const data = error.response.data
      if (data.err) {
        error.message = ((data.err.message) ? data.err.message : data.err.code)
        console.log('error message ' + error.message)
      }
      if (error.response.status === 401) {
        if (error.message === 'ER_AUTH_USER_OR_PWD_ERR') {
          error.message = '用户名或密码错误！'
        } else if (error.message === 'jwt expired') {
          error.message = '认证过期，请重新登录！'
        } else {
          error.message = '权限认证有误，请重新登录！'
        }
      } else {
        if (error.message === 'ER_API_PATH_NOT_MATCH') {
          error.message = 'API路径有误，请确认！'
        }
      }
    }
    message.error({
      content: error.message,
      duration: 5
    })
    return Promise.reject(error)
  }
)

export default service
