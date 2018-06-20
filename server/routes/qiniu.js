var express = require('express');
var router = express.Router();
const qiniu = require("qiniu");

const config={
    // 点击链接申请注册免费成为七牛开发者 https://portal.qiniu.com/user/key
    // 只需要正确填写以下空缺部分，客户端就能从后台拿到token从而进行七牛云上传相关操作
    "AccessKey": "",
    "SecretKey": "",
    "Bucket": "",
    "Domain": ""
};

const mac = new qiniu.auth.digest.Mac(config.AccessKey, config.SecretKey);
const config2 = new qiniu.conf.Config();
// 这里主要是为了用 node sdk 的 form 直传，结合 demo 中 form 方式来实现无刷新上传
config2.zone = qiniu.zone.Zone_z2;
const formUploader = new qiniu.form_up.FormUploader(config2);
const putExtra = new qiniu.form_up.PutExtra();
const options = {
    scope: config.Bucket,
    deleteAfterDays: 7,
    returnBody:
        '{"key":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}'
};

const putPolicy = new qiniu.rs.PutPolicy(options);
const bucketManager = new qiniu.rs.BucketManager(mac, null);

router.get('/uptoken', function(req, res, next) {
    const token = putPolicy.uploadToken(mac);
    res.header("Cache-Control", "max-age=0, private, must-revalidate");
    res.header("Pragma", "no-cache");
    res.header("Expires", "0");
    if (token) {
        res.json({
            token: token,
            domain: config.Domain
        });
    }
});

module.exports = router;
