import cGame from '@components/game/game.vue'
import cOffLineGame from '@components/game/off-line-game.vue'
import cOffLineGame2 from '@components/game/off-line-game-2.vue'

export default [
  {
    path: '/game/:id',
    name: 'game',
    props: true,
    component: cGame
  },
  {
    path: '/off-line-game',
    name: 'off-line-game',
    component: cOffLineGame
  },
  {
    path: '/off-line-game-2',
    name: 'off-line-game-2',
    props: true,
    component: cOffLineGame2
  }
]
