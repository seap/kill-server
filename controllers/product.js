import _ from 'lodash'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { insert, update, remove, findList, findById } from '../models/product'

// validate product object
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const product = {}
  product.name = _.trim(obj.name)
  product.category = _.trim(obj.category)
  product.price = _.trim(obj.price)
  product.order = _.trim(obj.order)
  // check the required attributes 
  for (let key in product) {
    if (!product.hasOwnProperty(key)) {
      continue
    }
    if (product[key] === '') {
      return false
    }
  }
  // not necessary
  product.remark = _.trim(obj.remark)
  product.images = obj.images
  return product
}


export async function insertProduct(ctx, next) {
  try {
    logger.log('debug', 'product: ', ctx.request.body, {})
    const product = validator(ctx.request.body)
    if (!product) {
      return ctx.body = codeManager.paramError
    }
    // const duplicated = await findByDeptCode(product.deptCode)
    // if (duplicated) {
    //   return ctx.body = Object.assign({}, codeManager.paramDuplicated, {msg: '部门编号已经存在！'})
    // }
    product.status = '0' // 默认有效
    const result = await insert(product)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function deleteProduct(ctx, next) {
  try {
    const id = ctx.params.id
    logger.log('debug', 'delete product id: ', id)

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

export async function updateProduct(ctx, next) {
  try {
    const id = ctx.params.id
    const product = validator(ctx.request.body)
    if (!product) {
      return ctx.body = codeManager.paramError
    }
    product.id = id
    logger.log('debug', 'product: ', product, {})
    const result = await update(product)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function updateProductStatus(ctx, next) {
  try {
    const id = ctx.params.id
    const { status } = ctx.params
    if (status !== '0' && status !== '1') { 
      // 只支持两种状态， 0: 有效, 1: 失效（封存）
      return ctx.body = codeManager.paramError
    }
    logger.log('debug', 'update product status: %s', status)
    const result = await update({ id, status })
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

// export async function findProduct(ctx, next) {
//   try {
//     const result = await findList()
//     ctx.body = Object.assign({}, codeManager.success, { data: result })
//   } catch (e) {
//     logger.log('error', e)
//     ctx.body = codeManager.unknownError
//   }
// }

export async function findProduct(ctx, next) {
  try {
    const { keyword, status } = ctx.request.query
    const conditions = []
    if (status) {
      conditions.push({ status })
    }
    if (keyword) {
      let regExp
      try {
        regExp = new RegExp(keyword)
      } catch (e) {
        regExp = /(?:)/
      }
      conditions.push({ 
        $or: [
          { id: regExp },
          { name: regExp },
          { remark: regExp }
        ]
      })
    }
    const where = {}
    if (conditions.length > 0) {
      where.$and = conditions
    }
    const result = await findList(where)
    ctx.body = Object.assign({}, codeManager.success, { data: result })
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function findProductOne(ctx, next) {
  try {
    const id = ctx.params.id
    const result = await findById(id)
    if (result) {
      ctx.body = Object.assign({}, codeManager.success, { data: result })
    } else {
      ctx.body = Object.assign({}, codeManager.notExist)
    }
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}