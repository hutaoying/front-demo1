<template>
  <div class="leave-application-container">
    <h2>请假申请</h2>
    <div class="form-container">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="请假类型">
          <el-select v-model="formData.leaveType" placeholder="请选择请假类型">
            <el-option label="事假" value="personal" />
            <el-option label="病假" value="sick" />
            <el-option label="年假" value="annual" />
            <el-option label="调休" value="compensatory" />
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker
            v-model="formData.startTime"
            type="datetime"
            placeholder="选择开始时间"
          />
        </el-form-item>
        <el-form-item label="结束时间">
          <el-date-picker
            v-model="formData.endTime"
            type="datetime"
            placeholder="选择结束时间"
          />
        </el-form-item>
        <el-form-item label="请假原因">
          <el-input
            v-model="formData.reason"
            type="textarea"
            rows="4"
            placeholder="请输入请假原因"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitForm">提交申请</el-button>
          <el-button @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { ElMessage } from 'element-plus'

const formData = reactive({
  leaveType: '',
  startTime: '',
  endTime: '',
  reason: ''
})

const submitForm = async () => {
  try {
    // TODO: 实现提交请假申请的API调用
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}

const resetForm = () => {
  formData.leaveType = ''
  formData.startTime = ''
  formData.endTime = ''
  formData.reason = ''
}
</script>

<style scoped>
.leave-application-container {
  padding: 24px;
}

h2 {
  margin-bottom: 24px;
  color: #24292f;
}

.form-container {
  background: #fff;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  max-width: 800px;
}
</style>