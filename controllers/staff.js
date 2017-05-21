import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList } from '../models/staff'

// validate staff object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const staff = {}
  staff.name = _.trim(obj.name)

  // check the required attributes 
  for (let key in staff) {
    if (!staff.hasOwnProperty(key)) {
      continue
    }
    if (staff[key] === '') {
      return false
    }
  }
  // not necessary
  staff.remark = _.trim(obj.remark)
  return staff
}


export async function insertStaff(ctx, next) {
  try {
    logger.log('debug', 'staff: ', ctx.request.body, {})
    const staff = validator(ctx.request.body)
    if (!staff) {
      return ctx.body = codeManager.paramError
    }
    // const duplicated = await findByDeptCode(staff.deptCode)
    // if (duplicated) {
    //   return ctx.body = Object.assign({}, codeManager.paramDuplicated, {msg: '部门编号已经存在！'})
    // }
    staff.status = '0' // 默认有效
    const result = await insert(staff)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deleteStaff(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete staff id: ', id)

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

export async function updateStaff(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const staff = validator(ctx.request.body)
    staff.id = id
    if (!staff) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'staff: ', staff, {})
    const result = await update(staff)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateStaffStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update staff status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findStaff(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}