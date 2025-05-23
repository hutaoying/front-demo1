<template>
  <div class="list-display-container">

    <!-- 统计概览区域 -->
    <div class="statistics-overview">
      <!-- 风险概况统计 -->
      <div class="risk-statistics">
        <h4>风险概况</h4>
        <div class="stat-cards">
          <div class="stat-card high-risk">
            <div class="stat-number">{{ statistics.highRisk }}</div>
            <div class="stat-label">高风险</div>
          </div>
          <div class="stat-card medium-risk">
            <div class="stat-number">{{ statistics.mediumRisk }}</div>
            <div class="stat-label">中风险</div>
          </div>
          <div class="stat-card low-risk">
            <div class="stat-number">{{ statistics.lowRisk }}</div>
            <div class="stat-label">低风险</div>
          </div>
          <div class="stat-card compromised">
            <div class="stat-number">{{ statistics.compromised }}</div>
            <div class="stat-label">已失陷</div>
          </div>
        </div>
      </div>
      
      <!-- 组织架构风险资产排行 -->
      <div class="org-risk-ranking">
        <h4>组织架构风险资产排行</h4>
        <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>

    <!-- 资产列表区域 -->
    <div class="asset-list-section">
      <div class="list-title">
        <h3>风险资产列表</h3>
      </div>
      <div class="search-bar">
        <el-input
          v-model="searchForm.name"
          placeholder="请输入资产名称/标识"
          class="search-input"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        
        <el-select
          v-model="searchForm.riskType"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择风险评级"
          class="risk-select"
        >
          <el-option label="高" value="高" />
          <el-option label="中" value="中" />
          <el-option label="低" value="低" />
        </el-select>

        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button @click="handleReset">重置</el-button>
      </div>

      <div class="table-container">
        <el-table :data="tableData" border style="width: 100%" v-loading="loading">
          <el-table-column prop="id" label="资产ID" width="120" />
          <el-table-column prop="name" label="资产名称" width="180" />
          <el-table-column prop="identifier" label="资产标识" width="120" />
          <el-table-column prop="organizationName" label="所属组织" width="150" />
          <el-table-column prop="riskType" label="风险等级" width="100">
            <template #default="{ row }">
              <el-tag :type="getRiskTagType(row.riskType)">{{ row.riskType }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="score" label="评分" width="80" />
          <el-table-column prop="ratingTags" label="评级标签">
            <template #default="{ row }">
              <el-tag
                v-for="tag in row.ratingTags.split(',')"
                :key="tag"
                class="tag-item"
                size="small"
              >
                {{ tag }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="ratingTime" label="评级时间" width="160" />
        </el-table>

        <div class="pagination">
          <el-pagination
            v-model:current-page="searchForm.page"
            v-model:page-size="searchForm.size"
            :page-sizes="[10, 20, 30, 50]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </div>
    </div>

    <!-- 独立的饼图区域 -->
    <div class="pie-chart-section">
      <h4>组织架构风险分布</h4>
      <div ref="pieChartRef" class="pie-chart-container"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import * as echarts from 'echarts'

const loading = ref(false)
const total = ref(0)
const tableData = ref([])

const searchForm = reactive({
  name: '',
  riskType: [],
  organizationId: '',
  page: 1,
  size: 10
})

const getRiskTagType = (type) => {
  const typeMap = {
    '高': 'danger',
    '中': 'warning',
    '低': 'success'
  }
  return typeMap[type] || 'info'
}

const fetchData = async () => {
  loading.value = true
  try {
    const response = await fetch('/api/risk/assets?' + new URLSearchParams({
      ...searchForm,
      riskType: searchForm.riskType.join(',')
    }), {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    console.info('data:', data)
    if (data.code === 200) {
      tableData.value = data.data
      total.value = data.total
    } else {
      ElMessage.error(data.message || '获取数据失败')
    }
  } catch (error) {
    console.error('获取风险资产列表失败:', error)
    ElMessage.error('获取数据失败')
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  searchForm.page = 1
  fetchData()
}

const handleReset = () => {
  searchForm.name = ''
  searchForm.riskType = []
  searchForm.organizationId = ''
  searchForm.page = 1
  fetchData()
}

const handleSizeChange = (val) => {
  searchForm.size = val
  fetchData()
}

const handleCurrentChange = (val) => {
  searchForm.page = val
  fetchData()
}

// 添加统计数据
const statistics = reactive({
  highRisk: 0,
  mediumRisk: 0,
  lowRisk: 0,
  compromised: 0
})

const orgRankings = ref([])
const maxCount = ref(0)

// 获取统计数据
const fetchStatistics = async () => {
  try {
    const response = await fetch('/api/risk/statistics', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    if (data.code === 200) {
      statistics.highRisk = data.data.highRisk
      statistics.mediumRisk = data.data.mediumRisk
      statistics.lowRisk = data.data.lowRisk
      statistics.compromised = data.data.compromised
    }
  } catch (error) {
    console.error('获取统计数据失败:', error)
  }
}

const chartRef = ref(null)
let chart = null

// 初始化图表
const initChart = () => {
  if (chart) {
    chart.dispose()
  }
  chart = echarts.init(chartRef.value)
}

// 更新图表数据
const updateChart = (data) => {
  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.name),
      axisLabel: {
        interval: 0,
        rotate: 30
      }
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '风险资产数',
        type: 'bar',
        data: data.map(item => item.value),
        itemStyle: {
          color: '#409EFF'
        }
      }
    ]
  }
  chart.setOption(option)
}

const pieChartRef = ref(null)
let pieChart = null

// 初始化饼图
const initPieChart = () => {
  if (pieChart) {
    pieChart.dispose()
  }
  pieChart = echarts.init(pieChartRef.value)
}

// 更新饼图数据
const updatePieChart = (data) => {
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'horizontal',
      bottom: 0
    },
    series: [
      {
        name: '风险资产分布',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        itemStyle: {
          borderRadius: 10,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: true,
          formatter: '{b}: {c}'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: data.map(item => ({
          name: item.name,
          value: item.value
        }))
      }
    ]
  }
  pieChart.setOption(option)
}

// 修改获取组织架构排行数据的方法
const fetchOrgRankings = async () => {
  try {
    const response = await fetch('/api/risk/org-rankings', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    })
    const data = await response.json()
    if (data.code === 200) {
      // 初始化并更新图表
      initChart()
      updateChart(data.data)
      // 初始化并更新饼图
      initPieChart()
      updatePieChart(data.data)
    }
  } catch (error) {
    console.error('获取组织架构排行失败:', error)
  }
}

// 监听窗口大小变化
window.addEventListener('resize', () => {
  chart?.resize()
  pieChart?.resize()
})

onMounted(() => {
  fetchStatistics()
  fetchOrgRankings()
  fetchData()
})
</script>

<style scoped>
.list-display-container {
  padding: 24px;
}

.search-bar {
  margin-bottom: 24px;
  display: flex;
  gap: 16px;
  align-items: center;
}

.search-input {
  width: 240px;
}

.risk-select {
  width: 200px;
}

.tag-item {
  margin-right: 4px;
}

.pagination {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.statistics-overview {
  display: flex;
  gap: 24px;
  margin-bottom: 24px;
}

.risk-statistics, .org-risk-ranking {
  flex: 1;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.stat-cards {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-top: 16px;
}

.stat-card {
  padding: 16px;
  border-radius: 6px;
  text-align: center;
  color: #fff;
}

.stat-number {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
}

.high-risk { background-color: #f56c6c; }
.medium-risk { background-color: #e6a23c; }
.low-risk { background-color: #67c23a; }
.compromised { background-color: #909399; }

.rank-number {
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  border-radius: 50%;
  background: #f4f4f5;
}

.top-three {
  color: #fff;
  background: #ffd700;
}

.top-three:nth-child(2) { background: #c0c0c0; }
.top-three:nth-child(3) { background: #cd7f32; }

.org-name {
  margin-bottom: 8px;
}

.progress-bar {
  height: 6px;
  background: #f4f4f5;
  border-radius: 3px;
  overflow: hidden;
}

.progress {
  height: 100%;
  background: #409eff;
  transition: width 0.3s ease;
}

h4 {
  margin: 0 0 16px 0;
  color: #303133;
  font-size: 16px;
}

.asset-list-section {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.chart-container {
  width: 100%;
  height: 300px;
}

.chart-section {
  margin: 24px 0;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.pie-chart-container {
  width: 100%;
  height: 400px;
}

.table-container {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.pagination {
  margin-top: 0;  /* 移除原有的上边距 */
  padding-top: 16px;
  border-top: 1px solid #ebeef5;
}

.pie-chart-section {
  margin-top: 24px;
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
</style>