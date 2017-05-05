import Router from 'koa-router'
// import authorize from '../middlewares/authorize'
import { login } from '../controllers/user'

const router = new Router({
  prefix: '/api'
})

// router.get('/user/:userId', authorize, getUserInfo)

// wechat login
router.get('/wechat/login/:code', login)

export default router
