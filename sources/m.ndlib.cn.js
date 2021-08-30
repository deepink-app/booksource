require('crypto-js')

const baseUrl = 'http://m.ndlib.cn/nlc_read_home/service.do'

const wapToken =   localStorage.getItem("wapToken")

const encrypt = function (data) {
  let key = CryptoJS.enc.Hex.parse('77656240687A6C71')
  encrypted = CryptoJS.DES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

const decrypt = function (data) {
  let key = CryptoJS.enc.Hex.parse('77656240687A6C71')
  decrypted = CryptoJS.DES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

const encode = function (data) {
  let e = ENCODE(wapToken,"base64")
  let key = CryptoJS.enc.Base64.parse(e)
  str = CryptoJS.DES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return str.toString()
}

const decode = function (data) {
  let e = ENCODE(wapToken,"base64")
  let key = CryptoJS.enc.Base64.parse(e)
  str = CryptoJS.DES.decrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return str.toString(CryptoJS.enc.Utf8)
}

const timeStamp = Math.round(new Date())

const hashCode = CryptoJS.MD5(`${timeStamp}library_2016@hzlq`).toString()


/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let data = encrypt(JSON.stringify({
    timestamp:timeStamp,
    bigtype:'1',
    content:key,
    pagesize:10,
    pagenum:1
    }))
  let value = encodeURIComponent(JSON.stringify({
    siteId:'1',
    data:data,
    userId:0,
    fromSource:3,
    osType:5,
    version:'1.0.1',
    versionCode:10001,
    timeStamp:timeStamp,
    hashCode:hashCode
    }))
  let res = JSON.parse(POST(`${baseUrl}`,{data: `cmd=qrySearchList&value=${value}`}))
  let array = []
  res.returnObject.resAndMagResult.forEach(($) => {
    array.push({
      name: $.resourceInfo.name,
      author: $.resourceInfo.author,
      cover: $.resourceInfo.coverUrl,
      detail: JSON.stringify({
        bId: $.resourceInfo.resId
      })
    })
  })
  return JSON.stringify(array)
}


/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let args = JSON.parse(url)
  let data = encrypt(JSON.stringify({
    timestamp:timeStamp,
    resourceId:args.bId,
    uainfo:'0'
  }))
  let value = encodeURIComponent(JSON.stringify({
    siteId:'1',
    data:data,
    userId:0,
    fromSource:3,
    osType:5,
    version:'1.0.1',
    versionCode:10001,
    timeStamp:timeStamp,
    hashCode:hashCode
  }))
  let $ = JSON.parse(POST(`${baseUrl}`, {data: `cmd=qryResourceInfo&value=${value}`})).returnObject
  let book = {
    summary: $.shortIntro,
    category: $.categoryName,
    catalog: JSON.stringify({
      dId: $.resId
    })
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "移动阅读",
  url: "m.ndlib.cn",
  version: 100
})
