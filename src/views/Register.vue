<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <img src="../assets/angry_face_with_horns_color.svg" alt="Logo" class="logo">
        <h1>注册 不语大师</h1>
      </div>
      <div class="register-form">
        <div class="form-group">
          <label for="username">用户名</label>
          <input 
            type="text" 
            id="username" 
            v-model="formData.username"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="password">密码</label>
          <input 
            type="password" 
            id="password" 
            v-model="formData.password"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="email">邮箱</label>
          <div class="email-group">
            <input 
              type="email" 
              id="email" 
              v-model="formData.email"
              class="form-input"
            >
            <button class="verify-button" @click="sendVerificationCode">获取验证码</button>
          </div>
        </div>
        <div class="form-group">
          <label for="phone">手机号</label>
          <input 
            type="tel" 
            id="phone" 
            v-model="formData.phone"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="verificationCode">验证码</label>
          <input 
            type="text" 
            id="verificationCode" 
            v-model="formData.verificationCode"
            class="form-input"
          >
        </div>
        <button class="register-button" @click="handleRegister">注册</button>
      </div>
    </div>
    <div class="login-link">
      已有账号? <router-link to="/login" class="login-text">立即登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  email: '',
  phone: '',
  verificationCode: ''
})

const sendVerificationCode = async () => {
  try {
    const response = await fetch('/api/auth/send-verification-code', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: formData.email,
        purpose: 'REGISTER'
      })
    })
    const data = await response.json()
    if (data.code === 200) {
      alert('验证码已发送，请查收邮件')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('发送验证码失败:', error)
    alert('发送验证码失败，请稍后重试')
  }
}

const handleRegister = async () => {
  if (formData.password !== formData.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        email: formData.email,
        phone: formData.phone,
        verification_code: formData.verificationCode
      })
    })
    
    const data = await response.json()
    if (data.code === 201) {
      alert('注册成功')
      localStorage.setItem('access_token', data.data.access_token)
      router.push('/home')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('注册失败:', error)
    alert('注册失败，请稍后重试')
  }
}
</script>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.register-box {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 1px solid #d8dee4;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 16px;
}

.register-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.register-header h1 {
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

.email-group {
  display: flex;
  gap: 10px;
}

.email-group .form-input {
  flex: 1;
}

.verify-button {
  padding: 5px 12px;
  font-size: 14px;
  color: #0969da;
  background-color: transparent;
  border: 1px solid #0969da;
  border-radius: 6px;
  cursor: pointer;
  white-space: nowrap;
}

.verify-button:hover {
  background-color: #f6f8fa;
}

.register-button {
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

.register-button:hover {
  background-color: #2c974b;
}

.login-link {
  font-size: 14px;
  color: #24292f;
}

.login-text {
  color: #0969da;
  text-decoration: none;
}

.login-text:hover {
  text-decoration: underline;
}
</style>