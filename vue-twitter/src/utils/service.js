import request from './request'
import store from '@/store'
import router from '@/router'

const service = (options) => {
  return new Promise((resolve, reject) => {
    const now = parseInt(new Date().getTime() / 1000, 10)
    let token
    const tokens = store.getters.userTokens
    if (tokens) {
      if (tokens.access.expires <= now) {
        if (tokens.refresh.expires <= now) {
          store.dispatch('setUserTokens', '')
          return router.push({
            path: '/login',
          })
        } else {
          token = tokens.refresh.token
          request({
            method: 'post',
            url: '/api/auth/refresh-tokens',
            data: {
              refreshToken: token,
            },
          })
            .then((res) => {
              store.dispatch('setUserTokens', res)
              console.log(res)
              token = res.access.token
              options.headers = {
                Authorization: 'bearer ' + token,
              }
              request(options)
                .then((response) => {
                  resolve(response)
                })
                .catch((error) => {
                  reject(error)
                })
            })
            .catch((err) => {
              reject(err)
            })
        }
      } else {
        token = tokens.access.token
        options.headers = {
          Authorization: 'bearer ' + token,
        }
        request(options)
          .then((response) => {
            resolve(response)
          })
          .catch((error) => {
            reject(error)
          })
      }
    } else {
      return router.push({
        path: '/login',
      })
    }
  })
}

export default service
