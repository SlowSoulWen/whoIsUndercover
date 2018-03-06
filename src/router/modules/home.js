import cHome from '@components/home/home'
import cHomeIndex from '@components/home/home-index'
import cHomeList from '@components/home/home-list'
import cHomePerson from '@components/home/home-person'
import cHomePage from '@components/home/home-homePage'

export default [
  {
    path: '/',
    redirect: '/home'
  },
  {
    path: '/home',
    component: cHome
  },
  {
    path: '/home-index',
    redirect: '/home-index/list',
    component: cHomeIndex,
    name: 'home-index',
    children: [
      {
        path: 'list',
        name: 'rooms-list',
        component: cHomeList
      },
      {
        path: 'person',
        name: 'home-person',
        component: cHomePerson
      },
      {
        path: 'homePage',
        name: 'home-page',
        component: cHomePage
      }
    ]
  }
]
