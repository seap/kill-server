import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList, findByCode } from '../models/department'

// validate department object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const department = {}
  department.name = _.trim(obj.name)
  department.owner = _.trim(obj.owner)
  // check the required attributes 
  for (let key in department) {
    if (!department.hasOwnProperty(key)) {
      continue
    }
    if (department[key] === '') {
      return false
    }
  }
  // not necessary
  department.parentId = _.trim(obj.parentId)
  department.organization = _.trim(obj.organization)
  department.remark = _.trim(obj.remark)
  return department
}


export async function insertDepartment(ctx, next) {
  try {
    logger.log('debug', 'insertDepartment: ', ctx.request.body, {})
    const department = validator(ctx.request.body)
    if (!department) {
      return ctx.body = codeManager.paramError
    }
    department.status = '0' // 默认有效
    const result = await insert(department)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

// export async function insertChildDepartment(ctx, next) {
//   try {
//     const { parentCode } = ctx.params
//     logger.log('debug', 'parentCode: %s', parentCode)
//     logger.log('debug', 'department: ', ctx.request.body, {})
//     const childDepartment = validator(ctx.request.body)
//     if (!childDepartment) {
//       return ctx.body = codeManager.paramError
//     }
//     childDepartment.status = '0' // 默认有效

//     const codes = parentCode.split('-')
//     const department = await findByCode(codes[0])
//     if (!department) {
//       return ctx.body = Object.assign({}, codeManager.paramError, { msg: '部门编号有误！' })
//     }
//     department.children = department.children || []
//     let children = department.children
//     for (let i = 1; i < code.length; i++) {
//       for (let child of children) {
//         if (child.code == code[i]) {
//           child.children = child.children || []
//           children = child.children
//           break
//         }
//       }
//     }
//     consolo.log('children: ', children)
//     children.insert(childDepartment)

//     const result = await update(department)
//     ctx.body = Object.assign({}, codeManager.success, { data: result })
//   } catch (e) {
//     logger.log('error', e)
//     ctx.body = codeManager.unknownError
//   }
// }

export async function deleteDepartment(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete department id: ', id)

    const result = await remove(id)
    if (result) {
      ctx.body = Object.assign({}, codeManager.success, { data: { id } })
    } else {
      ctx.body = Object.assign({}, codeManager.notExist)
    }
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateDepartment(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const department = validator(ctx.request.body)
    department.id = id
    if (!department) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'department: ', department, {})
    const result = await update(department)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateDepartmentStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update department status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function enableDepartment(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    department.id = id
    if (!department) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'department: ', department, {})
    const result = await update(department)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findDepartment(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}