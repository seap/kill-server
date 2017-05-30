import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList } from '../models/category'

// validate category object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const category = {}
  category.name = _.trim(obj.name)

  // check the required attributes 
  for (let key in category) {
    if (!category.hasOwnProperty(key)) {
      continue
    }
    if (category[key] === '') {
      return false
    }
  }
  // not necessary
  category.remark = _.trim(obj.remark)
  return category
}

export async function insertCategory(ctx, next) {
  try {
    logger.log('debug', 'category: ', ctx.request.body, {})
    const category = validator(ctx.request.body)
    if (!category) {
      return ctx.body = codeManager.paramError
    }
    category.status = '0' // 默认有效
    const result = await insert(category)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deleteCategory(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    logger.log('debug', 'delete category id: ', id)

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

export async function updateCategory(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const category = validator(ctx.request.body)
    category.id = id
    if (!category) {
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'category: ', category, {})
    const result = await update(category)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateCategoryStatus(ctx, next) {
  try {
    const id = parseInt(ctx.params.id)
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update category status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findCategory(ctx, next) {
  try {
    const result = await findList()
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}