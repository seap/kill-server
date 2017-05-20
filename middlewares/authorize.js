import jwt from 'jsonwebtoken'
import logger from '../common/logger'
import { wechat, tokenConfig } from '../config'
import codeManager from '../common/codeManager'

export default async (ctx, next) => {
  const token = ctx.query.token || ctx.headers['x-access-token']
  logger.log('debug', 'token: %s', token)
  try {
    const decode = jwt.verify(token, tokenConfig.secret)
    logger.log('debug', 'decode: ', decode, {})
    await next()
  } catch (err) {
    logger.log('error', 'verify token error, ', err, {})
    ctx.body = Object.assign({}, codeManager.noLogin, { msg: err.message })
  }
}
