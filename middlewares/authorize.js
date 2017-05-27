import logger from '../common/logger'
import codeManager from '../common/codeManager'

export default async (ctx, next) => {
  if (ctx.session.isLogin) {
    await next()
  } else {
    logger.log('debug', 'user is not login')
    ctx.body = Object.assign({}, codeManager.noLogin)
  }
}
