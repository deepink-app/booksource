require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
    decrypted = CryptoJS.DES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.Pkcs7
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const encrypt = function (data) {
  let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
  encrypted = CryptoJS.DES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  })
  return encrypted.toString()
}

//搜索
const search = (key) => {
  let params = encodeURIComponent(encrypt(JSON.stringify({keyword:key})))
  let response = GET(`https://m.ciyuanji.com/_next/data/wBMzM68QHlPmXTULTY67J/search/list.json?params=${params}`)
  let $ = JSON.parse(response)
  let array = []
  $.pageProps.esBookList.forEach((child) => {
    array.push({
      name: child.bookName,
      author: child.authorName,
      cover: child.imgUrl,
      detail: child.bookId,
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let params = encodeURIComponent(encrypt(JSON.stringify({bookId:url})))
  let response = GET(`https://m.ciyuanji.com/_next/data/wBMzM68QHlPmXTULTY67J/bookDetails.json?params=${params}`)
  let $ = JSON.parse(response).pageProps.book
  let book = {
    summary: $.notes,
    status: $.endState == 2 ? '连载' : '完结',
    category: $.tagList.map((item)=>{ return item.tagName}).join(" "),
    words: $.wordCount,
    update: $.latestUpdateTime,
    lastChapter: $.latestChapterName,
    catalog: $.bookId
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "次元姬小说",
  url: "m.ciyuanji.com",
  version: 106
})
