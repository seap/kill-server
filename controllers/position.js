import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList } from '../models/position'

// validate position object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const position = {}
  position.name = _.trim(obj.name)

  // check the required attributes 
  for (let key in position) {
    if (!position.hasOwnProperty(key)) {
      continue
    }
    if (position[key] === '') {
      return false
    }
  }
  // not necessary
  position.remark = _.trim(obj.remark)
  return position
}


export async function insertPosition(ctx, next) {
  try {
    logger.log('debug', 'position: ', ctx.request.body, {})
    const position = validator(ctx.request.body)
    if (!position) {
      return ctx.body = codeManager.paramError
    }
    // const duplicated = await findByDeptCode(position.deptCode)
    // if (duplicated) {
    //   return ctx.body = Object.assign({}, codeManager.paramDuplicated, {msg: '部门编号已经存在！'})
    // }
    position.status = '0' // 默认有效
    const result = await insert(position)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deletePosition(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete position id: ', id)

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

export async function updatePosition(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const position = validator(ctx.request.body)
    position.id = id
    if (!position) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'position: ', position, {})
    const result = await update(position)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updatePositionStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update position status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findPosition(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}