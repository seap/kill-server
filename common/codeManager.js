export default {
  success: {
    code: 0,
    msg: '成功'
  },
  noLogin: {
    code: 1000,
    msg: '用户未登录'
  },
  wrongUserOrPsd: {
    code: 1001,
    msg: '用户名或密码有误'
  },
  noResourse: {
    code: 1101,
    msg: '没有资源权限'
  },
  paramError: {
    code: 2000,
    msg: '请求参数有误'
  },
  paramDuplicated: {
    code: 2001,
    msg: '数据重复'
  },
  notExist: {
    code: 2002,
    msg: '数据不存在'
  },
  fileUploadError: {
    code: 2003,
    msg: '文件上传异常'
  },
  dbError: {
    code: 9000,
    msg: '数据库异常'
  },
  wechatError: {
    code: 9001,
    msg: '微信服务错误'
  },
  unknownError: {
    code: 9999,
    msg: '未知错误'
  }
}
