import Router from 'koa-router'
import authorize from '../middlewares/authorize'
import { getUserInfo } from '../controllers/user'

const router = new Router({
  prefix: '/api'
})

router.get('/user/:userId', authorize, getUserInfo)

// wechat router
router.get('/wechat/')

export default router
