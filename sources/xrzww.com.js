//转换更新时间 时间戳
function timestampToTime(timestamp) {
        var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
        var Y = date.getFullYear() + '-';
        var M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1):date.getMonth()+1) + '-';
        var D = (date.getDate()< 10 ? '0'+date.getDate():date.getDate())+ ' ';
        var h = (date.getHours() < 10 ? '0'+date.getHours():date.getHours())+ ':';
        var m = (date.getMinutes() < 10 ? '0'+date.getMinutes():date.getMinutes()) + ':';
        var s = date.getSeconds() < 10 ? '0'+date.getSeconds():date.getSeconds();
        return Y+M+D+h+m+s;
}

const baseUrl = "https://android-api.xrzww.com"

//搜索
const search = (key) => {
  let response = GET(`${baseUrl}/api/searchAll?search_type=novel&search_value=${encodeURI(key)}&page=1&pageSize=20`)
  let $ = JSON.parse(response).data
  let array = []
  $.data.forEach((child) => {
    array.push({
      name: child.novel_name,
      author: child.novel_author,
      cover: `http://oss.xrzww.com${child.novel_cover}`,
      detail: `${baseUrl}/api/detail?novel_id=${child.novel_id}`
    })
  })
  return JSON.stringify(array)
}

//详情  
const detail = (url) => {
  let response = GET(url)
  let $ = JSON.parse(response).data
  let book = {
    summary: $.novel_info,
    status: $.novel_process == 1 ? '连载' : '完结',
    category: $.novel_tags.replace(/,/g," "),
    words: $.novel_wordnumber,
    update: timestampToTime($.novel_uptime),
    lastChapter: $.novel_newcname,
    catalog: `${baseUrl}/api/novelDirectory?nid=${$.novel_id}&orderBy=asc`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "息壤中文网",
  url: "xrzww.com",
  version: 105
})
