import axios from 'axios'
import { message } from 'ant-design-vue'
import router from '@/router'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_GLOB_API_URL, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 30000, // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    // do something before request is sent

    return config
  },
  (error) => {
    // do something with request error
    console.log(error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  (response) => {
    return response.data
  },
  (error) => {
    console.log('err' + error) // for debug
    let msg = ''
    if (error.response) {
      const response = error.response.data
      if (response.code && response.message) {
        msg += response.code + ': ' + response.message
      } else {
        msg = error.message
      }

      message.error({
        content: msg,
        duration: 5,
      })
      if (error.response.status === 401) {
        router.push({
          path: '/login',
        })
      }
    }
    return Promise.reject(error)
  }
)

export default service
