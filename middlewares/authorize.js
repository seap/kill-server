import logger from '../common/logger'
import codeManager from '../common/codeManager'

const SSO_VALIDATE_API = 'http://sso.haiziwang.com/sso-web/mobileVisit/validate.do'

// 验证用户是否已登录, http://wiki.haiziwang.com/xwiki/bin/view/
export default async (ctx, next) => {

  console.log('ctx.session1: ', ctx.session)
  ctx.session.isLogin = true
  console.log('ctx.session2: ', ctx.session)
  // if (ctx.session.isLogin) {
    await next()
  //   return
  // }
  // ctx.body = Object.assign({}, codeManager.noLogin)
}
