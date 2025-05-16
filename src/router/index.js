import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainLayout from '../layout/MainLayout.vue'

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/forgot-password',
    name: 'ForgotPassword',
    component: () => import('../views/ForgotPassword.vue')
  },
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: 'home',
        name: 'Home',
        component: () => import('../views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'todo',
        name: 'Todo',
        component: () => import('../views/Todo.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'done',
        name: 'Done',
        component: () => import('../views/Done.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'qingjia',
        name: 'LeaveApplication',
        component: () => import('../views/LeaveApplication.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'bx',
        name: 'ExpenseReport',
        component: () => import('../views/ExpenseReport.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'listShow',
        name: 'ListDisplay',
        component: () => import('../views/ListDisplay.vue'),
        meta: { requiresAuth: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.meta.requiresAuth && !localStorage.getItem('access_token')) {
    next('/login')
  } else {
    next()
  }
})

export default router