import path from 'path'
import multer from 'koa-multer'
import { fileUploadDest } from '../config'
import codeManager from '../common/codeManager'
import { getUptoken } from '../common/qiniuUpload'

const dest = path.resolve('upload')
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, fileUploadDest)
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname)
  }
})

export async function uploadFile(ctx, next) {
  const upload = multer({ storage }).single('file')
  const res = await upload(ctx, next)
  console.log('xxxxx', res)
  ctx.body = codeManager.success
}

export async function uptoken(ctx, next) {
  ctx.body = Object.assign({} , codeManager.success, { data: getUptoken() })
}