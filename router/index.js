import Router from 'koa-router'
import authorize from '../middlewares/authorize'
import { wechatLogin, updateUserInfo } from '../controllers/user'
import { insertDepartment, updateDepartment, deleteDepartment, findDepartment } from '../controllers/department'
import { insertOrganization, updateOrganization, deleteOrganization, findOrganization, updateOrganizationStatus } from '../controllers/organization'

const router = new Router({
  prefix: '/api'
})

router.get('/user/:userId', authorize)

// wechat login
router.get('/wechat/login/:code', wechatLogin)
router.post('/user', updateUserInfo)

// department
router.get('/department', findDepartment)
router.post('/department', insertDepartment)
router.put('/department/:id', updateDepartment)
router.delete('/department/:id', deleteDepartment)

// organization
router.get('/organization', findOrganization)
router.post('/organization', insertOrganization)
router.put('/organization/:id', updateOrganization)
router.put('/organization/:id/:status', updateOrganizationStatus)
router.delete('/organization/:id', deleteOrganization)

export default router
