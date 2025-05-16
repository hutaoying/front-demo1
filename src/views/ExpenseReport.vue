<template>
  <div class="expense-report-container">
    <h2>报销申请</h2>
    <div class="form-container">
      <el-form :model="formData" label-width="100px">
        <el-form-item label="报销类型">
          <el-select v-model="formData.expenseType" placeholder="请选择报销类型">
            <el-option label="差旅费" value="travel" />
            <el-option label="办公用品" value="office" />
            <el-option label="培训费" value="training" />
            <el-option label="其他" value="other" />
          </el-select>
        </el-form-item>
        <el-form-item label="报销金额">
          <el-input-number 
            v-model="formData.amount" 
            :precision="2" 
            :step="0.01" 
            :min="0"
          />
        </el-form-item>
        <el-form-item label="发生日期">
          <el-date-picker
            v-model="formData.expenseDate"
            type="date"
            placeholder="选择日期"
          />
        </el-form-item>
        <el-form-item label="报销说明">
          <el-input
            v-model="formData.description"
            type="textarea"
            rows="4"
            placeholder="请输入报销说明"
          />
        </el-form-item>
        <el-form-item label="上传凭证">
          <el-upload
            action="#"
            list-type="picture-card"
            :auto-upload="false"
          >
            <el-icon><Plus /></el-icon>
          </el-upload>
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
import { Plus } from '@element-plus/icons-vue'

const formData = reactive({
  expenseType: '',
  amount: 0,
  expenseDate: '',
  description: ''
})

const submitForm = async () => {
  try {
    // TODO: 实现提交报销申请的API调用
    ElMessage.success('提交成功')
  } catch (error) {
    console.error('提交失败:', error)
    ElMessage.error('提交失败，请稍后重试')
  }
}

const resetForm = () => {
  formData.expenseType = ''
  formData.amount = 0
  formData.expenseDate = ''
  formData.description = ''
}
</script>

<style scoped>
.expense-report-container {
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