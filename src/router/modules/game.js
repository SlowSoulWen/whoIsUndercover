import cGame from '@components/game/game.vue'

export default [
  {
    path: '/game/:id',
    name: 'game',
    props: true,
    component: cGame
  }
]
