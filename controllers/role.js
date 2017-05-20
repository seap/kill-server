import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList } from '../models/role'

// validate role object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const role = {}
  role.name = _.trim(obj.name)

  // check the required attributes 
  for (let key in role) {
    if (!role.hasOwnProperty(key)) {
      continue
    }
    if (role[key] === '') {
      return false
    }
  }
  // not necessary
  role.remark = _.trim(obj.remark)
  return role
}


export async function insertRole(ctx, next) {
  try {
    logger.log('debug', 'role: ', ctx.request.body, {})
    const role = validator(ctx.request.body)
    if (!role) {
      return ctx.body = codeManager.paramError
    }
    role.status = '0' // 默认有效
    const result = await insert(role)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deleteRole(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete role id: ', id)

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

export async function updateRole(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const role = validator(ctx.request.body)
    role.id = id
    if (!role) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'role: ', role, {})
    const result = await update(role)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateRoleStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update role status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findRole(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}