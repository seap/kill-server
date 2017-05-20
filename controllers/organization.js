import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList } from '../models/organization'

// validate organization object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const organization = {}
  organization.name = _.trim(obj.name)
  organization.type = _.trim(obj.type)
  organization.owner = _.trim(obj.owner)
  organization.telephone = _.trim(obj.telephone)
  // check the required attributes 
  for (let key in organization) {
    if (!organization.hasOwnProperty(key)) {
      continue
    }
    if (organization[key] === '') {
      return false
    }
  }
  // not necessary
  organization.remark = _.trim(obj.remark)
  return organization
}


export async function insertOrganization(ctx, next) {
  try {
    logger.log('debug', 'organization: ', ctx.request.body, {})
    const organization = validator(ctx.request.body)
    if (!organization) {
      return ctx.body = codeManager.paramError
    }
    // const duplicated = await findByDeptCode(organization.deptCode)
    // if (duplicated) {
    //   return ctx.body = Object.assign({}, codeManager.paramDuplicated, {msg: '部门编号已经存在！'})
    // }
    organization.status = '0' // 默认有效
    const result = await insert(organization)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deleteOrganization(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete organization id: ', id)

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

export async function updateOrganization(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const organization = validator(ctx.request.body)
    organization.id = id
    if (!organization) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'organization: ', organization, {})
    const result = await update(organization)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateOrganizationStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update organization status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findOrganization(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}