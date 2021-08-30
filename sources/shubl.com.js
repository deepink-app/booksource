//抄自酷安@渊呀妹子大佬的阅读源
require("crypto-js")
let login_token=localStorage.getItem("token")?localStorage.getItem("token"):"2545b2d4237eefbc78a11ed3a95cae61"
let account =localStorage.getItem("account")?localStorage.getItem("account"):"萌友121078118744"
function encode(word) {
    let key = CryptoJS.enc.Base64.parse("nvlrM3RT6n0iYj4I/zbGqisUGGMpy3UT84cNphYONC8=");
    let iv = CryptoJS.enc.Base64.parse("AAAAAAAAAAAAAAAAAAAAAA==");  
    str = CryptoJS.AES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return str.toString()
}
function decode(word) {
    let key = CryptoJS.enc.Base64.parse("nvlrM3RT6n0iYj4I/zbGqisUGGMpy3UT84cNphYONC8=");
    let iv = CryptoJS.enc.Base64.parse("AAAAAAAAAAAAAAAAAAAAAA==");    
    str = CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    })
    return str.toString(CryptoJS.enc.Utf8)
}
//搜索
const search = (key) => {
 let data="secret_content="+encodeURIComponent(encode(JSON.stringify({"app_signature_md5":"f73576612783f8ed8b68cdf73a56be94","app_version":"2.1.6","channel":"default","order":"week_click","count":"15","category_type":"1","page":0,"key":key,"login_token":"d21bbcae2da566e0d3c8d7dc02793563","account":"萌友841068377319"})))
  let response = POST("https://app.shubl.com/bookcity/get_filter_search_book_list",{data})
  let array = []
  let $ = JSON.parse(decode(response))
  $.data.book_list.forEach((child) => {
    array.push({
      name: child.book_name,
      author: child.author_name,
      cover: child.cover,
      detail: JSON.stringify({
      url: "https://app.shubl.com/book/get_info_by_id",
      bid: child.book_id
      })
    })
  })
  return JSON.stringify(array)
}

//详情
const detail = (url) => {
  let args = JSON.parse(url)
  let data =  "secret_content="+encodeURIComponent(encode(JSON.stringify({"app_signature_md5":"f73576612783f8ed8b68cdf73a56be94","app_version":"2.1.6","channel":"default","book_id":args.bid,"login_token":login_token,account:account})))
  let response = POST(args.url,{data})  
  let $ = JSON.parse(decode(response)).data.book_info
  let book = {
    summary: $.description,
    status: $.up_status == 1 ? '完结' : '连载',
    category: $.tag.replace(/,/g," "),
    words: $.total_word_count,
    update: $.uptime,
    lastChapter: $.last_chapter_info.chapter_title,
    catalog: JSON.stringify({
       url: "https://app.shubl.com/chapter/get_chapter_list_group_by_division",
       data:  "secret_content="+encodeURIComponent(encode(JSON.stringify({"app_signature_md5":"f73576612783f8ed8b68cdf73a56be94","app_version":"2.1.6","channel":"default","last_update_time":"0","book_id":$.book_id,"login_token":login_token,"account":account})))
  })}
  return JSON.stringify(book)
}


var bookSource = JSON.stringify({
  name: "书耽",
  url: "shubl.com",
  version: 101
})
