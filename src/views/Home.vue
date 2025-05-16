<template>
  <div class="home-container">
    <div class="statistics-grid">
      <div class="stat-card">
        <h3>待办事项</h3>
        <div class="stat-number">{{ stats.todoCount }}</div>
      </div>
      <div class="stat-card">
        <h3>已办事项</h3>
        <div class="stat-number">{{ stats.doneCount }}</div>
      </div>
      <div class="stat-card">
        <h3>待审批事项</h3>
        <div class="stat-number">{{ stats.pendingApprovalCount }}</div>
      </div>
      <div class="stat-card">
        <h3>已审批事项</h3>
        <div class="stat-number">{{ stats.approvedCount }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { API_BASE_URL } from '../config/api'

const stats = reactive({
  todoCount: 0,
  doneCount: 0,
  pendingApprovalCount: 0,
  approvedCount: 0
})

const fetchStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/stats/dashboard`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    if (data.code === 200) {
      stats.todoCount = data.data.todoCount || 0
      stats.doneCount = data.data.doneCount || 0
      stats.pendingApprovalCount = data.data.pendingApprovalCount || 0
      stats.approvedCount = data.data.approvedCount || 0
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

onMounted(() => {
  fetchStats()
})
</script>

<style scoped>
.home-container {
  padding: 24px;
}

.statistics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.stat-card {
  background: #fff;
  border: 1px solid #d0d7de;
  border-radius: 6px;
  padding: 16px;
  text-align: center;
}

.stat-card h3 {
  color: #24292f;
  font-size: 16px;
  margin-bottom: 8px;
}

.stat-number {
  font-size: 32px;
  font-weight: 600;
  color: #0969da;
}
</style>