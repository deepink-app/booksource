require('crypto-js')

const baseUrl = 'https://app.hbooker.com'

const token = {
  app_version: '2.8.008',
  device_token: 'ciweimao_a01b7e3e8c0a73bf',
}

const iv = CryptoJS.enc.Hex.parse('00000000000000000000000000000000')

/**
 * 解密
 * @param {String} data 加密数据
 * @param {String} key 解密密钥
 * @returns {String} 解密后的内容
 */
const decrypt = function (data, key) {
  key = CryptoJS.SHA256(key ? key : 'zG2nSeEfSHfvTCHy5LCcqtBbQehKNLXn')
  var decrypted = CryptoJS.AES.decrypt(data, key, {
    mode: CryptoJS.mode.CBC,
    iv: iv,
    padding: CryptoJS.pad.Pkcs7,
  })
  return decrypted.toString(CryptoJS.enc.Utf8)
}

/**
 * 包装的请求体
 * 只封装了 GET 请求
 * @param {String} url 请求地址
 * @param {Object} data 请求参数
 * @param {Boolean|Undefined} full 可选，是否传回完整响应体
 * @returns {Object} 解密后的内容对象
 */
const CGET = function (url, data, full) {
  url = baseUrl + url
  url += url.includes('?') ? '&' : '?'
  data = Object.assign(
    data ? data : {},
    token,
    url == '/signup/login' ?
      {} :
      {
        login_token: localStorage.getItem('loginToken'),
        account: localStorage.getItem('account'),
      }
  )
  for (let key in data) {
    url += `${key}=${data[key]}&`
  }
  url = url.slice(0, -1)
  let res = GET(url, {
    headers: [
      'User-Agent: Android com.kuangxiangciweimao.novel 2.8.008, Google, Pixel5',
    ],
  })
  res = JSON.parse(decrypt(res))
  return full ? res : res.data
}

/**
 * 搜索
 * @params {string} key
 * @returns {[{name, author, cover, detail}]}
 */
const search = (key) => {
  let res = CGET('/bookcity/get_filter_search_book_list', {
    count: 30,
    key: key,
  })
  let arr = res.book_list.map((e) => {
    return {
      name: e.book_name,
      author: e.author_name,
      cover: e.cover,
      detail: `/book/get_info_by_id?book_id=${e.book_id}`,
    }
  })
  return JSON.stringify(arr)
}

/**
 * 详情
 * @params {string} url
 * @returns {[{summary, status, category, words, update, lastChapter, catalog}]}
 */
const detail = (url) => {
  let res = CGET(url)
  let binfo = res.book_info
  let book = {
    summary: binfo.description,
    status: binfo.up_status == '1' ? '完结' : '连载',
    category: binfo.tag.replace(/,/g," "),
    words: binfo.total_word_count,
    update: binfo.uptime,
    lastChapter: binfo.last_chapter_info.chapter_title,
    catalog: `/book/get_division_list?book_id=${binfo.book_id}`,
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: '刺猬猫阅读',
  url: 'hbooker.com',
  version: 109
})
