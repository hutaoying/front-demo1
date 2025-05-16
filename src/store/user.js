import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {
      username: '',
      avatar: ''
    },
    token: localStorage.getItem('access_token') || '',
    refreshToken: localStorage.getItem('refresh_token') || ''
  }),
  
  actions: {
    setUserInfo(info) {
      this.userInfo = info
    },
    
    setToken(token) {
      this.token = token
      localStorage.setItem('access_token', token)
    },
    
    setRefreshToken(token) {
      this.refreshToken = token
      localStorage.setItem('refresh_token', token)
    },
    
    clearUserInfo() {
      this.userInfo = {
        username: '',
        avatar: ''
      }
      this.token = ''
      this.refreshToken = ''
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
    }
  }
})