import qiniu from 'qiniu'

// https://developer.qiniu.com/kodo/sdk/1289/nodejs
// 需要填写你的 Access Key 和 Secret Key
qiniu.conf.ACCESS_KEY = 'kG4x5WueMtMqzb1EMijAHIPqAYl9XmMrM9u2w3Xt'
qiniu.conf.SECRET_KEY = 'ITq0HakfLoldF8aZgnozQP5VhYr2amED30gjS-pI'

const bucket = 'seayang'

// 构建上传策略函数
function uptoken(bucket) {
  var putPolicy = new qiniu.rs.PutPolicy(bucket)
  return putPolicy.token();
}

export function getUptoken() {
  return uptoken(bucket)
}

/**
//构造上传函数
function uploadFile(uptoken, key, localFile) {
  var extra = new qiniu.io.PutExtra();
    qiniu.io.putFile(uptoken, key, localFile, extra, function(err, ret) {
      if(!err) {
        // 上传成功， 处理返回值
        console.log(ret.hash, ret.key, ret.persistentId);       
      } else {
        // 上传失败， 处理返回代码
        console.log(err);
      }
  });
}

//要上传文件的本地路径
const filePath = 'uploads/f_001.png'
//上传到七牛后保存的文件名
const key = 'my-123.png';
uploadFile(uptoken(bucket), key, filePath);
 */