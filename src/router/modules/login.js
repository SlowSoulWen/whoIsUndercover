import cLogin from '@components/login/login.vue'
import cRegister from '@components/login/register.vue'

export default [
  {
    path: '/login',
    component: cLogin,
    name: 'login'
  },
  {
    path: '/register',
    component: cRegister,
    name: 'register'
  }
]
