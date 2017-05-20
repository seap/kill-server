import fetch from 'node-fetch'
import jwt from 'jsonwebtoken'
import { wechat, tokenConfig } from '../config'
import logger from '../common/logger'
import codeManager from '../common/codeManager'
import { findByOpenId } from '../models/user'

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
export async function wechatLogin(ctx, next) {
  const { code } = ctx.params
  try {
    // sso checking
    logger.log('debug', 'wx login, code: %s', code)
    const response = await fetch(`https://api.weixin.qq.com/sns/jscode2session?appid=${wechat.appid}&secret=${wechat.secret}&js_code=${code}&grant_type=authorization_code`)
    const json = await response.json()
    if (json.errcode) {
      logger.log('debug', 'wx login fail: %j', json)
      ctx.body = Object.assign({}, codeManager.wechatError, { msg: json.errmsg })
    } else {
      // code有效，验证成功, {openid, session_key}
      const token = jwt.sign({ openid: json.openid }, tokenConfig.secret, { expiresIn: tokenConfig.expire })
      logger.log('debug', 'sign the token: %s', token)
      // 判断是否是新用户
      const userInfo = await findByOpenId(json.openid)
      logger.log('debug', 'userinfo: ', userInfo, {})
      const data = {
        token,
        newUser: userInfo ? false : true
      }
      ctx.body = Object.assign({}, codeManager.success, { data })
    }
  } catch (e) {
    ctx.body = codeManager.unknownError
    logger.log('error', 'login error: ', e, {})
  }
}

// 提交wechat用户信息
export async function updateUserInfo(ctx, next) {
  try {
   
    logger.log('debug', 'userinfo: ', ctx.request.body, {})

  } catch(e) {

  }
}