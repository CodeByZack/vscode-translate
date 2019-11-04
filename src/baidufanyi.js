const MD5 = require('./md5.js').MD5;
const rp = require('request-promise');
const URL = 'http://api.fanyi.baidu.com/api/trans/vip/translate';
const appid = '20191011000340659';
const key = 'iyIpyvystvYT8fpRI35W';

const getSign = org => {
  return MD5(org);
};

const getUrlWithParam = (baseUrl, params) => {
  let paramStr = '';
  for (const key in params) {
    if (params.hasOwnProperty(key)) {
      const value = params[key];
      paramStr += `&${key}=${value}`;
    }
  }
  return baseUrl + '?' + paramStr.substring(1);
};

const translate = async query => {
  let _from, _to, _query;
  if (/^[\u4e00-\u9fa5]+$/.test(query)) {
    //中文->英文
    _from = 'zh';
    _to = 'en';
    _query = encodeURI(query);
  } else if (/^[a-zA-Z]+$/.test(query)) {
    //英文->中文
    _from = 'en';
    _to = 'zh';
    _query = query;
  } else {
    return Promise.resolve('不支持的语言类型！');
  }
  const salt = new Date().getTime();
  const from = _from;
  const to = _to;
  const sign = getSign(appid + query + salt + key);
  const finalUrl = getUrlWithParam(URL, {
    salt,
    from,
    to,
    sign,
    q: _query,
    appid
  });
  try {
    const res = await rp.get(finalUrl);
    const resJson = JSON.parse(res);
    if (resJson.error_msg) return Promise.resolve(resJson.error_msg);
    return Promise.resolve(resJson.trans_result[0].dst);
  } catch (error) {
    return Promise.resolve('出错了');
  }
};

exports.translate = translate;
