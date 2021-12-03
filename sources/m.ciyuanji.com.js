require('crypto-js')

const decrypt = function (data) {
    let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
    decrypted = CryptoJS.DES.decrypt(data, key, {
        mode: CryptoJS.mode.ECB,
        padding: CryptoJS.pad.NoPadding
    })
    return decrypted.toString(CryptoJS.enc.Utf8)
}

const encrypt = function (data) {
  let key = CryptoJS.enc.Utf8.parse('ZUreQN0E')
  encrypted = CryptoJS.DES.encrypt(data, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.NoPadding
  })
  return encrypted.toString()
}

//搜索
const search = (key) => {
  if(key.length == 1 || key.length%8 == 1)
    var air = ""
  else if(key.length == 2 || key.length%8 == 2)
         var air = ""
       else if(key.length == 3 || key.length%8 == 3)
              var air = ""
            else if(key.length == 4 || key.length%8 == 4)
                   var air = ""
                 else if(key.length == 5 || key.length%8 == 5)
                        var air = ""
                      else if(key.length == 6 || key.length%8 == 6)
                             var air = ""
                           else if(key.length == 7 || key.length%8 == 7)
                                  var air = ""
                                else if(key.length == 8 || key.length%8 == 0)
                                       var air = ""
  let params = encodeURIComponent(encrypt(JSON.stringify({keyword:key}) + air))
  let response = GET(`https://m.ciyuanji.com/_next/data/ApH_5MGXsw1xRV2nxb8QL/search/list.json?params=${params}`)
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
  if(url.length == 1)
    var air = ""
  else if(url.length == 2)
         var air = ""
       else if(url.length == 3)
              var air = ""
            else if(url.length == 4)
                   var air = ""
  let params = encodeURIComponent(encrypt(JSON.stringify({bookId:url}) + air))
  let response = GET(`https://m.ciyuanji.com/_next/data/ApH_5MGXsw1xRV2nxb8QL/bookDetails.json?params=${params}`)
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
  version: 104
})
