import Router from 'koa-router'
import authorize from '../middlewares/authorize'
import { wechatLogin, updateUserInfo } from '../controllers/user'
import { insertDepartment, updateDepartment, deleteDepartment, findDepartment, updateDepartmentStatus } from '../controllers/department'
import { insertOrganization, updateOrganization, deleteOrganization, findOrganization, updateOrganizationStatus } from '../controllers/organization'
import { insertPosition, updatePosition, deletePosition, findPosition, updatePositionStatus } from '../controllers/position'
import { insertRole, updateRole, deleteRole, findRole, updateRoleStatus } from '../controllers/role'

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
router.put('/department/:id/:status', updateDepartmentStatus)
router.delete('/department/:id', deleteDepartment)

// organization
router.get('/organization', findOrganization)
router.post('/organization', insertOrganization)
router.put('/organization/:id', updateOrganization)
router.put('/organization/:id/:status', updateOrganizationStatus)
router.delete('/organization/:id', deleteOrganization)

// position
router.get('/position', findPosition)
router.post('/position', insertPosition)
router.put('/position/:id', updatePosition)
router.put('/position/:id/:status', updatePositionStatus)
router.delete('/position/:id', deletePosition)

// role
router.get('/role', findRole)
router.post('/role', insertRole)
router.put('/role/:id', updateRole)
router.put('/role/:id/:status', updateRoleStatus)
router.delete('/role/:id', deleteRole)

export default router
