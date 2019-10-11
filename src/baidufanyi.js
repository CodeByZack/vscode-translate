const MD5 = require('./md5.js').MD5;
const axios = require('axios');

const URL = "http://api.fanyi.baidu.com/api/trans/vip/translate";
const appid = "20191011000340659";
const key = "iyIpyvystvYT8fpRI35W";

const getSign = (org)=>{
    return MD5(org);
}

const translate = ( query ) => {
    console.log( query );
    const salt = (new Date).getTime();
    const from = 'en';
    const to = 'zh';
    const sign = getSign( appid + query + salt +key);
    return axios.get(URL,{
        params:{
            q: query,
            appid: appid,
            salt: salt,
            from: from,
            to: to,
            sign: sign
        }
    }).then(res=>{
        const dst = res.data.trans_result[0].dst;
        return Promise.resolve(dst);
    },err=>{
        return Promise.resolve("出错了～～～");
    })

}


exports.translate = translate;