import fetch from 'node-fetch'
import { wechat } from '../config'
import logger from '../common/logger'
import codeManager from '../common/codeManager'

export async function getUserInfo(ctx, next) {
  try {
    ctx.body = 'userinfo'
  } catch (e) {
    logger.log('error', e)
  }
}

// code 换取 session_key, openid
// 这是一个 HTTPS 接口，开发者服务器使用登录凭证 code 获取 session_key 和 openid。
// 其中 session_key 是对用户数据进行加密签名的密钥。为了自身应用安全，session_key 不应该在网络上传输。
// https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code

export async function login(ctx, next) {
  try {
    // sso checking
    logger.log('debug', 'wx login')
    const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${wechat.appid}&secret=${wechat.secret}&js_code=JSCODE&grant_type=authorization_code`)
    const json = await response.json()
    if (json.errcode) {
      logger.log('debug', 'wx login fail: %j', json)
      ctx.body = Object.assign({}, codeManager.wechatError, { msg: json.errmsg })
    } else {
      ctx.body = Object.assign({}, codeManager.success, { data: json })
    }
  } catch (e) {
    ctx.body = codeManager.unknownError
    logger.log('error', 'login error: ', e, {})
  }
}
