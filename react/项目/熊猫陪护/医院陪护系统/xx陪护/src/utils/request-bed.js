import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  //baseURL: 'http://localhost:8080', // url = base url + request url
  // baseURL: 'https://www.gaofuture.com:8443',
  // baseURL: 'http://47.111.77.137:8080',
  baseURL: process.env.VUE_APP_BED_API,
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['X-Token'] = getToken()
    }
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

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // 4011: Session超时
    if (res.code === '4011') {
      MessageBox.confirm('You have already logged out, you can stay at this page or login again', 'Ready for login', {
        confirmButtonText: 'Login',
        cancelButtonText: 'Cancel',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return
    }

    // 4012: 未登录
    if (res.code === '4012') {
      MessageBox.confirm('Please Login First', 'Redirect To Login Page', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return
    }
    if(res.code === '10000001'){
      MessageBox.confirm('Please Login TimeOut', 'Redirect To Login Page', {
        confirmButtonText: 'YES',
        cancelButtonText: 'NO',
        type: 'warning'
      }).then(() => {
        store.dispatch('user/logout').then(() => {
          location.reload() // 为了重新实例化vue-router对象 避免bug
        })
      })
      return
    }
    
    if (res.code !== '00000000') {
      if (res.code === '500') {
        res.msg = '服务异常，请联系管理员'
      }

      if (res.code === '400') {
        res.msg = res.message
      }

      if (res.code === '11111111') {
        if(res.msg){
          res.msg = res.message
        }else{
          res.msg = res.result
        }
      }

      Message({
        message: res.msg,
        type: 'error',
        duration: 8 * 1000
      })

      
      return Promise.reject(res.message || 'error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
