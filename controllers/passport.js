import _ from 'lodash'
import crypto from 'crypto'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { findById } from '../models/staff'

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
    
    const staff = await findById(+opt.user)
    if (!staff) {
      return ctx.body = codeManager.wrongUserOrPsd
    }
    if (staff && (staff.password == crypto.createHash('md5').update(opt.password).digest('hex'))) {
      ctx.session.isLogin = true // session设置
      return ctx.body = Object.assign({}, codeManager.success,
        { msg: '登录成功！', data: _.pick(staff, ['name', 'organization', 'department', 'position', 'role']) })
    } else {
      return ctx.body = codeManager.wrongUserOrPsd
    }
  } catch (e) {
    logger.log('error', e)
    ctx.body = codeManager.unknownError
  }
}