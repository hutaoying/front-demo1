<template>
  <div class="forgot-password-container">
    <div class="forgot-password-box">
      <div class="forgot-password-header">
        <img src="../assets/angry_face_with_horns_color.svg" alt="Logo" class="logo">
        <h1>重置密码</h1>
      </div>
      <div class="forgot-password-form">
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
          <label for="verificationCode">验证码</label>
          <input 
            type="text" 
            id="verificationCode" 
            v-model="formData.verificationCode"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="newPassword">新密码</label>
          <input 
            type="password" 
            id="newPassword" 
            v-model="formData.newPassword"
            class="form-input"
          >
        </div>
        <div class="form-group">
          <label for="confirmPassword">确认新密码</label>
          <input 
            type="password" 
            id="confirmPassword" 
            v-model="formData.confirmPassword"
            class="form-input"
          >
        </div>
        <button class="reset-button" @click="handleReset">重置密码</button>
      </div>
    </div>
    <div class="login-link">
      想起密码了? <router-link to="/login" class="login-text">返回登录</router-link>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const formData = reactive({
  username: '',
  email: '',
  verificationCode: '',
  newPassword: '',
  confirmPassword: ''
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
        purpose: 'RESET_PASSWORD'
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

const handleReset = async () => {
  if (formData.newPassword !== formData.confirmPassword) {
    alert('两次输入的密码不一致')
    return
  }
  
  try {
    const response = await fetch('/api/auth/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        username: formData.username,
        email: formData.email,
        new_password: formData.newPassword,
        confirm_password: formData.confirmPassword,
        verification_code: formData.verificationCode
      })
    })
    
    const data = await response.json()
    if (data.code === 200) {
      alert('密码重置成功')
      router.push('/login')
    } else {
      alert(data.message)
    }
  } catch (error) {
    console.error('重置密码失败:', error)
    alert('重置密码失败，请稍后重试')
  }
}
</script>

<style scoped>
.forgot-password-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #f9f9f9;
  padding: 20px;
}

.forgot-password-box {
  width: 100%;
  max-width: 400px;
  background: #fff;
  border: 1px solid #d8dee4;
  border-radius: 6px;
  padding: 20px;
  margin-bottom: 16px;
}

.forgot-password-header {
  text-align: center;
  margin-bottom: 24px;
}

.logo {
  width: 48px;
  height: 48px;
  margin-bottom: 16px;
}

.forgot-password-header h1 {
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

.reset-button {
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

.reset-button:hover {
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