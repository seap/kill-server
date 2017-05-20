const env = process.env.NODE_ENV || 'development'
// production mode
export const isProduction = env === 'production'
// server port
export const port = process.env.PORT || 4000

// session config
export const sessionKeys = ['koa', 'sea']
export const cookieKey = 'sea.sid'

// log file
export const logInfoFile = 'logs/sea-log-info.log'
export const logErrorFile = 'logs/sea-log-error.log'

// wechat config
export const wechat = {
  appid: 'wx3b7e09491c848678',
  secret: '0abb388a563afbda738ca289da59a735'
}

// token config
export const tokenConfig = {
  secret: 'seayang',
  expire: 60 * 60 * 24 * 7 // 7 days
}

export const mongoUrl = isProduction
  ? 'mongodb://127.0.0.1:27017/biz'
  : 'mongodb://127.0.0.1:27017/biz'

export const mongoOpt = isProduction
  ? {}
  : {}