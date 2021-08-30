const baseUrl = "https://android-api.xrzww.com"

//搜索
const search = (key) => {
  let array = []
  last_page = 1
  for (i=1;i<=last_page;i++){
    let response = GET(`${baseUrl}/api/searchAll?search_type=novel&search_value=${encodeURI(key)}&page=${i}&pageSize=20`)
    let $ = JSON.parse(response).data
    last_page = $.last_page
    $.data.forEach((child) => {
      array.push({
        name: child.novel_name,
        author: child.novel_author,
        cover: `http://oss.xrzww.com${child.novel_cover}`,
        detail: `${baseUrl}/api/detail?novel_id=${child.novel_id}`
       })
    })
  }
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
    update: $.novel_uptime,
    lastChapter: $.novel_newcname,
    catalog: `${baseUrl}/api/novelDirectory?nid=${$.novel_id}&orderBy=asc`
  }
  return JSON.stringify(book)
}

var bookSource = JSON.stringify({
  name: "息壤中文网",
  url: "xrzww.com",
  version: 104
})
