<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <img src="../assets/angry_face_with_horns_color.svg" alt="Logo" class="logo">
        <h1>登录 不语大师</h1>
      </div>
      <div class="login-form">
        <div class="form-group">
          <label for="username">用户名或邮箱地址</label>
          <input 
            type="text" 
            id="username" 
            v-model="username"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <div class="password-label">
            <label for="password">密码</label>
            <a href="#" class="forgot-link">忘记密码?</a>
          </div>
          <input 
            type="password" 
            id="password" 
            v-model="password"
            class="form-input"
          >
        </div>
        <button class="login-button" @click="handleLogin">登录</button>
      </div>
    </div>
    <div class="create-account">
      新来到 GitHub? <a href="#" class="signup-link">创建账号</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const username = ref('')
const password = ref('')

const handleLogin = async () => {
  try {
    const response = await fetch('http://10.11.36.141:8080/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    
    const data = await response.json()
    if (data.code === 200) {
      // 存储token
      console.log("登录返回",data)
      localStorage.setItem('access_token', data.data.accessToken)
      localStorage.setItem('refresh_token', data.data.refreshToken)
      // 跳转到首页
      router.push('/home')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('登录失败:', error)
    alert('登录失败，请稍后重试')
  }
}
</script>

<style scoped>
.login-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.login-box {
  width: 100%;
  max-width: 308px;
  background: #fff;
  border: 1px solid #d8dee4;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 16px;
}

.login-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.login-header h1 {
  font-size: 24px;
  font-weight: 300;
  letter-spacing: -0.5px;
  color: #24292f;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #24292f;
}

.password-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.forgot-link {
  font-size: 12px;
  color: #0969da;
  text-decoration: none;
}

.form-input {
  width: 100%;
  padding: 5px 12px;
  font-size: 14px;
  line-height: 20px;
  color: #24292f;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  box-shadow: inset 0 1px 0 rgba(208, 215, 222, 0.2);
}

.form-input:focus {
  border-color: #0969da;
  outline: none;
  box-shadow: 0 0 0 3px rgba(9, 105, 218, 0.3);
}

.login-button {
  width: 100%;
  padding: 5px 16px;
  font-size: 14px;
  font-weight: 500;
  color: #ffffff;
  background-color: #2da44e;
  border: 1px solid rgba(27, 31, 36, 0.15);
  border-radius: 6px;
  cursor: pointer;
}

.login-button:hover {
  background-color: #2c974b;
}

.create-account {
  font-size: 14px;
  color: #24292f;
}

.signup-link {
  color: #0969da;
  text-decoration: none;
}

.signup-link:hover {
  text-decoration: underline;
}
</style>