import cRoom from '@components/room/room.vue'

export default [
  {
    path: '/room/:id',
    name: 'room',
    props: true,
    component: cRoom
  }
]
