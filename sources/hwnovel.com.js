require('crypto-js')

function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
    return v.toString(16);
  }).replaceAll("-","");
}

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

const headers = ["channel:25","deviceno:0","platform:1","version:3.0.3",`token:${localStorage.getItem('tk')}`]

//搜索
const search = (key) => {
  let timestamp = Math.round(new Date())
  let requestId = guid()
  let param = encrypt(JSON.stringify({
    keyword:key,
    pageNo:1,
    pageSize:15,
    timestamp:timestamp
  }))
  let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
  let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/book/searchBookList?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
  let $ = JSON.parse(response)
  let array = []
  $.data.esBookList.forEach((child) => {
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
  let timestamp = Math.round(new Date())
  let requestId = guid()
  let param = encrypt(JSON.stringify({
    bookId:url,
    timestamp:timestamp
  }))
  let sign = CryptoJS.MD5(ENCODE(`param=${param}&requestId=${requestId}&timestamp=${timestamp}&key=NpkTYvpvhJjEog8Y051gQDHmReY54z5t3F0zSd9QEFuxWGqfC8g8Y4GPuabq0KPdxArlji4dSnnHCARHnkqYBLu7iIw55ibTo18`,"base64").replaceAll("\n","")).toString().toUpperCase()
  let response = GET(`https://api.hwnovel.com/api/ciyuanji/client/book/getBookDetail?timestamp=${timestamp}&requestId=${requestId}&sign=${sign}&param=${param}`,{headers})
  let $ = JSON.parse(response).data.book
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
  url: "hwnovel.com",
  version: 100
})
