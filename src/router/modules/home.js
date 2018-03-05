import HOME from '@components/home/home'

export default [
  {
    path: '/',
    redirect: '/home/index'
  },
  {
    path: '/home',
    redirect: '/home/index'
  },
  {
    path: '/home/index',
    component: HOME
  }
]
