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
  department.code = _.trim(obj.code)
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
  department.organization = _.trim(obj.organization)
  department.remark = _.trim(obj.remark)
  return department
}


export async function insertDepartment(ctx, next) {
  try {
    logger.log('debug', 'department: ', ctx.request.body, {})
    const department = validator(ctx.request.body)
    if (!department) {
      return ctx.body = codeManager.paramError
    }
    const duplicated = await findByCode(department.code)
    if (duplicated) {
      return ctx.body = Object.assign({}, codeManager.paramDuplicated, {msg: '部门编号已经存在！'})
    }
    department.status = '0' // 默认有效
    const result = await insert(department)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

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