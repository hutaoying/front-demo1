<template>
  <div class="layout-container">
    <header class="header">
      <div class="logo">
        <img src="../assets/angry_face_with_horns_color.svg" alt="Logo" class="logo-img">
        <span class="logo-text">不语大师</span>
      </div>
      <nav class="nav">
        <!-- 工作台菜单 -->
        <router-link to="/home" class="nav-item">
          <el-icon><Monitor /></el-icon>
          工作台
        </router-link>
        
        <!-- 动态菜单 -->
        <div v-for="menu in menus" :key="menu.code" class="nav-item">
          <span class="menu-title">
            <el-icon><component :is="menu.icon.replace('el-icon-', '')" /></el-icon>
            {{ menu.name }}
          </span>
          <div class="dropdown-menu" v-if="menu.children && menu.children.length">
            <router-link 
              v-for="child in menu.children" 
              :key="child.code"
              :to="child.path"
              class="dropdown-item"
            >
              <el-icon><component :is="child.icon.replace('el-icon-', '')" /></el-icon>
              {{ child.name }}
            </router-link>
          </div>
        </div>
      </nav>
      <div class="user-info">
        <span class="username">{{ userInfo.username }}</span>
        <img :src="userInfo.avatar" alt="Avatar" class="avatar">
      </div>
    </header>
    <main class="main-content">
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Monitor, Document, Check, Service, Timer, Money } from '@element-plus/icons-vue'

const router = useRouter()
const menus = ref([])
const userInfo = ref({
  username: '',
  avatar: ''
})

// 图标映射函数
const getIconComponent = (iconName) => {
  const iconMap = {
    'el-icon-monitor': 'Monitor',
    'el-icon-document': 'Document',
    'el-icon-check': 'Check',
    'el-icon-service': 'Service',
    'el-icon-time': 'Timer',
    'el-icon-money': 'Money'
  }
  return iconMap[iconName] || 'Monitor'
}

const fetchMenus = async () => {
  try {
    const response = await fetch('http://10.11.36.141:8080/api/menu/list', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    if (data.code === 200) {
      menus.value = data.data
      console.log('设置后的菜单数据:', menus.value)
    }
  } catch (error) {
    console.error('获取菜单列表失败:', error)
  }
}

onMounted(() => {
  fetchMenus()
  // 修改获取用户信息的逻辑
  const storedUserInfo = localStorage.getItem('user_info')
  if (storedUserInfo) {
    userInfo.value = JSON.parse(storedUserInfo)
  } else {
    // 如果本地存储没有用户信息，使用登录时存储的token重新获取用户信息
    const token = localStorage.getItem('access_token')
    if (token) {
      // 从登录接口返回的数据中获取用户信息
      const loginData = JSON.parse(localStorage.getItem('login_data') || '{}')
      if (loginData.user_info) {
        userInfo.value = loginData.user_info
        // 将用户信息存储到localStorage中
        localStorage.setItem('user_info', JSON.stringify(loginData.user_info))
      }
    }
  }
})
</script>

<style scoped>
.layout-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: #ffffff;
  border-bottom: 1px solid #d0d7de;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-img {
  width: 32px;
  height: 32px;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #24292f;
}

.nav {
  display: flex;
  gap: 24px;
}

.nav-item {
  position: relative;
  color: #24292f;
  text-decoration: none;
  font-size: 14px;
  padding: 8px 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  border-radius: 6px;
}

.nav-item:hover {
  color: #0969da;
  background-color: #f6f8fa;
}

.menu-title {
  display: flex;
  align-items: center;
  gap: 4px;
}

.dropdown-menu {
  display: none;
  position: absolute;
  top: 100%;
  left: 0;
  background: #ffffff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 8px 0;
  min-width: 180px;
  box-shadow: 0 8px 24px rgba(140,149,159,0.2);
}

.nav-item:hover .dropdown-menu {
  display: block;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  color: #24292f;
  text-decoration: none;
  font-size: 14px;
}

.dropdown-item:hover {
  background: #f6f8fa;
  color: #0969da;
}

.el-icon {
  font-size: 16px;
  margin-right: 4px;
}

.dropdown-item .el-icon {
  font-size: 14px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.username {
  font-size: 14px;
  color: #24292f;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.main-content {
  margin-top: 64px;
  flex: 1;
  background: #f6f8fa;
}

.nav-item i {
  margin-right: 4px;
  font-size: 16px;
}

.dropdown-item i {
  margin-right: 4px;
  font-size: 14px;
}

.menu-title {
  display: flex;
  align-items: center;
}
</style>